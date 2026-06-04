import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Gamepad2, Play, Trophy } from 'lucide-react'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Modal from '../components/ui/Modal'
import { games, pendingTasks } from '../data/mockData'

function GamesPage() {
  const [isRewardsOpen, setIsRewardsOpen] = useState(false)
  const [redeemedRewards, setRedeemedRewards] = useState([])

  const rewards = [
    { title: 'Medalha de Ouro', description: 'Para quem completar 5 desafios com pontuacao maxima.' },
    { title: 'Selo de Campeao', description: 'Concedido ao aluno mais engajado na semana.' },
    { title: 'Coroa de Conquista', description: 'Resgate ao chegar em 1000 pontos no ranking.' },
    { title: 'Estrela de Progresso', description: 'Disponivel para quem terminar todas as trilhas do mes.' },
  ]

  const handleRedeemReward = (rewardTitle) => {
    setRedeemedRewards((current) =>
      current.includes(rewardTitle) ? current : [...current, rewardTitle]
    )
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase text-alert-coral">Jogos educativos</p>
          <h1 className="mt-1 text-3xl font-black text-brand-ink">Aprender por desafios</h1>
          <p className="mt-2 text-muted">Trilhas interativas por disciplina com pontos para o ranking da turma.</p>
        </div>
        <Button icon={Trophy} variant="warning" onClick={() => setIsRewardsOpen(true)}>
          Ver premios
        </Button>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {games.map((game) => (
          <Card className="overflow-hidden p-0" key={game.title}>
            <div className="relative">
              <img alt={game.title} className="h-48 w-full object-cover" src={game.image} />
              <Badge className="absolute right-3 top-3" tone="dark">
                {game.score}
              </Badge>
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

      {isRewardsOpen && (
        <Modal title="Prêmios e pendências" onClose={() => setIsRewardsOpen(false)}>
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.95fr]">
            <div className="grid gap-4">
              <div>
                <p className="text-sm font-black uppercase text-alert-coral">Recompensas</p>
                <p className="mt-2 text-sm text-muted">Resgate os prêmios conquistados e veja seu progresso.</p>
              </div>
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
                        <div className="flex items-center gap-2">
                          {isRedeemed ? (
                            <Badge tone="success">Resgatado</Badge>
                          ) : (
                            <Button
                              variant="royal"
                              onClick={() => handleRedeemReward(reward.title)}
                            >
                              Resgatar
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </div>

            <div className="grid gap-4">
              <div>
                <p className="text-sm font-black uppercase text-alert-coral">O que falta fazer</p>
                <p className="mt-2 text-sm text-muted">Complete essas tarefas para subir no ranking e liberar mais prêmios.</p>
              </div>
              <div className="grid gap-3">
                {pendingTasks.map((task) => (
                  <Card className="border border-line p-4" key={task.title}>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-black text-brand-ink">{task.title}</p>
                        <p className="mt-1 text-sm text-muted">
                          {task.subject} - entrega {task.due}
                        </p>
                      </div>
                      <Button
                        as={Link}
                        to="/atividades"
                        variant={task.status === 'Atrasado' ? 'coral' : 'royal'}
                        className="w-full sm:w-auto"
                      >
                        Ver tarefa
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button variant="ghost" onClick={() => setIsRewardsOpen(false)}>
              Fechar
            </Button>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default GamesPage
