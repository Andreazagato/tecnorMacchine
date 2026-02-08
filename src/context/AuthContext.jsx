import { createContext, useState, useContext, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async (userId) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    return data
  }

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
        const prof = await fetchProfile(session.user.id)
        setProfile(prof)
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user)
        const prof = await fetchProfile(session.user.id)
        setProfile(prof)
      } else {
        setUser(null)
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { success: false, message: error.message }

    const prof = await fetchProfile(data.user.id)
    if (!prof || prof.status !== 'approved') {
      await supabase.auth.signOut()
      return { success: false, message: 'Account in attesa di approvazione o non approvato.' }
    }
    setProfile(prof)
    return { success: true }
  }

  const register = async ({ firstName, lastName, username, password }) => {
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
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  const refreshProfile = async () => {
    if (user) {
      const prof = await fetchProfile(user.id)
      setProfile(prof)
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
