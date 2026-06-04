import { useMemo } from 'react'
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
import { useSession } from '../hooks/useSession'
import {
  dashboardStats,
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
  const { currentUser, isTeacher, activities, globalMessages } = useSession()

  // Get dynamic pending activities for the student
  const studentPendingTasks = useMemo(() => {
    return activities
      .filter((act) => act.status !== 'Concluido' && act.status !== 'Concluído')
      .slice(0, 3)
  }, [activities])

  // Get recent chats from globalMessages
  const studentRecentMessages = useMemo(() => {
    // Filter messages for current user, group by contact name, and take latest
    const recent = []
    const seen = new Set()
    
    // Scan messages in reverse chronological order
    const sortedMsg = [...globalMessages].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    
    for (const msg of sortedMsg) {
      if (msg.sender_id === currentUser.id || msg.receiver_id === currentUser.id) {
        const contactId = msg.sender_id === currentUser.id ? msg.receiver_id : msg.sender_id
        if (!seen.has(contactId)) {
          seen.add(contactId)
          // Find contact name
          let contactName = 'Professor'
          let contactAvatar = 'https://i.pravatar.cc/100?img=3'
          if (contactId === '22222222-2222-4222-8222-222222222222') {
            contactName = 'Marco Nunes'
            contactAvatar = 'https://i.pravatar.cc/100?img=3'
          } else if (contactId === '44444444-4444-4444-8444-444444444444') {
            contactName = 'Elisa Duarte'
            contactAvatar = 'https://i.pravatar.cc/100?img=5'
          } else if (contactId === '55555555-5555-4555-8555-555555555555') {
            contactName = 'Rafael Brito'
            contactAvatar = 'https://i.pravatar.cc/100?img=11'
          } else if (contactId === '66666666-6666-4666-8666-666666666666') {
            contactName = 'Nina Salles'
            contactAvatar = 'https://i.pravatar.cc/100?img=20'
          } else if (contactId === '11111111-1111-4111-8111-111111111111') {
            contactName = 'Anna Regina'
            contactAvatar = 'https://i.pravatar.cc/120?img=45'
          }
          
          recent.push({
            from: contactName,
            preview: msg.content,
            avatar: contactAvatar,
          })
        }
      }
      if (recent.length >= 3) break
    }
    
    // If empty, fall back to some mock
    if (recent.length === 0) {
      return [
        { from: 'Marco Nunes', preview: 'Revise os exercícios 8 a 12 antes da aula.', avatar: 'https://i.pravatar.cc/100?img=3' },
        { from: 'Elisa Duarte', preview: 'Sua introdução ficou mais forte nesta versão.', avatar: 'https://i.pravatar.cc/100?img=5' },
      ]
    }
    return recent
  }, [globalMessages, currentUser.id])

  if (isTeacher) {
    // ----------------------------------------------------
    // TEACHER DASHBOARD VIEW
    // ----------------------------------------------------
    return (
      <div className="grid gap-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase text-alert-coral">Portal do Professor</p>
            <h1 className="mt-1 text-3xl font-black text-brand-ink">Painel do Professor</h1>
            <p className="mt-2 text-muted">
              Resumo das atividades docentes de {currentUser.fullname} para hoje, 02/06/2026.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button as={Link} icon={FileText} to="/atividades" variant="royal">
              Criar Atividade
            </Button>
          </div>
        </div>

        {/* Teacher Metrics Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className={`${statStyles.coral.card} overflow-hidden`}>
            <p className={`text-sm font-black uppercase ${statStyles.coral.label}`}>Total de Turmas</p>
            <div className="mt-4 flex items-end justify-between gap-4">
              <span className="text-4xl font-black text-brand-ink">7</span>
              <Badge className={statStyles.coral.badge}>6º ano ao 3º ano</Badge>
            </div>
          </Card>
          <Card className={`${statStyles.royal.card} overflow-hidden`}>
            <p className={`text-sm font-black uppercase ${statStyles.royal.label}`}>Alunos Cadastrados</p>
            <div className="mt-4 flex items-end justify-between gap-4">
              <span className="text-4xl font-black text-brand-ink">17</span>
              <Badge className={statStyles.royal.badge}>Nas turmas ativas</Badge>
            </div>
          </Card>
          <Card className={`${statStyles.success.card} overflow-hidden`}>
            <p className={`text-sm font-black uppercase ${statStyles.success.label}`}>Atividades Pendentes</p>
            <div className="mt-4 flex items-end justify-between gap-4">
              <span className="text-4xl font-black text-brand-ink">3</span>
              <Badge className={statStyles.success.badge}>Para correção</Badge>
            </div>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.35fr_.85fr]">
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <Card>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-black uppercase text-alert-coral">Minhas Aulas</p>
                  <h2 className="mt-1 text-xl font-black text-brand-ink">Agenda docente</h2>
                </div>
                <CalendarDays aria-hidden="true" className="h-5 w-5 text-brand-royal" />
              </div>
              <div className="mt-5 grid gap-3">
                <div className="flex items-center gap-3 rounded-lg border border-line p-3">
                  <span className="grid h-12 w-14 shrink-0 place-items-center rounded-lg bg-brand-royal-soft text-sm font-black text-brand-royal">
                    08:00
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-black text-brand-ink">Matemática</p>
                    <p className="truncate text-sm text-muted">9º ano B - Sala 12</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-line p-3">
                  <span className="grid h-12 w-14 shrink-0 place-items-center rounded-lg bg-brand-royal-soft text-sm font-black text-brand-royal">
                    10:00
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-black text-brand-ink">Matemática</p>
                    <p className="truncate text-sm text-muted">8º ano A - Sala 04</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-line p-3">
                  <span className="grid h-12 w-14 shrink-0 place-items-center rounded-lg bg-brand-royal-soft text-sm font-black text-brand-royal">
                    13:30
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-black text-brand-ink">Matemática</p>
                    <p className="truncate text-sm text-muted">2º Médio B - Sala 08</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-black uppercase text-alert-coral">Atividades</p>
                  <h2 className="mt-1 text-xl font-black text-brand-ink">Ações rápidas</h2>
                </div>
                <Clock aria-hidden="true" className="h-5 w-5 text-brand-royal" />
              </div>
              <div className="mt-5 grid gap-3">
                <div className="grid gap-3 rounded-lg border border-line p-3 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div>
                    <p className="font-black text-brand-ink">Lançamento de Notas</p>
                    <p className="mt-1 text-sm text-muted">Atualizar notas do bimestre</p>
                  </div>
                  <Button as={Link} className="w-full sm:w-auto" icon={ArrowRight} to="/boletim" variant="royal">
                    Lançar
                  </Button>
                </div>
                <div className="grid gap-3 rounded-lg border border-line p-3 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div>
                    <p className="font-black text-brand-ink">Histórico de Quizzes</p>
                    <p className="mt-1 text-sm text-muted">Visualizar ranking e pontos</p>
                  </div>
                  <Button as={Link} className="w-full sm:w-auto" icon={ArrowRight} to="/ranking" variant="royal">
                    Ranking
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="lg:col-span-2">
              <p className="text-sm font-black uppercase text-alert-coral">Atualizações do sistema</p>
              <h2 className="mt-1 text-xl font-black text-brand-ink">Ambiente virtual de apoio ao docente</h2>
              <p className="mt-3 leading-7 text-muted">
                Você pode gerenciar suas turmas e disciplinas a partir dos menus acima. Libere novos materiais de estudo na aba de materiais ou configure novos exercícios para os alunos.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button as={Link} icon={FileText} to="/atividades" variant="coral">
                  Postar nova atividade
                </Button>
              </div>
            </Card>
          </div>

          <div className="grid gap-6">
            <Card>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-black uppercase text-alert-coral">Mensagens recentes</p>
                  <h2 className="mt-1 text-xl font-black text-brand-ink">Alunos</h2>
                </div>
                <MessageSquare aria-hidden="true" className="h-5 w-5 text-brand-royal" />
              </div>
              <div className="mt-5 grid gap-4">
                {studentRecentMessages.map((message, i) => (
                  <div className="flex items-start gap-3" key={`${message.from}-${i}`}>
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

  // ----------------------------------------------------
  // STUDENT DASHBOARD VIEW
  // ----------------------------------------------------
  const stats = [
    ...dashboardStats,
    {
      label: 'Nível de Experiência (XP)',
      value: `${currentUser.xp || 370} XP`,
      tone: 'coral',
      detail: `Nível ${currentUser.level || 4}`,
    },
    {
      label: 'Pontuação Geral',
      value: `${currentUser.points || 370} pts`,
      tone: 'royal',
      detail: 'Jogos educativos',
    },
  ]

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase text-alert-coral">Portal do Aluno</p>
          <h1 className="mt-1 text-3xl font-black text-brand-ink">Dashboard do Aluno</h1>
          <p className="mt-2 text-muted">Resumo acadêmico de {currentUser.fullname} para hoje, 02/06/2026.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button as={Link} icon={FileText} to="/materiais" variant="ghost">
            Materiais
          </Button>
          <Button as={Link} icon={TrendingUp} to="/frequencia" variant="royal">
            Frequência
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
        {stats.map((stat) => {
          const style = statStyles[stat.tone] || statStyles.coral

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
                <h2 className="mt-1 text-xl font-black text-brand-ink">Agenda acadêmica</h2>
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
                <h2 className="mt-1 text-xl font-black text-brand-ink">Ações rápidas</h2>
              </div>
              <Clock aria-hidden="true" className="h-5 w-5 text-brand-royal" />
            </div>
            <div className="mt-5 grid gap-3">
              {studentPendingTasks.map((task) => (
                <div className="grid gap-3 rounded-lg border border-line p-3 sm:grid-cols-[1fr_auto] sm:items-center" key={task.id}>
                  <div>
                    <p className="font-black text-brand-ink">{task.name}</p>
                    <p className="mt-1 text-sm text-muted">
                      {task.course} - entrega {task.due}
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
              {studentPendingTasks.length === 0 ? (
                <p className="rounded-lg bg-page p-4 text-sm text-muted">Nenhuma tarefa pendente!</p>
              ) : null}
            </div>
          </Card>

          <Card className="lg:col-span-2">
            <div className="grid gap-6 lg:grid-cols-[1fr_.8fr]">
              <div>
                <p className="text-sm font-black uppercase text-alert-coral">Atualizações do sistema</p>
                <h2 className="mt-1 text-xl font-black text-brand-ink">Nova trilha de revisão liberada</h2>
                <p className="mt-3 leading-7 text-muted">
                  A coordenação publicou uma sequência de revisão para as provas de junho com materiais, simulados e prioridades por disciplina.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Button as={Link} icon={FileText} to="/materiais" variant="coral">
                    Acessar materiais
                  </Button>
                  <Button as={Link} icon={CalendarDays} to="/calendario" variant="ghost">
                    Ver calendário
                  </Button>
                </div>
              </div>
              <div className="rounded-xl bg-page p-4">
                <p className="font-black text-brand-ink">Mini calendário</p>
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
                <p className="text-sm font-black uppercase text-alert-coral">Média geral</p>
                <h2 className="mt-1 text-xl font-black text-brand-ink">Desempenho atual</h2>
              </div>
              <CheckCircle2 aria-hidden="true" className="h-5 w-5 text-success" />
            </div>
            <DoughnutStat colors={['#D84F45', '#FFF0EF']} label="Média" subLabel="média" value={69.3} />
            <div className="grid grid-cols-2 gap-3 text-center text-sm">
              <div className="rounded-lg bg-success-soft p-3 text-success">
                <p className="font-black">Aprovado</p>
                <p>4 matérias</p>
              </div>
              <div className="rounded-lg bg-warning-soft p-3 text-amber-700">
                <p className="font-black">Atenção</p>
                <p>2 matérias</p>
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
              {studentRecentMessages.map((message, i) => (
                <div className="flex items-start gap-3" key={`${message.from}-${i}`}>
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
