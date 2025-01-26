import Link from 'next/link'
import { AuthForm } from '@/components/auth/auth-form'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <AuthForm type="login" />
        <div className="text-center">
          <span className="text-muted-foreground">
            Don't have an account?{' '}
          </span>
          <Button variant="link" className="p-0" asChild>
            <Link href="/register">Sign up</Link>
          </Button>
        </div>
      </div>
    </div>
  )
} 