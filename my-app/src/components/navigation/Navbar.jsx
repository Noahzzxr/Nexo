import { NavLink, useNavigate } from 'react-router-dom'
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  ClipboardList,
  Gamepad2,
  GraduationCap,
  LogOut,
  MessageSquare,
  ShieldCheck,
  UserCircle,
} from 'lucide-react'
import Avatar from '../ui/Avatar'
import { roles, roleLabels } from '../../context/roles'
import { useSession } from '../../hooks/useSession'
import { studentProfile } from '../../data/mockData'

const links = [
  { label: 'Dashboard', to: '/dashboard', icon: BarChart3 },
  { label: 'Boletim', to: '/boletim', icon: BookOpen },
  { label: 'Atividades', to: '/atividades', icon: ClipboardList },
  { label: 'Jogos', to: '/jogos', icon: Gamepad2 },
  { label: 'Chat', to: '/conversas', icon: MessageSquare },
  { label: 'Provas', to: '/provas', icon: GraduationCap },
  { label: 'Calendario', to: '/calendario', icon: CalendarDays },
  { label: 'Perfil', to: '/perfil', icon: UserCircle },
]

function Navbar() {
  const navigate = useNavigate()
  const { currentUser, isAdmin, logout, role, roleLabel, setRole } = useSession()
  const visibleLinks = isAdmin ? [...links, { label: 'Admin', to: '/admin', icon: ShieldCheck }] : links

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <header className="fixed inset-x-0 top-0 z-40 w-full border-b border-line bg-white/95 backdrop-blur">
      <div className="flex h-16 w-full items-center justify-between gap-3 px-3 sm:px-5">
        <NavLink className="flex min-w-0 shrink-0 items-center gap-2" to="/dashboard">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-ink text-sm font-black text-white">PG</span>
          <span className="hidden leading-none lg:block">
            <span className="block text-sm font-black text-brand-ink">PROGRESSO</span>
            <span className="block text-[10px] font-bold uppercase text-alert-coral">Sistema Escolar</span>
          </span>
        </NavLink>

        <nav className="scrollbar-thin flex min-w-0 flex-1 items-center justify-center gap-1 overflow-x-auto px-1">
          {visibleLinks.map((link) => {
            const Icon = link.icon

            return (
              <NavLink
                className={({ isActive }) =>
                  `inline-flex h-10 shrink-0 items-center gap-2 rounded-lg px-2.5 text-sm font-bold transition xl:px-3 ${
                    isActive ? 'bg-brand-royal text-white shadow-sm' : 'text-brand-ink hover:bg-brand-royal-soft hover:text-brand-royal'
                  }`
                }
                key={link.to}
                to={link.to}
              >
                <Icon aria-hidden="true" className="h-4 w-4" />
                <span className="hidden sm:inline">{link.label}</span>
              </NavLink>
            )
          })}
        </nav>

        <details className="group relative shrink-0">
          <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg border border-line bg-white px-2 py-1.5 transition hover:border-brand-royal">
            <Avatar image={studentProfile.avatar} name={studentProfile.name} size="sm" />
            <span className="hidden max-w-32 truncate text-sm font-bold text-brand-ink md:block">{currentUser.fullname}</span>
            <span className="hidden rounded-md bg-brand-royal-soft px-2 py-1 text-xs font-black text-brand-royal lg:block">{roleLabel}</span>
          </summary>
          <div className="absolute right-0 top-12 w-72 rounded-xl border border-line bg-white p-4 text-slate-900 shadow-panel">
            <div className="flex items-center gap-3 border-b border-line pb-4">
              <Avatar image={studentProfile.avatar} name={currentUser.fullname} size="md" />
              <div className="min-w-0">
                <p className="truncate font-black text-brand-ink">{currentUser.fullname}</p>
                <p className="truncate text-sm text-slate-700">{currentUser.email}</p>
              </div>
            </div>
            <label className="mt-4 block text-sm font-bold text-brand-ink">
              Perfil ativo
              <select
                aria-label="Alternar perfil"
                className="mt-2 w-full rounded-lg border border-line bg-page px-3 py-2 text-sm font-bold text-slate-900 outline-none focus:border-brand-royal focus:ring-2 focus:ring-brand-royal-soft"
                onChange={(event) => setRole(event.target.value)}
                value={role}
              >
                {Object.values(roles).map((item) => (
                  <option key={item} value={item}>
                    {roleLabels[item]}
                  </option>
                ))}
              </select>
            </label>
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
    </header>
  )
}

export default Navbar
