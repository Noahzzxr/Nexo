import { Award, LockKeyhole, Medal, UserRound } from 'lucide-react'
import DoughnutStat from '../components/charts/DoughnutStat'
import Avatar from '../components/ui/Avatar'
import Badge from '../components/ui/Badge'
import Card from '../components/ui/Card'
import InputField from '../components/ui/InputField'
import { badges, studentProfile } from '../data/mockData'

const badgeStyles = {
  warning: 'bg-warning-soft text-amber-700',
  royal: 'bg-brand-royal-soft text-brand-royal',
  coral: 'bg-alert-soft text-alert-coral',
  success: 'bg-success-soft text-success',
}

function ProfilePage() {
  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-black uppercase text-alert-coral">Perfil e pendencias</p>
        <h1 className="mt-1 text-3xl font-black text-brand-ink">Perfil do Aluno</h1>
        <p className="mt-2 text-muted">Dados pessoais, conquistas e progresso das pendencias escolares.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[.9fr_1.1fr]">
        <Card>
          <div className="flex flex-col items-center text-center">
            <Avatar image={studentProfile.avatar} name={studentProfile.name} size="xl" />
            <h2 className="mt-4 text-2xl font-black text-brand-ink">{studentProfile.name}</h2>
            <p className="mt-1 text-muted">{studentProfile.course}</p>
            <Badge className="mt-4" tone="success">
              Frequencia {studentProfile.attendance}
            </Badge>
          </div>

          <div className="mt-8 grid gap-4">
            <InputField label="Matricula" name="registration" readOnly value={studentProfile.registration} />
            <InputField label="Email escolar" name="email" readOnly value={studentProfile.email} />
            <InputField label="Telefone" name="phone" readOnly value={studentProfile.phone} />
            <InputField label="Responsavel" name="guardian" readOnly value={studentProfile.guardian} />
            <InputField label="Turno" name="shift" readOnly value={studentProfile.shift} />
          </div>

          <div className="mt-5 flex items-center gap-2 rounded-lg bg-page p-3 text-sm font-bold text-muted">
            <LockKeyhole aria-hidden="true" className="h-4 w-4 text-brand-royal" />
            Dados protegidos pela secretaria escolar.
          </div>
        </Card>

        <div className="grid gap-6">
          <Card>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-black uppercase text-alert-coral">Badges conquistados</p>
                <h2 className="mt-1 text-xl font-black text-brand-ink">Medalhas e reconhecimentos</h2>
              </div>
              <Award aria-hidden="true" className="h-6 w-6 text-warning" />
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {badges.map((badge) => (
                <div className={`rounded-xl p-4 ${badgeStyles[badge.tone]}`} key={badge.title}>
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-lg bg-white/70">
                      <Medal aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-black">{badge.title}</p>
                      <p className="text-sm font-bold opacity-80">{badge.level}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-black uppercase text-alert-coral">Pendencias</p>
                <h2 className="mt-1 text-xl font-black text-brand-ink">Progresso de conclusao</h2>
              </div>
              <UserRound aria-hidden="true" className="h-5 w-5 text-brand-royal" />
            </div>
            <div className="grid gap-6 lg:grid-cols-[.7fr_1fr] lg:items-center">
              <DoughnutStat colors={['#243F8F', '#E8EFFF']} label="Pendencias" subLabel="concluido" value={60} />
              <div className="grid gap-3">
                {[
                  ['Tarefas realizadas', '60%', 'success'],
                  ['Materiais revisados', '43%', 'royal'],
                  ['Aulas de reforco', '28%', 'warning'],
                  ['Faltas justificadas', '8%', 'coral'],
                ].map(([label, value, tone]) => (
                  <div className="flex items-center justify-between rounded-lg border border-line p-3" key={label}>
                    <span className="font-bold text-brand-ink">{label}</span>
                    <Badge tone={tone}>{value}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
