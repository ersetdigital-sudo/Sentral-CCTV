import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import type { User } from '@supabase/supabase-js'

/** Supabase client untuk Server Component / Server Action (sesi dari cookie). */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            /* dipanggil dari Server Component (read-only) — sesi di-refresh oleh proxy */
          }
        },
      },
    },
  )
}

/** User yang sedang login beserta role-nya (null bila belum login / bukan admin). */
export async function getAdmin(): Promise<{ user: User; fullName: string } | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .maybeSingle<{ role: string; full_name: string | null }>()

  if (profile?.role !== 'admin') return null
  return { user, fullName: profile.full_name || user.email || 'Admin' }
}
