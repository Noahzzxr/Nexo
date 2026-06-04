import { useState } from 'react'
import { BookOpen, Save, TrendingUp } from 'lucide-react'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Table from '../components/ui/Table'
import { useSession } from '../hooks/useSession'
import { useToast } from '../hooks/useToast'
import { saveGrades } from '../services/schoolService'

function BoletimPage() {
  const { addToast } = useToast()
  const { currentUser, isAdmin, isTeacher, refreshSchoolData, roleLabel, schoolData } = useSession()
  const [drafts, setDrafts] = useState({})
  const [isSaving, setIsSaving] = useState(false)
  const canEdit = isTeacher || isAdmin
  const studentRows = canEdit ? schoolData.students : [currentUser]
  const classIdByStudent = Object.fromEntries(schoolData.enrollments.map((item) => [item.student_id, item.class_id]))
  const relevantGrades = schoolData.grades.filter((grade) => canEdit || grade.student_id === currentUser.id)
  const average = relevantGrades.length ? relevantGrades.reduce((total, grade) => total + Number(grade.final_grade || 0), 0) / relevantGrades.length : 0
  const absences = relevantGrades.reduce((total, grade) => total + Number(grade.total_absences || 0), 0)

  const getDraftKey = (studentId, subjectId) => `${studentId}:${subjectId}`
  const getGrade = (studentId, subjectId) => {
    const existing = relevantGrades.find((grade) => grade.student_id === studentId && grade.subject_id === subjectId)
    return drafts[getDraftKey(studentId, subjectId)] || {
      p1: existing?.note_p1 || 0,
      p2: existing?.note_p2 || 0,
      p3: existing?.note_p3 || 0,
      average: existing?.final_grade || 0,
      absences: existing?.total_absences || 0,
    }
  }

  const updateDraft = (studentId, subjectId, field, value) => {
    const current = getGrade(studentId, subjectId)
    const next = { ...current, [field]: value === '' ? '' : Number(value) }
    next.average = Number((((Number(next.p1) || 0) + (Number(next.p2) || 0) + (Number(next.p3) || 0)) / 3).toFixed(2))
    setDrafts((items) => ({ ...items, [getDraftKey(studentId, subjectId)]: next }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await saveGrades(
        Object.entries(drafts).map(([key, row]) => {
          const [studentId, subjectId] = key.split(':')
          return {
            ...row,
            classId: classIdByStudent[studentId],
            studentId,
            subjectId,
          }
        }),
      )
      setDrafts({})
      await refreshSchoolData()
      addToast({ title: 'Boletim salvo', message: 'Notas atualizadas no banco.' })
    } catch (error) {
      addToast({ title: 'Erro ao salvar notas', message: error.message })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase text-alert-coral">Notas e faltas</p>
          <h1 className="mt-1 text-3xl font-black text-brand-ink">{canEdit ? 'Boletim da turma' : 'Meu Boletim'}</h1>
          <p className="mt-2 text-muted">Dados vindos da tabela grades. Perfil ativo: {roleLabel}.</p>
        </div>
        {canEdit ? <Button disabled={!Object.keys(drafts).length || isSaving} icon={Save} onClick={handleSave} variant="royal">{isSaving ? 'Salvando...' : 'Salvar notas'}</Button> : null}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card><TrendingUp className="h-5 w-5 text-success" /><p className="mt-4 text-sm font-black uppercase text-muted">Media geral</p><p className="mt-2 text-4xl font-black text-brand-ink">{average.toFixed(1)}</p></Card>
        <Card><BookOpen className="h-5 w-5 text-brand-royal" /><p className="mt-4 text-sm font-black uppercase text-muted">Registros</p><p className="mt-2 text-4xl font-black text-brand-ink">{relevantGrades.length}</p></Card>
        <Card><BookOpen className="h-5 w-5 text-alert-coral" /><p className="mt-4 text-sm font-black uppercase text-muted">Faltas</p><p className="mt-2 text-4xl font-black text-brand-ink">{absences}</p></Card>
      </div>

      <Card>
        <Table columns={['Aluno', 'Disciplina', 'P1', 'P2', 'P3', 'Media', 'Faltas']}>
          {studentRows.flatMap((student) =>
            schoolData.subjects.map((subject) => {
              const row = getGrade(student.id, subject.id)
              return (
                <tr className="bg-white even:bg-slate-50" key={`${student.id}-${subject.id}`}>
                  <td className="px-4 py-4 font-black text-brand-ink">{student.fullname}</td>
                  <td className="px-4 py-4 text-copy">{subject.name}</td>
                  {['p1', 'p2', 'p3'].map((field) => (
                    <td className="px-4 py-4" key={field}>
                      {canEdit ? <input className="w-20 rounded-lg border border-line px-2 py-1 text-center" max="10" min="0" onChange={(event) => updateDraft(student.id, subject.id, field, event.target.value)} step="0.1" type="number" value={row[field]} /> : row[field]}
                    </td>
                  ))}
                  <td className="px-4 py-4"><Badge tone={Number(row.average) >= 7 ? 'success' : 'warning'}>{Number(row.average).toFixed(1)}</Badge></td>
                  <td className="px-4 py-4">{canEdit ? <input className="w-20 rounded-lg border border-line px-2 py-1 text-center" min="0" onChange={(event) => updateDraft(student.id, subject.id, 'absences', event.target.value)} type="number" value={row.absences} /> : row.absences}</td>
                </tr>
              )
            }),
          )}
        </Table>
      </Card>
    </div>
  )
}

export default BoletimPage
