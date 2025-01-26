"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/shared/data-table"
import { columns } from "../../orders/columns"
import type { Customer } from "../columns"
import type { Order } from "../../orders/columns"

export default function CustomerDetailsPage() {
  const params = useParams()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        const supabase = createClient()
        
        // Fetch customer details
        const { data: customerData, error: customerError } = await supabase
          .from("customers")
          .select("*")
          .eq("id", params.id)
          .single()

        if (customerError) throw customerError
        setCustomer(customerData)

        // Fetch customer's orders
        const { data: ordersData, error: ordersError } = await supabase
          .from("orders")
          .select("*")
          .eq("customer_id", params.id)
          .order("created_at", { ascending: false })

        if (ordersError) throw ordersError
        const formattedOrders = ordersData.map(order => ({
          ...order,
          customer_name: customerData.name
        }))
        setOrders(formattedOrders)
      } catch (error) {
        console.error("Error fetching customer details:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchCustomerDetails()
    }
  }, [params.id])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!customer) {
    return <div>Customer not found</div>
  }

  return (
    <div className="flex-1 space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Customer Details</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Name</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customer.name}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Email</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customer.email}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Company</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customer.company || "N/A"}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{customer.status}</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-2xl font-bold tracking-tight">Orders</h3>
        <DataTable columns={columns} data={orders} searchKey="id" />
      </div>
    </div>
  )
} 