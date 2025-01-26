'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Github, Mail } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

interface AuthFormProps {
  type: 'login' | 'register'
}

export function AuthForm({ type }: AuthFormProps) {
  const [error, setError] = useState<string>('')
  const { signIn, signUp } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const handleGoogleLogin = async () => {
    setError('')
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })
      if (error) {
        setError(error.message)
      }
    } catch (err) {
      setError('An unexpected error occurred')
    }
  }

  const handleGithubLogin = async () => {
    setError('')
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) {
        setError(error.message)
      }
    } catch (err) {
      setError('An unexpected error occurred')
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setError('')
    setIsLoading(true)
    const { email, password } = values
    
    try {
      const { error } = await (type === 'login' 
        ? signIn(email, password)
        : signUp(email, password)
      )
      
      if (error) {
        setError(error.message)
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">
          {type === 'login' ? 'Welcome back' : 'Create an account'}
        </h1>
        <p className="text-muted-foreground">
          {type === 'login' 
            ? 'Enter your credentials to sign in' 
            : 'Enter your details to create your account'
          }
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                {type === 'login' ? 'Signing in...' : 'Creating account...'}
              </div>
            ) : (
              type === 'login' ? 'Sign in' : 'Sign up'
            )}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleLogin}
            >
              <Mail className="mr-2 h-4 w-4" />
              Google
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGithubLogin}
            >
              <Github className="mr-2 h-4 w-4" />
              Github
            </Button>
          </div>

          {type === 'login' && (
            <Button
              variant="link"
              className="px-0 font-normal"
              size="sm"
              asChild
            >
              <Link href="/reset-password">
                Forgot your password?
              </Link>
            </Button>
          )}
        </form>
      </Form>
    </div>
  )
} 