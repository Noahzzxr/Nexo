import { useState } from 'react'
import { PlusCircle } from 'lucide-react'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import InputField from '../components/ui/InputField'
import { useSession } from '../hooks/useSession'
import { useToast } from '../hooks/useToast'

const eventStyles = {
  Prova: 'bg-alert-coral text-white',
  Atividade: 'bg-success text-white',
  Evento: 'bg-brand-royal text-white',
}

const legend = [
  { label: 'Avaliações', tone: 'bg-alert-coral' },
  { label: 'Atividades', tone: 'bg-success' },
  { label: 'Eventos', tone: 'bg-brand-royal' },
]

function CalendarPage() {
  const { addToast } = useToast()
  const { calendarEvents, addCalendarEvent } = useSession()
  const [selectedDay, setSelectedDay] = useState(2) // Default to Day 2 (has initial exam)
  const [newEvent, setNewEvent] = useState({
    title: '',
    type: 'Atividade',
    time: '08:00',
  })

  const selectedEvents = calendarEvents.filter((event) => event.day === selectedDay)

  const handleCreateEvent = (event) => {
    event.preventDefault()

    if (!newEvent.title.trim()) {
      addToast({ title: 'Título obrigatório', message: 'Informe o título do compromisso.' })
      return
    }

    const eventData = {
      day: selectedDay,
      title: newEvent.title,
      type: newEvent.type,
      time: newEvent.time,
    }

    addCalendarEvent(eventData)
    setNewEvent({ title: '', type: 'Atividade', time: '08:00' })
    addToast({ title: 'Evento cadastrado', message: `Compromisso adicionado para o dia ${selectedDay}.` })
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase text-alert-coral">Calendário escolar</p>
          <h1 className="mt-1 text-3xl font-black text-brand-ink">Junho 2026</h1>
          <p className="mt-2 text-muted">Avaliações, atividades e eventos organizados de forma compacta e elegante.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Left Column: Calendar Grid */}
        <div className="grid gap-6">
          <Card className="p-0">
            <div className="grid grid-cols-7 border-b border-line bg-brand-ink text-center text-xs font-black uppercase text-white">
              {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((day) => (
                <div className="border-r border-white/10 px-2 py-3 last:border-r-0" key={day}>
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {Array.from({ length: 35 }).map((_, index) => {
                const day = index + 1
                const inMonth = day <= 30
                const events = calendarEvents.filter((event) => event.day === day)
                const isSelected = selectedDay === day

                return (
                  <button
                    className={`min-h-20 md:min-h-24 border-r border-t border-line p-2 text-left transition last:border-r-0 ${
                      !inMonth
                        ? 'bg-slate-50 text-slate-300'
                        : isSelected
                        ? 'bg-brand-royal-soft/50 ring-2 ring-inset ring-brand-royal'
                        : 'bg-white hover:bg-brand-royal-soft/30'
                    }`}
                    disabled={!inMonth}
                    key={index}
                    onClick={() => setSelectedDay(day)}
                    type="button"
                  >
                    {inMonth ? (
                      <span className={`text-xs font-black ${isSelected ? 'text-brand-royal' : 'text-brand-ink'}`}>
                        {day}
                      </span>
                    ) : null}
                    <div className="mt-1 grid gap-0.5 max-h-[64px] overflow-y-auto">
                      {events.map((evt, idx) => (
                        <span
                          className={`truncate rounded px-1 py-0.5 text-[10px] font-bold leading-none ${eventStyles[evt.type] || 'bg-slate-500 text-white'}`}
                          key={`${evt.title}-${idx}`}
                        >
                          {evt.title}
                        </span>
                      ))}
                    </div>
                  </button>
                )
              })}
            </div>
          </Card>

          <Card>
            <div className="flex flex-wrap items-center gap-4">
              {legend.map((item) => (
                <span className="flex items-center gap-2 text-sm font-bold text-copy" key={item.label}>
                  <span className={`h-3 w-3 rounded-full ${item.tone}`} />
                  {item.label}
                </span>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Sidebar (Details and Event Creation Form) */}
        <div className="grid gap-6 self-start">
          <Card>
            <div>
              <p className="text-xs font-black uppercase text-alert-coral">Dia {selectedDay}</p>
              <h2 className="mt-1 text-xl font-black text-brand-ink">Compromissos</h2>
            </div>
            
            <div className="mt-4 grid gap-2.5 max-h-[220px] overflow-y-auto pr-1">
              {selectedEvents.length ? (
                selectedEvents.map((event, idx) => (
                  <div className="rounded-lg border border-line p-3 text-left" key={`${event.title}-${idx}`}>
                    <Badge tone={event.type === 'Prova' ? 'coral' : event.type === 'Atividade' ? 'success' : 'royal'}>
                      {event.type}
                    </Badge>
                    <p className="mt-2 text-sm font-black text-brand-ink">{event.title}</p>
                    <p className="mt-0.5 text-xs text-muted">Horário: {event.time}</p>
                  </div>
                ))
              ) : (
                <p className="rounded-lg bg-page p-3 text-xs text-muted text-center">
                  Nenhum compromisso registrado para este dia.
                </p>
              )}
            </div>
          </Card>

          <Card>
            <div>
              <p className="text-xs font-black uppercase text-alert-coral">Novo Evento</p>
              <h2 className="mt-1 text-xl font-black text-brand-ink">Cadastrar no dia {selectedDay}</h2>
            </div>
            
            <form className="mt-4 grid gap-3" onSubmit={handleCreateEvent}>
              <InputField
                label="Título"
                name="title"
                onChange={(event) => setNewEvent((current) => ({ ...current, title: event.target.value }))}
                placeholder="Ex: Entrega de Biologia"
                required
                value={newEvent.title}
              />
              <InputField
                as="select"
                label="Tipo"
                name="type"
                onChange={(event) => setNewEvent((current) => ({ ...current, type: event.target.value }))}
                options={['Atividade', 'Prova', 'Evento']}
                value={newEvent.type}
              />
              <InputField
                label="Horário"
                name="time"
                onChange={(event) => setNewEvent((current) => ({ ...current, time: event.target.value }))}
                placeholder="Ex: 14:00"
                required
                value={newEvent.time}
              />
              <Button icon={PlusCircle} type="submit" variant="royal">
                Cadastrar
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default CalendarPage
