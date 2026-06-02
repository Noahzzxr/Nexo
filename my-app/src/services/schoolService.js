import { schoolBucket, supabase } from '../lib/supabase'
import { postedMaterials } from '../data/mockData'

const wait = (value) => new Promise((resolve) => window.setTimeout(() => resolve(value), 250))

const makeId = () =>
  crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`

const cleanFileName = (name) =>
  name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9.-]+/g, '-')
    .toLowerCase()

const buildInstitutionalEmail = (fullName) => {
  const parts = fullName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)

  const first = parts[0] || 'aluno'
  const last = parts.at(-1) && parts.at(-1) !== first ? parts.at(-1) : 'progresso'
  return `${first}.${last}@escola.com`
}

const localMaterialsKey = 'school-posted-materials'

const getLocalPostedMaterials = () => {
  const stored = window.localStorage.getItem(localMaterialsKey)
  return stored ? JSON.parse(stored) : postedMaterials
}

const setLocalPostedMaterials = (materials) => {
  window.localStorage.setItem(localMaterialsKey, JSON.stringify(materials))
}

export const generateRegistrationNumber = () => {
  const suffix = String(Math.floor(Math.random() * 9999)).padStart(4, '0')
  return `PG-2026-${suffix}`
}

export async function uploadAttachment(file, folder = 'attachments') {
  if (!file) return { path: null, publicUrl: null }

  if (!supabase) {
    return wait({
      path: `local/${folder}/${file.name}`,
      publicUrl: URL.createObjectURL(file),
    })
  }

  const path = `${folder}/${Date.now()}-${cleanFileName(file.name)}`
  const { error } = await supabase.storage.from(schoolBucket).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })

  if (error) throw error

  const { data } = supabase.storage.from(schoolBucket).getPublicUrl(path)
  return { path, publicUrl: data.publicUrl }
}

export async function createStudentSubmission({ activity, file, studentId }) {
  const attachment = await uploadAttachment(file, 'submissions')
  const payload = {
    id: makeId(),
    assignment_id: activity.id,
    student_id: studentId,
    photo_delivery_url: attachment.publicUrl,
    submitted_at: new Date().toISOString(),
    status: 'completed',
  }

  if (!supabase) return wait(payload)

  const { data, error } = await supabase.from('student_submissions').insert(payload).select().single()
  if (error) throw error
  return data
}

export async function createAssignment({ assignment, file }) {
  const attachment = await uploadAttachment(file, 'assignments')
  const payload = {
    id: makeId(),
    class_id: assignment.classId || null,
    subject_id: assignment.subjectId || null,
    title: assignment.title,
    description: assignment.description,
    file_attachment_url: attachment.publicUrl,
    due_date: assignment.dueDate,
  }

  if (!supabase) return wait(payload)

  const { data, error } = await supabase.from('assignments').insert(payload).select().single()
  if (error) throw error
  return data
}

export async function createPostedMaterial({ file, material }) {
  const attachment = await uploadAttachment(file, 'posted-materials')
  const payload = {
    id: makeId(),
    class_id: material.classId,
    created_at: new Date().toISOString(),
    description: material.description,
    file_attachment_url: attachment.publicUrl,
    subject_id: material.subjectId,
    teacher_id: material.teacherId,
    title: material.title,
  }

  if (!supabase) {
    const nextMaterials = [payload, ...getLocalPostedMaterials()]
    setLocalPostedMaterials(nextMaterials)
    return wait(payload)
  }

  const { data, error } = await supabase.from('posted_materials').insert(payload).select().single()
  if (error) throw error
  return data
}

export async function fetchPostedMaterials({ classId }) {
  if (!supabase) {
    return wait(getLocalPostedMaterials().filter((material) => !classId || material.class_id === classId))
  }

  let query = supabase.from('posted_materials').select('*').order('created_at', { ascending: false })

  if (classId) {
    query = query.eq('class_id', classId)
  }

  const { data, error } = await query
  if (error) throw error
  return data
}

export function subscribePostedMaterials({ classId, onInsert }) {
  if (!supabase) return () => {}

  const channel = supabase
    .channel(`posted-materials-${classId || 'all'}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        filter: classId ? `class_id=eq.${classId}` : undefined,
        schema: 'public',
        table: 'posted_materials',
      },
      (payload) => onInsert(payload.new),
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}

