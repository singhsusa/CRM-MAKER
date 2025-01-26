import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your account settings.",
}

export default function SettingsPage() {
  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      </div>
      {/* Add settings UI here */}
    </div>
  )
} 