import { NavLink } from 'react-router-dom'
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  ClipboardList,
  Gamepad2,
  GraduationCap,
  MessageSquare,
  UserCircle,
} from 'lucide-react'
import Avatar from '../ui/Avatar'
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
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-4 px-4 sm:px-6">
        <NavLink className="flex shrink-0 items-center gap-2" to="/dashboard">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-ink text-sm font-black text-white">PG</span>
          <span className="hidden leading-none sm:block">
            <span className="block text-sm font-black text-brand-ink">PROGRESSO</span>
            <span className="block text-[10px] font-bold uppercase text-alert-coral">Sistema Escolar</span>
          </span>
        </NavLink>

        <nav className="scrollbar-thin flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
          {links.map((link) => {
            const Icon = link.icon

            return (
              <NavLink
                className={({ isActive }) =>
                  `inline-flex h-10 shrink-0 items-center gap-2 rounded-lg px-3 text-sm font-bold transition ${
                    isActive ? 'bg-brand-royal text-white shadow-sm' : 'text-brand-ink hover:bg-brand-royal-soft hover:text-brand-royal'
                  }`
                }
                key={link.to}
                to={link.to}
              >
                <Icon aria-hidden="true" className="h-4 w-4" />
                <span>{link.label}</span>
              </NavLink>
            )
          })}
        </nav>

        <NavLink
          className="hidden shrink-0 items-center gap-2 rounded-lg border border-line px-2 py-1.5 transition hover:border-brand-royal md:flex"
          to="/perfil"
        >
          <Avatar image={studentProfile.avatar} name={studentProfile.name} size="sm" />
          <span className="max-w-28 truncate text-sm font-bold text-brand-ink">{studentProfile.name}</span>
        </NavLink>
      </div>
    </header>
  )
}

export default Navbar
