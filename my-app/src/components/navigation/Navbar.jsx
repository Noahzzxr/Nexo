import { useMemo, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  ClipboardList,
  Gamepad2,
  LogOut,
  Menu,
  MessageSquare,
  ShieldCheck,
  UserCircle,
  X,
} from 'lucide-react'
import Avatar from '../ui/Avatar'
import LogoMark from '../brand/LogoMark'
import { useSession } from '../../hooks/useSession'

function Navbar() {
  const navigate = useNavigate()
  const { currentUser, isAdmin, isTeacher, logout, roleLabel } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const homeLink = isAdmin ? '/admin' : '/dashboard'

  const visibleLinks = useMemo(() => {
    if (isAdmin) {
      return [
        { label: 'Administrador', to: '/admin', icon: ShieldCheck },
        { label: 'Calendario', to: '/calendario', icon: CalendarDays },
      ]
    }

    if (isTeacher) {
      return [
        { label: 'Painel', to: '/dashboard', icon: BarChart3 },
        { label: 'Boletim', to: '/boletim', icon: BookOpen },
        { label: 'Atividades', to: '/atividades', icon: ClipboardList },
        { label: 'Jogos', to: '/jogos', icon: Gamepad2 },
        { label: 'Calendario', to: '/calendario', icon: CalendarDays },
        { label: 'Bater papo', to: '/conversas', icon: MessageSquare },
        { label: 'Perfil', to: '/perfil', icon: UserCircle },
      ]
    }

    return [
      { label: 'Painel', to: '/dashboard', icon: BarChart3 },
      { label: 'Boletim', to: '/boletim', icon: BookOpen },
      { label: 'Atividades', to: '/atividades', icon: ClipboardList },
      { label: 'Jogos', to: '/jogos', icon: Gamepad2 },
      { label: 'Bater papo', to: '/conversas', icon: MessageSquare },
      { label: 'Calendario', to: '/calendario', icon: CalendarDays },
      { label: 'Perfil', to: '/perfil', icon: UserCircle },
    ]
  }, [isAdmin, isTeacher])

  const handleLogout = async () => {
    await logout()
    setIsMenuOpen(false)
    navigate('/')
  }

  const navLinkClass = ({ isActive }) =>
    `inline-flex h-10 shrink-0 items-center gap-2 rounded-lg px-2.5 text-sm font-bold transition xl:px-3 ${
      isActive ? 'bg-brand-royal text-white shadow-sm' : 'text-brand-ink hover:bg-brand-royal-soft hover:text-brand-royal'
    }`

  const mobileNavLinkClass = ({ isActive }) =>
    `flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-black transition ${
      isActive ? 'bg-brand-royal text-white shadow-sm' : 'text-brand-ink hover:bg-brand-royal-soft hover:text-brand-royal'
    }`

  return (
    <header className="fixed inset-x-0 top-0 z-40 w-full border-b border-line bg-white/95 backdrop-blur">
      <div className="flex h-16 w-full items-center justify-between gap-3 px-3 sm:px-5">
        <NavLink className="flex min-w-0 shrink-0 items-center gap-2" onClick={() => setIsMenuOpen(false)} to={homeLink}>
          <LogoMark />
          <span className="hidden leading-none sm:block">
            <span className="block text-sm font-black text-brand-ink">PROGRESSO</span>
            <span className="block text-[10px] font-bold uppercase text-alert-coral">Sistema Escolar</span>
          </span>
        </NavLink>

        <nav className="scrollbar-thin hidden min-w-0 flex-1 items-center justify-center gap-1 overflow-x-auto px-1 md:flex">
          {visibleLinks.map((link) => {
            const Icon = link.icon

            return (
              <NavLink className={navLinkClass} key={link.to} to={link.to}>
                <Icon aria-hidden="true" className="h-4 w-4" />
                <span className="hidden sm:inline">{link.label}</span>
              </NavLink>
            )
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <button
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            className="grid h-10 w-10 place-items-center rounded-lg border border-line bg-white text-brand-ink transition hover:border-brand-royal hover:text-brand-royal md:hidden"
            onClick={() => setIsMenuOpen((current) => !current)}
            type="button"
          >
            {isMenuOpen ? <X aria-hidden="true" className="h-5 w-5" /> : <Menu aria-hidden="true" className="h-5 w-5" />}
          </button>

          <details className="group relative shrink-0">
            <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg border border-line bg-white px-2 py-1.5 transition hover:border-brand-royal">
              <Avatar image={currentUser.avatar_url} name={currentUser.fullname} size="sm" />
              <span className="hidden max-w-32 truncate text-sm font-bold text-brand-ink lg:block">{currentUser.fullname}</span>
              <span className="hidden rounded-md bg-brand-royal-soft px-2 py-1 text-xs font-black text-brand-royal xl:block">{roleLabel}</span>
            </summary>
            <div className="absolute right-0 top-12 w-[min(18rem,calc(100vw-1rem))] rounded-xl border border-line bg-white p-4 text-slate-900 shadow-panel">
              <div className="flex items-center gap-3 border-b border-line pb-4">
                <Avatar image={currentUser.avatar_url} name={currentUser.fullname} size="md" />
                <div className="min-w-0">
                  <p className="truncate font-black text-brand-ink">{currentUser.fullname}</p>
                  <p className="truncate text-sm text-slate-700">{currentUser.email}</p>
                </div>
              </div>
              <div className="mt-4 rounded-lg bg-page p-3">
                <p className="text-xs font-black uppercase text-muted">Perfil ativo</p>
                <p className="mt-1 font-black text-brand-ink">{roleLabel}</p>
              </div>
              <button
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-alert-coral px-4 py-2.5 text-sm font-black text-white transition hover:bg-red-700"
                onClick={handleLogout}
                type="button"
              >
                <LogOut aria-hidden="true" className="h-4 w-4" />
                Sair
              </button>
            </div>
          </details>
        </div>
      </div>

      {isMenuOpen ? (
        <nav className="border-t border-line bg-white px-3 py-3 shadow-panel md:hidden">
          <div className="grid gap-1">
            {visibleLinks.map((link) => {
              const Icon = link.icon

              return (
                <NavLink className={mobileNavLinkClass} key={link.to} onClick={() => setIsMenuOpen(false)} to={link.to}>
                  <Icon aria-hidden="true" className="h-4 w-4" />
                  <span>{link.label}</span>
                </NavLink>
              )
            })}
          </div>
        </nav>
      ) : null}
    </header>
  )
}

export default Navbar
