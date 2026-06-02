import { BookOpen, TrendingUp } from 'lucide-react'
import AreaGradesChart from '../components/charts/AreaGradesChart'
import Badge from '../components/ui/Badge'
import Card from '../components/ui/Card'
import Table from '../components/ui/Table'
import { gradeHistory, subjects } from '../data/mockData'

function GradeBar({ value }) {
  const approved = value >= 7

  return (
    <div className="min-w-32">
      <div className="mb-1 flex items-center justify-between text-xs font-bold text-muted">
        <span>{value.toFixed(1)}</span>
        <span>{approved ? 'Bom' : 'Atencao'}</span>
      </div>
      <div className="h-2 rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${approved ? 'bg-success' : 'bg-alert-coral'}`}
          style={{ width: `${Math.min(value * 10, 100)}%` }}
        />
      </div>
    </div>
  )
}

function BoletimPage() {
  const average = subjects.reduce((total, subject) => total + subject.average, 0) / subjects.length
  const absences = subjects.reduce((total, subject) => total + subject.absences, 0)

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-black uppercase text-alert-coral">Notas e faltas</p>
        <h1 className="mt-1 text-3xl font-black text-brand-ink">Meu Boletim</h1>
        <p className="mt-2 text-muted">Evolucao por periodo, media final e acompanhamento de faltas.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <div className="flex items-center justify-between">
            <span className="text-sm font-black uppercase text-muted">Media geral</span>
            <TrendingUp aria-hidden="true" className="h-5 w-5 text-success" />
          </div>
          <p className="mt-4 text-4xl font-black text-brand-ink">{average.toFixed(1)}</p>
          <Badge className="mt-3" tone={average >= 7 ? 'success' : 'warning'}>
            {average >= 7 ? 'Dentro da meta' : 'Precisa reforco'}
          </Badge>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <span className="text-sm font-black uppercase text-muted">Disciplinas</span>
            <BookOpen aria-hidden="true" className="h-5 w-5 text-brand-royal" />
          </div>
          <p className="mt-4 text-4xl font-black text-brand-ink">{subjects.length}</p>
          <Badge className="mt-3" tone="royal">
            3 periodos avaliados
          </Badge>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <span className="text-sm font-black uppercase text-muted">Total de faltas</span>
            <BookOpen aria-hidden="true" className="h-5 w-5 text-alert-coral" />
          </div>
          <p className="mt-4 text-4xl font-black text-brand-ink">{absences}</p>
          <Badge className="mt-3" tone={absences <= 15 ? 'success' : 'coral'}>
            Frequencia regular
          </Badge>
        </Card>
      </div>

      <Card>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-black uppercase text-alert-coral">Tabela completa</p>
            <h2 className="mt-1 text-xl font-black text-brand-ink">Resultados por disciplina</h2>
          </div>
          <Badge tone="dark">Ano letivo 2026</Badge>
        </div>
        <Table columns={['Disciplina', 'Periodo 1', 'Periodo 2', 'Periodo 3', 'Media final', 'Faltas']}>
          {subjects.map((subject) => (
            <tr className="bg-white even:bg-slate-50" key={subject.name}>
              <td className="px-4 py-4 font-black text-brand-ink">{subject.name}</td>
              <td className="px-4 py-4">
                <GradeBar value={subject.p1} />
              </td>
              <td className="px-4 py-4">
                <GradeBar value={subject.p2} />
              </td>
              <td className="px-4 py-4">
                <GradeBar value={subject.p3} />
              </td>
              <td className="px-4 py-4">
                <Badge tone={subject.average >= 7 ? 'success' : 'warning'}>{subject.average.toFixed(1)}</Badge>
              </td>
              <td className="px-4 py-4 font-bold text-copy">{subject.absences}</td>
            </tr>
          ))}
        </Table>
      </Card>

      <Card>
        <div className="mb-4">
          <p className="text-sm font-black uppercase text-alert-coral">Meu boletim</p>
          <h2 className="mt-1 text-xl font-black text-brand-ink">Evolucao das notas</h2>
        </div>
        <AreaGradesChart data={gradeHistory} />
      </Card>
    </div>
  )
}

export default BoletimPage
