import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { KeyRound } from 'lucide-react'
import LogoMark from '../components/brand/LogoMark'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import InputField from '../components/ui/InputField'
import { supabase } from '../lib/supabase'
import { useToast } from '../hooks/useToast'

function PasswordSetupPage() {
  const navigate = useNavigate()
  const { addToast } = useToast()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [form, setForm] = useState({ confirmPassword: '', password: '' })

  useEffect(() => {
    let isMounted = true

    async function loadInviteSession() {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) throw error
        if (isMounted) setEmail(session?.user?.email || '')
      } catch (error) {
        addToast({ title: 'Convite invalido', message: error.message })
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadInviteSession()

    return () => {
      isMounted = false
    }
  }, [addToast])

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (form.password.length < 6) {
      addToast({ title: 'Senha curta', message: 'Use pelo menos 6 caracteres.' })
      return
    }

    if (form.password !== form.confirmPassword) {
      addToast({ title: 'Senhas diferentes', message: 'Confirme a mesma senha nos dois campos.' })
      return
    }

    setIsSaving(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: form.password })
      if (error) throw error

      addToast({ title: 'Senha definida', message: 'Agora voce pode acessar o painel.' })
      navigate('/dashboard')
    } catch (error) {
      addToast({ title: 'Erro ao definir senha', message: error.message })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-page px-4 py-10 text-copy">
      <Card className="w-full max-w-md">
        <div className="flex items-center gap-3">
          <LogoMark />
          <span>
            <span className="block text-sm font-black text-brand-ink">PROGRESSO</span>
            <span className="block text-[10px] font-bold uppercase text-alert-coral">Convite escolar</span>
          </span>
        </div>

        <p className="mt-8 text-sm font-black uppercase text-alert-coral">Definir senha</p>
        <h1 className="mt-2 text-3xl font-black text-brand-ink">Finalize seu acesso</h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          {email ? `Convite recebido para ${email}.` : 'Abra esta pagina pelo link de convite enviado ao seu e-mail.'}
        </p>

        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          <InputField
            label="Nova senha"
            name="password"
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            required
            type="password"
            value={form.password}
          />
          <InputField
            label="Confirmar senha"
            name="confirmPassword"
            onChange={(event) => setForm((current) => ({ ...current, confirmPassword: event.target.value }))}
            required
            type="password"
            value={form.confirmPassword}
          />
          <Button disabled={isLoading || isSaving || !email} icon={KeyRound} type="submit" variant="royal">
            {isSaving ? 'Salvando...' : 'Definir senha'}
          </Button>
        </form>

        <Button as={Link} className="mt-4 w-full" to="/" variant="ghost">
          Voltar para o login
        </Button>
      </Card>
    </div>
  )
}

export default PasswordSetupPage
