import React, { createContext, useEffect, useState, type PropsWithChildren } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthContextValue {
  user: User | null
}

export const AuthContext = createContext<AuthContextValue>({ user: null })

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null))
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
}
