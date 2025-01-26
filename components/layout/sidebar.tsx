'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
} from 'lucide-react'

const routes = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
  },
  {
    label: 'Customers',
    icon: Users,
    href: '/customers',
  },
  {
    label: 'Orders',
    icon: ShoppingCart,
    href: '/orders',
  },
  {
    label: 'Products',
    icon: Package,
    href: '/products',
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-background">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="flex items-center">
          <span className="text-lg font-bold">CRM Maker</span>
        </Link>
      </div>
      <div className="flex-1 space-y-1 p-2">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              'flex items-center gap-x-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
              pathname === route.href ? 'bg-accent text-accent-foreground' : 'transparent'
            )}
          >
            <route.icon className="h-4 w-4" />
            {route.label}
          </Link>
        ))}
      </div>
    </div>
  )
} 