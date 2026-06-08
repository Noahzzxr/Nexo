import { Link } from 'react-router-dom'
import { ArrowRight, CalendarDays, ClipboardList, FileText, MessageSquare, Trophy, Users } from 'lucide-react'
import Avatar from '../components/ui/Avatar'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { roles } from '../context/roles'
import { useSession } from '../hooks/useSession'

const formatDate = (value) => (value ? new Date(value).toLocaleDateString('pt-BR') : '-')

function DashboardPage() {
  const { currentUser, isTeacher, roleLabel, schoolData } = useSession()
  const pendingAssignments = schoolData.assignments.filter(
    (assignment) => !schoolData.submissions.some((submission) => submission.assignment_id === assignment.id && submission.student_id === currentUser.id),
  )
  const userMessages = schoolData.messages.filter((message) => message.sender_id === currentUser.id || message.receiver_id === currentUser.id)
  const upcomingEvents = schoolData.calendarEvents.slice(0, 4)
  const databaseProfile = schoolData.profiles.find((profile) => profile.id === currentUser.id) || currentUser

  const cards = isTeacher
    ? [
        ['Turmas vinculadas', new Set(schoolData.teacherSubjects.filter((item) => item.teacher_id === currentUser.id).map((item) => item.class_id)).size],
        ['Atividades criadas', schoolData.assignments.length],
        ['Mensagens', userMessages.length],
      ]
    : [
        ['Meu XP', Number(databaseProfile.total_xp || 0)],
        ['Atividades pendentes', pendingAssignments.length],
        ['Materiais disponiveis', schoolData.materials.length],
      ]

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase text-alert-coral">Portal {roleLabel}</p>
          <h1 className="mt-1 text-3xl font-black text-brand-ink">{isTeacher ? 'Painel do Professor' : 'Dashboard do Aluno'}</h1>
          <p className="mt-2 text-muted">Resumo carregado diretamente do banco para {currentUser.fullname}.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button as={Link} icon={FileText} to="/materiais" variant="ghost">Materiais</Button>
          <Button as={Link} icon={ClipboardList} to="/atividades" variant="royal">Atividades</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {cards.map(([label, value]) => (
          <Card className="border-brand-royal/20 bg-brand-royal-soft" key={label}>
            <p className="text-sm font-black uppercase text-brand-royal">{label}</p>
            <p className="mt-3 text-4xl font-black text-brand-ink">{value}</p>
          </Card>
        ))}
      </div>

      {!isTeacher ? (
        <Card className="border-success/30 bg-success-soft">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-black uppercase text-success">Experiencia</p>
              <h2 className="mt-1 text-2xl font-black text-brand-ink">{Number(databaseProfile.total_xp || 0)} XP acumulados</h2>
              <p className="mt-2 text-sm text-copy">Complete quizzes em Jogos para ganhar mais XP.</p>
            </div>
            <Trophy className="h-10 w-10 text-success" />
          </div>
        </Card>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
        <Card>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-black uppercase text-alert-coral">Atividades</p>
              <h2 className="mt-1 text-xl font-black text-brand-ink">{isTeacher ? 'Ultimas atividades criadas' : 'Pendencias do aluno'}</h2>
            </div>
            <ClipboardList className="h-5 w-5 text-brand-royal" />
          </div>
          <div className="grid gap-3">
            {(isTeacher ? schoolData.assignments : pendingAssignments).slice(0, 5).map((assignment) => {
              const subject = schoolData.subjects.find((item) => item.id === assignment.subject_id)
              return (
                <div className="grid gap-3 rounded-lg border border-line p-3 sm:grid-cols-[1fr_auto] sm:items-center" key={assignment.id}>
                  <div>
                    <p className="font-black text-brand-ink">{assignment.title}</p>
                    <p className="mt-1 text-sm text-muted">{subject?.name || 'Sem disciplina'} - prazo {formatDate(assignment.due_date)}</p>
                  </div>
                  <Button as={Link} icon={ArrowRight} to="/atividades" variant="royal">Abrir</Button>
                </div>
              )
            })}
            {!(isTeacher ? schoolData.assignments : pendingAssignments).length ? <p className="rounded-lg bg-page p-4 text-sm text-muted">Nenhuma atividade registrada.</p> : null}
          </div>
        </Card>

        <div className="grid gap-6">
          <Card>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-black uppercase text-alert-coral">Agenda</p>
                <h2 className="mt-1 text-xl font-black text-brand-ink">Proximos eventos</h2>
              </div>
              <CalendarDays className="h-5 w-5 text-brand-royal" />
            </div>
            <div className="grid gap-3">
              {upcomingEvents.map((event) => (
                <div className="rounded-lg border border-line p-3" key={event.id}>
                  <Badge tone={event.event_type === 'exam' ? 'coral' : event.event_type === 'activity' ? 'success' : 'royal'}>{event.event_type}</Badge>
                  <p className="mt-2 font-black text-brand-ink">{event.title}</p>
                  <p className="text-sm text-muted">{formatDate(event.start_date)}</p>
                </div>
              ))}
              {!upcomingEvents.length ? <p className="rounded-lg bg-page p-4 text-sm text-muted">Nenhum evento cadastrado.</p> : null}
            </div>
          </Card>

          <Card>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-black uppercase text-alert-coral">Mensagens</p>
                <h2 className="mt-1 text-xl font-black text-brand-ink">Conversas recentes</h2>
              </div>
              <MessageSquare className="h-5 w-5 text-brand-royal" />
            </div>
            <div className="grid gap-3">
              {userMessages.slice(-3).reverse().map((message) => {
                const otherId = message.sender_id === currentUser.id ? message.receiver_id : message.sender_id
                const other = schoolData.profiles.find((profile) => profile.id === otherId)
                return (
                  <div className="flex items-start gap-3" key={message.id}>
                    <Avatar image={other?.avatar_url} name={other?.fullname || 'Usuario'} size="sm" />
                    <div>
                      <p className="font-black text-brand-ink">{other?.fullname || 'Usuario'}</p>
                      <p className="text-sm text-muted">{message.content}</p>
                    </div>
                  </div>
                )
              })}
              {!userMessages.length ? <p className="rounded-lg bg-page p-4 text-sm text-muted">Nenhuma mensagem registrada.</p> : null}
            </div>
            <Button as={Link} className="mt-5 w-full" icon={MessageSquare} to="/conversas" variant="soft">Abrir conversas</Button>
          </Card>
        </div>
      </div>

      {currentUser.role === roles.admin ? (
        <Card>
          <Users className="h-5 w-5 text-brand-royal" />
          <p className="mt-3 text-sm text-muted">Administradores devem usar o painel administrativo para criar contas e estruturar turmas.</p>
        </Card>
      ) : null}
    </div>
  )
}

export default DashboardPage
