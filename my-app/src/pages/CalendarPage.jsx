import { useState } from 'react'
import { PlusCircle } from 'lucide-react'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import InputField from '../components/ui/InputField'
import { useSession } from '../hooks/useSession'
import { useToast } from '../hooks/useToast'
import { createCalendarEvent } from '../services/schoolService'

function CalendarPage() {
  const { addToast } = useToast()
  const { isAdmin, isTeacher, refreshSchoolData, schoolData } = useSession()
  const [eventForm, setEventForm] = useState({ class_id: '', event_type: 'activity', start_date: '', title: '' })
  const canCreate = isTeacher || isAdmin

  const handleCreateEvent = async (event) => {
    event.preventDefault()
    try {
      await createCalendarEvent(eventForm)
      setEventForm({ class_id: '', event_type: 'activity', start_date: '', title: '' })
      await refreshSchoolData()
      addToast({ title: 'Evento cadastrado', message: 'Compromisso salvo no banco.' })
    } catch (error) {
      addToast({ title: 'Erro ao criar evento', message: error.message })
    }
  }

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-black uppercase text-alert-coral">Calendario escolar</p>
        <h1 className="mt-1 text-3xl font-black text-brand-ink">Agenda</h1>
        <p className="mt-2 text-muted">Eventos carregados da tabela calendar_events.</p>
      </div>

      {canCreate ? (
        <Card>
          <form className="grid gap-4 md:grid-cols-[1fr_180px_220px_auto]" onSubmit={handleCreateEvent}>
            <InputField label="Titulo" name="title" onChange={(event) => setEventForm((current) => ({ ...current, title: event.target.value }))} required value={eventForm.title} />
            <InputField as="select" label="Tipo" name="type" onChange={(event) => setEventForm((current) => ({ ...current, event_type: event.target.value }))} options={[{ label: 'Atividade', value: 'activity' }, { label: 'Avaliacao', value: 'exam' }, { label: 'Feriado', value: 'holiday' }]} value={eventForm.event_type} />
            <InputField label="Data e hora" name="start" onChange={(event) => setEventForm((current) => ({ ...current, start_date: event.target.value }))} required type="datetime-local" value={eventForm.start_date} />
            <Button className="self-end" icon={PlusCircle} type="submit" variant="royal">Cadastrar</Button>
            <InputField as="select" className="md:col-span-4" label="Turma" name="classId" onChange={(event) => setEventForm((current) => ({ ...current, class_id: event.target.value }))} options={[{ label: 'Selecione', value: '' }, ...schoolData.classes.map((item) => ({ label: item.name, value: item.id }))]} required value={eventForm.class_id} />
          </form>
        </Card>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {schoolData.calendarEvents.map((item) => {
          const schoolClass = schoolData.classes.find((schoolClassItem) => schoolClassItem.id === item.class_id)
          return (
            <Card key={item.id}>
              <Badge tone={item.event_type === 'exam' ? 'coral' : item.event_type === 'activity' ? 'success' : 'royal'}>{item.event_type}</Badge>
              <h2 className="mt-4 font-black text-brand-ink">{item.title}</h2>
              <p className="mt-2 text-sm text-muted">{new Date(item.start_date).toLocaleString('pt-BR')}</p>
              <p className="mt-1 text-sm text-muted">{schoolClass?.name || 'Turma nao informada'}</p>
            </Card>
          )
        })}
        {!schoolData.calendarEvents.length ? <p className="rounded-lg bg-white p-4 text-sm text-muted">Nenhum evento cadastrado.</p> : null}
      </div>
    </div>
  )
}

export default CalendarPage
