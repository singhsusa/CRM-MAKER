"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Order } from "@/app/(dashboard)/orders/columns"

export function useOrders() {
  const [data, setData] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      const supabase = createClient()
      const { data: orders, error } = await supabase
        .from("orders")
        .select(`
          *,
          customers (
            name
          ),
          order_items (
            id,
            product_id,
            quantity,
            unit_price
          )
        `)
        .order("created_at", { ascending: false })

      if (error) throw error

      const formattedOrders = orders.map(order => ({
        ...order,
        customer_name: order.customers.name,
        items: order.order_items.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity.toString(),
        })),
      }))

      setData(formattedOrders)
    } catch (e) {
      setError(e as Error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  return { data, isLoading, error, refresh: fetchOrders }
} 