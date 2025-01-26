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
import { CustomerForm } from "./customer-form"

export type Customer = {
  id: string
  name: string
  email: string
  phone: string | null
  company: string | null
  fein: string | null
  status: "active" | "inactive"
  created_at: string
  updated_at: string
}

export const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "company",
    header: "Company",
  },
  {
    accessorKey: "fein",
    header: "FEIN",
    cell: ({ row }) => {
      const fein = row.getValue("fein") as string
      if (!fein) return null
      // Format FEIN as XX-XXXXXXX
      return `${fein.slice(0, 2)}-${fein.slice(2)}`
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.getValue("status") === "active" ? "default" : "secondary"}>
        {row.getValue("status")}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const customer = row.original
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
                onClick={() => router.push(`/customers/${customer.id}`)}
              >
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(customer.id)}
              >
                Copy ID
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowEditForm(true)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <CustomerForm
            open={showEditForm}
            onClose={() => setShowEditForm(false)}
            initialData={customer}
            mode="edit"
            onSuccess={() => {
              setShowEditForm(false)
              // Refresh the data
              window.location.reload()
            }}
          />
        </>
      )
    },
  },
] 