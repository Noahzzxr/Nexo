import { useMemo } from 'react'
import { Medal, Trophy } from 'lucide-react'
import Avatar from '../components/ui/Avatar'
import Badge from '../components/ui/Badge'
import Card from '../components/ui/Card'
import Table from '../components/ui/Table'
import { useSession } from '../hooks/useSession'

const podium = {
  1: 'text-warning',
  2: 'text-slate-400',
  3: 'text-amber-700',
}

function RankingPage() {
  const { studentsList } = useSession()

  // Dynamic ranking list sorted by points descending
  const ranking = useMemo(() => {
    return [...studentsList]
      .sort((a, b) => (b.points || 0) - (a.points || 0))
      .map((student, index) => ({
        position: index + 1,
        name: student.name,
        games: student.games !== undefined ? student.games : Math.floor((student.points || 0) / 1.7) + 5,
        points: student.points || 0,
        avatar: student.avatar || `https://i.pravatar.cc/120?img=${10 + index}`,
      }))
  }, [studentsList])

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase text-alert-coral">Jogos e conquistas</p>
          <h1 className="mt-1 text-3xl font-black text-brand-ink">Ranking da Turma</h1>
          <p className="mt-2 text-muted">Classificação por jogos concluídos, pontos e desempenho nos desafios educativos.</p>
        </div>
        <Badge tone="dark">9º ano B</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {ranking.slice(0, 3).map((student) => (
          <Card className="text-center" key={student.name}>
            <Trophy aria-hidden="true" className={`mx-auto h-9 w-9 ${podium[student.position]}`} />
            <Avatar className="mt-4" image={student.avatar} name={student.name} size="lg" />
            <h2 className="mt-3 font-black text-brand-ink">{student.name}</h2>
            <p className="mt-1 text-sm text-muted">{student.points} pontos</p>
          </Card>
        ))}
      </div>

      <Card>
        <Table columns={['Posição', 'Aluno', 'Jogos', 'Pontos', 'Pódio']}>
          {ranking.map((student) => (
            <tr className="bg-white even:bg-slate-50" key={student.name}>
              <td className="px-4 py-4">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-royal-soft font-black text-brand-royal">
                  {student.position}
                </span>
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <Avatar image={student.avatar} name={student.name} size="sm" />
                  <span className="font-black text-brand-ink">{student.name}</span>
                </div>
              </td>
              <td className="px-4 py-4 font-bold text-copy">{student.games}</td>
              <td className="px-4 py-4 font-bold text-copy">{student.points}</td>
              <td className="px-4 py-4">
                {student.position <= 3 ? (
                  <Medal aria-hidden="true" className={`h-6 w-6 ${podium[student.position]}`} />
                ) : (
                  <Badge tone="neutral">Participante</Badge>
                )}
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  )
}

export default RankingPage
