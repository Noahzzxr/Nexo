import { useMemo, useState, useEffect } from 'react'
<<<<<<< HEAD
import { BookOpen, Save, TrendingUp, ChevronDown } from 'lucide-react'
import Avatar from '../components/ui/Avatar'
=======
import { BookOpen, Save, TrendingUp, Filter } from 'lucide-react'
>>>>>>> def3735 (Ajuste no CSS, correção de erro, chat funcionando e painei do professor)
import AreaGradesChart from '../components/charts/AreaGradesChart'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Table from '../components/ui/Table'
import InputField from '../components/ui/InputField'
import { useSession } from '../hooks/useSession'
import { useToast } from '../hooks/useToast'
<<<<<<< HEAD
import { saveGrades } from '../services/schoolService'
import { gradeHistory, schoolClasses, studentProfile, subjects, subjectsCatalog } from '../data/mockData'
import { mockProfiles } from '../context/roles'
=======
import { studentProfile } from '../data/mockData'

const subjectsCatalogList = ['Português', 'Matemática', 'Biologia', 'Química', 'Física', 'História', 'Inglês']
const classOptions = ['6º ano', '7º ano', '8º ano A', '9º ano B', '1º ano', '2º Médio B', '3º ano']
>>>>>>> def3735 (Ajuste no CSS, correção de erro, chat funcionando e painei do professor)

