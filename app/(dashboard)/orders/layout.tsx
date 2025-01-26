import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Orders",
  description: "Manage your orders and transactions.",
}

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 