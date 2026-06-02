import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, RotateCcw } from 'lucide-react'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { quizzes } from '../data/mockData'

function QuizPage() {
  const { id } = useParams()
  const quiz = useMemo(() => quizzes.find((item) => item.id === id) || quizzes[0], [id])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const [selectedOption, setSelectedOption] = useState(null)
  const [isFinished, setIsFinished] = useState(false)

  const currentQuestion = quiz.questions[currentIndex]
  const score = answers.reduce((total, answer) => total + (answer.isCorrect ? 1 : 0), 0)
  const progress = ((isFinished ? quiz.questions.length : currentIndex) / quiz.questions.length) * 100

  const handleNext = () => {
    if (selectedOption === null) return

    const nextAnswers = [
      ...answers,
      {
        isCorrect: selectedOption === currentQuestion.correct_option,
        questionId: currentQuestion.id,
        selectedOption,
      },
    ]

    setAnswers(nextAnswers)
    setSelectedOption(null)

    if (currentIndex + 1 >= quiz.questions.length) {
      setIsFinished(true)
      return
    }

    setCurrentIndex((current) => current + 1)
  }

  const resetQuiz = () => {
    setAnswers([])
    setCurrentIndex(0)
    setIsFinished(false)
    setSelectedOption(null)
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase text-alert-coral">Jogos educativos</p>
          <h1 className="mt-1 text-3xl font-black text-brand-ink">{quiz.title}</h1>
          <p className="mt-2 text-muted">Responda as perguntas, acompanhe o progresso e confira sua pontuacao final.</p>
        </div>
        <Button as={Link} icon={ArrowLeft} to="/jogos" variant="ghost">
          Voltar
        </Button>
      </div>

      <Card>
        <div className="h-3 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-brand-royal transition-all" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-3 flex items-center justify-between text-sm font-bold text-slate-700">
          <span>
            {isFinished ? quiz.questions.length : currentIndex + 1} de {quiz.questions.length}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
      </Card>

      {isFinished ? (
        <Card className="text-center">
          <CheckCircle2 aria-hidden="true" className="mx-auto h-14 w-14 text-success" />
          <h2 className="mt-4 text-3xl font-black text-brand-ink">Quiz concluido</h2>
          <p className="mt-3 text-slate-700">
            Voce acertou <strong>{score}</strong> de <strong>{quiz.questions.length}</strong> perguntas.
          </p>
          <Badge className="mt-5" tone={score / quiz.questions.length >= 0.7 ? 'success' : 'warning'}>
            Pontuacao: {Math.round((score / quiz.questions.length) * 100)}%
          </Badge>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button icon={RotateCcw} onClick={resetQuiz} variant="royal">
              Refazer quiz
            </Button>
            <Button as={Link} icon={ArrowLeft} to="/jogos" variant="ghost">
              Ver jogos
            </Button>
          </div>
        </Card>
      ) : (
        <Card>
          <Badge tone="dark">Pergunta {currentIndex + 1}</Badge>
          <h2 className="mt-4 text-2xl font-black text-brand-ink">{currentQuestion.question_text}</h2>
          <div className="mt-6 grid gap-3">
            {currentQuestion.options.map((option, index) => (
              <button
                className={`rounded-xl border px-4 py-4 text-left text-sm font-bold transition ${
                  selectedOption === index
                    ? 'border-brand-royal bg-brand-royal text-white'
                    : 'border-line bg-white text-slate-900 hover:border-brand-royal hover:bg-brand-royal-soft'
                }`}
                key={option}
                onClick={() => setSelectedOption(index)}
                type="button"
              >
                {option}
              </button>
            ))}
          </div>
          <Button className="mt-6 w-full sm:w-auto" disabled={selectedOption === null} onClick={handleNext} variant="primary">
            {currentIndex + 1 === quiz.questions.length ? 'Finalizar quiz' : 'Proxima pergunta'}
          </Button>
        </Card>
      )}
    </div>
  )
}

export default QuizPage
