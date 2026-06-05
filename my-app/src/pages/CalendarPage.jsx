import { useState } from 'react'
import { ChevronLeft, ChevronRight, Edit3, PlusCircle, X } from 'lucide-react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import InputField from '../components/ui/InputField'
import { useSession } from '../hooks/useSession'
import { useToast } from '../hooks/useToast'
import { createCalendarEvent, updateCalendarEvent } from '../services/schoolService'

const colorOptions = [
  { label: 'Roxo - feriado', value: '#7c3aed' },
  { label: 'Vermelho - prova', value: '#dc2626' },
  { label: 'Azul - atividade', value: '#2563eb' },
  { label: 'Verde - reuniao', value: '#16a34a' },
  { label: 'Amarelo - aviso', value: '#ca8a04' },
]

const eventTypeOptions = [
  { label: 'Atividade', value: 'activity' },
  { label: 'Prova', value: 'exam' },
  { label: 'Feriado', value: 'holiday' },
  { label: 'Reuniao', value: 'meeting' },
  { label: 'Aviso', value: 'notice' },
]

const emptyEventForm = {
  class_id: '',
  color: '#2563eb',
  event_type: 'activity',
  start_date: '',
  title: '',
}

function formatDateTimeInput(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return offsetDate.toISOString().slice(0, 16)
}

const monthFormatter = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' })
const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']

function getDateKey(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toISOString().slice(0, 10)
}

function buildCalendarDays(currentMonth) {
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const firstDay = new Date(year, month, 1)
  const startDate = new Date(firstDay)
  startDate.setDate(firstDay.getDate() - firstDay.getDay())

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + index)
    return {
      date,
      isCurrentMonth: date.getMonth() === month,
      key: date.toISOString().slice(0, 10),
    }
  })
}

