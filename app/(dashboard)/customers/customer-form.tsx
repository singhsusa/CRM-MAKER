"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { createClient } from "@/lib/supabase/client"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  fein: z.string()
    .min(9, "FEIN must be 9 digits")
    .max(9, "FEIN must be 9 digits")
    .regex(/^\d+$/, "FEIN must contain only numbers")
    .optional(),
  status: z.enum(["active", "inactive"]),
})

interface CustomerFormProps {
  open: boolean
  onClose: () => void
  onSuccess?: () => void
  initialData?: Customer | null
  mode?: 'create' | 'edit'
}

export function CustomerForm({ 
  open, 
  onClose, 
  onSuccess, 
  initialData,
  mode = 'create' 
}: CustomerFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      company: initialData?.company || "",
      fein: initialData?.fein || "",
      status: initialData?.status || "active",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)

      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error("User not authenticated")
      }

      if (mode === 'edit' && initialData?.id) {
        // Update existing customer
        const { error } = await supabase
          .from("customers")
          .update({
            name: values.name,
            email: values.email,
            phone: values.phone || null,
            company: values.company || null,
            fein: values.fein || null,
            status: values.status,
          })
          .eq('id', initialData.id)

        if (error) throw error
      } else {
        // Create new customer
        const { error } = await supabase
          .from("customers")
          .insert([{
            name: values.name,
            email: values.email,
            phone: values.phone || null,
            company: values.company || null,
            fein: values.fein || null,
            status: values.status,
            user_id: user.id,
          }])

        if (error) throw error
      }

      toast({
        title: "Success",
        description: `Customer ${mode === 'edit' ? 'updated' : 'created'} successfully`,
      })
      form.reset()
      onSuccess?.()
    } catch (error) {
      console.error(`Error ${mode === 'edit' ? 'updating' : 'creating'} customer:`, error)
      toast({
        title: "Error",
        description: `Failed to ${mode === 'edit' ? 'update' : 'create'} customer. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'edit' ? 'Edit' : 'Create'} Customer</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john@example.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="+1 234 567 8900" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input placeholder="Acme Inc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fein"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>FEIN</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="123456789"
                      maxLength={9}
                      {...field}
                      onChange={(e) => {
                        // Only allow numbers
                        const value = e.target.value.replace(/\D/g, '')
                        field.onChange(value)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? `${mode === 'edit' ? 'Updating...' : 'Creating...'}` : `${mode === 'edit' ? 'Update' : 'Create'} Customer`}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 