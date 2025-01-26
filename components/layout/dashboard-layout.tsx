"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
      }
    }

    checkAuth()
  }, [router, supabase.auth])

  return (
    <div className="relative flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="flex-1 space-y-4 p-8 pt-6">
          {children}
        </main>
      </div>
    </div>
  )
} 