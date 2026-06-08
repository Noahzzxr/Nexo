import { useCallback, useEffect, useMemo, useState } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { fetchProfile, fetchSchoolData } from '../services/schoolService'
import { roleLabels, roles } from './roles'
import { SessionContext } from './sessionContext'

const emptySchoolData = {
  assignments: [],
  attendance: [],
  calendarEvents: [],
  classes: [],
  currentEnrollment: null,
  enrollments: [],
  grades: [],
  materials: [],
  messages: [],
  profiles: [],
  quizAttempts: [],
  quizzes: [],
  students: [],
  subjects: [],
  submissions: [],
  teachers: [],
  teacherSubjects: [],
}

function normalizeAuthError(error) {
  const message = error?.message || 'Nao foi possivel entrar.'

  if (message.toLowerCase().includes('invalid api key')) {
    return new Error('Chave anon do Supabase invalida. Copie a anon public key correta em Project Settings > API.')
  }

  if (message.toLowerCase().includes('database error querying schema')) {
    return new Error('Erro no schema do Supabase. Reexecute o school_schema.sql atualizado no SQL Editor e confira se a anon key esta correta.')
  }

  return new Error(message)
}

function SessionProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoadingSession, setIsLoadingSession] = useState(true)
  const [schoolData, setSchoolData] = useState(emptySchoolData)
  const [dataError, setDataError] = useState(null)

  const role = currentUser?.role || roles.student

  const loadUserAndData = useCallback(async (user) => {
    if (!user) {
      setCurrentUser(null)
      setSchoolData(emptySchoolData)
      setIsAuthenticated(false)
      return null
    }

    const profile = await fetchProfile(user.id)
    const data = await fetchSchoolData(profile)
    setCurrentUser(profile)
    setSchoolData(data)
    setIsAuthenticated(true)
    setDataError(null)
    return profile
  }, [])

  const refreshSchoolData = useCallback(async () => {
    if (!currentUser) return emptySchoolData
    const data = await fetchSchoolData(currentUser)
    setSchoolData(data)
    setDataError(null)
    return data
  }, [currentUser])

  useEffect(() => {
    let isMounted = true

    async function loadSession() {
      if (!isSupabaseConfigured || !supabase) {
        setIsLoadingSession(false)
        setDataError('Supabase nao configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.')
        return
      }

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!isMounted) return

        if (session?.user) {
          await loadUserAndData(session.user)
        } else {
          setCurrentUser(null)
          setIsAuthenticated(false)
        }
      } catch (error) {
        if (isMounted) setDataError(error.message)
      } finally {
        if (isMounted) setIsLoadingSession(false)
      }
    }

    loadSession()

    if (!supabase) return undefined

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) {
        setCurrentUser(null)
        setSchoolData(emptySchoolData)
        setIsAuthenticated(false)
        return
      }

      try {
        await loadUserAndData(session.user)
      } catch (error) {
        setDataError(error.message)
      }
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [loadUserAndData])

  const loginWithCredentials = useCallback(
    async ({ email, password }) => {
      if (!isSupabaseConfigured || !supabase) {
        throw new Error('Supabase nao configurado.')
      }

      setIsLoadingSession(true)
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw normalizeAuthError(error)
        return loadUserAndData(data.user)
      } finally {
        setIsLoadingSession(false)
      }
    },
    [loadUserAndData],
  )

  const logout = useCallback(async () => {
    if (supabase) await supabase.auth.signOut()
    setCurrentUser(null)
    setSchoolData(emptySchoolData)
    setIsAuthenticated(false)
  }, [])

  const value = useMemo(
    () => ({
      currentUser,
      dataError,
      isAdmin: role === roles.admin,
      isAuthenticated,
      isLoadingSession,
      isStudent: role === roles.student,
      isSupabaseConfigured,
      isTeacher: role === roles.teacher,
      loginWithCredentials,
      logout,
      refreshSchoolData,
      role,
      roleLabel: roleLabels[role],
      schoolData,
    }),
    [currentUser, dataError, isAuthenticated, isLoadingSession, loginWithCredentials, logout, refreshSchoolData, role, schoolData],
  )

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export default SessionProvider
