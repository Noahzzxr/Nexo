import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  FileText,
  MessageSquare,
  TrendingUp,
} from 'lucide-react'
import DoughnutStat from '../components/charts/DoughnutStat'
import Avatar from '../components/ui/Avatar'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import {
  dashboardStats,
  pendingTasks,
  recentMessages,
  studentProfile,
  teachers,
  todaysClasses,
} from '../data/mockData'

const statStyles = {
  coral: {
    card: 'border-alert-coral/25 bg-alert-soft',
    badge: 'bg-alert-coral text-white',
    label: 'text-alert-coral',
  },
  royal: {
    card: 'border-brand-royal/20 bg-brand-royal-soft',
    badge: 'bg-brand-royal text-white',
    label: 'text-brand-royal',
  },
  success: {
    card: 'border-success/20 bg-success-soft',
    badge: 'bg-success text-white',
    label: 'text-success',
  },
}

function DashboardPage() {
  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase text-alert-coral">Portal do aluno</p>
          <h1 className="mt-1 text-3xl font-black text-brand-ink">Dashboard do Aluno</h1>
          <p className="mt-2 text-muted">Resumo academico de {studentProfile.name} para hoje, 02/06/2026.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button as={Link} icon={FileText} to="/materiais" variant="ghost">
            Materiais
          </Button>
          <Button as={Link} icon={TrendingUp} to="/frequencia" variant="royal">
            Frequencia
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {dashboardStats.map((stat) => {
          const style = statStyles[stat.tone]

          return (
            <Card className={`${style.card} overflow-hidden`} key={stat.label}>
              <p className={`text-sm font-black uppercase ${style.label}`}>{stat.label}</p>
              <div className="mt-4 flex items-end justify-between gap-4">
                <span className="text-4xl font-black text-brand-ink">{stat.value}</span>
                <Badge className={style.badge}>{stat.detail}</Badge>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_.85fr]">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <Card>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-black uppercase text-alert-coral">Aulas de hoje</p>
                <h2 className="mt-1 text-xl font-black text-brand-ink">Agenda academica</h2>
              </div>
              <CalendarDays aria-hidden="true" className="h-5 w-5 text-brand-royal" />
            </div>
            <div className="mt-5 grid gap-3">
              {todaysClasses.map((lesson) => {
                const teacher = teachers.find((item) => item.name === lesson.teacher)

                return (
                  <div className="flex items-center gap-3 rounded-lg border border-line p-3" key={`${lesson.time}-${lesson.title}`}>
                    <span className="grid h-12 w-14 shrink-0 place-items-center rounded-lg bg-brand-royal-soft text-sm font-black text-brand-royal">
                      {lesson.time}
                    </span>
                    <Avatar image={teacher?.avatar} name={lesson.teacher} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-black text-brand-ink">{lesson.title}</p>
                      <p className="truncate text-sm text-muted">
                        {lesson.teacher} - {lesson.room}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-black uppercase text-alert-coral">Tarefas pendentes</p>
                <h2 className="mt-1 text-xl font-black text-brand-ink">Acoes rapidas</h2>
              </div>
              <Clock aria-hidden="true" className="h-5 w-5 text-brand-royal" />
            </div>
            <div className="mt-5 grid gap-3">
              {pendingTasks.map((task) => (
                <div className="grid gap-3 rounded-lg border border-line p-3 sm:grid-cols-[1fr_auto] sm:items-center" key={task.title}>
                  <div>
                    <p className="font-black text-brand-ink">{task.title}</p>
                    <p className="mt-1 text-sm text-muted">
                      {task.subject} - entrega {task.due}
                    </p>
                  </div>
                  <Button
                    as={Link}
                    className="w-full sm:w-auto"
                    icon={ArrowRight}
                    to="/atividades"
                    variant={task.status === 'Atrasado' ? 'coral' : 'royal'}
                  >
                    Entrar
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          <Card className="lg:col-span-2">
            <div className="grid gap-6 lg:grid-cols-[1fr_.8fr]">
              <div>
                <p className="text-sm font-black uppercase text-alert-coral">Atualizacoes do sistema</p>
                <h2 className="mt-1 text-xl font-black text-brand-ink">Nova trilha de revisao liberada</h2>
                <p className="mt-3 leading-7 text-muted">
                  A coordenacao publicou uma sequencia de revisao para provas de junho com materiais, simulados e prioridades por disciplina.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Button as={Link} icon={FileText} to="/materiais" variant="coral">
                    Acessar materiais
                  </Button>
                  <Button as={Link} icon={CalendarDays} to="/calendario" variant="ghost">
                    Ver calendario
                  </Button>
                </div>
              </div>
              <div className="rounded-xl bg-page p-4">
                <p className="font-black text-brand-ink">Mini calendario</p>
                <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs font-bold text-muted">
                  {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((day, index) => (
                    <span key={`${day}-${index}`}>{day}</span>
                  ))}
                  {Array.from({ length: 30 }).map((_, index) => {
                    const day = index + 1
                    const active = [2, 4, 10, 18, 22].includes(day)

                    return (
                      <span
                        className={`grid h-8 place-items-center rounded-md ${active ? 'bg-alert-coral text-white' : 'bg-white text-brand-ink'}`}
                        key={day}
                      >
                        {day}
                      </span>
                    )
                  })}
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid gap-6">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-black uppercase text-alert-coral">Media geral</p>
                <h2 className="mt-1 text-xl font-black text-brand-ink">Desempenho atual</h2>
              </div>
              <CheckCircle2 aria-hidden="true" className="h-5 w-5 text-success" />
            </div>
            <DoughnutStat colors={['#D84F45', '#FFF0EF']} label="Media" subLabel="media" value={69.3} />
            <div className="grid grid-cols-2 gap-3 text-center text-sm">
              <div className="rounded-lg bg-success-soft p-3 text-success">
                <p className="font-black">Aprovado</p>
                <p>4 materias</p>
              </div>
              <div className="rounded-lg bg-warning-soft p-3 text-amber-700">
                <p className="font-black">Atencao</p>
                <p>2 materias</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-black uppercase text-alert-coral">Mensagens recentes</p>
                <h2 className="mt-1 text-xl font-black text-brand-ink">Professores</h2>
              </div>
              <MessageSquare aria-hidden="true" className="h-5 w-5 text-brand-royal" />
            </div>
            <div className="mt-5 grid gap-4">
              {recentMessages.map((message) => (
                <div className="flex items-start gap-3" key={message.from}>
                  <Avatar image={message.avatar} name={message.from} size="sm" />
                  <div>
                    <p className="font-black text-brand-ink">{message.from}</p>
                    <p className="mt-1 text-sm leading-5 text-muted">{message.preview}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button as={Link} className="mt-5 w-full" icon={MessageSquare} to="/conversas" variant="soft">
              Abrir conversas
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
