import { useMemo, useState } from 'react'
import { BookOpen, Filter, Save, TrendingUp } from 'lucide-react'
import AreaGradesChart from '../components/charts/AreaGradesChart'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Table from '../components/ui/Table'
import { useSession } from '../hooks/useSession'
import { useToast } from '../hooks/useToast'

const subjectsCatalogList = ['Portugues', 'Matematica', 'Biologia', 'Quimica', 'Fisica', 'Historia', 'Ingles']
const classOptions = ['6o ano', '7o ano', '8o ano A', '9o ano B', '1o ano', '2o Medio B', '3o ano']

function GradeBar({ value }) {
  const approved = value >= 7

  return (
    <div className="min-w-32">
      <div className="mb-1 flex items-center justify-between text-xs font-bold text-muted">
        <span>{value.toFixed(1)}</span>
        <span>{approved ? 'Bom' : 'Atencao'}</span>
      </div>
      <div className="h-2 rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${approved ? 'bg-success' : 'bg-alert-coral'}`} style={{ width: `${Math.min(value * 10, 100)}%` }} />
      </div>
    </div>
  )
}

function BoletimPage() {
  const { addToast } = useToast()
  const { currentUser, isTeacher, roleLabel, saveBulkGrades, studentsList } = useSession()
  const [selectedClass, setSelectedClass] = useState('9o ano B')
  const [draftGrades, setDraftGrades] = useState({})
  const [isSaving, setIsSaving] = useState(false)

  const filteredStudents = useMemo(() => studentsList.filter((student) => student.className === selectedClass), [studentsList, selectedClass])
  const activeStudent = useMemo(() => studentsList.find((student) => student.id === currentUser.id) || studentsList[0], [studentsList, currentUser.id])

  const handleGradeChange = (studentId, subject, value) => {
    let nextValue = value === '' ? '' : Number(value)
    if (nextValue !== '' && nextValue > 10) nextValue = 10
    if (nextValue !== '' && nextValue < 0) nextValue = 0

    setDraftGrades((current) => ({
      ...current,
      [studentId]: {
        ...current[studentId],
        [subject]: nextValue,
      },
    }))
  }

  const getGradeValue = (studentId, subject) => {
    if (draftGrades[studentId]?.[subject] !== undefined) return draftGrades[studentId][subject]
    const student = studentsList.find((item) => item.id === studentId)
    return student?.grades?.[subject] ?? 0
  }

  const handleSaveGrades = () => {
    setIsSaving(true)
    try {
      saveBulkGrades(
        filteredStudents.map((student) => ({
          id: student.id,
          grades: { ...student.grades, ...(draftGrades[student.id] || {}) },
        })),
      )
      setDraftGrades({})
      addToast({ title: 'Boletim salvo', message: `Notas da turma ${selectedClass} atualizadas com sucesso.` })
    } catch (error) {
      addToast({ title: 'Erro ao salvar notas', message: error.message })
    } finally {
      setIsSaving(false)
    }
  }

  const studentGradeRows = useMemo(
    () =>
      subjectsCatalogList.map((subjectName) => {
        const currentGrade = activeStudent.grades?.[subjectName] ?? 7
        const absences = activeStudent.absences?.[subjectName] ?? 0

        return {
          absences,
          average: currentGrade,
          name: subjectName,
          p1: Math.max(0, Math.min(10, Number((currentGrade - 0.5).toFixed(1)))),
          p2: Math.max(0, Math.min(10, Number((currentGrade + 0.3).toFixed(1)))),
          p3: currentGrade,
        }
      }),
    [activeStudent],
  )

  const studentAverage = studentGradeRows.reduce((total, row) => total + row.average, 0) / studentGradeRows.length
  const studentAbsences = studentGradeRows.reduce((total, row) => total + row.absences, 0)
  const studentHistoryData = [
    { period: '1o Periodo', Portugues: 7.2, Matematica: 7.5, Biologia: 8.0, Quimica: 7.0, Fisica: 6.8, Historia: 8.2, Ingles: 6.5 },
    { period: '2o Periodo', Portugues: 7.6, Matematica: 8.1, Biologia: 8.2, Quimica: 7.2, Fisica: 7.0, Historia: 8.5, Ingles: 7.0 },
    { period: '3o Periodo', ...Object.fromEntries(subjectsCatalogList.map((subject) => [subject, activeStudent.grades?.[subject] ?? 7])) },
  ]

  if (isTeacher) {
    return (
      <div className="grid gap-6">
        <div>
          <p className="text-sm font-black uppercase text-alert-coral">Lancamento de notas</p>
          <h1 className="mt-1 text-3xl font-black text-brand-ink">Caderneta de Notas</h1>
          <p className="mt-2 text-muted">Selecione a turma e lance as notas dos alunos em lote. Perfil ativo: {roleLabel}.</p>
        </div>

        <Card>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
            <label className="flex items-center gap-3 text-sm font-bold text-brand-ink">
              <Filter className="h-5 w-5 text-brand-royal" />
              Turma
              <select className="rounded-lg border border-line bg-white px-3 py-1.5 text-sm font-bold text-slate-800" onChange={(event) => setSelectedClass(event.target.value)} value={selectedClass}>
                {classOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <Button disabled={isSaving} icon={Save} onClick={handleSaveGrades} variant="royal">
              {isSaving ? 'Salvando...' : 'Salvar notas'}
            </Button>
          </div>

          <div className="overflow-x-auto">
            <Table columns={['Aluno', ...subjectsCatalogList]}>
              {filteredStudents.map((student) => (
                <tr className="bg-white even:bg-slate-50" key={student.id}>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <img alt={student.name} className="h-8 w-8 rounded-full object-cover" src={student.avatar} />
                      <span className="font-black text-brand-ink">{student.name}</span>
                    </div>
                  </td>
                  {subjectsCatalogList.map((subject) => (
                    <td className="px-4 py-4" key={subject}>
                      <input className="w-20 rounded-lg border border-line px-2.5 py-1.5 text-center text-sm font-bold text-slate-900" max="10" min="0" onChange={(event) => handleGradeChange(student.id, subject, event.target.value)} step="0.1" type="number" value={getGradeValue(student.id, subject)} />
                    </td>
                  ))}
                </tr>
              ))}
            </Table>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-black uppercase text-alert-coral">Notas e faltas</p>
        <h1 className="mt-1 text-3xl font-black text-brand-ink">Meu Boletim</h1>
        <p className="mt-2 text-muted">Evolucao por periodo, media final e acompanhamento de faltas. Perfil ativo: {roleLabel}.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <div className="flex items-center justify-between">
            <span className="text-sm font-black uppercase text-muted">Media geral</span>
            <TrendingUp aria-hidden="true" className="h-5 w-5 text-success" />
          </div>
          <p className="mt-4 text-4xl font-black text-brand-ink">{studentAverage.toFixed(1)}</p>
          <Badge className="mt-3" tone={studentAverage >= 7 ? 'success' : 'warning'}>{studentAverage >= 7 ? 'Dentro da meta' : 'Precisa reforco'}</Badge>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <span className="text-sm font-black uppercase text-muted">Disciplinas</span>
            <BookOpen aria-hidden="true" className="h-5 w-5 text-brand-royal" />
          </div>
          <p className="mt-4 text-4xl font-black text-brand-ink">{studentGradeRows.length}</p>
          <Badge className="mt-3" tone="royal">3 periodos avaliados</Badge>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <span className="text-sm font-black uppercase text-muted">Total de faltas</span>
            <BookOpen aria-hidden="true" className="h-5 w-5 text-alert-coral" />
          </div>
          <p className="mt-4 text-4xl font-black text-brand-ink">{studentAbsences}</p>
          <Badge className="mt-3" tone={studentAbsences <= 15 ? 'success' : 'coral'}>Frequencia regular</Badge>
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
          {studentGradeRows.map((row) => (
            <tr className="bg-white even:bg-slate-50" key={row.name}>
              <td className="px-4 py-4 font-black text-brand-ink">{row.name}</td>
              <td className="px-4 py-4"><GradeBar value={row.p1} /></td>
              <td className="px-4 py-4"><GradeBar value={row.p2} /></td>
              <td className="px-4 py-4"><GradeBar value={row.p3} /></td>
              <td className="px-4 py-4"><Badge tone={row.average >= 7 ? 'success' : 'warning'}>{row.average.toFixed(1)}</Badge></td>
              <td className="px-4 py-4 font-bold text-copy">{row.absences}</td>
            </tr>
          ))}
        </Table>
      </Card>

      <Card>
        <div className="mb-4">
          <p className="text-sm font-black uppercase text-alert-coral">Meu boletim</p>
          <h2 className="mt-1 text-xl font-black text-brand-ink">Evolucao das notas</h2>
        </div>
        <AreaGradesChart data={studentHistoryData} />
      </Card>
    </div>
  )
}

export default BoletimPage
