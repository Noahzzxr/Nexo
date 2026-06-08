import { useEffect, useMemo, useRef, useState } from 'react'
import { Search, Send, Trash2 } from 'lucide-react'
import Avatar from '../components/ui/Avatar'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Modal from '../components/ui/Modal'
import { roles } from '../context/roles'
import { useSession } from '../hooks/useSession'
import { useToast } from '../hooks/useToast'
import { supabase } from '../lib/supabase'
import { clearChatMessages, reactToMessage, sendMessage } from '../services/schoolService'

const availableReactions = ['👍', '❤️', '😊', '🎉', '👏', '😢']
const makeTemporaryMessageId = () => `pending-${globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`}`

function getReactionSummary(reactions, profiles) {
  return availableReactions
    .map((emoji) => {
      const emojiReactions = reactions.filter((reaction) => reaction.emoji === emoji)
      return {
        emoji,
        names: emojiReactions.map((reaction) => profiles.find((profile) => profile.id === reaction.student_id)?.fullname || 'Aluno'),
        total: emojiReactions.length,
      }
    })
    .filter((item) => item.total > 0)
}

function ConversationsPage() {
  const { addToast } = useToast()
  const { currentUser, isAdmin, isStudent, isTeacher, refreshSchoolData, roleLabel, schoolData } = useSession()
  const [activeId, setActiveId] = useState('')
  const [clearedMessageIds, setClearedMessageIds] = useState([])
  const [isClearingChat, setIsClearingChat] = useState(false)
  const [isReactingTo, setIsReactingTo] = useState('')
  const [liveMessages, setLiveMessages] = useState([])
  const [liveReactions, setLiveReactions] = useState([])
  const [messageText, setMessageText] = useState('')
  const [optimisticMessages, setOptimisticMessages] = useState([])
  const [showClearChatModal, setShowClearChatModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const chatScrollRef = useRef(null)

  useEffect(() => {
    if (!supabase || !currentUser?.id) return undefined

    const channel = supabase
      .channel(`school-notices:${currentUser.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        ({ new: message }) => {
          if (message.sender_id !== currentUser.id && message.receiver_id !== currentUser.id) return
          setLiveMessages((current) => (current.some((item) => item.id === message.id) ? current : [...current, message]))
          setOptimisticMessages((current) => current.filter((item) => item.id !== message.id))
        },
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'message_reactions',
        },
        ({ new: reaction }) => {
          if (!reaction?.id) return
          setLiveReactions((current) => {
            const withoutCurrent = current.filter((item) => item.id !== reaction.id && !(item.message_id === reaction.message_id && item.student_id === reaction.student_id))
            return [...withoutCurrent, reaction]
          })
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [currentUser?.id])

  const contacts = useMemo(() => {
    if (isAdmin) return schoolData.profiles.filter((profile) => profile.id !== currentUser.id)
    if (isTeacher) {
      const classIds = schoolData.teacherSubjects.filter((item) => item.teacher_id === currentUser.id).map((item) => item.class_id)
      const studentIds = schoolData.enrollments.filter((item) => classIds.includes(item.class_id)).map((item) => item.student_id)
      return schoolData.students.filter((student) => studentIds.includes(student.id))
    }
    return schoolData.teachers
  }, [currentUser.id, isAdmin, isTeacher, schoolData])

  const filteredContacts = contacts.filter((contact) => `${contact.fullname} ${contact.email}`.toLowerCase().includes(searchTerm.toLowerCase()))
  const active = contacts.find((contact) => contact.id === activeId) || contacts[0]

  const messages = useMemo(() => {
    const mergedMessages = [...schoolData.messages, ...liveMessages, ...optimisticMessages]
    const messagesById = new Map(mergedMessages.map((message) => [message.id, message]))

    return [...messagesById.values()].sort(
      (first, second) => new Date(first.created_at).getTime() - new Date(second.created_at).getTime(),
    )
  }, [liveMessages, optimisticMessages, schoolData.messages])

  const reactions = useMemo(() => {
    const mergedReactions = [...schoolData.messageReactions, ...liveReactions]
    const reactionsByStudentAndMessage = new Map(mergedReactions.map((reaction) => [`${reaction.message_id}:${reaction.student_id}`, reaction]))
    return [...reactionsByStudentAndMessage.values()]
  }, [liveReactions, schoolData.messageReactions])

  const activeMessages = active
    ? messages.filter(
        (message) =>
          !clearedMessageIds.includes(message.id) &&
          ((message.sender_id === currentUser.id && message.receiver_id === active.id) ||
            (message.sender_id === active.id && message.receiver_id === currentUser.id)),
      )
    : []

  useEffect(() => {
    const chatScroll = chatScrollRef.current
    if (!chatScroll) return
    chatScroll.scrollTop = chatScroll.scrollHeight
  }, [active?.id, activeMessages.length])

  const handleClearChat = async () => {
    if (!active || !activeMessages.length || isStudent) return

    const messageIdsToClear = activeMessages.map((message) => message.id)
    setIsClearingChat(true)

    try {
      await clearChatMessages(active.id)
      setClearedMessageIds((current) => [...new Set([...current, ...messageIdsToClear])])
      setLiveMessages((current) => current.filter((message) => !messageIdsToClear.includes(message.id)))
      setOptimisticMessages((current) => current.filter((message) => !messageIdsToClear.includes(message.id)))
      setShowClearChatModal(false)
      await refreshSchoolData()
      addToast({ title: 'Comunicados apagados', message: `Mensagens com ${active.fullname} foram apagadas.` })
    } catch (error) {
      addToast({ title: 'Erro ao apagar comunicados', message: error.message })
    } finally {
      setIsClearingChat(false)
    }
  }

  const handleSendMessage = async (event) => {
    event.preventDefault()
    if (!isTeacher) return

    const content = messageText.trim()
    if (!content || !active) return

    const temporaryId = makeTemporaryMessageId()
    const pendingMessage = {
      content,
      created_at: new Date().toISOString(),
      id: temporaryId,
      receiver_id: active.id,
      sender_id: currentUser.id,
    }

    setOptimisticMessages((current) => [...current, pendingMessage])
    setMessageText('')

    try {
      const savedMessage = await sendMessage({ content, receiverId: active.id, senderId: currentUser.id })
      setOptimisticMessages((current) => current.map((message) => (message.id === temporaryId ? savedMessage : message)))
      await refreshSchoolData()
    } catch (error) {
      setOptimisticMessages((current) => current.filter((message) => message.id !== temporaryId))
      setMessageText(content)
      addToast({ title: 'Erro ao enviar comunicado', message: error.message })
    }
  }

  const handleReaction = async (message, emoji) => {
    if (!isStudent || message.receiver_id !== currentUser.id || String(message.id).startsWith('pending-')) return

    setIsReactingTo(`${message.id}:${emoji}`)
    try {
      const savedReaction = await reactToMessage({ emoji, messageId: message.id, studentId: currentUser.id })
      setLiveReactions((current) => {
        const withoutCurrent = current.filter((reaction) => !(reaction.message_id === savedReaction.message_id && reaction.student_id === savedReaction.student_id))
        return [...withoutCurrent, savedReaction]
      })
      await refreshSchoolData()
    } catch (error) {
      addToast({ title: 'Erro ao reagir', message: error.message })
    } finally {
      setIsReactingTo('')
    }
  }

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-black uppercase text-alert-coral">Comunicados</p>
        <h1 className="mt-1 text-3xl font-black text-brand-ink">{isTeacher ? 'Comunicados para alunos' : 'Comunicados escolares'}</h1>
        <p className="mt-2 text-muted">Mensagens do professor para o aluno, com reacoes por emoji. Perfil ativo: {roleLabel}.</p>
      </div>

      <div className="grid min-h-[680px] gap-6 lg:grid-cols-[340px_1fr]">
        <Card className="p-0">
          <div className="border-b border-line p-4">
            <label className="flex h-11 items-center gap-2 rounded-lg border border-line bg-page px-3 text-sm text-muted">
              <Search aria-hidden="true" className="h-4 w-4" />
              <input className="min-w-0 flex-1 bg-transparent text-slate-800 outline-none" onChange={(event) => setSearchTerm(event.target.value)} placeholder={isTeacher ? 'Buscar aluno' : 'Buscar professor'} type="search" value={searchTerm} />
            </label>
          </div>
          <div className="grid gap-1 p-3">
            {filteredContacts.map((contact) => (
              <button className={`flex w-full items-center gap-3 rounded-lg p-3 text-left transition ${active?.id === contact.id ? 'bg-brand-royal text-white' : 'hover:bg-brand-royal-soft'}`} key={contact.id} onClick={() => setActiveId(contact.id)} type="button">
                <Avatar image={contact.avatar_url} name={contact.fullname} size="sm" />
                <span className="min-w-0 flex-1">
                  <span className={`block truncate font-black ${active?.id === contact.id ? 'text-white' : 'text-brand-ink'}`}>{contact.fullname}</span>
                  <span className={`block truncate text-sm ${active?.id === contact.id ? 'text-white/75' : 'text-muted'}`}>{contact.role === roles.student ? 'Aluno' : contact.role === roles.teacher ? 'Professor' : 'Admin'}</span>
                </span>
              </button>
            ))}
            {!filteredContacts.length ? <p className="px-2 py-4 text-center text-sm text-muted">Nenhum contato disponivel.</p> : null}
          </div>
        </Card>

        {active ? (
          <Card className="flex min-h-0 flex-col p-0">
            <div className="flex items-center justify-between gap-4 border-b border-line p-4">
              <div className="flex min-w-0 items-center gap-3">
                <Avatar image={active.avatar_url} name={active.fullname} size="md" />
                <div className="min-w-0">
                  <p className="truncate font-black text-brand-ink">{active.fullname}</p>
                  <p className="truncate text-sm text-muted">{active.email}</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {!isStudent ? (
                  <Button disabled={!activeMessages.length || isClearingChat} icon={Trash2} onClick={() => setShowClearChatModal(true)} variant="ghost">
                    Apagar
                  </Button>
                ) : null}
                <Badge tone="royal">{active.role}</Badge>
              </div>
            </div>
            <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto bg-page p-5" ref={chatScrollRef}>
              <div className="grid gap-4">
                {activeMessages.map((message) => {
                  const sentByCurrentUser = message.sender_id === currentUser.id
                  const messageReactions = reactions.filter((reaction) => reaction.message_id === message.id)
                  const currentStudentReaction = messageReactions.find((reaction) => reaction.student_id === currentUser.id)
                  const reactionSummary = getReactionSummary(messageReactions, schoolData.profiles)

                  return (
                    <div className={`flex items-end gap-3 ${sentByCurrentUser ? 'justify-end' : 'justify-start'}`} key={message.id}>
                      {!sentByCurrentUser ? <Avatar image={active.avatar_url} name={active.fullname} size="sm" /> : null}
                      <div className={`max-w-[78%] rounded-xl px-4 py-3 text-sm leading-6 shadow-sm ${sentByCurrentUser ? 'bg-brand-royal text-white' : 'bg-white text-copy'}`}>
                        <p>{message.content}</p>
                        <p className={`mt-2 text-xs font-bold ${sentByCurrentUser ? 'text-white/80' : 'text-slate-600'}`}>{new Date(message.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>

                        {isStudent && message.receiver_id === currentUser.id ? (
                          <div className="mt-3 flex flex-wrap gap-2 border-t border-line/60 pt-3">
                            {availableReactions.map((emoji) => {
                              const isSelected = currentStudentReaction?.emoji === emoji
                              return (
                                <button
                                  aria-label={`Reagir com ${emoji}`}
                                  className={`grid h-9 w-9 place-items-center rounded-lg border text-lg transition ${isSelected ? 'border-brand-royal bg-brand-royal-soft' : 'border-line bg-white hover:border-brand-royal'}`}
                                  disabled={isReactingTo === `${message.id}:${emoji}`}
                                  key={emoji}
                                  onClick={() => handleReaction(message, emoji)}
                                  type="button"
                                >
                                  {emoji}
                                </button>
                              )
                            })}
                          </div>
                        ) : null}

                        {!isStudent && reactionSummary.length ? (
                          <div className="mt-3 grid gap-2 border-t border-white/25 pt-3">
                            <p className={`text-xs font-black uppercase ${sentByCurrentUser ? 'text-white/80' : 'text-muted'}`}>Reacoes dos alunos</p>
                            <div className="flex flex-wrap gap-2">
                              {reactionSummary.map((summary) => (
                                <span className={`rounded-lg px-2 py-1 text-xs font-black ${sentByCurrentUser ? 'bg-white/15 text-white' : 'bg-brand-royal-soft text-brand-royal'}`} key={summary.emoji} title={summary.names.join(', ')}>
                                  {summary.emoji} {summary.total}
                                </span>
                              ))}
                            </div>
                            <p className={`text-xs ${sentByCurrentUser ? 'text-white/80' : 'text-muted'}`}>
                              {reactionSummary.flatMap((summary) => summary.names.map((name) => `${name} ${summary.emoji}`)).join(', ')}
                            </p>
                          </div>
                        ) : null}
                      </div>
                      {sentByCurrentUser ? <Avatar image={currentUser.avatar_url} name={currentUser.fullname} size="sm" /> : null}
                    </div>
                  )
                })}
                {!activeMessages.length ? <p className="rounded-lg bg-white p-4 text-sm text-muted">Nenhum comunicado registrado.</p> : null}
              </div>
            </div>
            {isTeacher ? (
              <form className="flex gap-3 border-t border-line p-4" onSubmit={handleSendMessage}>
                <input className="min-w-0 flex-1 rounded-lg border border-line px-4 text-sm text-slate-900 outline-none" onChange={(event) => setMessageText(event.target.value)} placeholder="Escreva um comunicado..." type="text" value={messageText} />
                <Button icon={Send} type="submit" variant="primary">Enviar</Button>
              </form>
            ) : null}
          </Card>
        ) : (
          <Card className="grid place-items-center text-muted">Nenhum contato disponivel.</Card>
        )}
      </div>

      {showClearChatModal && active ? (
        <Modal onClose={() => setShowClearChatModal(false)} title="Apagar comunicados">
          <div className="grid gap-5">
            <p className="text-slate-700">Confirme para apagar os comunicados com {active.fullname}.</p>
            <div className="flex flex-wrap justify-end gap-3">
              <Button disabled={isClearingChat} onClick={() => setShowClearChatModal(false)} variant="ghost">Cancelar</Button>
              <Button disabled={isClearingChat} icon={Trash2} onClick={handleClearChat} variant="coral">
                {isClearingChat ? 'Apagando' : 'Apagar comunicados'}
              </Button>
            </div>
          </div>
        </Modal>
      ) : null}
    </div>
  )
}

export default ConversationsPage
