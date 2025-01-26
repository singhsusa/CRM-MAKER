"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { OrderForm } from "./order-form"
import { formatPrice } from "@/lib/utils"

export type Order = {
  id: string
  customer_id: string
  customer_name: string
  order_term: string
  term_start_date: string
  term_end_date: string
  total_amount: number
  status: "pending" | "kick-off" | "implementation" | "live" | "on-hold" | "canceled"
  created_at: string
  billing_contact_name: string
  billing_contact_email: string
  billing_contact_address: string
  one_time_fee: number
  account_executive: string
  special_notes: string | null
}

const getStatusColor = (status: Order['status']) => {
  const colors = {
    pending: "yellow",
    "kick-off": "blue",
    implementation: "purple",
    live: "green",
    "on-hold": "orange",
    canceled: "red",
  }
  return colors[status] || "default"
}

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "customer_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Customer
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Order Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return new Date(row.getValue("created_at")).toLocaleDateString()
    },
  },
  {
    accessorKey: "order_term",
    header: "Term",
  },
  {
    accessorKey: "total_amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return formatPrice(row.getValue("total_amount"))
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as Order["status"]
      return (
        <Badge variant={getStatusColor(status)}>{status}</Badge>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const order = row.original
      const router = useRouter()
      const [showEditForm, setShowEditForm] = useState(false)

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => router.push(`/orders/${order.id}`)}
              >
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowEditForm(true)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(order.id)}
              >
                Copy ID
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <OrderForm
            open={showEditForm}
            onClose={() => setShowEditForm(false)}
            initialData={order}
            mode="edit"
            onSuccess={() => {
              setShowEditForm(false)
              window.location.reload()
            }}
          />
        </>
      )
    },
  },
] 