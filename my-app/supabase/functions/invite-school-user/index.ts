import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Origin': '*',
}

const jsonResponse = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status,
  })

const randomHex = (bytes = 4) =>
  Array.from(crypto.getRandomValues(new Uint8Array(bytes)))
    .map((value) => value.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()

async function generateRegistration(supabaseAdmin: ReturnType<typeof createClient>) {
  const year = new Date().getFullYear()

  for (let attempt = 0; attempt < 8; attempt += 1) {
    const registration = `PG-${year}-${randomHex(4)}`
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('registration_number', registration)
      .maybeSingle()

    if (error) throw error
    if (!data) return registration
  }

  throw new Error('Nao foi possivel gerar uma matricula unica.')
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (request.method !== 'POST') return jsonResponse({ error: 'Metodo nao permitido.' }, 405)

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !serviceRoleKey) {
      return jsonResponse({ error: 'Secrets SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY nao configurados.' }, 500)
    }

    const authHeader = request.headers.get('Authorization') || ''
    const token = authHeader.replace('Bearer ', '')

    if (!token) return jsonResponse({ error: 'Sessao nao enviada.' }, 401)

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    const {
      data: { user: requester },
      error: requesterError,
    } = await supabaseAdmin.auth.getUser(token)

    if (requesterError || !requester) return jsonResponse({ error: 'Sessao invalida.' }, 401)

    const { data: requesterProfile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', requester.id)
      .maybeSingle()

    if (profileError) throw profileError
    if (requesterProfile?.role !== 'admin') {
      return jsonResponse({ error: 'Somente admin pode criar convites.' }, 403)
    }

    const body = await request.json()
    const fullname = String(body.fullname || '').trim()
    const email = String(body.email || '').trim().toLowerCase()
    const role = String(body.role || '').trim()
    const cpf = body.cpf ? String(body.cpf).trim() : null
    const classId = body.classId ? String(body.classId) : null

    if (!fullname || !email || !['student', 'teacher'].includes(role)) {
      return jsonResponse({ error: 'Informe nome, e-mail e perfil valido.' }, 400)
    }

    const registrationNumber = role === 'student' ? await generateRegistration(supabaseAdmin) : null
    const siteUrl = Deno.env.get('SITE_URL') || request.headers.get('Origin') || 'http://localhost:5173'
    const redirectTo = `${siteUrl.replace(/\/$/, '')}/definir-senha`

    const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data: {
        cpf,
        fullname,
        registration_number: registrationNumber,
        role,
      },
      redirectTo,
    })

    if (inviteError) {
      console.error('inviteUserByEmail failed', {
        code: inviteError.code,
        message: inviteError.message,
        name: inviteError.name,
        status: inviteError.status,
      })

      throw inviteError
    }

    const invitedUser = inviteData.user
    if (!invitedUser?.id) throw new Error('Convite criado sem usuario retornado.')

    const { data: profile, error: upsertError } = await supabaseAdmin
      .from('profiles')
      .upsert(
        {
          cpf,
          email,
          fullname,
          id: invitedUser.id,
          registration_number: registrationNumber,
          role,
        },
        { onConflict: 'id' },
      )
      .select()
      .single()

    if (upsertError) throw upsertError

    if (role === 'student' && classId) {
      const { error: enrollmentError } = await supabaseAdmin
        .from('enrollments')
        .upsert({ class_id: classId, student_id: invitedUser.id }, { onConflict: 'student_id,class_id' })

      if (enrollmentError) throw enrollmentError
    }

    return jsonResponse({
      email,
      fullname,
      invitation_sent: true,
      profile,
      registration_number: registrationNumber,
      role,
    })
  } catch (error) {
    console.error('invite-school-user failed', error)
    return jsonResponse({ error: error instanceof Error ? error.message : 'Erro ao enviar convite.' }, 500)
  }
})
