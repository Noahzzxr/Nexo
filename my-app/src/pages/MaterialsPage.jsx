import { useEffect, useState } from 'react'
import { Download, FileArchive, FileText, Headphones, UploadCloud } from 'lucide-react'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import InputField from '../components/ui/InputField'
import { useSession } from '../hooks/useSession'
import { useToast } from '../hooks/useToast'
import { createPostedMaterial, fetchPostedMaterials, subscribePostedMaterials } from '../services/schoolService'
import { materials, schoolClasses, subjectsCatalog } from '../data/mockData'

const studentClassId = schoolClasses[0].id

const getSubjectName = (subjectId) => subjectsCatalog.find((subject) => subject.id === subjectId)?.name || 'Materia'
const getClassName = (classId) => schoolClasses.find((schoolClass) => schoolClass.id === classId)?.name || 'Turma'

function MaterialsPage() {
  const { addToast } = useToast()
  const { currentUser, isAdmin, isStudent, isSupabaseConfigured, isTeacher, roleLabel } = useSession()
  const canPostMaterial = isTeacher || isAdmin
  const [postedRows, setPostedRows] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPosting, setIsPosting] = useState(false)
  const [materialFile, setMaterialFile] = useState(null)
  const [materialForm, setMaterialForm] = useState({
    classId: studentClassId,
    description: '',
    subjectId: subjectsCatalog[0].id,
    title: '',
  })

  useEffect(() => {
    let isMounted = true
    const classId = isStudent ? studentClassId : undefined

    async function loadMaterials() {
      setIsLoading(true)
      try {
        const rows = await fetchPostedMaterials({ classId })
        if (isMounted) setPostedRows(rows)
      } catch (error) {
        addToast({ title: 'Erro ao carregar materias', message: error.message })
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    const unsubscribe = subscribePostedMaterials({
      classId,
      onInsert: (material) => setPostedRows((current) => [material, ...current]),
    })

    loadMaterials()

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [addToast, isStudent])

  const handlePostMaterial = async (event) => {
    event.preventDefault()

    if (!materialForm.title.trim()) {
      addToast({ title: 'Titulo obrigatorio', message: 'Informe um titulo para publicar a materia.' })
      return
    }

    setIsPosting(true)

    try {
      const created = await createPostedMaterial({
        file: materialFile,
        material: {
          ...materialForm,
          teacherId: currentUser.id,
        },
      })
      setPostedRows((current) => [created, ...current])
      setMaterialFile(null)
      setMaterialForm((current) => ({ ...current, description: '', title: '' }))
      addToast({
        title: 'Materia publicada',
        message: isSupabaseConfigured ? 'A turma ja pode visualizar no portal.' : 'Materia salva no fallback local da sessao.',
      })
    } catch (error) {
      addToast({ title: 'Erro ao publicar materia', message: error.message })
    } finally {
      setIsPosting(false)
    }
  }

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-black uppercase text-alert-coral">Biblioteca do aluno</p>
        <h1 className="mt-1 text-3xl font-black text-brand-ink">Materiais de Estudo</h1>
        <p className="mt-2 text-muted">Arquivos organizados por materia para revisao e download. Perfil ativo: {roleLabel}.</p>
      </div>

      {canPostMaterial ? (
        <Card>
          <div className="mb-5">
            <p className="text-sm font-black uppercase text-alert-coral">Professor</p>
            <h2 className="mt-1 text-xl font-black text-brand-ink">Postar Materia</h2>
          </div>
          <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1.4fr_auto]" onSubmit={handlePostMaterial}>
            <InputField
              as="select"
              label="Turma destino"
              name="classId"
              onChange={(event) => setMaterialForm((current) => ({ ...current, classId: event.target.value }))}
              options={schoolClasses.map((schoolClass) => ({ label: schoolClass.name, value: schoolClass.id }))}
              value={materialForm.classId}
            />
            <InputField
              as="select"
              label="Disciplina"
              name="subjectId"
              onChange={(event) => setMaterialForm((current) => ({ ...current, subjectId: event.target.value }))}
              options={subjectsCatalog.map((subject) => ({ label: subject.name, value: subject.id }))}
              value={materialForm.subjectId}
            />
            <InputField
              label="Titulo"
              name="title"
              onChange={(event) => setMaterialForm((current) => ({ ...current, title: event.target.value }))}
              placeholder="Tema da materia"
              value={materialForm.title}
            />
            <label className="block text-sm font-semibold text-brand-ink">
              <span>Arquivo</span>
              <input
                className="mt-2 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-slate-800 file:mr-3 file:rounded-md file:border-0 file:bg-brand-royal file:px-3 file:py-1.5 file:text-sm file:font-bold file:text-white"
                onChange={(event) => setMaterialFile(event.target.files?.[0] || null)}
                type="file"
              />
            </label>
            <InputField
              as="textarea"
              className="md:col-span-2 xl:col-span-3"
              label="Descricao"
              name="description"
              onChange={(event) => setMaterialForm((current) => ({ ...current, description: event.target.value }))}
              placeholder="Explique o que os alunos devem estudar"
              value={materialForm.description}
            />
            <Button className="self-end" disabled={isPosting} icon={UploadCloud} type="submit" variant="royal">
              {isPosting ? 'Publicando...' : 'Publicar'}
            </Button>
          </form>
        </Card>
      ) : null}

      <Card>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-black uppercase text-alert-coral">Ultimas materias postadas</p>
            <h2 className="mt-1 text-xl font-black text-brand-ink">
              {isStudent ? `Publicacoes para ${getClassName(studentClassId)}` : 'Publicacoes por turma'}
            </h2>
          </div>
          <Badge tone="royal">{isLoading ? 'Carregando' : `${postedRows.length} publicacoes`}</Badge>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {postedRows.map((material) => (
            <div className="rounded-xl border border-line bg-page p-4" key={material.id}>
              <Badge tone="dark">{getSubjectName(material.subject_id)}</Badge>
              <h3 className="mt-4 font-black text-brand-ink">{material.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-700">{material.description || 'Material publicado pelo professor.'}</p>
              <div className="mt-4 flex items-center justify-between gap-3 text-xs font-bold text-slate-700">
                <span>{getClassName(material.class_id)}</span>
                <span>{new Date(material.created_at).toLocaleDateString('pt-BR')}</span>
              </div>
              {material.file_attachment_url ? (
                <a
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-ink px-4 py-2 text-sm font-bold text-white transition hover:bg-brand-ink-soft"
                  href={material.file_attachment_url}
                  rel="noreferrer"
                  target="_blank"
                >
                  <Download aria-hidden="true" className="h-4 w-4" />
                  Abrir anexo
                </a>
              ) : null}
            </div>
          ))}
          {!postedRows.length && !isLoading ? (
            <p className="rounded-lg bg-page p-4 text-sm text-slate-700">Nenhuma materia publicada para esta turma ainda.</p>
          ) : null}
        </div>
      </Card>

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
              <Button
                className="mt-auto w-full"
                icon={Download}
                onClick={() => addToast({ title: 'Download simulado', message: `${material.title} foi preparado para download.` })}
                variant="primary"
              >
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
