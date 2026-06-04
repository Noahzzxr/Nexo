import { Navigate, Outlet, Link } from 'react-router-dom'
import { Globe2, Mail, MapPin, MessagesSquare, Phone, Share2 } from 'lucide-react'
import { useSession } from '../../hooks/useSession'
import Navbar from '../navigation/Navbar'
import LogoMark from '../brand/LogoMark'

function Footer() {
  return (
    <footer className="bg-brand-ink text-white">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <LogoMark className="h-11 w-11" light />
            <div>
              <p className="font-black">PROGRESSO</p>
              <p className="text-xs font-semibold uppercase text-slate-300">Portal Inteligente</p>
            </div>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-300">
            Acompanhamento academico, comunicacao escolar e rotina do aluno em uma experiencia unificada.
          </p>
        </div>

        <div>
          <p className="font-bold">Institucional</p>
          <div className="mt-3 grid gap-2 text-sm text-slate-300">
            <Link className="hover:text-white" to="/">
              Sobre a escola
            </Link>
            <Link className="hover:text-white" to="/materiais">
              Materiais
            </Link>
            <Link className="hover:text-white" to="/ranking">
              Ranking
            </Link>
          </div>
        </div>

        <div>
          <p className="font-bold">Contato</p>
          <div className="mt-3 grid gap-2 text-sm text-slate-300">
            <span className="flex items-center gap-2">
              <Phone aria-hidden="true" className="h-4 w-4" />
              (11) 4002-2026
            </span>
            <span className="flex items-center gap-2">
              <Mail aria-hidden="true" className="h-4 w-4" />
              atendimento@progresso.edu
            </span>
            <span className="flex items-center gap-2">
              <MapPin aria-hidden="true" className="h-4 w-4" />
              Sao Paulo, SP
            </span>
          </div>
        </div>

        <div>
          <p className="font-bold">Redes</p>
          <div className="mt-3 flex gap-2">
            {[Share2, MessagesSquare, Globe2].map((Icon) => (
              <a
                aria-label="Rede social"
                className="grid h-9 w-9 place-items-center rounded-lg bg-white/10 text-slate-200 transition hover:bg-white hover:text-brand-ink"
                href="#top"
                key={Icon.displayName || Icon.name}
              >
                <Icon aria-hidden="true" className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-slate-400">
        Copyright 2026 Colegio Progresso. Todos os direitos reservados.
      </div>
    </footer>
  )
}

function MainLayout() {
  const { isAuthenticated, isLoadingSession } = useSession()

  if (isLoadingSession) {
    return (
      <div className="grid min-h-screen place-items-center bg-page px-4 text-center">
        <div>
          <LogoMark className="mx-auto h-12 w-12" />
          <p className="mt-4 font-black text-brand-ink">Carregando sessao...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen bg-page">
      <Navbar />
      <main className="mx-auto min-h-screen w-full max-w-7xl px-4 pb-10 pt-24 sm:px-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout
