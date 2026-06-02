import { useEffect, useMemo, useState } from 'react'
import { Paperclip, Search, Send } from 'lucide-react'
import Avatar from '../components/ui/Avatar'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { useSession } from '../hooks/useSession'
import { useToast } from '../hooks/useToast'
import { fetchMessages, sendMessage } from '../services/schoolService'
import { adminUsers, conversations, studentProfile } from '../data/mockData'

const teacherIds = [
  '22222222-2222-4222-8222-222222222222',
  '44444444-4444-4444-8444-444444444444',
  '55555555-5555-4555-8555-555555555555',
  '66666666-6666-4666-8666-666666666666',
]

const getContactList = (isTeacher, isAdmin) => {
  if (isTeacher) {
    return adminUsers
      .filter((user) => user.role === 'student')
      .map((user) => ({
        avatar: studentProfile.avatar,
        id: user.id,
        messages: [
          { from: 'contact', text: 'Professor, revisei a atividade e enviei a foto.', time: '08:40' },
          { from: 'self', text: 'Recebido. Vou corrigir ainda hoje.', time: '08:45' },
        ],
        name: user.fullname,
        online: true,
        subject: '9o ano B',
      }))
  }

  if (isAdmin) {
    return adminUsers.map((user) => ({
      avatar: user.role === 'student' ? studentProfile.avatar : 'https://i.pravatar.cc/120?img=3',
      id: user.id,
      messages: [{ from: 'contact', text: 'Aguardando orientacao administrativa.', time: '09:00' }],
      name: user.fullname,
      online: user.role !== 'student',
      subject: user.role,
    }))
  }

  return conversations.map((conversation, index) => ({
    ...conversation,
    id: teacherIds[index] || teacherIds[0],
    messages: conversation.messages.map((message) => ({
      ...message,
      from: message.from === 'student' ? 'self' : 'contact',
    })),
  }))
}

function ConversationsPage() {
  const { addToast } = useToast()
  const { currentUser, isAdmin, isSupabaseConfigured, isTeacher, roleLabel } = useSession()
  const contacts = useMemo(() => getContactList(isTeacher, isAdmin), [isAdmin, isTeacher])
  const [activeIndex, setActiveIndex] = useState(0)
  const [messageText, setMessageText] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [messageMap, setMessageMap] = useState(() =>
    Object.fromEntries(contacts.map((contact) => [contact.id, contact.messages])),
  )
  const active = contacts[activeIndex] || contacts[0]
  const activeMessages = messageMap[active.id] || active.messages || []
  const filteredContacts = contacts.filter((contact) =>
    `${contact.name} ${contact.subject}`.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  useEffect(() => {
    async function loadMessages() {
      if (!isSupabaseConfigured || !active?.id) return

      try {
        const remoteMessages = await fetchMessages({ receiverId: active.id, senderId: currentUser.id })
        if (!remoteMessages.length) return

        setMessageMap((current) => ({
          ...current,
          [active.id]: remoteMessages.map((message) => ({
            from: message.sender_id === currentUser.id ? 'self' : 'contact',
            text: message.content,
            time: new Date(message.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          })),
        }))
      } catch (error) {
        addToast({ title: 'Erro ao carregar mensagens', message: error.message })
      }
    }

    loadMessages()
  }, [active?.id, addToast, currentUser.id, isSupabaseConfigured])

  const handleSendMessage = async (event) => {
    event.preventDefault()
    const content = messageText.trim()

    if (!content) return

    setMessageText('')

    try {
      const created = await sendMessage({
        content,
        receiverId: active.id,
        senderId: currentUser.id,
      })
      setMessageMap((current) => ({
        ...current,
        [active.id]: [
          ...(current[active.id] || []),
          {
            from: 'self',
            text: created.content,
            time: new Date(created.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          },
        ],
      }))
    } catch (error) {
      addToast({ title: 'Erro ao enviar mensagem', message: error.message })
    }
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase text-alert-coral">Conversas</p>
          <h1 className="mt-1 text-3xl font-black text-brand-ink">Chat com Professor</h1>
          <p className="mt-2 text-muted">Mensagens academicas privadas com envio rapido. Perfil ativo: {roleLabel}.</p>
        </div>
        <Button
          icon={Send}
          onClick={() => addToast({ title: 'Nova conversa', message: 'Selecione um contato na lista para iniciar a troca privada.' })}
          variant="royal"
        >
          Nova conversa
        </Button>
      </div>

      <div className="grid min-h-[680px] gap-6 lg:grid-cols-[340px_1fr]">
        <Card className="p-0">
          <div className="border-b border-line p-4">
            <label className="flex h-11 items-center gap-2 rounded-lg border border-line bg-page px-3 text-sm text-muted focus-within:border-brand-royal focus-within:ring-2 focus-within:ring-brand-royal-soft">
              <Search aria-hidden="true" className="h-4 w-4" />
              <input
                className="min-w-0 flex-1 bg-transparent text-slate-800 outline-none placeholder:text-slate-500"
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Buscar contato"
                type="search"
                value={searchTerm}
              />
            </label>
          </div>
          <div className="grid gap-1 p-3">
            <p className="px-2 py-2 text-xs font-black uppercase text-success">Online</p>
            {filteredContacts
              .map((conversation) => ({ conversation, index: contacts.findIndex((contact) => contact.id === conversation.id) }))
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
            {filteredContacts
              .map((conversation) => ({ conversation, index: contacts.findIndex((contact) => contact.id === conversation.id) }))
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
              {activeMessages.map((message, index) => {
                const sentByCurrentUser = message.from === 'self'

                return (
                  <div className={`flex items-end gap-3 ${sentByCurrentUser ? 'justify-end' : 'justify-start'}`} key={`${message.time}-${index}`}>
                    {!sentByCurrentUser ? <Avatar image={active.avatar} name={active.name} size="sm" /> : null}
                    <div
                      className={`max-w-[78%] rounded-xl px-4 py-3 text-sm leading-6 shadow-sm ${
                        sentByCurrentUser ? 'bg-brand-royal text-white' : 'bg-white text-copy'
                      }`}
                    >
                      <p>{message.text}</p>
                      <p className={`mt-2 text-xs font-bold ${sentByCurrentUser ? 'text-white/80' : 'text-slate-600'}`}>{message.time}</p>
                    </div>
                    {sentByCurrentUser ? <Avatar image={studentProfile.avatar} name={currentUser.fullname} size="sm" /> : null}
                  </div>
                )
              })}
            </div>
          </div>

          <form className="flex gap-3 border-t border-line p-4" onSubmit={handleSendMessage}>
            <button
              aria-label="Anexar arquivo"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-line text-muted transition hover:border-brand-royal hover:text-brand-royal"
              type="button"
            >
              <Paperclip aria-hidden="true" className="h-5 w-5" />
            </button>
            <input
              className="min-w-0 flex-1 rounded-lg border border-line px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-brand-royal focus:ring-2 focus:ring-brand-royal-soft"
              onChange={(event) => setMessageText(event.target.value)}
              placeholder="Mensagem..."
              type="text"
              value={messageText}
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
