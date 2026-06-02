import { Link } from 'react-router-dom'
import { Gamepad2, Play, Trophy } from 'lucide-react'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { games } from '../data/mockData'

function GamesPage() {
  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase text-alert-coral">Jogos educativos</p>
          <h1 className="mt-1 text-3xl font-black text-brand-ink">Aprender por desafios</h1>
          <p className="mt-2 text-muted">Trilhas interativas por disciplina com pontos para o ranking da turma.</p>
        </div>
        <Button icon={Trophy} variant="warning">
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
    </div>
  )
}

export default GamesPage
