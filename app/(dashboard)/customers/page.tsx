'use client'

import { useState } from 'react'
import { DataTable } from '@/components/shared/data-table'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { columns } from './columns'
import { useCustomers } from '@/hooks/use-customers'
import { CustomerForm } from './customer-form'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { ErrorMessage } from '@/components/ui/error-message'

export default function CustomersPage() {
  const { data: customers, isLoading, error, refresh } = useCustomers()
  const [showAddCustomer, setShowAddCustomer] = useState(false)

  const handleCustomerAdded = () => {
    refresh()
    setShowAddCustomer(false)
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
        <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
        <Button onClick={() => setShowAddCustomer(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Customer
        </Button>
      </div>
      <DataTable columns={columns} data={customers} searchKey="name" />
      <CustomerForm
        open={showAddCustomer}
        onClose={() => setShowAddCustomer(false)}
        onSuccess={handleCustomerAdded}
      />
    </div>
  )
} 