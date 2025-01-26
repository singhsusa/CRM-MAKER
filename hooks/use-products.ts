"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Product } from "@/app/(dashboard)/products/columns"

export function useProducts() {
  const [data, setData] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      const supabase = createClient()
      const { data: products, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setData(products)
    } catch (e) {
      setError(e as Error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return { data, isLoading, error, refresh: fetchProducts }
} 