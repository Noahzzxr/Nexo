import { AlertTriangle, CalendarCheck, CheckCircle2, TrendingUp } from 'lucide-react'
import AttendanceBarChart from '../components/charts/AttendanceBarChart'
import Badge from '../components/ui/Badge'
import Card from '../components/ui/Card'
import { attendanceGrid, attendanceMonthly, studentProfile } from '../data/mockData'

const statusColors = {
  Presenca: 'bg-success',
  Atraso: 'bg-warning',
  Falta: 'bg-alert-coral',
}

function FrequencyPage() {
  const absences = attendanceGrid.filter((item) => item.status === 'Falta').length
  const delays = attendanceGrid.filter((item) => item.status === 'Atraso').length

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-black uppercase text-alert-coral">Assiduidade</p>
        <h1 className="mt-1 text-3xl font-black text-brand-ink">Frequencia do Aluno</h1>
        <p className="mt-2 text-muted">Acompanhamento anual de presencas, atrasos e faltas.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CheckCircle2 aria-hidden="true" className="h-6 w-6 text-success" />
          <p className="mt-4 text-sm font-black uppercase text-muted">Frequencia atual</p>
          <p className="mt-2 text-4xl font-black text-brand-ink">{studentProfile.attendance}</p>
        </Card>
        <Card>
          <AlertTriangle aria-hidden="true" className="h-6 w-6 text-alert-coral" />
          <p className="mt-4 text-sm font-black uppercase text-muted">Faltas registradas</p>
          <p className="mt-2 text-4xl font-black text-brand-ink">{absences}</p>
        </Card>
        <Card>
          <CalendarCheck aria-hidden="true" className="h-6 w-6 text-warning" />
          <p className="mt-4 text-sm font-black uppercase text-muted">Atrasos</p>
          <p className="mt-2 text-4xl font-black text-brand-ink">{delays}</p>
        </Card>
      </div>

      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-black uppercase text-alert-coral">Grafico anual</p>
            <h2 className="mt-1 text-xl font-black text-brand-ink">Presenca por mes</h2>
          </div>
          <Badge tone="success">
            <TrendingUp aria-hidden="true" className="mr-1 h-3 w-3" />
            Acima da meta
          </Badge>
        </div>
        <AttendanceBarChart data={attendanceMonthly} />
      </Card>

      <Card>
        <div className="mb-5">
          <p className="text-sm font-black uppercase text-alert-coral">Mapa compacto</p>
          <h2 className="mt-1 text-xl font-black text-brand-ink">Ultimos registros</h2>
        </div>
        <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(15, minmax(18px, 1fr))' }}>
          {attendanceGrid.map((item) => (
            <span
              aria-label={`${item.status} no dia ${item.day}`}
              className={`h-7 rounded-md ${statusColors[item.status]}`}
              key={item.day}
              title={`${item.day}: ${item.status}`}
            />
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-4">
          {Object.entries(statusColors).map(([status, color]) => (
            <span className="flex items-center gap-2 text-sm font-bold text-copy" key={status}>
              <span className={`h-3 w-3 rounded-full ${color}`} />
              {status}
            </span>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default FrequencyPage
