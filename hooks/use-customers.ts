"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Customer } from "@/app/(dashboard)/customers/columns"

export function useCustomers() {
  const [data, setData] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchCustomers = async () => {
    try {
      setIsLoading(true)
      const supabase = createClient()
      const { data: customers, error } = await supabase
        .from("customers")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setData(customers)
    } catch (e) {
      setError(e as Error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  return { data, isLoading, error, refresh: fetchCustomers }
} 