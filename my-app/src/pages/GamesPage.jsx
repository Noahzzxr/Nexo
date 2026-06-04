import { Link } from 'react-router-dom'
import { Gamepad2, Play } from 'lucide-react'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { useSession } from '../hooks/useSession'
import RankingPage from './RankingPage'

function GamesPage() {
  const { isTeacher, schoolData } = useSession()

  if (isTeacher) return <RankingPage />

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-black uppercase text-alert-coral">Quizzes</p>
        <h1 className="mt-1 text-3xl font-black text-brand-ink">Jogos educativos</h1>
        <p className="mt-2 text-muted">Quizzes carregados das tabelas quizzes e quiz_questions.</p>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {schoolData.quizzes.map((quiz) => {
          const subject = schoolData.subjects.find((item) => item.id === quiz.subject_id)
          return (
            <Card className="flex h-full flex-col" key={quiz.id}>
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-brand-royal-soft text-brand-royal"><Gamepad2 className="h-5 w-5" /></span>
              <h2 className="mt-5 text-xl font-black text-brand-ink">{quiz.title}</h2>
              <p className="mt-2 text-sm text-muted">{subject?.name || 'Sem disciplina'}</p>
              <Badge className="mt-4" tone="royal">{quiz.questions.length} perguntas</Badge>
              <Button as={Link} className="mt-auto w-full" icon={Play} to={`/quiz/${quiz.id}`} variant="royal">Jogar agora</Button>
            </Card>
          )
        })}
        {!schoolData.quizzes.length ? <p className="rounded-lg bg-white p-4 text-sm text-muted">Nenhum quiz cadastrado.</p> : null}
      </div>
    </div>
  )
}

export default GamesPage
