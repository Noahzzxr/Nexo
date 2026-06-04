import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Gamepad2, Play, Trophy } from 'lucide-react'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Modal from '../components/ui/Modal'
import { games, pendingTasks } from '../data/mockData'
import { useSession } from '../hooks/useSession'
import RankingPage from './RankingPage'

const rewards = [
  { title: 'Medalha de Ouro', description: 'Para quem completar 5 desafios com pontuacao maxima.' },
  { title: 'Selo de Campeao', description: 'Concedido ao aluno mais engajado na semana.' },
  { title: 'Coroa de Conquista', description: 'Resgate ao chegar em 1000 pontos no ranking.' },
  { title: 'Estrela de Progresso', description: 'Disponivel para quem terminar todas as trilhas do mes.' },
]

function GamesPage() {
  const { isTeacher } = useSession()
  const [isRewardsOpen, setIsRewardsOpen] = useState(false)
  const [redeemedRewards, setRedeemedRewards] = useState([])

  if (isTeacher) {
    return <RankingPage />
  }

  const handleRedeemReward = (rewardTitle) => {
    setRedeemedRewards((current) => (current.includes(rewardTitle) ? current : [...current, rewardTitle]))
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase text-alert-coral">Jogos educativos</p>
          <h1 className="mt-1 text-3xl font-black text-brand-ink">Aprender por desafios</h1>
          <p className="mt-2 text-muted">Trilhas interativas por disciplina com pontos para o ranking da turma.</p>
        </div>
        <Button icon={Trophy} onClick={() => setIsRewardsOpen(true)} variant="warning">
          Ver premios
        </Button>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {games.map((game) => (
          <Card className="overflow-hidden p-0" key={game.title}>
            <div className="relative">
              <img alt={game.title} className="h-48 w-full object-cover" src={game.image} />
              <Badge className="absolute right-3 top-3" tone="dark">{game.score}</Badge>
            </div>
            <div className="p-5">
              <div className="flex items-start gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-lg bg-brand-royal-soft text-brand-royal">
                  <Gamepad2 aria-hidden="true" className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="font-black text-brand-ink">{game.title}</h2>
                  <p className="mt-1 text-sm text-muted">{game.subject}</p>
                </div>
              </div>
              <Button as={Link} className="mt-5 w-full" icon={Play} to={`/quiz/${game.id}`} variant="royal">
                Jogar agora
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {isRewardsOpen ? (
        <Modal onClose={() => setIsRewardsOpen(false)} title="Premios e pendencias">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_.95fr]">
            <div className="grid gap-3">
              {rewards.map((reward) => {
                const isRedeemed = redeemedRewards.includes(reward.title)

                return (
                  <Card className="border border-slate-200 p-4" key={reward.title}>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="font-black text-brand-ink">{reward.title}</h3>
                        <p className="mt-1 text-sm text-copy">{reward.description}</p>
                      </div>
                      {isRedeemed ? <Badge tone="success">Resgatado</Badge> : <Button onClick={() => handleRedeemReward(reward.title)} variant="royal">Resgatar</Button>}
                    </div>
                  </Card>
                )
              })}
            </div>

            <div className="grid gap-3">
              {pendingTasks.map((task) => (
                <Card className="border border-line p-4" key={task.title}>
                  <p className="font-black text-brand-ink">{task.title}</p>
                  <p className="mt-1 text-sm text-muted">{task.subject} - entrega {task.due}</p>
                  <Button as={Link} className="mt-3 w-full" to="/atividades" variant={task.status === 'Atrasado' ? 'coral' : 'royal'}>
                    Ver tarefa
                  </Button>
                </Card>
              ))}
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button onClick={() => setIsRewardsOpen(false)} variant="ghost">Fechar</Button>
          </div>
        </Modal>
      ) : null}
    </div>
  )
}

export default GamesPage
