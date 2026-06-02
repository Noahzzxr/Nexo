import { ArrowRight, ClipboardCheck, Clock, ListChecks } from 'lucide-react'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Table from '../components/ui/Table'
import { activities } from '../data/mockData'

const statusTone = {
  Pendente: 'warning',
  Concluido: 'success',
  Atrasado: 'coral',
}

const statusLabel = {
  Pendente: 'Pendente',
  Concluido: 'Concluido',
  Atrasado: 'Atrasado',
}

function ActivitiesPage() {
  const completed = activities.filter((activity) => activity.status === 'Concluido').length
  const late = activities.filter((activity) => activity.status === 'Atrasado').length

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-black uppercase text-alert-coral">Minhas atividades</p>
        <h1 className="mt-1 text-3xl font-black text-brand-ink">Tarefas e Avaliacoes</h1>
        <p className="mt-2 text-muted">Prazos, status e acessos rapidos para cada disciplina.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <ListChecks aria-hidden="true" className="h-6 w-6 text-brand-royal" />
          <p className="mt-4 text-sm font-black uppercase text-muted">Total de tarefas</p>
          <p className="mt-2 text-4xl font-black text-brand-ink">{activities.length}</p>
        </Card>
        <Card>
          <ClipboardCheck aria-hidden="true" className="h-6 w-6 text-success" />
          <p className="mt-4 text-sm font-black uppercase text-muted">Concluidas</p>
          <p className="mt-2 text-4xl font-black text-brand-ink">{completed}</p>
        </Card>
        <Card>
          <Clock aria-hidden="true" className="h-6 w-6 text-alert-coral" />
          <p className="mt-4 text-sm font-black uppercase text-muted">Atrasadas</p>
          <p className="mt-2 text-4xl font-black text-brand-ink">{late}</p>
        </Card>
      </div>

      <Card>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-black uppercase text-alert-coral">Lista robusta</p>
            <h2 className="mt-1 text-xl font-black text-brand-ink">Atividades por curso</h2>
          </div>
          <Badge tone="royal">Atualizado hoje</Badge>
        </div>
        <Table columns={['Curso', 'Atividade', 'Data limite', 'Status', 'Acao']}>
          {activities.map((activity) => (
            <tr className="bg-white even:bg-slate-50" key={activity.name}>
              <td className="px-4 py-4 font-black text-brand-ink">{activity.course}</td>
              <td className="px-4 py-4 text-copy">{activity.name}</td>
              <td className="px-4 py-4 text-muted">{activity.due}</td>
              <td className="px-4 py-4">
                <Badge tone={statusTone[activity.status]}>{statusLabel[activity.status]}</Badge>
              </td>
              <td className="px-4 py-4">
                <Button icon={ArrowRight} variant={activity.status === 'Atrasado' ? 'coral' : 'royal'}>
                  {activity.status === 'Concluido' ? 'Revisar' : 'Acessar Avaliacao'}
                </Button>
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  )
}

export default ActivitiesPage
