"use client"

import { useState } from "react"
import { DataTable } from "@/components/shared/data-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { columns } from "./columns"
import { useOrders } from "@/hooks/use-orders"
import { OrderForm } from "./order-form"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorMessage } from "@/components/ui/error-message"

export default function OrdersPage() {
  const { data: orders, isLoading, error, refresh } = useOrders()
  const [showAddOrder, setShowAddOrder] = useState(false)

  const handleOrderAdded = () => {
    refresh()
    setShowAddOrder(false)
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorMessage message={error.message} />
  }

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
        <Button onClick={() => setShowAddOrder(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Order
        </Button>
      </div>
      <DataTable columns={columns} data={orders} searchKey="customer_name" />
      <OrderForm
        open={showAddOrder}
        onClose={() => setShowAddOrder(false)}
        onSuccess={handleOrderAdded}
      />
    </div>
  )
} 