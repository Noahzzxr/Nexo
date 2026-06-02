import { CalendarClock, Clock, GraduationCap, MapPin } from 'lucide-react'
import Badge from '../components/ui/Badge'
import Card from '../components/ui/Card'
import Table from '../components/ui/Table'
import { examHistory, exams } from '../data/mockData'

const colorClass = {
  coral: 'bg-alert-coral text-white',
  success: 'bg-success text-white',
  royal: 'bg-brand-royal text-white',
  warning: 'bg-warning text-brand-ink',
}

function ExamsPage() {
  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-black uppercase text-alert-coral">Agenda academica</p>
        <h1 className="mt-1 text-3xl font-black text-brand-ink">Agenda de Provas</h1>
        <p className="mt-2 text-muted">Proximas avaliacoes, salas e historico de resultados.</p>
      </div>

      <Card>
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase text-alert-coral">Semana atual</p>
            <h2 className="mt-1 text-xl font-black text-brand-ink">Linha de avaliacoes</h2>
          </div>
          <CalendarClock aria-hidden="true" className="h-6 w-6 text-brand-royal" />
        </div>
        <div className="grid gap-4 lg:grid-cols-4">
          {exams.map((exam) => (
            <div className={`rounded-xl p-5 shadow-sm ${colorClass[exam.color]}`} key={exam.subject}>
              <GraduationCap aria-hidden="true" className="h-7 w-7" />
              <h3 className="mt-4 text-xl font-black">{exam.subject}</h3>
              <div className="mt-4 grid gap-2 text-sm font-bold">
                <span className="flex items-center gap-2">
                  <CalendarClock aria-hidden="true" className="h-4 w-4" />
                  {exam.date}
                </span>
                <span className="flex items-center gap-2">
                  <Clock aria-hidden="true" className="h-4 w-4" />
                  {exam.time}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin aria-hidden="true" className="h-4 w-4" />
                  {exam.room}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="mb-5">
          <p className="text-sm font-black uppercase text-alert-coral">Historico de provas</p>
          <h2 className="mt-1 text-xl font-black text-brand-ink">Resultados recentes</h2>
        </div>
        <Table columns={['Disciplina', 'Data da prova', 'Resultado']}>
          {examHistory.map((item) => (
            <tr className="bg-white even:bg-slate-50" key={`${item.subject}-${item.date}`}>
              <td className="px-4 py-4 font-black text-brand-ink">{item.subject}</td>
              <td className="px-4 py-4 text-muted">{item.date}</td>
              <td className="px-4 py-4">
                <Badge tone={Number(item.result) >= 7 ? 'success' : 'warning'}>{item.result}</Badge>
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  )
}

export default ExamsPage
