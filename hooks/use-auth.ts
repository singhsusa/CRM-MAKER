import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useCallback } from 'react'

export function useAuth() {
  const router = useRouter()
  const supabase = createClient()

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (!error) {
      router.push('/')
      router.refresh()
    }
    return { error }
  }, [router, supabase.auth])

  const signUp = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (!error) {
      router.push('/verify')
    }
    return { error }
  }, [router, supabase.auth])

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      router.push('/login')
      router.refresh()
    }
    return { error }
  }, [router, supabase.auth])

  return {
    signIn,
    signUp,
    signOut,
  }
} 