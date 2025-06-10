import { supabase } from './client'
import type { User, UserInsert, UserUpdate } from './types'

export interface SignUpData {
  email: string
  password: string
  fullName?: string
  phone?: string
  userType?: 'patient' | 'dentist'
}

export interface SignInData {
  email: string
  password: string
}

export interface AuthError {
  message: string
  status?: number
}

export interface AuthResponse {
  user: User | null
  error: AuthError | null
}

// Sign up a new user
export async function signUp(data: SignUpData): Promise<AuthResponse> {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
          phone: data.phone,
          user_type: data.userType || 'patient'
        }
      }
    })

    if (authError) {
      return { user: null, error: { message: authError.message } }
    }

    if (!authData.user) {
      return { user: null, error: { message: 'Failed to create user' } }
    }

    // Create user profile in the users table
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: data.email,
        full_name: data.fullName,
        phone: data.phone,
        user_type: data.userType || 'patient'
      })
      .select()
      .single()

    if (profileError) {
      return { user: null, error: { message: profileError.message } }
    }

    return { user: userProfile, error: null }
  } catch (error) {
    return { 
      user: null, 
      error: { message: error instanceof Error ? error.message : 'Unknown error' } 
    }
  }
}

// Sign in an existing user
export async function signIn(data: SignInData): Promise<AuthResponse> {
  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password
    })

    if (authError) {
      return { user: null, error: { message: authError.message } }
    }

    if (!authData.user) {
      return { user: null, error: { message: 'Authentication failed' } }
    }

    // Get user profile
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single()

    if (profileError) {
      return { user: null, error: { message: profileError.message } }
    }

    return { user: userProfile, error: null }
  } catch (error) {
    return { 
      user: null, 
      error: { message: error instanceof Error ? error.message : 'Unknown error' } 
    }
  }
}

// Sign out the current user
export async function signOut(): Promise<{ error: AuthError | null }> {
  try {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      return { error: { message: error.message } }
    }

    return { error: null }
  } catch (error) {
    return { 
      error: { message: error instanceof Error ? error.message : 'Unknown error' } 
    }
  }
}

// Get the current user
export async function getCurrentUser(): Promise<{ user: User | null; error: AuthError | null }> {
  try {
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()

    if (authError) {
      return { user: null, error: { message: authError.message } }
    }

    if (!authUser) {
      return { user: null, error: null }
    }

    // Get user profile
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single()

    if (profileError) {
      return { user: null, error: { message: profileError.message } }
    }

    return { user: userProfile, error: null }
  } catch (error) {
    return { 
      user: null, 
      error: { message: error instanceof Error ? error.message : 'Unknown error' } 
    }
  }
}

// Update user profile
export async function updateUserProfile(
  id: string, 
  updates: UserUpdate
): Promise<{ user: User | null; error: AuthError | null }> {
  try {
    const { data: userProfile, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return { user: null, error: { message: error.message } }
    }

    return { user: userProfile, error: null }
  } catch (error) {
    return { 
      user: null, 
      error: { message: error instanceof Error ? error.message : 'Unknown error' } 
    }
  }
}

// Reset password
export async function resetPassword(email: string): Promise<{ error: AuthError | null }> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })

    if (error) {
      return { error: { message: error.message } }
    }

    return { error: null }
  } catch (error) {
    return { 
      error: { message: error instanceof Error ? error.message : 'Unknown error' } 
    }
  }
}

// Update password
export async function updatePassword(newPassword: string): Promise<{ error: AuthError | null }> {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) {
      return { error: { message: error.message } }
    }

    return { error: null }
  } catch (error) {
    return { 
      error: { message: error instanceof Error ? error.message : 'Unknown error' } 
    }
  }
}

// Listen to auth state changes
export function onAuthStateChange(callback: (user: User | null) => void) {
  return supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      const { data: userProfile } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single()
      
      callback(userProfile)
    } else {
      callback(null)
    }
  })
}
