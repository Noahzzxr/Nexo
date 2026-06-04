import { useCallback, useEffect, useMemo, useState } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { mockCredentials, mockProfiles, roleLabels, roles } from './roles'
import { SessionContext } from './sessionContext'

function readInitialRole() {
  const savedRole = window.localStorage.getItem('school-role')
  return Object.values(roles).includes(savedRole) ? savedRole : roles.student
}

function findMockRoleByEmail(email) {
  const normalizedEmail = email.trim().toLowerCase()
  return Object.entries(mockCredentials).find(([, credentials]) => credentials.email.toLowerCase() === normalizedEmail)?.[0]
}

function SessionProvider({ children }) {
  const [role, setRoleState] = useState(readInitialRole)
  const [currentUser, setCurrentUser] = useState(() => mockProfiles[readInitialRole()])
  const [isAuthenticated, setIsAuthenticated] = useState(() => window.localStorage.getItem('school-authenticated') === 'true')
  const [isLoadingSession, setIsLoadingSession] = useState(false)

  const setRole = useCallback((nextRole) => {
    setRoleState(nextRole)
    setCurrentUser(mockProfiles[nextRole])
    window.localStorage.setItem('school-role', nextRole)
  }, [])

  const hydrateProfile = useCallback(async (userId, fallbackEmail) => {
    if (!supabase) return mockProfiles.student

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
          throw new Error('E-mail ou senha invalidos. Use uma credencial cadastrada para entrar.')
        }

        const demoProfile = mockProfiles[matchedRole]

        setRoleState(matchedRole)
        setCurrentUser(demoProfile)
        setIsAuthenticated(true)
        window.localStorage.setItem('school-role', matchedRole)
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
    window.localStorage.setItem('school-role', roles.student)
    setRoleState(roles.student)
    setCurrentUser(mockProfiles.student)
    setIsAuthenticated(false)
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
    }),
    [currentUser, isAuthenticated, isLoadingSession, loginWithCredentials, logout, role, setRole],
  )

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export default SessionProvider
