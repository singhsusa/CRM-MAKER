import Link from 'next/link'
import { AuthForm } from '@/components/auth/auth-form'
import { Button } from '@/components/ui/button'

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <AuthForm type="register" />
        <div className="text-center">
          <span className="text-muted-foreground">
            Already have an account?{' '}
          </span>
          <Button variant="link" className="p-0" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
        </div>
      </div>
    </div>
  )
} 