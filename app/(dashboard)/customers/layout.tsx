import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Customers",
  description: "Manage your customer relationships.",
}

export default function CustomersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 