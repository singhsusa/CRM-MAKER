'use client'

import { useState } from 'react'
import { MoreHorizontal, Pencil, Trash } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ProductForm } from './product-form'
import { DeleteAlert } from '@/components/shared/delete-alert'
import { Product } from '@/types'

interface ProductActionsProps {
  product: Product
}

export function ProductActions({ product }: ProductActionsProps) {
  const [showEditForm, setShowEditForm] = useState(false)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)

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
          <DropdownMenuItem onClick={() => setShowEditForm(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive"
            onClick={() => setShowDeleteAlert(true)}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProductForm
        open={showEditForm}
        onClose={() => setShowEditForm(false)}
        product={product}
      />
      
      <DeleteAlert
        open={showDeleteAlert}
        onClose={() => setShowDeleteAlert(false)}
        onConfirm={async () => {
          // TODO: Implement delete functionality
        }}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
      />
    </>
  )
} 