function CalendarPage() {
  const { addToast } = useToast()
  const { currentUser, isAdmin, isTeacher, refreshSchoolData, schoolData } = useSession()
  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date()
    return new Date(today.getFullYear(), today.getMonth(), 1)
  })
  const [editingEventId, setEditingEventId] = useState(null)
  const [eventForm, setEventForm] = useState(emptyEventForm)
  const canManage = isTeacher || isAdmin
  const teacherClassIds = schoolData.teacherSubjects.filter((item) => item.teacher_id === currentUser.id).map((item) => item.class_id)
  const manageableClasses = isAdmin ? schoolData.classes : schoolData.classes.filter((item) => teacherClassIds.includes(item.id))
  const classOptions = [{ label: 'Evento geral', value: '' }, ...manageableClasses.map((item) => ({ label: item.name, value: item.id }))]
  const calendarDays = buildCalendarDays(currentMonth)
  const todayKey = new Date().toISOString().slice(0, 10)
  const eventsByDay = schoolData.calendarEvents.reduce((accumulator, item) => {
    const key = getDateKey(item.start_date)
    if (!key) return accumulator
    return { ...accumulator, [key]: [...(accumulator[key] || []), item] }
  }, {})

  const changeMonth = (step) => {
    setCurrentMonth((date) => new Date(date.getFullYear(), date.getMonth() + step, 1))
  }

  const resetForm = () => {
    setEditingEventId(null)
    setEventForm(emptyEventForm)
  }

  const handleSubmitEvent = async (event) => {
    event.preventDefault()

    try {
      if (editingEventId) {
        await updateCalendarEvent(editingEventId, eventForm)
        addToast({ title: 'Evento atualizado', message: 'Calendario alterado com sucesso.' })
      } else {
        await createCalendarEvent(eventForm)
        addToast({ title: 'Evento cadastrado', message: 'Compromisso salvo no banco.' })
      }

      resetForm()
      await refreshSchoolData()
    } catch (error) {
      addToast({ title: editingEventId ? 'Erro ao editar evento' : 'Erro ao criar evento', message: error.message })
    }
  }

  const handleEditEvent = (item) => {
    setEditingEventId(item.id)
    setEventForm({
      class_id: item.class_id || '',
      color: item.color || '#2563eb',
      event_type: item.event_type || 'activity',
      start_date: formatDateTimeInput(item.start_date),
      title: item.title || '',
    })
  }

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-black uppercase text-alert-coral">Calendario escolar</p>
        <h1 className="mt-1 text-3xl font-black text-brand-ink">Agenda</h1>
        <p className="mt-2 text-muted">Professores e administradores podem criar e editar feriados, provas e atividades.</p>
      </div>

      {canManage ? (
        <Card>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-black uppercase text-alert-coral">{editingEventId ? 'Editar evento' : 'Novo evento'}</p>
              <h2 className="mt-1 text-xl font-black text-brand-ink">Calendario da escola</h2>
            </div>
            {editingEventId ? (
              <Button icon={X} onClick={resetForm} type="button" variant="ghost">
                Cancelar edicao
              </Button>
            ) : null}
          </div>

          <form className="grid gap-4 lg:grid-cols-[1fr_170px_220px_220px_auto]" onSubmit={handleSubmitEvent}>
            <InputField label="Titulo" name="title" onChange={(event) => setEventForm((current) => ({ ...current, title: event.target.value }))} required value={eventForm.title} />
            <InputField as="select" label="Tipo" name="type" onChange={(event) => setEventForm((current) => ({ ...current, event_type: event.target.value }))} options={eventTypeOptions} value={eventForm.event_type} />
            <InputField as="select" label="Cor" name="color" onChange={(event) => setEventForm((current) => ({ ...current, color: event.target.value }))} options={colorOptions} value={eventForm.color} />
            <InputField label="Data e hora" name="start" onChange={(event) => setEventForm((current) => ({ ...current, start_date: event.target.value }))} required type="datetime-local" value={eventForm.start_date} />
            <Button className="self-end" icon={editingEventId ? Edit3 : PlusCircle} type="submit" variant="royal">
              {editingEventId ? 'Salvar' : 'Cadastrar'}
            </Button>
            <InputField as="select" className="lg:col-span-5" label="Turma" name="classId" onChange={(event) => setEventForm((current) => ({ ...current, class_id: event.target.value }))} options={classOptions} value={eventForm.class_id} />
          </form>
        </Card>
      ) : null}

      <Card className="overflow-hidden p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-4">
          <div>
            <p className="text-sm font-black uppercase text-alert-coral">Calendario mensal</p>
            <h2 className="mt-1 text-2xl font-black capitalize text-brand-ink">{monthFormatter.format(currentMonth)}</h2>
          </div>
          <div className="flex gap-2">
            <Button icon={ChevronLeft} onClick={() => changeMonth(-1)} type="button" variant="ghost">
              Anterior
            </Button>
            <Button icon={ChevronRight} onClick={() => changeMonth(1)} type="button" variant="ghost">
              Proximo
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 border-b border-line bg-page">
          {weekDays.map((day) => (
            <div className="px-2 py-3 text-center text-xs font-black uppercase text-muted" key={day}>
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {calendarDays.map((day) => {
            const dayEvents = eventsByDay[day.key] || []

            return (
              <div
                className={`min-h-28 border-b border-r border-line p-2 ${day.isCurrentMonth ? 'bg-white' : 'bg-slate-50 text-muted'} ${day.key === todayKey ? 'ring-2 ring-inset ring-brand-royal' : ''}`}
                key={day.key}
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className={`grid h-7 w-7 place-items-center rounded-lg text-sm font-black ${day.key === todayKey ? 'bg-brand-royal text-white' : 'text-brand-ink'}`}>
                    {day.date.getDate()}
                  </span>
                  {dayEvents.length ? <span className="text-xs font-black text-muted">{dayEvents.length}</span> : null}
                </div>

                <div className="grid gap-1">
                  {dayEvents.slice(0, 3).map((item) => {
                    const schoolClass = schoolData.classes.find((schoolClassItem) => schoolClassItem.id === item.class_id)
                    const eventColor = item.color || (item.event_type === 'exam' ? '#dc2626' : item.event_type === 'holiday' ? '#7c3aed' : '#2563eb')

                    return (
                      <button
                        className="w-full rounded-md px-2 py-1 text-left text-[11px] font-black leading-tight text-white shadow-sm"
                        key={item.id}
                        onClick={() => (canManage ? handleEditEvent(item) : null)}
                        style={{ backgroundColor: eventColor }}
                        title={`${item.title} - ${schoolClass?.name || 'Evento geral'}`}
                        type="button"
                      >
                        <span className="block truncate">{item.title}</span>
                        <span className="block truncate text-white/80">{new Date(item.start_date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                      </button>
                    )
                  })}
                  {dayEvents.length > 3 ? <p className="text-xs font-bold text-muted">+{dayEvents.length - 3} eventos</p> : null}
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      <div className="flex flex-wrap gap-2">
        {colorOptions.map((option) => (
          <span className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-xs font-black text-brand-ink" key={option.value}>
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: option.value }} />
            {option.label}
          </span>
        ))}
      </div>
    </div>
  )
}

export default CalendarPage
