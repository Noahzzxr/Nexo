import { useState } from 'react'
import { Download, UploadCloud } from 'lucide-react'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import InputField from '../components/ui/InputField'
import { useSession } from '../hooks/useSession'
import { useToast } from '../hooks/useToast'
import { createPostedMaterial } from '../services/schoolService'

function MaterialsPage() {
  const { addToast } = useToast()
  const { currentUser, isAdmin, isTeacher, refreshSchoolData, roleLabel, schoolData } = useSession()
  const canPostMaterial = isTeacher || isAdmin
  const [materialFile, setMaterialFile] = useState(null)
  const [materialForm, setMaterialForm] = useState({ classId: '', description: '', subjectId: '', title: '' })
  const [isPosting, setIsPosting] = useState(false)

  const handlePostMaterial = async (event) => {
    event.preventDefault()
    setIsPosting(true)
    try {
      await createPostedMaterial({ file: materialFile, material: { ...materialForm, teacherId: currentUser.id } })
      setMaterialFile(null)
      setMaterialForm({ classId: '', description: '', subjectId: '', title: '' })
      await refreshSchoolData()
      addToast({ title: 'Material publicado', message: 'Arquivo salvo no banco/storage.' })
    } catch (error) {
      addToast({ title: 'Erro ao publicar material', message: error.message })
    } finally {
      setIsPosting(false)
    }
  }

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-black uppercase text-alert-coral">Biblioteca</p>
        <h1 className="mt-1 text-3xl font-black text-brand-ink">Materiais de Estudo</h1>
        <p className="mt-2 text-muted">Materiais carregados da tabela posted_materials. Perfil ativo: {roleLabel}.</p>
      </div>

      {canPostMaterial ? (
        <Card>
          <div className="mb-5"><p className="text-sm font-black uppercase text-alert-coral">Professor</p><h2 className="mt-1 text-xl font-black text-brand-ink">Postar material</h2></div>
          <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1.4fr_auto]" onSubmit={handlePostMaterial}>
            <InputField as="select" label="Turma" name="classId" onChange={(event) => setMaterialForm((current) => ({ ...current, classId: event.target.value }))} options={[{ label: 'Selecione', value: '' }, ...schoolData.classes.map((item) => ({ label: item.name, value: item.id }))]} required value={materialForm.classId} />
            <InputField as="select" label="Disciplina" name="subjectId" onChange={(event) => setMaterialForm((current) => ({ ...current, subjectId: event.target.value }))} options={[{ label: 'Selecione', value: '' }, ...schoolData.subjects.map((item) => ({ label: item.name, value: item.id }))]} required value={materialForm.subjectId} />
            <InputField label="Titulo" name="title" onChange={(event) => setMaterialForm((current) => ({ ...current, title: event.target.value }))} required value={materialForm.title} />
            <label className="block text-sm font-semibold text-brand-ink"><span>Arquivo</span><input className="mt-2 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm" onChange={(event) => setMaterialFile(event.target.files?.[0] || null)} type="file" /></label>
            <InputField as="textarea" className="md:col-span-2 xl:col-span-3" label="Descricao" name="description" onChange={(event) => setMaterialForm((current) => ({ ...current, description: event.target.value }))} value={materialForm.description} />
            <Button className="self-end" disabled={isPosting} icon={UploadCloud} type="submit" variant="royal">{isPosting ? 'Publicando...' : 'Publicar'}</Button>
          </form>
        </Card>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {schoolData.materials.map((material) => {
          const subject = schoolData.subjects.find((item) => item.id === material.subject_id)
          const schoolClass = schoolData.classes.find((item) => item.id === material.class_id)
          return (
            <Card className="flex h-full flex-col" key={material.id}>
              <Badge tone="dark">{subject?.name || 'Sem disciplina'}</Badge>
              <h2 className="mt-4 text-xl font-black text-brand-ink">{material.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{material.description || 'Sem descricao.'}</p>
              <p className="mt-3 text-xs font-bold text-slate-700">{schoolClass?.name || 'Sem turma'} - {new Date(material.created_at).toLocaleDateString('pt-BR')}</p>
              {material.file_attachment_url ? <Button as="a" className="mt-auto w-full" href={material.file_attachment_url} icon={Download} rel="noreferrer" target="_blank" variant="primary">Abrir anexo</Button> : null}
            </Card>
          )
        })}
        {!schoolData.materials.length ? <p className="rounded-lg bg-white p-4 text-sm text-muted">Nenhum material publicado.</p> : null}
      </div>
    </div>
  )
}

export default MaterialsPage
