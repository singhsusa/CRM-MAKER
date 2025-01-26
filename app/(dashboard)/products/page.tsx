'use client'

import { useState } from 'react'
import { DataTable } from '@/components/shared/data-table'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { columns } from './columns'
import { useProducts } from '@/hooks/use-products'
import { ProductForm } from './product-form'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { ErrorMessage } from '@/components/ui/error-message'

export default function ProductsPage() {
  const { data: products, isLoading, error, refresh } = useProducts()
  const [showAddProduct, setShowAddProduct] = useState(false)

  const handleProductAdded = () => {
    refresh()
    setShowAddProduct(false)
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
        <h2 className="text-3xl font-bold tracking-tight">Products</h2>
        <Button onClick={() => setShowAddProduct(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>
      <DataTable columns={columns} data={products} searchKey="name" />
      <ProductForm
        open={showAddProduct}
        onClose={() => setShowAddProduct(false)}
        onSuccess={handleProductAdded}
      />
    </div>
  )
} 