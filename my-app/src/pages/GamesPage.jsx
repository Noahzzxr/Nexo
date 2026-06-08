import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Gamepad2, PlusCircle, Play, Trash2, Trophy } from 'lucide-react'
import Avatar from '../components/ui/Avatar'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import InputField from '../components/ui/InputField'
import { useSession } from '../hooks/useSession'
import { useToast } from '../hooks/useToast'
import { createQuizWithQuestions } from '../services/schoolService'

const emptyQuestion = () => ({
  correctOption: 0,
  optionA: '',
  optionB: '',
  optionC: '',
  optionD: '',
  text: '',
})

function GamesPage() {
  const { addToast } = useToast()
  const { currentUser, isAdmin, isTeacher, refreshSchoolData, schoolData } = useSession()
  const [quizForm, setQuizForm] = useState({ baseXp: 100, subjectId: '', title: '' })
  const [questions, setQuestions] = useState([emptyQuestion()])
  const canCreate = isAdmin || isTeacher
  const subjectOptions = useMemo(
    () => [{ label: 'Selecione', value: '' }, ...schoolData.subjects.map((subject) => ({ label: subject.name, value: subject.id }))],
    [schoolData.subjects],
  )
  const rankingClassId = schoolData.currentEnrollment?.class_id
  const rankingRows = useMemo(() => {
    const studentIds =
      rankingClassId && !isAdmin && !isTeacher
        ? new Set(schoolData.enrollments.filter((enrollment) => enrollment.class_id === rankingClassId).map((enrollment) => enrollment.student_id))
        : null

    return schoolData.students
      .filter((student) => !studentIds || studentIds.has(student.id))
      .sort((a, b) => Number(b.total_xp || 0) - Number(a.total_xp || 0))
      .slice(0, 8)
  }, [isAdmin, isTeacher, rankingClassId, schoolData.enrollments, schoolData.students])
  const rankingClass = schoolData.classes.find((schoolClass) => schoolClass.id === rankingClassId)

  const updateQuestion = (index, key, value) => {
    setQuestions((current) => current.map((question, questionIndex) => (questionIndex === index ? { ...question, [key]: value } : question)))
  }

  const addQuestion = () => {
    setQuestions((current) => [...current, emptyQuestion()])
  }

  const removeQuestion = (index) => {
    setQuestions((current) => (current.length === 1 ? current : current.filter((_, questionIndex) => questionIndex !== index)))
  }

  const handleCreateQuiz = async (event) => {
    event.preventDefault()

    const payloadQuestions = questions.map((question) => ({
      correctOption: Number(question.correctOption),
      options: [question.optionA, question.optionB, question.optionC, question.optionD].map((option) => option.trim()),
      text: question.text.trim(),
    }))

    if (payloadQuestions.some((question) => !question.text || question.options.some((option) => !option))) {
      addToast({ title: 'Quiz incompleto', message: 'Preencha a pergunta e as quatro alternativas.' })
      return
    }

    try {
      await createQuizWithQuestions({
        baseXp: quizForm.baseXp,
        questions: payloadQuestions,
        subjectId: quizForm.subjectId,
        title: quizForm.title,
      })
      setQuizForm({ baseXp: 100, subjectId: '', title: '' })
      setQuestions([emptyQuestion()])
      await refreshSchoolData()
      addToast({ title: 'Quiz criado', message: 'Jogo salvo no banco de dados.' })
    } catch (error) {
      addToast({ title: 'Erro ao criar quiz', message: error.message })
    }
  }

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-black uppercase text-alert-coral">Quizzes</p>
        <h1 className="mt-1 text-3xl font-black text-brand-ink">Jogos educativos</h1>
        <p className="mt-2 text-muted">Crie e jogue quizzes conectados ao banco de dados.</p>
      </div>

      <Card>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-black uppercase text-alert-coral">Ranking</p>
            <h2 className="mt-1 text-xl font-black text-brand-ink">
              {!isAdmin && !isTeacher ? `Melhores da turma${rankingClass ? ` ${rankingClass.name}` : ''}` : 'Melhores alunos'}
            </h2>
          </div>
          <Trophy className="h-6 w-6 text-warning" />
        </div>
        <div className="grid gap-3">
          {rankingRows.map((student, index) => (
            <div className={`flex items-center gap-3 rounded-lg border p-3 ${student.id === currentUser.id ? 'border-brand-royal bg-brand-royal-soft' : 'border-line bg-white'}`} key={student.id}>
              <Badge tone={index < 3 ? 'warning' : 'dark'}>{index + 1}</Badge>
              <Avatar image={student.avatar_url} name={student.fullname} size="sm" />
              <div className="min-w-0">
                <p className="truncate font-black text-brand-ink">{student.fullname}</p>
                <p className="text-sm text-muted">{student.registration_number || student.email}</p>
              </div>
              <p className="ml-auto shrink-0 font-black text-brand-royal">{Number(student.total_xp || 0)} XP</p>
            </div>
          ))}
          {!rankingRows.length ? <p className="rounded-lg bg-page p-4 text-sm text-muted">Nenhum aluno com XP nesta turma.</p> : null}
        </div>
      </Card>

      {canCreate ? (
        <Card>
          <form className="grid gap-5" onSubmit={handleCreateQuiz}>
            <div className="grid gap-4 md:grid-cols-3">
              <InputField
                label="Titulo do quiz"
                name="title"
                onChange={(event) => setQuizForm((current) => ({ ...current, title: event.target.value }))}
                required
                value={quizForm.title}
              />
              <InputField
                label="XP base"
                min="10"
                name="baseXp"
                onChange={(event) => setQuizForm((current) => ({ ...current, baseXp: event.target.value }))}
                required
                type="number"
                value={quizForm.baseXp}
              />
              <InputField
                as="select"
                label="Disciplina"
                name="subjectId"
                onChange={(event) => setQuizForm((current) => ({ ...current, subjectId: event.target.value }))}
                options={subjectOptions}
                required
                value={quizForm.subjectId}
              />
            </div>

            <div className="grid gap-4">
              {questions.map((question, index) => (
                <div className="rounded-lg border border-line bg-slate-50 p-4" key={index}>
                  <div className="flex items-center justify-between gap-3">
                    <Badge tone="dark">Pergunta {index + 1}</Badge>
                    <Button disabled={questions.length === 1} icon={Trash2} onClick={() => removeQuestion(index)} type="button" variant="ghost">
                      Remover
                    </Button>
                  </div>
                  <div className="mt-4 grid gap-4">
                    <InputField
                      label="Enunciado"
                      name={`question-${index}`}
                      onChange={(event) => updateQuestion(index, 'text', event.target.value)}
                      required
                      value={question.text}
                    />
                    <div className="grid gap-4 md:grid-cols-2">
                      <InputField label="Alternativa A" name={`a-${index}`} onChange={(event) => updateQuestion(index, 'optionA', event.target.value)} required value={question.optionA} />
                      <InputField label="Alternativa B" name={`b-${index}`} onChange={(event) => updateQuestion(index, 'optionB', event.target.value)} required value={question.optionB} />
                      <InputField label="Alternativa C" name={`c-${index}`} onChange={(event) => updateQuestion(index, 'optionC', event.target.value)} required value={question.optionC} />
                      <InputField label="Alternativa D" name={`d-${index}`} onChange={(event) => updateQuestion(index, 'optionD', event.target.value)} required value={question.optionD} />
                    </div>
                    <InputField
                      as="select"
                      label="Resposta correta"
                      name={`correct-${index}`}
                      onChange={(event) => updateQuestion(index, 'correctOption', event.target.value)}
                      options={[
                        { label: 'Alternativa A', value: 0 },
                        { label: 'Alternativa B', value: 1 },
                        { label: 'Alternativa C', value: 2 },
                        { label: 'Alternativa D', value: 3 },
                      ]}
                      value={question.correctOption}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Button icon={PlusCircle} onClick={addQuestion} type="button" variant="soft">
                Adicionar pergunta
              </Button>
              <Button icon={Gamepad2} type="submit" variant="royal">
                Salvar quiz
              </Button>
            </div>
          </form>
        </Card>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {schoolData.quizzes.map((quiz) => {
          const subject = schoolData.subjects.find((item) => item.id === quiz.subject_id)
          return (
            <Card className="flex h-full flex-col" key={quiz.id}>
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-brand-royal-soft text-brand-royal">
                <Gamepad2 className="h-5 w-5" />
              </span>
              <h2 className="mt-5 text-xl font-black text-brand-ink">{quiz.title}</h2>
              <p className="mt-2 text-sm text-muted">{subject?.name || 'Sem disciplina'}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge tone="royal">{quiz.questions.length} perguntas</Badge>
                <Badge tone="success">{quiz.base_xp || 100} XP base</Badge>
              </div>
              {quiz.questions.length ? (
                <Button as={Link} className="mt-auto w-full" icon={Play} to={`/quiz/${quiz.id}`} variant="royal">
                  Jogar agora
                </Button>
              ) : (
                <p className="mt-auto rounded-lg bg-page p-3 text-sm font-bold text-muted">Cadastre perguntas para liberar o jogo.</p>
              )}
            </Card>
          )
        })}
        {!schoolData.quizzes.length ? <p className="rounded-lg bg-white p-4 text-sm text-muted">Nenhum quiz cadastrado.</p> : null}
      </div>
    </div>
  )
}

export default GamesPage
