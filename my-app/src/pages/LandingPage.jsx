import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LockKeyhole } from 'lucide-react'
import LogoMark from '../components/brand/LogoMark'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import InputField from '../components/ui/InputField'
import { roles } from '../context/roles'
import { useSession } from '../hooks/useSession'
import { useToast } from '../hooks/useToast'

function LandingPage() {
  const navigate = useNavigate()
  const { dataError, isLoadingSession, isSupabaseConfigured, loginWithCredentials } = useSession()
  const { addToast } = useToast()
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const profile = await loginWithCredentials(loginForm)
      addToast({ title: 'Sessao iniciada', message: `Bem-vindo, ${profile.fullname}.` })
      navigate(profile.role === roles.admin ? '/admin' : '/dashboard')
    } catch (error) {
      addToast({ title: 'Falha no login', message: error.message })
    }
  }

  return (
    <div className="min-h-screen bg-page text-copy">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link className="flex items-center gap-3" to="/">
            <LogoMark />
            <span>
              <span className="block text-sm font-black text-brand-ink">PROGRESSO</span>
              <span className="block text-[10px] font-bold uppercase text-alert-coral">Sistema Escolar</span>
            </span>
          </Link>
        </div>
      </header>

      <main className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_420px]">
        <section>
          <p className="text-sm font-black uppercase text-alert-coral">Portal conectado ao banco</p>
          <h1 className="mt-3 max-w-2xl text-5xl font-black leading-tight text-brand-ink">Acesso escolar para alunos, professores e administradores</h1>
          <p className="mt-5 max-w-xl leading-7 text-muted">
            Alunos e professores entram somente com contas criadas pelo administrador. Dados de perfil, turmas, notas, materiais e mensagens sao carregados do banco de dados.
          </p>
        </section>

        <Card id="login">
          <p className="text-sm font-black uppercase text-alert-coral">Area de login</p>
          <h2 className="mt-2 text-3xl font-black text-brand-ink">Acesse seu painel</h2>
          {dataError || !isSupabaseConfigured ? (
            <p className="mt-4 rounded-lg bg-alert-soft p-3 text-sm font-bold text-alert-coral">
              {dataError || 'Configure o Supabase para entrar no sistema.'}
            </p>
          ) : null}
          <form className="mt-6 grid gap-4" onSubmit={handleLogin}>
            <InputField
              label="E-mail"
              name="email"
              onChange={(event) => setLoginForm((current) => ({ ...current, email: event.target.value }))}
              placeholder="usuario@progresso.edu"
              required
              type="email"
              value={loginForm.email}
            />
            <InputField
              label="Senha"
              name="password"
              onChange={(event) => setLoginForm((current) => ({ ...current, password: event.target.value }))}
              placeholder="Digite sua senha"
              required
              type="password"
              value={loginForm.password}
            />
            <Button disabled={isLoadingSession || !isSupabaseConfigured} icon={LockKeyhole} type="submit" variant="primary">
              {isLoadingSession ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </Card>
      </main>
    </div>
  )
}

export default LandingPage
