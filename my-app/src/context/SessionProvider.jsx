import { useCallback, useEffect, useMemo, useState } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { mockCredentials, mockProfiles, roleLabels, roles } from './roles'
import { SessionContext } from './sessionContext'
import { activities, calendarEvents } from '../data/mockData'

function readInitialRole() {
  const savedRole = window.localStorage.getItem('school-role')
  return Object.values(roles).includes(savedRole) ? savedRole : roles.student
}

function findMockRoleByEmail(email) {
  const normalizedEmail = email.trim().toLowerCase()
  return Object.entries(mockCredentials).find(([, credentials]) => credentials.email.toLowerCase() === normalizedEmail)?.[0]
}

const initialStudents = [
  { id: '11111111-1111-4111-8111-111111111111', name: 'Anna Regina', classId: '99999999-0001-4000-8000-000000000001', className: '9º ano B', points: 370, games: 220, xp: 370, level: 4, avatar: 'https://i.pravatar.cc/180?img=45', grades: { 'Matemática': 8.6, 'Redação': 8.2, 'História': 8.8, 'Inglês': 7.8, 'Química': 7.6, 'Física': 7.5 }, absences: { 'Matemática': 2, 'Redação': 1, 'História': 0, 'Inglês': 3, 'Química': 2, 'Física': 4 } },
  { id: 'student-2', name: 'Bruno Moraes', classId: '99999999-0002-4000-8000-000000000002', className: '8º ano A', points: 330, games: 190, xp: 330, level: 4, avatar: 'https://i.pravatar.cc/120?img=18', grades: { 'Matemática': 7.5, 'Redação': 7.4, 'História': 8.0, 'Inglês': 7.1, 'Química': 7.0, 'Física': 6.7 }, absences: {} },
  { id: 'student-3', name: 'Kaique Nunes', classId: '99999999-0001-4000-8000-000000000001', className: '9º ano B', points: 301, games: 168, xp: 301, level: 4, avatar: 'https://i.pravatar.cc/120?img=14', grades: { 'Matemática': 6.5, 'Redação': 7.0, 'História': 7.2, 'Inglês': 6.8, 'Química': 7.0, 'Física': 6.5 }, absences: {} },
  { id: 'student-4', name: 'Karen Matos', classId: '99999999-0001-4000-8000-000000000001', className: '9º ano B', points: 290, games: 150, xp: 290, level: 3, avatar: 'https://i.pravatar.cc/120?img=31', grades: { 'Matemática': 9.0, 'Redação': 8.8, 'História': 9.5, 'Inglês': 9.0, 'Química': 9.2, 'Física': 8.0 }, absences: {} },
  { id: 'student-5', name: 'Lucas Freitas', classId: '99999999-0001-4000-8000-000000000001', className: '9º ano B', points: 270, games: 142, xp: 270, level: 3, avatar: 'https://i.pravatar.cc/120?img=8', grades: { 'Matemática': 7.0, 'Redação': 7.5, 'História': 7.8, 'Inglês': 7.5, 'Química': 7.2, 'Física': 6.8 }, absences: {} },
  { id: 'student-6', name: 'Lucas Silva', classId: 'class-6', className: '6º ano', points: 150, games: 50, xp: 150, level: 2, avatar: 'https://i.pravatar.cc/120?img=10', grades: { 'Matemática': 8.0, 'Redação': 7.0 }, absences: {} },
  { id: 'student-7', name: 'Mariana Souza', classId: 'class-6', className: '6º ano', points: 240, games: 110, xp: 240, level: 3, avatar: 'https://i.pravatar.cc/120?img=21', grades: { 'Matemática': 9.5, 'Redação': 9.0 }, absences: {} },
  { id: 'student-8', name: 'Pedro Santos', classId: 'class-6', className: '6º ano', points: 90, games: 30, xp: 90, level: 1, avatar: 'https://i.pravatar.cc/120?img=33', grades: { 'Matemática': 5.5, 'Redação': 6.0 }, absences: {} },
  { id: 'student-9', name: 'Beatriz Lima', classId: 'class-7', className: '7º ano', points: 180, games: 70, xp: 180, level: 2, avatar: 'https://i.pravatar.cc/120?img=12', grades: { 'Matemática': 8.0, 'Redação': 8.5 }, absences: {} },
  { id: 'student-10', name: 'Thiago Rocha', classId: 'class-7', className: '7º ano', points: 120, games: 45, xp: 120, level: 2, avatar: 'https://i.pravatar.cc/120?img=13', grades: { 'Matemática': 7.8, 'Redação': 7.2 }, absences: {} },
  { id: 'student-12', name: 'Felipe Oliveira', classId: 'class-1m', className: '1º ano', points: 210, games: 95, xp: 210, level: 3, avatar: 'https://i.pravatar.cc/120?img=15', grades: { 'Matemática': 7.0, 'Redação': 7.5 }, absences: {} },
  { id: 'student-13', name: 'Larissa Gomez', classId: 'class-1m', className: '1º ano', points: 280, games: 130, xp: 280, level: 3, avatar: 'https://i.pravatar.cc/120?img=16', grades: { 'Matemática': 8.5, 'Redação': 8.8 }, absences: {} },
  { id: 'student-14', name: 'Gustavo Martins', classId: '99999999-0003-4000-8000-000000000003', className: '2º Médio B', points: 195, games: 80, xp: 195, level: 2, avatar: 'https://i.pravatar.cc/120?img=17', grades: { 'Matemática': 7.2, 'Redação': 6.8 }, absences: {} },
  { id: 'student-15', name: 'Amanda Costa', classId: '99999999-0003-4000-8000-000000000003', className: '2º Médio B', points: 310, games: 160, xp: 310, level: 4, avatar: 'https://i.pravatar.cc/120?img=19', grades: { 'Matemática': 9.0, 'Redação': 9.2 }, absences: {} },
  { id: 'student-16', name: 'Rafael Souza', classId: 'class-3m', className: '3º ano', points: 205, games: 88, xp: 205, level: 3, avatar: 'https://i.pravatar.cc/120?img=22', grades: { 'Matemática': 6.5, 'Redação': 7.0 }, absences: {} },
  { id: 'student-17', name: 'Sofia Pinheiro', classId: 'class-3m', className: '3º ano', points: 345, games: 210, xp: 345, level: 4, avatar: 'https://i.pravatar.cc/120?img=23', grades: { 'Matemática': 9.8, 'Redação': 9.5 }, absences: {} },
]

const initialMessages = [
  { id: 'm1', sender_id: '22222222-2222-4222-8222-222222222222', receiver_id: '11111111-1111-4111-8111-111111111111', content: 'Anna, sua resolução do desafio ficou muito boa.', created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
  { id: 'm2', sender_id: '11111111-1111-4111-8111-111111111111', receiver_id: '22222222-2222-4222-8222-222222222222', content: 'Professor, posso refazer a questão 4 para melhorar a nota?', created_at: new Date(Date.now() - 1000 * 60 * 20).toISOString() },
  { id: 'm3', sender_id: '22222222-2222-4222-8222-222222222222', receiver_id: '11111111-1111-4111-8111-111111111111', content: 'Pode sim. Envie até sexta no card da atividade.', created_at: new Date(Date.now() - 1000 * 60 * 18).toISOString() },
  { id: 'm4', sender_id: '44444444-4444-4444-8444-444444444444', receiver_id: '11111111-1111-4111-8111-111111111111', content: 'Incluí comentários no seu rascunho.', created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
  { id: 'm5', sender_id: '11111111-1111-4111-8111-111111111111', receiver_id: '44444444-4444-4444-8444-444444444444', content: 'Obrigada, vou ajustar a conclusão hoje.', created_at: new Date(Date.now() - 1000 * 60 * 60 * 1.9).toISOString() },
  { id: 'm6', sender_id: '55555555-5555-4555-8555-555555555555', receiver_id: '11111111-1111-4111-8111-111111111111', content: 'Não esqueça a fonte primária no trabalho.', created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
  { id: 'm7', sender_id: '66666666-6666-4666-8666-666666666666', receiver_id: '11111111-1111-4111-8111-111111111111', content: 'O áudio 03 já está liberado.', created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() },
]

function SessionProvider({ children }) {
  const [role, setRoleState] = useState(readInitialRole)
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = window.localStorage.getItem('school-user')
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser)
        if (parsed && parsed.role === readInitialRole()) {
          return parsed
        }
      } catch {
        return mockProfiles[readInitialRole()]
      }
    }
    return mockProfiles[readInitialRole()]
  })
  const [isAuthenticated, setIsAuthenticated] = useState(() => window.localStorage.getItem('school-authenticated') === 'true')
  const [isLoadingSession, setIsLoadingSession] = useState(false)

  // Simulated Database states
  const [activitiesList, setActivitiesList] = useState(() => {
    const saved = window.localStorage.getItem('school-activities')
    return saved ? JSON.parse(saved) : activities
  })

  const [calendarEventsList, setCalendarEventsList] = useState(() => {
    const saved = window.localStorage.getItem('school-calendar-events')
    return saved ? JSON.parse(saved) : calendarEvents
  })

  const [studentsList, setStudentsList] = useState(() => {
    const saved = window.localStorage.getItem('school-students-list')
    return saved ? JSON.parse(saved) : initialStudents
  })

  const [globalMessages, setGlobalMessages] = useState(() => {
    const saved = window.localStorage.getItem('school-global-messages')
    return saved ? JSON.parse(saved) : initialMessages
  })

  const setRole = useCallback((nextRole) => {
    setRoleState(nextRole)
    const initialProfile = mockProfiles[nextRole]
    
    // If resetting to Student, make sure we merge any dynamic score/xp from our studentsList
    if (nextRole === roles.student) {
      const dynamicStudent = JSON.parse(window.localStorage.getItem('school-students-list') || 'null')
        ?.find(s => s.id === '11111111-1111-4111-8111-111111111111')
      if (dynamicStudent) {
        Object.assign(initialProfile, {
          points: dynamicStudent.points,
          xp: dynamicStudent.xp,
          level: dynamicStudent.level
        })
      }
    }
    
    setCurrentUser(initialProfile)
    window.localStorage.setItem('school-role', nextRole)
    window.localStorage.setItem('school-user', JSON.stringify(initialProfile))
  }, [])

  // Sync current student's dynamic points back to mockProfiles
  useEffect(() => {
    if (currentUser && (currentUser.role === 'aluno' || currentUser.role === 'student')) {
      mockProfiles.aluno.points = currentUser.points;
      mockProfiles.aluno.xp = currentUser.xp;
      mockProfiles.aluno.level = currentUser.level;
    }
  }, [currentUser])

  const hydrateProfile = useCallback(async (userId, fallbackEmail) => {
    if (!supabase) return mockProfiles[roles.student]

    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle()
    if (error) throw error

    const profileRole = data?.role && Object.values(roles).includes(data.role) ? data.role : roles.student
    const profile = data || {
      email: fallbackEmail,
      fullname: fallbackEmail?.split('@')[0] || 'Usuario',
      id: userId,
      role: profileRole,
    }

    setRoleState(profileRole)
    setCurrentUser(profile)
    setIsAuthenticated(true)
    window.localStorage.setItem('school-role', profileRole)
    window.localStorage.setItem('school-authenticated', 'true')
    return profile
  }, [])

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return undefined

    let isMounted = true

    async function loadSession() {
      setIsLoadingSession(true)
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!isMounted) return

      if (session?.user) {
        await hydrateProfile(session.user.id, session.user.email)
      }

      setIsLoadingSession(false)
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        window.localStorage.removeItem('school-authenticated')
        return
      }

      hydrateProfile(session.user.id, session.user.email)
    })

    loadSession()

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [hydrateProfile])

  const loginWithCredentials = useCallback(async ({ email, password }) => {
    setIsLoadingSession(true)

    try {
      if (!isSupabaseConfigured || !supabase) {
        const matchedRole = findMockRoleByEmail(email)

        if (!matchedRole || mockCredentials[matchedRole].password !== password) {
          throw new Error('E-mail ou senha inválidos. Use uma credencial cadastrada para entrar.')
        }

        const demoProfile = { ...mockProfiles[matchedRole] }

        // If logged in as student, read dynamic points from studentsList
        if (matchedRole === 'aluno') {
          const savedStudents = window.localStorage.getItem('school-students-list')
          const studentInfo = savedStudents ? JSON.parse(savedStudents).find(s => s.id === demoProfile.id) : null
          if (studentInfo) {
            demoProfile.points = studentInfo.points
            demoProfile.xp = studentInfo.xp
            demoProfile.level = studentInfo.level
          }
        }

        setRoleState(matchedRole)
        setCurrentUser(demoProfile)
        setIsAuthenticated(true)
        window.localStorage.setItem('school-role', matchedRole)
        window.localStorage.setItem('school-user', JSON.stringify(demoProfile))
        window.localStorage.setItem('school-authenticated', 'true')
        return demoProfile
      }

      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error

      const profile = await hydrateProfile(data.user.id, data.user.email)

      return profile
    } finally {
      setIsLoadingSession(false)
    }
  }, [hydrateProfile])

  const logout = useCallback(async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut()
    }

    window.localStorage.removeItem('school-authenticated')
    window.localStorage.removeItem('school-user')
    window.localStorage.setItem('school-role', roles.student)
    setRoleState(roles.student)
    setCurrentUser(mockProfiles[roles.student])
    setIsAuthenticated(false)
  }, [])

  // Simulated Database Mutations
  const addActivity = useCallback((newActivity) => {
    setActivitiesList(current => {
      const updated = [newActivity, ...current]
      window.localStorage.setItem('school-activities', JSON.stringify(updated))
      return updated
    })
  }, [])

  const updateActivityStatus = useCallback((activityId, status) => {
    setActivitiesList(current => {
      const updated = current.map(act => act.id === activityId ? { ...act, status } : act)
      window.localStorage.setItem('school-activities', JSON.stringify(updated))
      return updated
    })
  }, [])

  const addCalendarEvent = useCallback((event) => {
    setCalendarEventsList(current => {
      const updated = [...current, event]
      window.localStorage.setItem('school-calendar-events', JSON.stringify(updated))
      return updated
    })
  }, [])

  const saveBulkGrades = useCallback((gradesData) => {
    setStudentsList(current => {
      const updated = current.map(stud => {
        const match = gradesData.find(g => g.id === stud.id)
        if (match) {
          return {
            ...stud,
            grades: { ...stud.grades, ...match.grades },
            absences: { ...stud.absences, ...match.absences }
          }
        }
        return stud
      })
      window.localStorage.setItem('school-students-list', JSON.stringify(updated))
      return updated
    })
  }, [])

  const sendGlobalMessage = useCallback((content, receiverId, senderId) => {
    const newMsg = {
      id: `msg-${Date.now()}`,
      sender_id: senderId,
      receiver_id: receiverId,
      content,
      created_at: new Date().toISOString()
    }
    setGlobalMessages(current => {
      const updated = [...current, newMsg]
      window.localStorage.setItem('school-global-messages', JSON.stringify(updated))
      return updated
    })
    return newMsg
  }, [])

  const updateStudentPoints = useCallback((addedPoints) => {
    setStudentsList(current => {
      const updated = current.map(stud => {
        if (stud.id === '11111111-1111-4111-8111-111111111111') {
          const nextPoints = (stud.points || 0) + addedPoints
          const nextXP = nextPoints
          const nextLevel = Math.floor(nextXP / 100) + 1
          return {
            ...stud,
            points: nextPoints,
            xp: nextXP,
            level: nextLevel
          }
        }
        return stud
      })
      window.localStorage.setItem('school-students-list', JSON.stringify(updated))
      return updated
    })

    setCurrentUser(prev => {
      if (prev && prev.id === '11111111-1111-4111-8111-111111111111') {
        const nextPoints = (prev.points || 0) + addedPoints
        const nextXP = nextPoints
        const nextLevel = Math.floor(nextXP / 100) + 1
        const nextUser = {
          ...prev,
          points: nextPoints,
          xp: nextXP,
          level: nextLevel
        }
        window.localStorage.setItem('school-user', JSON.stringify(nextUser))
        return nextUser
      }
      return prev
    })
  }, [])

  const value = useMemo(
    () => ({
      currentUser,
      isAdmin: role === roles.admin,
      isAuthenticated,
      isLoadingSession,
      isStudent: role === roles.student,
      isSupabaseConfigured,
      isTeacher: role === roles.teacher,
      loginWithCredentials,
      logout,
      role,
      roleLabel: roleLabels[role],
      setRole,
      // Simulated Database properties and actions
      activities: activitiesList,
      addActivity,
      updateActivityStatus,
      calendarEvents: calendarEventsList,
      addCalendarEvent,
      studentsList,
      saveBulkGrades,
      globalMessages,
      sendGlobalMessage,
      updateStudentPoints,
    }),
    [
      currentUser,
      isAuthenticated,
      isLoadingSession,
      loginWithCredentials,
      logout,
      role,
      setRole,
      activitiesList,
      addActivity,
      updateActivityStatus,
      calendarEventsList,
      addCalendarEvent,
      studentsList,
      saveBulkGrades,
      globalMessages,
      sendGlobalMessage,
      updateStudentPoints,
    ],
  )

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export default SessionProvider
