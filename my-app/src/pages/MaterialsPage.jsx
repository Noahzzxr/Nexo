import { Download, FileArchive, FileText, Headphones } from 'lucide-react'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { materials } from '../data/mockData'

function MaterialsPage() {
  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-black uppercase text-alert-coral">Biblioteca do aluno</p>
        <h1 className="mt-1 text-3xl font-black text-brand-ink">Materiais de Estudo</h1>
        <p className="mt-2 text-muted">Arquivos organizados por materia para revisao e download.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {materials.map((material) => {
          const Icon = material.type === 'Audio' ? Headphones : FileText

          return (
            <Card className="flex h-full flex-col" key={material.title}>
              <div className="flex items-start justify-between gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-lg bg-brand-royal-soft text-brand-royal">
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </span>
                <Badge tone={material.type === 'Audio' ? 'warning' : 'royal'}>{material.type}</Badge>
              </div>
              <h2 className="mt-5 text-xl font-black text-brand-ink">{material.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{material.subject} - atualizado em {material.updated}</p>
              <div className="mt-5 flex items-center gap-2 text-sm font-bold text-copy">
                <FileArchive aria-hidden="true" className="h-4 w-4 text-alert-coral" />
                {material.size}
              </div>
              <Button className="mt-auto w-full" icon={Download} variant="primary">
                Baixar arquivo
              </Button>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default MaterialsPage
