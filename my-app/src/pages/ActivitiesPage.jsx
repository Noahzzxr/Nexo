import { useState } from 'react'
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

const formatDate = (value) => (value ? new Date(value).toLocaleDateString('pt-BR') : '-')

function ActivitiesPage() {
  const { addToast } = useToast()
  const { currentUser, isAdmin, isStudent, isTeacher, refreshSchoolData, roleLabel, schoolData } = useSession()
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [submissionFile, setSubmissionFile] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [assignmentFile, setAssignmentFile] = useState(null)
  const [assignmentForm, setAssignmentForm] = useState({ classId: '', description: '', dueDate: '', subjectId: '', title: '' })

  const completedIds = new Set(schoolData.submissions.filter((item) => item.student_id === currentUser.id && item.status === 'completed').map((item) => item.assignment_id))
  const pending = schoolData.assignments.filter((assignment) => !completedIds.has(assignment.id))
  const canCreateAssignments = isTeacher || isAdmin

  const handleSubmission = async (event) => {
    event.preventDefault()
    if (!selectedActivity || !submissionFile) {
      addToast({ title: 'Arquivo obrigatorio', message: 'Selecione uma foto antes de confirmar.' })
      return
    }

    setIsSubmitting(true)
    try {
      await createStudentSubmission({ assignment: selectedActivity, file: submissionFile, studentId: currentUser.id })
      await refreshSchoolData()
      setSelectedActivity(null)
      setSubmissionFile(null)
      addToast({ title: 'Entrega confirmada', message: 'Atividade enviada ao banco.' })
    } catch (error) {
      addToast({ title: 'Falha na entrega', message: error.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCreateAssignment = async (event) => {
    event.preventDefault()
    try {
      await createAssignment({ assignment: assignmentForm, file: assignmentFile })
      await refreshSchoolData()
      setAssignmentFile(null)
      setAssignmentForm({ classId: '', description: '', dueDate: '', subjectId: '', title: '' })
      addToast({ title: 'Atividade criada', message: 'Atividade salva no banco.' })
    } catch (error) {
      addToast({ title: 'Erro ao criar atividade', message: error.message })
    }
  }

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-black uppercase text-alert-coral">Atividades</p>
        <h1 className="mt-1 text-3xl font-black text-brand-ink">Tarefas e Avaliacoes</h1>
        <p className="mt-2 text-muted">Dados carregados do banco. Perfil ativo: {roleLabel}.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card><ListChecks className="h-6 w-6 text-brand-royal" /><p className="mt-4 text-sm font-black uppercase text-muted">Total</p><p className="mt-2 text-4xl font-black text-brand-ink">{schoolData.assignments.length}</p></Card>
        <Card><ClipboardCheck className="h-6 w-6 text-success" /><p className="mt-4 text-sm font-black uppercase text-muted">Concluidas</p><p className="mt-2 text-4xl font-black text-brand-ink">{completedIds.size}</p></Card>
        <Card><Clock className="h-6 w-6 text-alert-coral" /><p className="mt-4 text-sm font-black uppercase text-muted">Pendentes</p><p className="mt-2 text-4xl font-black text-brand-ink">{pending.length}</p></Card>
      </div>

      {canCreateAssignments ? (
        <Card>
          <div className="mb-5"><p className="text-sm font-black uppercase text-alert-coral">Professor</p><h2 className="mt-1 text-xl font-black text-brand-ink">Adicionar atividade</h2></div>
          <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-5" onSubmit={handleCreateAssignment}>
            <InputField as="select" label="Turma" name="classId" onChange={(event) => setAssignmentForm((current) => ({ ...current, classId: event.target.value }))} options={[{ label: 'Selecione', value: '' }, ...schoolData.classes.map((item) => ({ label: item.name, value: item.id }))]} required value={assignmentForm.classId} />
            <InputField as="select" label="Disciplina" name="subjectId" onChange={(event) => setAssignmentForm((current) => ({ ...current, subjectId: event.target.value }))} options={[{ label: 'Selecione', value: '' }, ...schoolData.subjects.map((item) => ({ label: item.name, value: item.id }))]} required value={assignmentForm.subjectId} />
            <InputField label="Titulo" name="title" onChange={(event) => setAssignmentForm((current) => ({ ...current, title: event.target.value }))} required value={assignmentForm.title} />
            <InputField label="Prazo" name="dueDate" onChange={(event) => setAssignmentForm((current) => ({ ...current, dueDate: event.target.value }))} type="datetime-local" value={assignmentForm.dueDate} />
            <label className="block text-sm font-semibold text-brand-ink"><span>Anexo</span><input className="mt-2 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm" onChange={(event) => setAssignmentFile(event.target.files?.[0] || null)} type="file" /></label>
            <InputField as="textarea" className="md:col-span-2 xl:col-span-4" label="Descricao" name="description" onChange={(event) => setAssignmentForm((current) => ({ ...current, description: event.target.value }))} value={assignmentForm.description} />
            <Button className="self-end" icon={PlusCircle} type="submit" variant="royal">Criar</Button>
          </form>
        </Card>
      ) : null}

      <Card>
        <div className="mb-5"><p className="text-sm font-black uppercase text-alert-coral">Lista</p><h2 className="mt-1 text-xl font-black text-brand-ink">Atividades do banco</h2></div>
        <Table columns={['Turma', 'Disciplina', 'Atividade', 'Prazo', 'Status', 'Acao']}>
          {schoolData.assignments.map((activity) => {
            const subject = schoolData.subjects.find((item) => item.id === activity.subject_id)
            const schoolClass = schoolData.classes.find((item) => item.id === activity.class_id)
            const done = completedIds.has(activity.id)
            return (
              <tr className="bg-white even:bg-slate-50" key={activity.id}>
                <td className="px-4 py-4 font-black text-brand-ink">{schoolClass?.name || '-'}</td>
                <td className="px-4 py-4 text-copy">{subject?.name || '-'}</td>
                <td className="px-4 py-4 text-copy">{activity.title}</td>
                <td className="px-4 py-4 text-muted">{formatDate(activity.due_date)}</td>
                <td className="px-4 py-4"><Badge tone={done ? 'success' : 'warning'}>{done ? 'Concluida' : 'Pendente'}</Badge></td>
                <td className="px-4 py-4"><Button disabled={!isStudent || done} icon={done ? ClipboardCheck : ArrowRight} onClick={() => setSelectedActivity(activity)} variant={done ? 'success' : 'royal'}>{done ? 'Enviada' : 'Entregar'}</Button></td>
              </tr>
            )
          })}
        </Table>
      </Card>

      {selectedActivity ? (
        <Modal onClose={() => setSelectedActivity(null)} title="Enviar atividade">
          <form className="grid gap-4" onSubmit={handleSubmission}>
            <p className="rounded-lg bg-page p-4 font-black text-brand-ink">{selectedActivity.title}</p>
            <label className="block text-sm font-semibold text-brand-ink"><span>Foto da atividade resolvida</span><input accept="image/*" className="mt-2 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm" onChange={(event) => setSubmissionFile(event.target.files?.[0] || null)} type="file" /></label>
            <Button disabled={isSubmitting} icon={ImageUp} type="submit" variant="coral">{isSubmitting ? 'Enviando...' : 'Confirmar entrega'}</Button>
          </form>
        </Modal>
      ) : null}
    </div>
  )
}

export default ActivitiesPage
