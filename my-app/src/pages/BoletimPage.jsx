import { useMemo, useState, useEffect } from 'react'
import { BookOpen, Save, TrendingUp, ChevronDown } from 'lucide-react'
import Avatar from '../components/ui/Avatar'
import AreaGradesChart from '../components/charts/AreaGradesChart'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Table from '../components/ui/Table'
import { useSession } from '../hooks/useSession'
import { useToast } from '../hooks/useToast'
import { saveGrades } from '../services/schoolService'
import { gradeHistory, schoolClasses, studentProfile, subjects, subjectsCatalog } from '../data/mockData'
import { mockProfiles } from '../context/roles'

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
  const { addToast } = useToast()
  const { isAdmin, isSupabaseConfigured, isTeacher, roleLabel } = useSession()
  const canEditGrades = isTeacher || isAdmin

  const [selectedStudent, setSelectedStudent] = useState(() => ({
    id: mockProfiles.student.id,
    name: mockProfiles.student.fullname || studentProfile.name,
  }))

  const [gradeRows, setGradeRows] = useState(() =>
    subjects.map((subject) => ({
      ...subject,
      classId: schoolClasses[0].id,
      studentId: mockProfiles.student.id,
      subjectId: subjectsCatalog.find((item) => item.name === subject.name)?.id,
    })),
  )

  useEffect(() => {
    // when teacher/admin selects another student, update studentId on rows
    setGradeRows((current) => current.map((row) => ({ ...row, studentId: selectedStudent.id })))
  }, [selectedStudent.id])
  const [isSaving, setIsSaving] = useState(false)

  const average = gradeRows.reduce((total, subject) => total + subject.average, 0) / gradeRows.length
  const absences = gradeRows.reduce((total, subject) => total + Number(subject.absences), 0)

  const teacherSummary = useMemo(
    () => `${selectedStudent.name} - ${schoolClasses[0].name}`,
    [selectedStudent],
  )

  const handleGradeChange = (subjectName, field, value) => {
    setGradeRows((current) =>
      current.map((row) => {
        if (row.name !== subjectName) return row

        const next = { ...row, [field]: value === '' ? '' : Number(value) }
        const p1 = Number(next.p1) || 0
        const p2 = Number(next.p2) || 0
        const p3 = Number(next.p3) || 0
        return { ...next, average: Number(((p1 + p2 + p3) / 3).toFixed(1)) }
      }),
    )
  }

  const handleSaveGrades = async () => {
    setIsSaving(true)

    try {
      await saveGrades(gradeRows)
      addToast({
        title: 'Boletim salvo',
        message: isSupabaseConfigured ? 'Notas atualizadas no Supabase.' : 'Notas recalculadas no fallback local.',
      })
    } catch (error) {
      addToast({ title: 'Erro ao salvar notas', message: error.message })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-black uppercase text-alert-coral">Notas e faltas</p>
        <h1 className="mt-1 text-3xl font-black text-brand-ink">Meu Boletim</h1>
        <p className="mt-2 text-muted">
          Evolucao por periodo, media final e acompanhamento de faltas. Perfil ativo: {roleLabel}.
        </p>
        {canEditGrades ? (
          <div className="mt-4">
            <label className="mb-2 block text-sm font-semibold text-slate-700">Selecionar aluno</label>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 rounded-lg border border-line bg-white px-3 py-2 shadow-sm">
                <Avatar
                  size="sm"
                  name={selectedStudent.name}
                  image={selectedStudent.id === mockProfiles.student.id ? studentProfile.avatar : undefined}
                />
                <div className="min-w-0">
                  <div className="text-sm font-black text-brand-ink truncate">{selectedStudent.name}</div>
                  <div className="text-xs text-muted">{mockProfiles[Object.keys(mockProfiles).find((k) => mockProfiles[k].id === selectedStudent.id)]?.email || ''}</div>
                </div>
              </div>

              <div className="relative">
                <select
                  value={selectedStudent.id}
                  onChange={(e) => {
                    const id = e.target.value
                    const profileEntry = Object.values(mockProfiles).find((p) => p.id === id)
                    setSelectedStudent({ id, name: profileEntry?.fullname || profileEntry?.name || 'Aluno' })
                  }}
                  className="appearance-none rounded-lg border border-line bg-white px-10 py-2 pr-8 text-sm shadow-sm"
                >
                  {Object.values(mockProfiles)
                    .filter((p) => p.role === 'student')
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.fullname}
                      </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <ChevronDown className="h-4 w-4 text-slate-500" />
                </div>
              </div>
            </div>
          </div>
        ) : null}
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
            {canEditGrades ? <p className="mt-1 text-sm text-slate-700">Editando {teacherSummary}</p> : null}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="dark">Ano letivo 2026</Badge>
            {canEditGrades ? (
              <Button disabled={isSaving} icon={Save} onClick={handleSaveGrades} variant="royal">
                {isSaving ? 'Salvando...' : 'Salvar notas'}
              </Button>
            ) : null}
          </div>
        </div>
        <Table columns={['Disciplina', 'Periodo 1', 'Periodo 2', 'Periodo 3', 'Media final', 'Faltas']}>
          {gradeRows.map((subject) => (
            <tr className="bg-white even:bg-slate-50" key={subject.name}>
              <td className="px-4 py-4 font-black text-brand-ink">{subject.name}</td>
              <td className="px-4 py-4">
                {canEditGrades ? (
                  <input
                    className="w-24 rounded-lg border border-line px-3 py-2 text-sm font-bold text-slate-900 outline-none focus:border-brand-royal focus:ring-2 focus:ring-brand-royal-soft"
                    max="10"
                    min="0"
                    onChange={(event) => handleGradeChange(subject.name, 'p1', event.target.value)}
                    step="0.1"
                    type="number"
                    value={subject.p1}
                  />
                ) : (
                  <GradeBar value={subject.p1} />
                )}
              </td>
              <td className="px-4 py-4">
                {canEditGrades ? (
                  <input
                    className="w-24 rounded-lg border border-line px-3 py-2 text-sm font-bold text-slate-900 outline-none focus:border-brand-royal focus:ring-2 focus:ring-brand-royal-soft"
                    max="10"
                    min="0"
                    onChange={(event) => handleGradeChange(subject.name, 'p2', event.target.value)}
                    step="0.1"
                    type="number"
                    value={subject.p2}
                  />
                ) : (
                  <GradeBar value={subject.p2} />
                )}
              </td>
              <td className="px-4 py-4">
                {canEditGrades ? (
                  <input
                    className="w-24 rounded-lg border border-line px-3 py-2 text-sm font-bold text-slate-900 outline-none focus:border-brand-royal focus:ring-2 focus:ring-brand-royal-soft"
                    max="10"
                    min="0"
                    onChange={(event) => handleGradeChange(subject.name, 'p3', event.target.value)}
                    step="0.1"
                    type="number"
                    value={subject.p3}
                  />
                ) : (
                  <GradeBar value={subject.p3} />
                )}
              </td>
              <td className="px-4 py-4">
                <Badge tone={subject.average >= 7 ? 'success' : 'warning'}>{subject.average.toFixed(1)}</Badge>
              </td>
              <td className="px-4 py-4 font-bold text-copy">
                {canEditGrades ? (
                  <input
                    className="w-24 rounded-lg border border-line px-3 py-2 text-sm font-bold text-slate-900 outline-none focus:border-brand-royal focus:ring-2 focus:ring-brand-royal-soft"
                    min="0"
                    onChange={(event) => handleGradeChange(subject.name, 'absences', event.target.value)}
                    type="number"
                    value={subject.absences}
                  />
                ) : (
                  subject.absences
                )}
              </td>
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
