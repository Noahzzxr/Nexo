import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  Bot,
  HeartHandshake,
  Lightbulb,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Star,
} from 'lucide-react'
import Badge from '../components/ui/Badge'
import LogoMark from '../components/brand/LogoMark'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import InputField from '../components/ui/InputField'
import { roles } from '../context/roles'
import { useSession } from '../hooks/useSession'
import { useToast } from '../hooks/useToast'

const image = (id, width = 900, height = 650) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&h=${height}&q=82`

const landingImages = {
  hero: image('photo-1562774053-701939374585', 1600, 1000),
  director: image('photo-1551836022-d5d88e9218df', 500, 520),
}

const schoolValues = [
  {
    title: 'Qualidade',
    text: 'Acompanhamento academico proximo, metas claras e avaliacao continua em cada etapa.',
  },
  {
    title: 'Inovacao',
    text: 'Projetos maker, tecnologia em sala de aula e atividades que conectam teoria e pratica.',
  },
  {
    title: 'Comunidade',
    text: 'Familias, professores e estudantes trabalhando juntos por uma rotina mais acolhedora.',
  },
]

const testimonials = [
  {
    name: 'Tatiane Rodrigues',
    role: 'Mae do 8o ano',
    avatar: image('photo-1494790108377-be9c29b29330', 160, 160),
    text: 'O portal aproximou nossa familia da escola. Consigo acompanhar entregas, notas e recados sem perder prazos importantes.',
  },
  {
    name: 'Nora Reis',
    role: 'Mae do Ensino Medio',
    avatar: image('photo-1438761681033-6461ffad8d80', 160, 160),
    text: 'As mensagens dos professores sao objetivas e o calendario deixa a semana muito mais previsivel para os estudos em casa.',
  },
  {
    name: 'Julio Pinheiro',
    role: 'Responsavel',
    avatar: image('photo-1500648767791-00dcc994a43e', 160, 160),
    text: 'A escola combina disciplina e cuidado. A area logada trouxe mais autonomia para organizar materiais e revisoes.',
  },
]

const highlightPhotos = [
  {
    title: 'Destaques do Semestre',
    subtitle: 'Alunos reconhecidos por colaboracao e desempenho',
    image: image('photo-1523580846011-d3a5bc25702b', 700, 460),
  },
  {
    title: 'Projeto de Ciencias',
    subtitle: 'Experimentos apresentados na mostra escolar',
    image: image('photo-1509062522246-3755977927d7', 700, 460),
  },
  {
    title: 'Equipe de Debate',
    subtitle: 'Preparacao para campeonato regional',
    image: image('photo-1517486808906-6ca8b3f04846', 700, 460),
  },
]

const schoolProjects = [
  {
    title: 'Robotica Avancada',
    text: 'Desafios semanais com sensores, programacao e apresentacoes em grupo.',
    image: image('photo-1517976547714-720226b864c1', 600, 420),
  },
  {
    title: 'Horta Comunitaria',
    text: 'Cuidado com canteiros, ciencias naturais e sustentabilidade na pratica.',
    image: image('photo-1466692476868-aef1dfb1e735', 600, 420),
  },
  {
    title: 'Clube de Debates',
    text: 'Oratoria, pesquisa e argumentacao para fortalecer o pensamento critico.',
    image: image('photo-1551836022-d5d88e9218df', 600, 420),
  },
  {
    title: 'Laboratorio Criativo',
    text: 'Prototipos, artes visuais e resolucao de problemas com metodologia maker.',
    image: image('photo-1581090464777-f3220bbe1b8b', 600, 420),
  },
]

const courses = [
  {
    title: 'Infantil',
    label: 'Programacao para Criancas',
    image: image('photo-1503676260728-1c00da094a0b', 500, 360),
  },
  {
    title: 'Fundamental',
    label: 'Ensino Fundamental Integral',
    image: image('photo-1513475382585-d06e58bcb0e0', 500, 360),
  },
  {
    title: 'Medio',
    label: 'Ensino Medio e Pre-Vestibular',
    image: image('photo-1520523839897-bd0b52f945a0', 500, 360),
  },
]

const valueIcons = [ShieldCheck, Lightbulb, HeartHandshake]

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

  const showFeedbacks = () => {
    document.querySelector('#feedbacks')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="bg-page text-copy">
      <section
        className="relative flex min-h-[72vh] items-center overflow-hidden bg-brand-ink text-white"
        id="top"
        style={{ backgroundImage: `url(${landingImages.hero})`, backgroundPosition: 'center', backgroundSize: 'cover' }}
      >
        <div className="absolute inset-0 bg-brand-ink/68" />
        <header className="absolute inset-x-0 top-0 z-10 border-b border-white/15 bg-brand-ink/45 backdrop-blur">
          <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
            <Link className="flex items-center gap-3" to="/">
              <LogoMark light />
              <span>
                <span className="block text-sm font-black">PROGRESSO</span>
                <span className="block text-[10px] font-bold uppercase text-white/75">Colegio Inteligente</span>
              </span>
            </Link>
            <nav className="hidden items-center gap-5 text-sm font-bold text-white/85 md:flex">
              <a className="hover:text-white" href="#sobre">
                Sobre
              </a>
              <a className="hover:text-white" href="#projetos">
                Projetos
              </a>
              <a className="hover:text-white" href="#cursos">
                Cursos
              </a>
              <a className="hover:text-white" href="#login">
                Login
              </a>
            </nav>
            <a
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-white px-4 text-sm font-black text-brand-ink transition hover:bg-brand-royal-soft"
              href="#login"
            >
              <LockKeyhole aria-hidden="true" className="h-4 w-4" />
              Portal
            </a>
          </div>
        </header>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-14 pt-28 sm:px-6">
          <div className="max-w-3xl">
            <Badge tone="warning">Matriculas 2026</Badge>
            <h1 className="mt-6 text-5xl font-black leading-tight text-white md:text-6xl">Colegio Progresso</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/86">
              Ensino conectado, acompanhamento claro e uma rotina escolar inteligente para alunos, familias e professores.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-alert-coral px-5 py-3 text-sm font-black text-white transition hover:bg-red-700"
                href="#login"
              >
                <BookOpen aria-hidden="true" className="h-4 w-4" />
                Acessar portal
              </a>
              <a
                className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-black text-brand-ink transition hover:bg-brand-royal-soft"
                href="#cursos"
              >
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
                Conhecer cursos
              </a>
            </div>
          </div>
        </div>
      </section>

      <main>
        <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_.95fr]" id="sobre">
          <div>
            <p className="text-sm font-black uppercase text-alert-coral">Sobre a escola</p>
            <h2 className="mt-2 text-3xl font-black text-brand-ink md:text-4xl">Uma rotina academica acompanhada de perto</h2>
            <p className="mt-4 leading-7 text-muted">
              O Colegio Progresso une tecnologia, acolhimento e excelencia pedagogica para transformar indicadores escolares em decisoes claras.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {schoolValues.map((value, index) => {
                const Icon = valueIcons[index]

                return (
                  <Card className="p-5" key={value.title}>
                    <span className="grid h-11 w-11 place-items-center rounded-lg bg-brand-royal-soft text-brand-royal">
                      <Icon aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <h3 className="mt-4 font-black text-brand-ink">{value.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted">{value.text}</p>
                  </Card>
                )
              })}
            </div>
          </div>
          <Card className="overflow-hidden p-0">
            <img alt="Diretora em ambiente escolar" className="h-72 w-full object-cover" src={landingImages.director} />
            <div className="p-6">
              <Badge tone="royal">Historia</Badge>
              <p className="mt-4 leading-7 text-muted">
                Desde 1998, a escola amplia laboratorios, clubes de projeto e acompanhamento digital para que cada estudante tenha percurso visivel.
              </p>
            </div>
          </Card>
        </section>

        <section className="bg-white py-12" id="feedbacks">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase text-alert-coral">Nossos feedbacks</p>
                <h2 className="mt-2 text-3xl font-black text-brand-ink">Familias acompanhando cada etapa</h2>
              </div>
              <Button icon={Sparkles} onClick={showFeedbacks} variant="soft">
                Ver feedbacks
              </Button>
            </div>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {testimonials.map((testimonial) => (
                <Card className="h-full" key={testimonial.name}>
                  <div className="flex items-center gap-3">
                    <img alt={testimonial.name} className="h-12 w-12 rounded-full object-cover" src={testimonial.avatar} />
                    <div>
                      <p className="font-black text-brand-ink">{testimonial.name}</p>
                      <p className="text-sm text-muted">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-copy">{testimonial.text}</p>
                  <div className="mt-4 flex gap-1 text-warning">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star aria-hidden="true" className="h-4 w-4 fill-current" key={index} />
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
          <p className="text-sm font-black uppercase text-alert-coral">Alunos destaque</p>
          <h2 className="mt-2 text-3xl font-black text-brand-ink">Foto dos alunos destaques</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {highlightPhotos.map((photo) => (
              <article className="group overflow-hidden rounded-xl border border-line bg-white shadow-md" key={photo.title}>
                <img alt={photo.title} className="h-64 w-full object-cover transition duration-500 group-hover:scale-105" src={photo.image} />
                <div className="p-5">
                  <h3 className="font-black text-brand-ink">{photo.title}</h3>
                  <p className="mt-2 text-sm text-muted">{photo.subtitle}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-white py-12" id="projetos">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase text-alert-coral">Nossos projetos</p>
                <h2 className="mt-2 text-3xl font-black text-brand-ink">Aprender fazendo</h2>
              </div>
              <Button
                icon={Bot}
                onClick={() => addToast({ title: 'Projetos', message: 'A coordenacao entrara em contato com detalhes dos projetos ativos.' })}
                variant="primary"
              >
                Saiba mais
              </Button>
            </div>
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {schoolProjects.map((project) => (
                <Card className="overflow-hidden p-0" key={project.title}>
                  <img alt={project.title} className="h-44 w-full object-cover" src={project.image} />
                  <div className="p-5">
                    <h3 className="font-black text-brand-ink">{project.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted">{project.text}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6" id="cursos">
          <p className="text-sm font-black uppercase text-alert-coral">Cursos disponiveis</p>
          <h2 className="mt-2 text-3xl font-black text-brand-ink">Trilhas para cada fase escolar</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {courses.map((course) => (
              <Card className="overflow-hidden p-0" key={`${course.title}-${course.label}`}>
                <img alt={course.label} className="h-44 w-full object-cover" src={course.image} />
                <div className="p-5">
                  <Badge tone="dark">{course.title}</Badge>
                  <h3 className="mt-4 text-xl font-black text-brand-ink">{course.label}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">Turmas com acompanhamento digital, projetos aplicados e rotina de aprendizagem visivel.</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="bg-white py-12" id="login">
          <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
            <Card>
              <p className="text-sm font-black uppercase text-alert-coral">Area de login</p>
              <h2 className="mt-2 text-3xl font-black text-brand-ink">Acesse seu painel escolar</h2>
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
          </div>
        </section>
      </main>

      <footer className="bg-brand-ink px-4 py-8 text-center text-sm text-slate-300">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3">
          <LogoMark light />
          <p className="font-bold text-white">Colegio Progresso</p>
          <p>Copyright 2026. Ensino inteligente, humano e conectado.</p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
