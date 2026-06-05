import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, RotateCcw } from 'lucide-react'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { useSession } from '../hooks/useSession'
import { useToast } from '../hooks/useToast'
import { completeQuizAttempt } from '../services/schoolService'

function QuizPage() {
  const { id } = useParams()
  const { isStudent, refreshSchoolData, schoolData } = useSession()
  const { addToast } = useToast()
  const quiz = schoolData.quizzes.find((item) => item.id === id)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const [earnedXp, setEarnedXp] = useState(null)
  const [isAwardingXp, setIsAwardingXp] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)
  const [isFinished, setIsFinished] = useState(false)

  if (!quiz) {
    return (
      <Card>
        <p className="font-black text-brand-ink">Quiz nao encontrado.</p>
        <Button as={Link} className="mt-4" to="/jogos" variant="ghost">Voltar</Button>
      </Card>
    )
  }

  const currentQuestion = quiz.questions[currentIndex]
  const score = answers.reduce((total, answer) => total + (answer.isCorrect ? 1 : 0), 0)
  const progress = ((isFinished ? quiz.questions.length : currentIndex) / Math.max(quiz.questions.length, 1)) * 100

  const handleNext = async () => {
    if (selectedOption === null || !currentQuestion) return
    const nextAnswers = [...answers, { isCorrect: selectedOption === currentQuestion.correct_option, questionId: currentQuestion.id, selectedOption }]
    setAnswers(nextAnswers)
    setSelectedOption(null)
    if (currentIndex + 1 >= quiz.questions.length) {
      setIsFinished(true)
      if (isStudent) {
        setIsAwardingXp(true)
        try {
          const correctAnswers = nextAnswers.reduce((total, answer) => total + (answer.isCorrect ? 1 : 0), 0)
          const result = await completeQuizAttempt({
            correctAnswers,
            quizId: quiz.id,
            totalQuestions: quiz.questions.length,
          })
          setEarnedXp(result?.earned_xp || 0)
          await refreshSchoolData()
          addToast({ title: 'XP recebido', message: `Voce ganhou ${result?.earned_xp || 0} XP neste quiz.` })
        } catch (error) {
          addToast({ title: 'Erro ao registrar XP', message: error.message })
        } finally {
          setIsAwardingXp(false)
        }
      }
      return
    }
    setCurrentIndex((current) => current + 1)
  }

  const resetQuiz = () => {
    setAnswers([])
    setEarnedXp(null)
    setCurrentIndex(0)
    setIsFinished(false)
    setSelectedOption(null)
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase text-alert-coral">Quiz</p>
          <h1 className="mt-1 text-3xl font-black text-brand-ink">{quiz.title}</h1>
          <p className="mt-2 text-muted">Perguntas vindas do banco.</p>
        </div>
        <Button as={Link} icon={ArrowLeft} to="/jogos" variant="ghost">Voltar</Button>
      </div>
      {!quiz.questions.length ? (
        <Card>Nenhuma pergunta cadastrada para este quiz.</Card>
      ) : isFinished ? (
        <Card className="text-center">
          <CheckCircle2 className="mx-auto h-14 w-14 text-success" />
          <h2 className="mt-4 text-3xl font-black text-brand-ink">Quiz concluido</h2>
          <p className="mt-3 text-slate-700">Voce acertou <strong>{score}</strong> de <strong>{quiz.questions.length}</strong> perguntas.</p>
          <Badge className="mt-5" tone={score / quiz.questions.length >= 0.7 ? 'success' : 'warning'}>{Math.round((score / quiz.questions.length) * 100)}%</Badge>
          {isStudent ? (
            <p className="mt-4 text-lg font-black text-brand-royal">
              {isAwardingXp ? 'Registrando XP...' : `XP ganho: ${earnedXp ?? 0}`}
            </p>
          ) : null}
          <Button className="mt-6" icon={RotateCcw} onClick={resetQuiz} variant="royal">Refazer quiz</Button>
        </Card>
      ) : (
        <Card>
          <div className="h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-brand-royal" style={{ width: `${progress}%` }} /></div>
          <Badge className="mt-5" tone="dark">Pergunta {currentIndex + 1}</Badge>
          <h2 className="mt-4 text-2xl font-black text-brand-ink">{currentQuestion.question_text}</h2>
          <div className="mt-6 grid gap-3">
            {currentQuestion.options.map((option, index) => (
              <button className={`rounded-xl border px-4 py-4 text-left text-sm font-bold ${selectedOption === index ? 'border-brand-royal bg-brand-royal text-white' : 'border-line bg-white text-slate-900'}`} key={option} onClick={() => setSelectedOption(index)} type="button">{option}</button>
            ))}
          </div>
          <Button className="mt-6" disabled={selectedOption === null} onClick={handleNext} variant="primary">{currentIndex + 1 === quiz.questions.length ? 'Finalizar quiz' : 'Proxima pergunta'}</Button>
        </Card>
      )}
    </div>
  )
}

export default QuizPage
