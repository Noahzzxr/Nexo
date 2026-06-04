import { useState } from 'react'
import { CheckCircle2, Save, TrendingUp } from 'lucide-react'
import AttendanceBarChart from '../components/charts/AttendanceBarChart'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { useSession } from '../hooks/useSession'
import { useToast } from '../hooks/useToast'
import { saveFrequency } from '../services/schoolService'

function FrequencyPage() {
  const { addToast } = useToast()
  const { currentUser, isAdmin, isTeacher, refreshSchoolData, roleLabel, schoolData } = useSession()
  const [drafts, setDrafts] = useState({})
  const [isSaving, setIsSaving] = useState(false)
  const canEdit = isTeacher || isAdmin
  const rows = schoolData.attendance.filter((item) => canEdit || item.student_id === currentUser.id)
  const chartRows = rows.map((item) => ({ month: item.month_label, meta: 90, presenca: Number(item.presence_rate) }))
  const average = chartRows.length ? chartRows.reduce((total, item) => total + item.presenca, 0) / chartRows.length : 0

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await saveFrequency(
        Object.entries(drafts).map(([key, value]) => {
          const [studentId, classId, month] = key.split(':')
          return { class_id: classId, month_label: month, presence_rate: Number(value), student_id: studentId }
        }),
      )
      setDrafts({})
      await refreshSchoolData()
      addToast({ title: 'Frequencia salva', message: 'Registros atualizados no banco.' })
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
        <h1 className="mt-1 text-3xl font-black text-brand-ink">Frequencia</h1>
        <p className="mt-2 text-muted">Registros vindos de attendance_records. Perfil ativo: {roleLabel}.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card><CheckCircle2 className="h-6 w-6 text-success" /><p className="mt-4 text-sm font-black uppercase text-muted">Media de presenca</p><p className="mt-2 text-4xl font-black text-brand-ink">{average.toFixed(1)}%</p></Card>
        <Card><TrendingUp className="h-6 w-6 text-brand-royal" /><p className="mt-4 text-sm font-black uppercase text-muted">Meses registrados</p><p className="mt-2 text-4xl font-black text-brand-ink">{rows.length}</p></Card>
      </div>
      <Card>
        <AttendanceBarChart data={chartRows} />
      </Card>
      {canEdit ? (
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-black text-brand-ink">Editar presenca mensal</h2>
            <Button disabled={!Object.keys(drafts).length || isSaving} icon={Save} onClick={handleSave} variant="royal">{isSaving ? 'Salvando...' : 'Salvar'}</Button>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {rows.map((row) => {
              const key = `${row.student_id}:${row.class_id}:${row.month_label}`
              const student = schoolData.profiles.find((profile) => profile.id === row.student_id)
              return (
                <label className="block text-sm font-bold text-brand-ink" key={key}>
                  <span>{student?.fullname || 'Aluno'} - {row.month_label}</span>
                  <input className="mt-2 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm" max="100" min="0" onChange={(event) => setDrafts((current) => ({ ...current, [key]: event.target.value }))} type="number" value={drafts[key] ?? row.presence_rate} />
                </label>
              )
            })}
          </div>
        </Card>
      ) : null}
    </div>
  )
}

export default FrequencyPage
