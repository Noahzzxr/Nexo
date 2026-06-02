import { useState } from 'react'
import { Paperclip, Search, Send } from 'lucide-react'
import Avatar from '../components/ui/Avatar'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { conversations, studentProfile } from '../data/mockData'

function ConversationsPage() {
  const [activeIndex, setActiveIndex] = useState(0)
  const active = conversations[activeIndex]

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase text-alert-coral">Conversas</p>
          <h1 className="mt-1 text-3xl font-black text-brand-ink">Chat com Professor</h1>
          <p className="mt-2 text-muted">Mensagens academicas com historico, status e envio rapido.</p>
        </div>
        <Button icon={Send} variant="royal">
          Nova conversa
        </Button>
      </div>

      <div className="grid min-h-[680px] gap-6 lg:grid-cols-[340px_1fr]">
        <Card className="p-0">
          <div className="border-b border-line p-4">
            <label className="flex h-11 items-center gap-2 rounded-lg border border-line bg-page px-3 text-sm text-muted focus-within:border-brand-royal focus-within:ring-2 focus-within:ring-brand-royal-soft">
              <Search aria-hidden="true" className="h-4 w-4" />
              <input className="min-w-0 flex-1 bg-transparent outline-none" placeholder="Buscar contato" type="search" />
            </label>
          </div>
          <div className="grid gap-1 p-3">
            <p className="px-2 py-2 text-xs font-black uppercase text-success">Online</p>
            {conversations
              .map((conversation, index) => ({ conversation, index }))
              .filter(({ conversation }) => conversation.online)
              .map(({ conversation, index }) => (
                <button
                  className={`flex w-full items-center gap-3 rounded-lg p-3 text-left transition ${
                    index === activeIndex ? 'bg-brand-royal text-white' : 'hover:bg-brand-royal-soft'
                  }`}
                  key={conversation.name}
                  onClick={() => setActiveIndex(index)}
                  type="button"
                >
                  <Avatar image={conversation.avatar} name={conversation.name} size="sm" status="online" />
                  <span className="min-w-0 flex-1">
                    <span className={`block truncate font-black ${index === activeIndex ? 'text-white' : 'text-brand-ink'}`}>
                      {conversation.name}
                    </span>
                    <span className={`block truncate text-sm ${index === activeIndex ? 'text-white/75' : 'text-muted'}`}>
                      {conversation.subject}
                    </span>
                  </span>
                </button>
              ))}
            <p className="mt-3 px-2 py-2 text-xs font-black uppercase text-muted">Offline</p>
            {conversations
              .map((conversation, index) => ({ conversation, index }))
              .filter(({ conversation }) => !conversation.online)
              .map(({ conversation, index }) => (
                <button
                  className={`flex w-full items-center gap-3 rounded-lg p-3 text-left transition ${
                    index === activeIndex ? 'bg-brand-royal text-white' : 'hover:bg-brand-royal-soft'
                  }`}
                  key={conversation.name}
                  onClick={() => setActiveIndex(index)}
                  type="button"
                >
                  <Avatar image={conversation.avatar} name={conversation.name} size="sm" status="offline" />
                  <span className="min-w-0 flex-1">
                    <span className={`block truncate font-black ${index === activeIndex ? 'text-white' : 'text-brand-ink'}`}>
                      {conversation.name}
                    </span>
                    <span className={`block truncate text-sm ${index === activeIndex ? 'text-white/75' : 'text-muted'}`}>
                      {conversation.subject}
                    </span>
                  </span>
                </button>
              ))}
          </div>
        </Card>

        <Card className="flex min-h-0 flex-col p-0">
          <div className="flex items-center justify-between gap-4 border-b border-line p-4">
            <div className="flex min-w-0 items-center gap-3">
              <Avatar image={active.avatar} name={active.name} size="md" status={active.online ? 'online' : 'offline'} />
              <div className="min-w-0">
                <p className="truncate font-black text-brand-ink">{active.name}</p>
                <p className="truncate text-sm text-muted">{active.subject}</p>
              </div>
            </div>
            <Badge tone={active.online ? 'success' : 'neutral'}>{active.online ? 'Online' : 'Offline'}</Badge>
          </div>

          <div className="scrollbar-thin flex-1 overflow-y-auto bg-page p-5">
            <div className="grid gap-4">
              {active.messages.map((message, index) => {
                const sentByStudent = message.from === 'student'

                return (
                  <div className={`flex items-end gap-3 ${sentByStudent ? 'justify-end' : 'justify-start'}`} key={`${message.time}-${index}`}>
                    {!sentByStudent ? <Avatar image={active.avatar} name={active.name} size="sm" /> : null}
                    <div
                      className={`max-w-[78%] rounded-xl px-4 py-3 text-sm leading-6 shadow-sm ${
                        sentByStudent ? 'bg-brand-royal text-white' : 'bg-white text-copy'
                      }`}
                    >
                      <p>{message.text}</p>
                      <p className={`mt-2 text-xs font-bold ${sentByStudent ? 'text-white/70' : 'text-muted'}`}>{message.time}</p>
                    </div>
                    {sentByStudent ? <Avatar image={studentProfile.avatar} name={studentProfile.name} size="sm" /> : null}
                  </div>
                )
              })}
            </div>
          </div>

          <form className="flex gap-3 border-t border-line p-4" onSubmit={(event) => event.preventDefault()}>
            <button
              aria-label="Anexar arquivo"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-line text-muted transition hover:border-brand-royal hover:text-brand-royal"
              type="button"
            >
              <Paperclip aria-hidden="true" className="h-5 w-5" />
            </button>
            <input
              className="min-w-0 flex-1 rounded-lg border border-line px-4 text-sm outline-none transition focus:border-brand-royal focus:ring-2 focus:ring-brand-royal-soft"
              placeholder="Mensagem..."
              type="text"
            />
            <Button icon={Send} type="submit" variant="primary">
              Enviar
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}

export default ConversationsPage