export async function saveGrades(rows) {
  const payload = rows.map((row) => ({
    student_id: row.studentId,
    subject_id: row.subjectId,
    class_id: row.classId,
    note_p1: Number(row.p1),
    note_p2: Number(row.p2),
    note_p3: Number(row.p3),
    final_grade: Number(row.average),
    total_absences: Number(row.absences),
  }))

  if (!supabase) return wait(payload)

  const { data, error } = await supabase
    .from('grades')
    .upsert(payload, { onConflict: 'student_id,subject_id,class_id' })
    .select()

  if (error) throw error
  return data
}

export async function saveFrequency(rows) {
  if (!supabase) return wait(rows)

  const { data, error } = await supabase.from('attendance_records').upsert(rows).select()
  if (error) throw error
  return data
}

export async function sendMessage({ content, receiverId, senderId }) {
  const payload = {
    content,
    created_at: new Date().toISOString(),
    receiver_id: receiverId,
    sender_id: senderId,
  }

  if (!supabase) return wait({ id: makeId(), ...payload })

  const { data, error } = await supabase.from('messages').insert(payload).select().single()
  if (error) throw error
  return data
}

export async function fetchMessages({ receiverId, senderId }) {
  if (!supabase) return wait([])

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(`and(sender_id.eq.${senderId},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${senderId})`)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data
}

export async function createLead(lead) {
  const payload = {
    id: makeId(),
    full_name: lead.fullName,
    email: lead.email,
    cpf: lead.cpf,
    desired_course: lead.desiredCourse,
    status: 'pending',
  }

  if (!supabase) return wait(payload)

  const { data, error } = await supabase.from('leads_inscription').insert(payload).select().single()
  if (error) throw error
  return data
}

export async function approveLead(lead) {
  const registrationNumber = generateRegistrationNumber()
  const institutionalEmail = buildInstitutionalEmail(lead.full_name || lead.fullName)
  const initialPassword = `Aluno@${registrationNumber.slice(-4)}`

  if (!supabase) {
    return wait({
      ...lead,
      auth_user_id: makeId(),
      initial_password: initialPassword,
      status: 'approved',
      registration_number: registrationNumber,
      institutional_email: institutionalEmail,
    })
  }

  const { data, error } = await supabase.rpc('approve_lead', {
    generated_password: initialPassword,
    lead_id: lead.id,
    generated_email: institutionalEmail,
    generated_registration: registrationNumber,
  })

  if (error) throw error
  return Array.isArray(data) ? data[0] : data
}

export async function createProfile(profile) {
  const payload = { ...profile, id: profile.id || makeId() }

  if (!supabase) return wait(payload)

  const { data, error } = await supabase.from('profiles').insert(payload).select().single()
  if (error) throw error
  return data
}

export async function removeProfile(profileId) {
  if (!supabase) return wait({ id: profileId })

  const { error } = await supabase.from('profiles').delete().eq('id', profileId)
  if (error) throw error
  return { id: profileId }
}

export async function createClass(payload) {
  if (!supabase) return wait({ id: makeId(), ...payload })

  const { data, error } = await supabase.from('classes').insert(payload).select().single()
  if (error) throw error
  return data
}

export async function createSubject(payload) {
  if (!supabase) return wait({ id: makeId(), ...payload })

  const { data, error } = await supabase.from('subjects').insert(payload).select().single()
  if (error) throw error
  return data
}

export async function assignTeacher(payload) {
  if (!supabase) return wait({ id: makeId(), ...payload })

  const { data, error } = await supabase.from('teacher_subjects').insert(payload).select().single()
  if (error) throw error
  return data
}
