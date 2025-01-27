import { createBrowserClient } from '@supabase/ssr'
import { Database } from './types'

export const createClient = () => {
  return supabaseClient.createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
} 