function GradeBar({ value }) {
  const approved = value >= 7

  return (
    <div className="min-w-32">
      <div className="mb-1 flex items-center justify-between text-xs font-bold text-muted">
        <span>{value.toFixed(1)}</span>
        <span>{approved ? 'Bom' : 'Atenção'}</span>
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
<<<<<<< HEAD
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
=======
  const { currentUser, isTeacher, studentsList, saveBulkGrades, roleLabel } = useSession()
  
  const [selectedClass, setSelectedClass] = useState('9º ano B')
  const [draftGrades, setDraftGrades] = useState({})
>>>>>>> def3735 (Ajuste no CSS, correção de erro, chat funcionando e painei do professor)
  const [isSaving, setIsSaving] = useState(false)

  // Filter students by selected class
  const filteredStudents = useMemo(() => {
    return studentsList.filter((s) => s.className === selectedClass)
  }, [studentsList, selectedClass])

<<<<<<< HEAD
  const teacherSummary = useMemo(
    () => `${selectedStudent.name} - ${schoolClasses[0].name}`,
    [selectedStudent],
  )
=======
  // Get active student data
  const activeStudent = useMemo(() => {
    return studentsList.find((s) => s.id === currentUser.id) || studentsList[0]
  }, [studentsList, currentUser.id])
>>>>>>> def3735 (Ajuste no CSS, correção de erro, chat funcionando e painei do professor)

  // Reset drafts when class changes
  useEffect(() => {
    setDraftGrades({})
  }, [selectedClass])

  const handleGradeChange = (studentId, subject, value) => {
    let num = value === '' ? '' : Number(value)
    if (num !== '' && num > 10) num = 10
    if (num !== '' && num < 0) num = 0
    
    setDraftGrades((current) => ({
      ...current,
      [studentId]: {
        ...current[studentId],
        [subject]: num,
      },
    }))
  }

  const getGradeValue = (studentId, subject) => {
    if (draftGrades[studentId]?.[subject] !== undefined) {
      return draftGrades[studentId][subject]
    }
    const student = studentsList.find((s) => s.id === studentId)
    return student?.grades?.[subject] !== undefined ? student.grades[subject] : 0
  }

  const handleSaveGrades = async () => {
    setIsSaving(true)
    try {
      const updatedGradesData = filteredStudents.map((stud) => {
        const draft = draftGrades[stud.id] || {}
        const updatedGrades = { ...stud.grades }
        
        subjectsCatalogList.forEach((sub) => {
          if (draft[sub] !== undefined) {
            updatedGrades[sub] = draft[sub]
          }
        })

        return {
          id: stud.id,
          grades: updatedGrades,
        }
      })

      saveBulkGrades(updatedGradesData)
      addToast({
        title: 'Boletim salvo',
        message: `Notas da turma ${selectedClass} atualizadas com sucesso.`,
      })
      setDraftGrades({})
    } catch (error) {
      addToast({ title: 'Erro ao salvar notas', message: error.message })
    } finally {
      setIsSaving(false)
    }
  }

  // Derive rows for the logged-in student's personal Boletim
  const studentGradeRows = useMemo(() => {
    if (isTeacher) return []
    return subjectsCatalogList.map((subName) => {
      const currentGrade = activeStudent.grades?.[subName] !== undefined ? activeStudent.grades[subName] : 7.0
      const abs = activeStudent.absences?.[subName] !== undefined ? activeStudent.absences[subName] : 0
      
      // Calculate mock P1 and P2 based on the current grade average
      const p1 = Math.max(0, Math.min(10, Number((currentGrade - 0.5).toFixed(1))))
      const p2 = Math.max(0, Math.min(10, Number((currentGrade + 0.3).toFixed(1))))
      
      return {
        name: subName,
        p1,
        p2,
        p3: currentGrade,
        average: currentGrade,
        absences: abs,
      }
    })
  }, [activeStudent, isTeacher])

  const studentAverage = useMemo(() => {
    if (isTeacher) return 0
    return studentGradeRows.reduce((total, row) => total + row.average, 0) / studentGradeRows.length
  }, [studentGradeRows, isTeacher])

  const studentAbsences = useMemo(() => {
    if (isTeacher) return 0
    return studentGradeRows.reduce((total, row) => total + row.absences, 0)
  }, [studentGradeRows, isTeacher])

  const studentHistoryData = useMemo(() => {
    if (isTeacher) return []
    return [
      { period: '1º Período', Português: 7.2, Matemática: 7.5, Biologia: 8.0, Química: 7.0, Física: 6.8, História: 8.2, Inglês: 6.5 },
      { period: '2º Período', Português: 7.6, Matemática: 8.1, Biologia: 8.2, Química: 7.2, Física: 7.0, História: 8.5, Inglês: 7.0 },
      { period: '3º Período', 
        Português: activeStudent.grades?.['Português'] || 7.0, 
        Matemática: activeStudent.grades?.['Matemática'] || 7.0, 
        Biologia: activeStudent.grades?.['Biologia'] || 7.0, 
        Química: activeStudent.grades?.['Química'] || 7.0, 
        Física: activeStudent.grades?.['Física'] || 7.0, 
        História: activeStudent.grades?.['História'] || 7.0, 
        Inglês: activeStudent.grades?.['Inglês'] || 7.0 
      },
    ]
  }, [activeStudent, isTeacher])

  if (isTeacher) {
    // -------------------------------------------------------------------------
    // TEACHER VIEW: BULK GRADE EDITOR BY SCHOOL CLASS
    // -------------------------------------------------------------------------
    return (
      <div className="grid gap-6">
        <div>
          <p className="text-sm font-black uppercase text-alert-coral">Lançamento de Notas</p>
          <h1 className="mt-1 text-3xl font-black text-brand-ink">Caderneta de Notas</h1>
          <p className="mt-2 text-muted">Selecione a turma e lance as notas vigentes dos alunos em lote. Perfil ativo: {roleLabel}.</p>
        </div>

        <Card>
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4 mb-4">
            <div className="flex items-center gap-3">
              <Filter className="h-5 w-5 text-brand-royal" />
              <span className="font-bold text-brand-ink">Filtrar por Turma:</span>
              <select
                className="rounded-lg border border-line bg-white px-3 py-1.5 text-sm font-bold text-slate-800 outline-none focus:border-brand-royal"
                onChange={(e) => setSelectedClass(e.target.value)}
                value={selectedClass}
              >
                {classOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <Button disabled={isSaving} icon={Save} onClick={handleSaveGrades} variant="royal">
              {isSaving ? 'Salvando...' : 'Salvar Notas'}
            </Button>
          </div>

          <div className="overflow-x-auto">
            <Table columns={['Aluno', ...subjectsCatalogList]}>
              {filteredStudents.map((stud) => (
                <tr className="bg-white even:bg-slate-50" key={stud.id}>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <img alt={stud.name} className="h-8 w-8 rounded-full object-cover" src={stud.avatar} />
                      <span className="font-black text-brand-ink">{stud.name}</span>
                    </div>
                  </td>
                  {subjectsCatalogList.map((sub) => (
                    <td className="px-4 py-4" key={sub}>
                      <input
                        className="w-20 rounded-lg border border-line px-2.5 py-1.5 text-center text-sm font-bold text-slate-900 outline-none focus:border-brand-royal focus:ring-2 focus:ring-brand-royal-soft"
                        max="10"
                        min="0"
                        onChange={(e) => handleGradeChange(stud.id, sub, e.target.value)}
                        step="0.1"
                        type="number"
                        value={getGradeValue(stud.id, sub)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
              {!filteredStudents.length ? (
                <tr>
                  <td className="px-4 py-8 text-center text-muted" colSpan={subjectsCatalogList.length + 1}>
                    Nenhum aluno cadastrado nesta turma.
                  </td>
                </tr>
              ) : null}
            </Table>
          </div>
        </Card>
      </div>
    )
  }

  // -------------------------------------------------------------------------
  // STUDENT VIEW: PERSONAL BOLETIM AND PROGRESS CHART
  // -------------------------------------------------------------------------
  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-black uppercase text-alert-coral">Notas e faltas</p>
        <h1 className="mt-1 text-3xl font-black text-brand-ink">Meu Boletim</h1>
        <p className="mt-2 text-muted">
          Evolução por período, média final e acompanhamento de faltas. Perfil ativo: {roleLabel}.
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
            <span className="text-sm font-black uppercase text-muted">Média geral</span>
            <TrendingUp aria-hidden="true" className="h-5 w-5 text-success" />
          </div>
          <p className="mt-4 text-4xl font-black text-brand-ink">{studentAverage.toFixed(1)}</p>
          <Badge className="mt-3" tone={studentAverage >= 7 ? 'success' : 'warning'}>
            {studentAverage >= 7 ? 'Dentro da meta' : 'Precisa reforço'}
          </Badge>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <span className="text-sm font-black uppercase text-muted">Disciplinas</span>
            <BookOpen aria-hidden="true" className="h-5 w-5 text-brand-royal" />
          </div>
          <p className="mt-4 text-4xl font-black text-brand-ink">{studentGradeRows.length}</p>
          <Badge className="mt-3" tone="royal">
            3 períodos avaliados
          </Badge>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <span className="text-sm font-black uppercase text-muted">Total de faltas</span>
            <BookOpen aria-hidden="true" className="h-5 w-5 text-alert-coral" />
          </div>
          <p className="mt-4 text-4xl font-black text-brand-ink">{studentAbsences}</p>
          <Badge className="mt-3" tone={studentAbsences <= 15 ? 'success' : 'coral'}>
            Frequência regular
          </Badge>
        </Card>
      </div>

      <Card>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-black uppercase text-alert-coral">Tabela completa</p>
            <h2 className="mt-1 text-xl font-black text-brand-ink">Resultados por disciplina</h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="dark">Ano letivo 2026</Badge>
          </div>
        </div>
        <Table columns={['Disciplina', 'Período 1', 'Período 2', 'Período 3', 'Média final', 'Faltas']}>
          {studentGradeRows.map((row) => (
            <tr className="bg-white even:bg-slate-50" key={row.name}>
              <td className="px-4 py-4 font-black text-brand-ink">{row.name}</td>
              <td className="px-4 py-4">
                <GradeBar value={row.p1} />
              </td>
              <td className="px-4 py-4">
                <GradeBar value={row.p2} />
              </td>
              <td className="px-4 py-4">
                <GradeBar value={row.p3} />
              </td>
              <td className="px-4 py-4">
                <Badge tone={row.average >= 7 ? 'success' : 'warning'}>{row.average.toFixed(1)}</Badge>
              </td>
              <td className="px-4 py-4 font-bold text-copy">
                {row.absences}
              </td>
            </tr>
          ))}
        </Table>
      </Card>

      <Card>
        <div className="mb-4">
          <p className="text-sm font-black uppercase text-alert-coral">Meu boletim</p>
          <h2 className="mt-1 text-xl font-black text-brand-ink">Evolução das notas</h2>
        </div>
        <AreaGradesChart data={studentHistoryData} />
      </Card>
    </div>
  )
}

export default BoletimPage
