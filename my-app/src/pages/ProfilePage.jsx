import { useState } from 'react'
import { ImageUp, LockKeyhole } from 'lucide-react'
import Avatar from '../components/ui/Avatar'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import InputField from '../components/ui/InputField'
import { useSession } from '../hooks/useSession'
import { useToast } from '../hooks/useToast'
import { updateProfileAvatar } from '../services/schoolService'

function ProfilePage() {
  const { addToast } = useToast()
  const { currentUser, refreshSchoolData, roleLabel } = useSession()
  const [avatarFile, setAvatarFile] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  const handleAvatarSubmit = async (event) => {
    event.preventDefault()
    if (!avatarFile) return

    setIsSaving(true)
    try {
      await updateProfileAvatar({ file: avatarFile, userId: currentUser.id })
      await refreshSchoolData()
      setAvatarFile(null)
      addToast({ title: 'Foto atualizada', message: 'Imagem do perfil salva no banco.' })
    } catch (error) {
      addToast({ title: 'Erro ao atualizar foto', message: error.message })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-black uppercase text-alert-coral">Perfil do usuario</p>
        <h1 className="mt-1 text-3xl font-black text-brand-ink">Meu Perfil</h1>
        <p className="mt-2 text-muted">Dados carregados da tabela profiles. Perfil ativo: {roleLabel}.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[.8fr_1.2fr]">
        <Card>
          <div className="flex flex-col items-center text-center">
            <Avatar image={currentUser.avatar_url} name={currentUser.fullname} size="xl" />
            <h2 className="mt-4 text-2xl font-black text-brand-ink">{currentUser.fullname}</h2>
            <Badge className="mt-3" tone="royal">{roleLabel}</Badge>
          </div>

          <form className="mt-6 grid gap-3" onSubmit={handleAvatarSubmit}>
            <label className="block text-sm font-semibold text-brand-ink">
              <span>Alterar foto do perfil</span>
              <input accept="image/*" className="mt-2 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm" onChange={(event) => setAvatarFile(event.target.files?.[0] || null)} type="file" />
            </label>
            <Button disabled={!avatarFile || isSaving} icon={ImageUp} type="submit" variant="royal">
              {isSaving ? 'Salvando...' : 'Salvar foto'}
            </Button>
          </form>
        </Card>

        <Card>
          <div className="grid gap-4">
            <InputField label="Nome" name="fullname" readOnly value={currentUser.fullname || ''} />
            <InputField label="E-mail" name="email" readOnly value={currentUser.email || ''} />
            <InputField label="CPF" name="cpf" readOnly value={currentUser.cpf || ''} />
            <InputField label="Matricula" name="registration" readOnly value={currentUser.registration_number || ''} />
            <InputField label="Perfil" name="role" readOnly value={roleLabel} />
          </div>
          <div className="mt-5 flex items-center gap-2 rounded-lg bg-page p-3 text-sm font-bold text-muted">
            <LockKeyhole aria-hidden="true" className="h-4 w-4 text-brand-royal" />
            Dados persistidos no banco de dados.
          </div>
        </Card>
      </div>
    </div>
  )
}

export default ProfilePage
