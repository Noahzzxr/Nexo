import { useState } from 'react'
import { AlertTriangle, CalendarCheck, CheckCircle2, Save, TrendingUp } from 'lucide-react'
import AttendanceBarChart from '../components/charts/AttendanceBarChart'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { useSession } from '../hooks/useSession'
import { useToast } from '../hooks/useToast'
import { saveFrequency } from '../services/schoolService'
import { attendanceGrid, attendanceMonthly, schoolClasses, studentProfile } from '../data/mockData'

const statusColors = {
  Presenca: 'bg-success',
  Atraso: 'bg-warning',
  Falta: 'bg-alert-coral',
}

function FrequencyPage() {
  const { addToast } = useToast()
  const { isAdmin, isSupabaseConfigured, isTeacher, roleLabel } = useSession()
  const canEditFrequency = isTeacher || isAdmin
  const [monthlyRows, setMonthlyRows] = useState(attendanceMonthly)
  const [isSaving, setIsSaving] = useState(false)
  const absences = attendanceGrid.filter((item) => item.status === 'Falta').length
  const delays = attendanceGrid.filter((item) => item.status === 'Atraso').length

  const handleMonthChange = (month, value) => {
    setMonthlyRows((current) =>
      current.map((item) => (item.month === month ? { ...item, presenca: Number(value) } : item)),
    )
  }

  const handleSaveFrequency = async () => {
    setIsSaving(true)

    try {
      await saveFrequency(
        monthlyRows.map((item) => ({
          class_id: schoolClasses[0].id,
          month_label: item.month,
          presence_rate: item.presenca,
          student_id: '11111111-1111-4111-8111-111111111111',
        })),
      )
      addToast({
        title: 'Frequencia salva',
        message: isSupabaseConfigured ? 'Registros enviados ao Supabase.' : 'Frequencia atualizada no fallback local.',
      })
    } catch (error) {
      addToast({ title: 'Erro ao salvar frequencia', message: error.message })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-black uppercase text-alert-coral">Assiduidade</p>
        <h1 className="mt-1 text-3xl font-black text-brand-ink">Frequencia do Aluno</h1>
        <p className="mt-2 text-muted">Acompanhamento anual de presencas, atrasos e faltas. Perfil ativo: {roleLabel}.</p>
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
        <AttendanceBarChart data={monthlyRows} />
        {canEditFrequency ? (
          <div className="mt-6 rounded-xl border border-line bg-page p-4">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-black uppercase text-alert-coral">Professor</p>
                <h3 className="font-black text-brand-ink">Editar presenca mensal</h3>
              </div>
              <Button disabled={isSaving} icon={Save} onClick={handleSaveFrequency} variant="royal">
                {isSaving ? 'Salvando...' : 'Salvar frequencia'}
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {monthlyRows.map((item) => (
                <label className="block text-sm font-bold text-brand-ink" key={item.month}>
                  <span>{item.month}</span>
                  <input
                    className="mt-2 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm font-bold text-slate-900 outline-none focus:border-brand-royal focus:ring-2 focus:ring-brand-royal-soft"
                    max="100"
                    min="0"
                    onChange={(event) => handleMonthChange(item.month, event.target.value)}
                    type="number"
                    value={item.presenca}
                  />
                </label>
              ))}
            </div>
          </div>
        ) : null}
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
