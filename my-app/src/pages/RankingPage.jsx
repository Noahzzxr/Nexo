import Avatar from '../components/ui/Avatar'
import Badge from '../components/ui/Badge'
import Card from '../components/ui/Card'
import { useSession } from '../hooks/useSession'

function RankingPage() {
  const { schoolData } = useSession()
  const rows = [...schoolData.students].sort((a, b) => Number(b.total_xp || 0) - Number(a.total_xp || 0))

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-black uppercase text-alert-coral">Ranking</p>
        <h1 className="mt-1 text-3xl font-black text-brand-ink">Ranking de XP</h1>
        <p className="mt-2 text-muted">Pontuacao baseada nos quizzes concluidos pelos alunos.</p>
      </div>
      <Card>
        <div className="grid gap-3">
          {rows.map((student, index) => (
            <div className="flex items-center gap-3 rounded-lg border border-line p-3" key={student.id}>
              <Badge tone="dark">{index + 1}</Badge>
              <Avatar image={student.avatar_url} name={student.fullname} size="sm" />
              <div className="min-w-0">
                <p className="font-black text-brand-ink">{student.fullname}</p>
                <p className="text-sm text-muted">{student.registration_number || student.email}</p>
              </div>
              <p className="ml-auto shrink-0 text-lg font-black text-brand-royal">{Number(student.total_xp || 0)} XP</p>
            </div>
          ))}
          {!rows.length ? <p className="rounded-lg bg-page p-4 text-sm text-muted">Nenhum aluno cadastrado.</p> : null}
        </div>
      </Card>
    </div>
  )
}

export default RankingPage
