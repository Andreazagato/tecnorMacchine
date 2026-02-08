import { createContext, useState, useContext, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const initDone = useRef(false)

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      if (error) {
        console.error('Errore fetch profilo:', error.message)
        return null
      }
      return data
    } catch (err) {
      console.error('Errore di rete fetch profilo:', err)
      return null
    }
  }

  useEffect(() => {
    let isMounted = true

    const initSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()

        if (error) {
          console.error('Errore getSession:', error.message)
          if (isMounted) {
            setUser(null)
            setProfile(null)
            setLoading(false)
          }
          return
        }

        if (session?.user && isMounted) {
          setUser(session.user)
          const prof = await fetchProfile(session.user.id)
          if (isMounted) {
            if (prof && prof.status === 'approved') {
              setProfile(prof)
            } else {
              // Utente non approvato o profilo non trovato: logout
              await supabase.auth.signOut()
              setUser(null)
              setProfile(null)
            }
          }
        }
      } catch (err) {
        console.error('Errore inizializzazione sessione:', err)
      } finally {
        if (isMounted) {
          setLoading(false)
          initDone.current = true
        }
      }
    }

    initSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Ignora eventi durante l'inizializzazione per evitare loop
      if (!initDone.current) return

      if (event === 'SIGNED_OUT' || !session?.user) {
        if (isMounted) {
          setUser(null)
          setProfile(null)
        }
        return
      }

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (isMounted) {
          setUser(session.user)
          const prof = await fetchProfile(session.user.id)
          if (isMounted) {
            if (prof && prof.status === 'approved') {
              setProfile(prof)
            } else {
              setProfile(null)
            }
          }
        }
      }
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) return { success: false, message: error.message }

      const prof = await fetchProfile(data.user.id)
      if (!prof || prof.status !== 'approved') {
        await supabase.auth.signOut()
        return { success: false, message: 'Account in attesa di approvazione o non approvato.' }
      }
      setUser(data.user)
      setProfile(prof)
      return { success: true }
    } catch (err) {
      return { success: false, message: 'Errore di connessione. Riprova.' }
    }
  }

  const register = async ({ firstName, lastName, username, password }) => {
    try {
      const email = `${username}@tecnor.local`
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            first_name: firstName,
            last_name: lastName,
            role: 'employee'
          }
        }
      })
      if (error) return { success: false, message: error.message }
      await supabase.auth.signOut()
      return { success: true }
    } catch (err) {
      return { success: false, message: 'Errore di connessione. Riprova.' }
    }
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.error('Errore logout:', err)
    } finally {
      setUser(null)
      setProfile(null)
    }
  }

  const refreshProfile = async () => {
    if (user) {
      const prof = await fetchProfile(user.id)
      if (prof) setProfile(prof)
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      login,
      register,
      logout,
      refreshProfile,
      isAdmin: profile?.role === 'admin'
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
