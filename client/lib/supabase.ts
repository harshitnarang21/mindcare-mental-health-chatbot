import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// ✅ EXPORT the supabase client (this was probably missing)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// If you also need a default export
export default supabase
