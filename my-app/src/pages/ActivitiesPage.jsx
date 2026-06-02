import { useMemo, useState } from 'react'
import { ArrowRight, ClipboardCheck, Clock, ImageUp, ListChecks, PlusCircle } from 'lucide-react'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import InputField from '../components/ui/InputField'
import Modal from '../components/ui/Modal'
import Table from '../components/ui/Table'
import { useSession } from '../hooks/useSession'
import { useToast } from '../hooks/useToast'
import { createAssignment, createStudentSubmission } from '../services/schoolService'
import { activities, schoolClasses, subjectsCatalog } from '../data/mockData'

const statusTone = {
  Pendente: 'warning',
  Concluido: 'success',
  Atrasado: 'coral',
}

const statusLabel = {
  Pendente: 'Pendente',
  Concluido: 'Concluido',
  Atrasado: 'Atrasado',
}

function ActivitiesPage() {
  const { addToast } = useToast()
  const { currentUser, isAdmin, isStudent, isSupabaseConfigured, isTeacher, roleLabel } = useSession()
  const [activityRows, setActivityRows] = useState(activities)
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [submissionFile, setSubmissionFile] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [assignmentFile, setAssignmentFile] = useState(null)
  const [assignmentForm, setAssignmentForm] = useState({
    classId: schoolClasses[0].id,
    description: '',
    dueDate: '2026-06-14T12:00',
    subjectId: subjectsCatalog[0].id,
    title: '',
  })

  const completed = activityRows.filter((activity) => activity.status === 'Concluido').length
  const late = activityRows.filter((activity) => activity.status === 'Atrasado').length
  const canCreateAssignments = isTeacher || isAdmin

  const selectedClassName = useMemo(
    () => schoolClasses.find((item) => item.id === assignmentForm.classId)?.name || schoolClasses[0].name,
    [assignmentForm.classId],
  )

  const selectedSubjectName = useMemo(
    () => subjectsCatalog.find((item) => item.id === assignmentForm.subjectId)?.name || subjectsCatalog[0].name,
    [assignmentForm.subjectId],
  )

  const handleSubmission = async (event) => {
    event.preventDefault()

    if (!selectedActivity || !submissionFile) {
      addToast({ title: 'Arquivo obrigatorio', message: 'Selecione uma foto antes de confirmar a entrega.' })
      return
    }

    setIsSubmitting(true)

    try {
      await createStudentSubmission({
        activity: selectedActivity,
        file: submissionFile,
        studentId: currentUser.id,
      })

      setActivityRows((current) =>
        current.map((activity) =>
          activity.id === selectedActivity.id ? { ...activity, status: 'Concluido', deliveryFile: submissionFile.name } : activity,
        ),
      )
      setSelectedActivity(null)
      setSubmissionFile(null)
      addToast({
        title: 'Entrega confirmada',
        message: isSupabaseConfigured ? 'Foto enviada ao Supabase e status atualizado.' : 'Entrega simulada localmente; configure o Supabase para persistir.',
      })
    } catch (error) {
      addToast({ title: 'Falha na entrega', message: error.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCreateAssignment = async (event) => {
    event.preventDefault()

    if (!assignmentForm.title.trim()) {
      addToast({ title: 'Titulo obrigatorio', message: 'Informe o titulo da atividade antes de postar.' })
      return
    }

    try {
      const created = await createAssignment({ assignment: assignmentForm, file: assignmentFile })
      setActivityRows((current) => [
        {
          id: created.id,
          classId: assignmentForm.classId,
          course: selectedSubjectName,
          due: new Date(assignmentForm.dueDate).toLocaleDateString('pt-BR'),
          name: assignmentForm.title,
          status: 'Pendente',
          subjectId: assignmentForm.subjectId,
        },
        ...current,
      ])
      setAssignmentForm((current) => ({ ...current, description: '', title: '' }))
      setAssignmentFile(null)
      addToast({ title: 'Atividade postada', message: `${selectedSubjectName} foi liberada para ${selectedClassName}.` })
    } catch (error) {
      addToast({ title: 'Erro ao postar', message: error.message })
    }
  }

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-black uppercase text-alert-coral">Minhas atividades</p>
        <h1 className="mt-1 text-3xl font-black text-brand-ink">Tarefas e Avaliacoes</h1>
        <p className="mt-2 text-muted">Prazos, status e acessos rapidos para cada disciplina. Perfil ativo: {roleLabel}.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <ListChecks aria-hidden="true" className="h-6 w-6 text-brand-royal" />
          <p className="mt-4 text-sm font-black uppercase text-muted">Total de tarefas</p>
          <p className="mt-2 text-4xl font-black text-brand-ink">{activityRows.length}</p>
        </Card>
        <Card>
          <ClipboardCheck aria-hidden="true" className="h-6 w-6 text-success" />
          <p className="mt-4 text-sm font-black uppercase text-muted">Concluidas</p>
          <p className="mt-2 text-4xl font-black text-brand-ink">{completed}</p>
        </Card>
        <Card>
          <Clock aria-hidden="true" className="h-6 w-6 text-alert-coral" />
          <p className="mt-4 text-sm font-black uppercase text-muted">Atrasadas</p>
          <p className="mt-2 text-4xl font-black text-brand-ink">{late}</p>
        </Card>
      </div>

      {canCreateAssignments ? (
        <Card>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-black uppercase text-alert-coral">Professor</p>
              <h2 className="mt-1 text-xl font-black text-brand-ink">Adicionar Atividade</h2>
            </div>
            <Badge tone="dark">Escrita em assignments</Badge>
          </div>
          <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-5" onSubmit={handleCreateAssignment}>
            <InputField
              as="select"
              label="Turma"
              name="classId"
              onChange={(event) => {
                const schoolClass = schoolClasses.find((item) => item.name === event.target.value)
                setAssignmentForm((current) => ({ ...current, classId: schoolClass.id }))
              }}
              options={schoolClasses.map((item) => item.name)}
              value={selectedClassName}
            />
            <InputField
              as="select"
              label="Disciplina"
              name="subjectId"
              onChange={(event) => {
                const subject = subjectsCatalog.find((item) => item.name === event.target.value)
                setAssignmentForm((current) => ({ ...current, subjectId: subject.id }))
              }}
              options={subjectsCatalog.map((item) => item.name)}
              value={selectedSubjectName}
            />
            <InputField
              label="Titulo"
              name="title"
              onChange={(event) => setAssignmentForm((current) => ({ ...current, title: event.target.value }))}
              placeholder="Enunciado curto"
              value={assignmentForm.title}
            />
            <InputField
              label="Prazo"
              name="dueDate"
              onChange={(event) => setAssignmentForm((current) => ({ ...current, dueDate: event.target.value }))}
              type="datetime-local"
              value={assignmentForm.dueDate}
            />
            <label className="block text-sm font-semibold text-brand-ink">
              <span>Foto/enunciado</span>
              <input
                accept="image/*,.pdf"
                className="mt-2 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-slate-800 file:mr-3 file:rounded-md file:border-0 file:bg-brand-royal file:px-3 file:py-1.5 file:text-sm file:font-bold file:text-white"
                onChange={(event) => setAssignmentFile(event.target.files?.[0] || null)}
                type="file"
              />
            </label>
            <InputField
              as="textarea"
              className="md:col-span-2 xl:col-span-4"
              label="Descricao"
              name="description"
              onChange={(event) => setAssignmentForm((current) => ({ ...current, description: event.target.value }))}
              placeholder="Detalhes da atividade"
              value={assignmentForm.description}
            />
            <Button className="self-end" icon={PlusCircle} type="submit" variant="royal">
              Postar
            </Button>
          </form>
        </Card>
      ) : null}

      <Card>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-black uppercase text-alert-coral">Lista robusta</p>
            <h2 className="mt-1 text-xl font-black text-brand-ink">Atividades por curso</h2>
          </div>
          <Badge tone="royal">Atualizado hoje</Badge>
        </div>
        <Table columns={['Curso', 'Atividade', 'Data limite', 'Status', 'Acao']}>
          {activityRows.map((activity) => (
            <tr className="bg-white even:bg-slate-50" key={activity.name}>
              <td className="px-4 py-4 font-black text-brand-ink">{activity.course}</td>
              <td className="px-4 py-4 text-copy">{activity.name}</td>
              <td className="px-4 py-4 text-muted">{activity.due}</td>
              <td className="px-4 py-4">
                <Badge tone={statusTone[activity.status]}>{statusLabel[activity.status]}</Badge>
              </td>
              <td className="px-4 py-4">
                <Button
                  disabled={!isStudent || activity.status === 'Concluido'}
                  icon={activity.status === 'Concluido' ? ClipboardCheck : ArrowRight}
                  onClick={() => setSelectedActivity(activity)}
                  variant={activity.status === 'Atrasado' ? 'coral' : activity.status === 'Concluido' ? 'success' : 'royal'}
                >
                  {activity.status === 'Concluido' ? 'Revisar' : 'Acessar Avaliacao'}
                </Button>
              </td>
            </tr>
          ))}
        </Table>
      </Card>

      {selectedActivity ? (
        <Modal onClose={() => setSelectedActivity(null)} title="Enviar atividade resolvida">
          <form className="grid gap-4" onSubmit={handleSubmission}>
            <div className="rounded-lg bg-page p-4">
              <p className="font-black text-brand-ink">{selectedActivity.name}</p>
              <p className="mt-1 text-sm text-slate-700">
                {selectedActivity.course} - entrega ate {selectedActivity.due}
              </p>
            </div>
            <label className="block text-sm font-semibold text-brand-ink">
              <span>Foto da atividade resolvida</span>
              <input
                accept="image/*"
                className="mt-2 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-slate-800 file:mr-3 file:rounded-md file:border-0 file:bg-brand-royal file:px-3 file:py-1.5 file:text-sm file:font-bold file:text-white"
                onChange={(event) => setSubmissionFile(event.target.files?.[0] || null)}
                type="file"
              />
            </label>
            <Button disabled={isSubmitting} icon={ImageUp} type="submit" variant="coral">
              {isSubmitting ? 'Enviando...' : 'Confirmar Entrega'}
            </Button>
          </form>
        </Modal>
      ) : null}
    </div>
  )
}

export default ActivitiesPage
