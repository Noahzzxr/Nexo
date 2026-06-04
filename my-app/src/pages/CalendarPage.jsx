import { useState } from 'react'
import { CalendarDays, X } from 'lucide-react'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { calendarEvents } from '../data/mockData'

const eventStyles = {
  Prova: 'bg-alert-coral text-white',
  Atividade: 'bg-success text-white',
  Evento: 'bg-brand-royal text-white',
}

const legend = [
  { label: 'Avaliacoes', tone: 'bg-alert-coral' },
  { label: 'Atividades', tone: 'bg-success' },
  { label: 'Eventos', tone: 'bg-brand-royal' },
]

function CalendarPage() {
  const [selectedDay, setSelectedDay] = useState(null)
  const selectedEvents = calendarEvents.filter((event) => event.day === selectedDay)

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase text-alert-coral">Calendario escolar</p>
          <h1 className="mt-1 text-3xl font-black text-brand-ink">Junho 2026</h1>
          <p className="mt-2 text-muted">Avaliacoes, atividades e eventos organizados em tela cheia.</p>
        </div>
        <Button icon={CalendarDays} variant="royal">
          Exportar agenda
        </Button>
      </div>

      <Card className="p-0">
        <div className="grid grid-cols-7 border-b border-line bg-brand-ink text-center text-xs font-black uppercase text-white">
          {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'].map((day) => (
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

            return (
              <button
                className={`min-h-32 border-r border-t border-line p-2 text-left transition last:border-r-0 hover:bg-brand-royal-soft ${
                  !inMonth ? 'bg-slate-50 text-slate-300' : 'bg-white'
                }`}
                disabled={!inMonth}
                key={index}
                onClick={() => setSelectedDay(day)}
                type="button"
              >
                {inMonth ? <span className="text-sm font-black text-brand-ink">{day}</span> : null}
                <div className="mt-2 grid gap-1">
                  {events.map((event) => (
                    <span className={`truncate rounded-md px-2 py-1 text-xs font-bold ${eventStyles[event.type]}`} key={event.title}>
                      {event.title}
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

      {selectedDay ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-brand-ink/60 px-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-panel">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase text-alert-coral">Dia {selectedDay}</p>
                <h2 className="mt-1 text-2xl font-black text-brand-ink">Detalhes da agenda</h2>
              </div>
              <button
                aria-label="Fechar calendario"
                className="grid h-9 w-9 place-items-center rounded-lg text-muted transition hover:bg-slate-100 hover:text-brand-ink"
                onClick={() => setSelectedDay(null)}
                type="button"
              >
                <X aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-5 grid gap-3">
              {selectedEvents.length ? (
                selectedEvents.map((event) => (
                  <div className="rounded-lg border border-line p-4" key={event.title}>
                    <Badge tone={event.type === 'Prova' ? 'coral' : event.type === 'Atividade' ? 'success' : 'royal'}>{event.type}</Badge>
                    <p className="mt-3 font-black text-brand-ink">{event.title}</p>
                    <p className="mt-1 text-sm text-muted">Horario: {event.time}</p>
                  </div>
                ))
              ) : (
                <p className="rounded-lg bg-page p-4 text-sm text-muted">Nenhum compromisso registrado para este dia.</p>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default CalendarPage
