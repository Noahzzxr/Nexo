import { Award, LockKeyhole, Medal, UserRound } from 'lucide-react'
import DoughnutStat from '../components/charts/DoughnutStat'
import Avatar from '../components/ui/Avatar'
import Badge from '../components/ui/Badge'
import Card from '../components/ui/Card'
import InputField from '../components/ui/InputField'
import { useSession } from '../hooks/useSession'
import { badges, studentProfile } from '../data/mockData'

const badgeStyles = {
  warning: 'bg-warning-soft text-amber-700',
  royal: 'bg-brand-royal-soft text-brand-royal',
  coral: 'bg-alert-soft text-alert-coral',
  success: 'bg-success-soft text-success',
}

function ProfilePage() {
  const { currentUser, isStudent, isTeacher, roleLabel } = useSession()

  const subtitle = isStudent
    ? studentProfile.course
    : isTeacher
    ? 'Corpo Docente'
    : 'Administração Escolar'

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-black uppercase text-alert-coral">Perfil do usuário</p>
        <h1 className="mt-1 text-3xl font-black text-brand-ink">
          {isStudent ? 'Perfil do Aluno' : isTeacher ? 'Perfil do Professor' : 'Perfil do Administrador'}
        </h1>
        <p className="mt-2 text-muted">Dados pessoais e credenciais cadastradas no sistema. Perfil ativo: {roleLabel}.</p>
      </div>

      <div className={`grid gap-6 ${isStudent ? 'xl:grid-cols-[.9fr_1.1fr]' : 'max-w-2xl mx-auto w-full'}`}>
        <Card>
          <div className="flex flex-col items-center text-center">
            <Avatar image={currentUser.avatar || studentProfile.avatar} name={currentUser.fullname} size="xl" />
            <h2 className="mt-4 text-2xl font-black text-brand-ink">{currentUser.fullname}</h2>
            <p className="mt-1 text-muted">{subtitle}</p>
            {isStudent ? (
              <Badge className="mt-4" tone="success">
                Frequência {studentProfile.attendance}
              </Badge>
            ) : null}
          </div>

          <div className="mt-8 grid gap-4">
            {isStudent ? (
              <>
                <InputField label="Matrícula" name="registration" readOnly value={studentProfile.registration} />
                <InputField label="Email escolar" name="email" readOnly value={currentUser.email} />
                <InputField label="Telefone" name="phone" readOnly value={studentProfile.phone} />
                <InputField label="Responsável" name="guardian" readOnly value={studentProfile.guardian} />
                <InputField label="Turno" name="shift" readOnly value={studentProfile.shift} />
              </>
            ) : isTeacher ? (
              <>
                <InputField label="Identificador Docente" name="registration" readOnly value="TCH-2026-0034" />
                <InputField label="Email escolar" name="email" readOnly value={currentUser.email} />
                <InputField label="Cargo" name="role" readOnly value="Professor Regente" />
                <InputField label="Turno de Trabalho" name="shift" readOnly value="Matutino e Vespertino" />
              </>
            ) : (
              <>
                <InputField label="Identificador Administrativo" name="registration" readOnly value="ADM-2026-0001" />
                <InputField label="Email institucional" name="email" readOnly value={currentUser.email} />
                <InputField label="Cargo" name="role" readOnly value="Administrador Geral" />
              </>
            )}
          </div>

          <div className="mt-5 flex items-center gap-2 rounded-lg bg-page p-3 text-sm font-bold text-muted">
            <LockKeyhole aria-hidden="true" className="h-4 w-4 text-brand-royal" />
            Dados protegidos pela secretaria escolar.
          </div>
        </Card>

        {isStudent ? (
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
                  <p className="text-sm font-black uppercase text-alert-coral">Pendências</p>
                  <h2 className="mt-1 text-xl font-black text-brand-ink">Progresso de conclusão</h2>
                </div>
                <UserRound aria-hidden="true" className="h-5 w-5 text-brand-royal" />
              </div>
              <div className="grid gap-6 lg:grid-cols-[.7fr_1fr] lg:items-center">
                <DoughnutStat colors={['#243F8F', '#E8EFFF']} label="Pendências" subLabel="concluído" value={60} />
                <div className="grid gap-3">
                  {[
                    ['Tarefas realizadas', '60%', 'success'],
                    ['Materiais revisados', '43%', 'royal'],
                    ['Aulas de reforço', '28%', 'warning'],
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
        ) : null}
      </div>
    </div>
  )
}

export default ProfilePage
