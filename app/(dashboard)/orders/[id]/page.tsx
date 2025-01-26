"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/shared/data-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { OrderItemsForm } from "../order-items-form"
import { orderItemColumns } from "./columns"
import type { Order } from "../columns"

type OrderItem = {
  id: string
  order_id: string
  product_id: string
  product_name: string
  quantity: number
  unit_price: number
  total: number
}

export default function OrderDetailsPage() {
  const params = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddItem, setShowAddItem] = useState(false)

  const fetchOrderDetails = async () => {
    try {
      const supabase = createClient()
      
      // Fetch order details
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select(`
          *,
          customers (
            name
          )
        `)
        .eq("id", params.id)
        .single()

      if (orderError) throw orderError
      setOrder({
        ...orderData,
        customer_name: orderData.customers.name
      })

      // Fetch order items
      const { data: itemsData, error: itemsError } = await supabase
        .from("order_items")
        .select(`
          *,
          products (
            name
          )
        `)
        .eq("order_id", params.id)

      if (itemsError) throw itemsError
      
      const formattedItems = itemsData.map(item => ({
        ...item,
        product_name: item.products.name,
        total: item.quantity * item.unit_price
      }))
      setOrderItems(formattedItems)

      // Update order total
      const total = formattedItems.reduce((sum, item) => sum + item.total, 0)
      if (total !== orderData.total_amount) {
        await supabase
          .from("orders")
          .update({ total_amount: total })
          .eq("id", params.id)
        setOrder(prev => prev ? { ...prev, total_amount: total } : null)
      }
    } catch (error) {
      console.error("Error fetching order details:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (params.id) {
      fetchOrderDetails()
    }
  }, [params.id])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!order) {
    return <div>Order not found</div>
  }

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Order Details</h2>
        <Button onClick={() => setShowAddItem(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Item
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{order.customer_name}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{order.status}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD"
              }).format(order.total_amount)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Date</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Date(order.created_at).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-2xl font-bold tracking-tight">Order Items</h3>
        <DataTable 
          columns={orderItemColumns} 
          data={orderItems} 
          searchKey="product_name" 
        />
      </div>

      <OrderItemsForm 
        open={showAddItem} 
        onClose={() => setShowAddItem(false)}
        orderId={order.id}
        onItemAdded={fetchOrderDetails}
      />
    </div>
  )
} 