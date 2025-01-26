"use client"

import { useState, useEffect } from "react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Plus, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

const orderItemSchema = z.object({
  product_id: z.string().min(1, "Product is required"),
  quantity: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Quantity must be a positive number",
  }),
})

const formSchema = z.object({
  customer_id: z.string().min(1, "Customer is required"),
  billing_contact_name: z.string().min(1, "Billing contact name is required"),
  billing_contact_email: z.string().email("Invalid email address"),
  billing_contact_address: z.string().min(1, "Billing address is required"),
  order_term: z.enum(["monthly", "1 year", "2 year"]),
  term_start_date: z.date({
    required_error: "Start date is required",
  }),
  term_end_date: z.date({
    required_error: "End date is required",
  }),
  items: z.array(orderItemSchema).min(1, "At least one product is required"),
  one_time_fee: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "One-time fee must be a non-negative number",
  }),
  account_executive: z.string().min(1, "Account executive is required"),
  special_notes: z.string().optional(),
  status: z.enum(["pending", "kick-off", "implementation", "live", "on-hold", "canceled"]),
})

interface OrderFormProps {
  open: boolean
  onClose: () => void
  onSuccess?: () => void
  initialData?: Order | null
  mode?: 'create' | 'edit'
}

export function OrderForm({ open, onClose, onSuccess, initialData, mode }: OrderFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [customers, setCustomers] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const { toast } = useToast()
  const supabase = createClient()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customer_id: initialData?.customer_id || "",
      billing_contact_name: initialData?.billing_contact_name || "",
      billing_contact_email: initialData?.billing_contact_email || "",
      billing_contact_address: initialData?.billing_contact_address || "",
      order_term: initialData?.order_term || "monthly",
      term_start_date: initialData?.term_start_date ? new Date(initialData.term_start_date) : undefined,
      term_end_date: initialData?.term_end_date ? new Date(initialData.term_end_date) : undefined,
      one_time_fee: initialData?.one_time_fee?.toString() || "0",
      account_executive: initialData?.account_executive || "",
      special_notes: initialData?.special_notes || "",
      status: initialData?.status || "pending",
      items: initialData?.items || [{ product_id: "", quantity: "1" }],
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch customers
        const { data: customersData } = await supabase
          .from("customers")
          .select("id, name")
          .order("name")

        if (customersData) {
          setCustomers(customersData)
        }

        // Fetch products
        const { data: productsData } = await supabase
          .from("products")
          .select("id, name, price")
          .order("name")

        if (productsData) {
          setProducts(productsData)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [supabase])

  const addItem = () => {
    const items = form.getValues("items")
    form.setValue("items", [...items, { product_id: "", quantity: "1" }])
  }

  const removeItem = (index: number) => {
    const items = form.getValues("items")
    form.setValue("items", items.filter((_, i) => i !== index))
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)

      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error("User not authenticated")
      }

      // Calculate total amount
      const total_amount = values.items.reduce((sum, item) => {
        const product = products.find(p => p.id === item.product_id)
        return sum + (product?.price || 0) * Number(item.quantity)
      }, Number(values.one_time_fee))

      if (mode === 'edit' && initialData?.id) {
        // Update existing order
        const { error: orderError } = await supabase
          .from("orders")
          .update({
            customer_id: values.customer_id,
            billing_contact_name: values.billing_contact_name,
            billing_contact_email: values.billing_contact_email,
            billing_contact_address: values.billing_contact_address,
            order_term: values.order_term,
            term_start_date: values.term_start_date,
            term_end_date: values.term_end_date,
            one_time_fee: Number(values.one_time_fee),
            account_executive: values.account_executive,
            special_notes: values.special_notes || null,
            status: values.status,
            total_amount,
          })
          .eq('id', initialData.id)

        if (orderError) throw orderError

        // Delete existing order items
        const { error: deleteError } = await supabase
          .from("order_items")
          .delete()
          .eq('order_id', initialData.id)

        if (deleteError) throw deleteError

        // Create new order items
        const orderItems = values.items.map(item => {
          const product = products.find(p => p.id === item.product_id)
          return {
            order_id: initialData.id,
            product_id: item.product_id,
            quantity: Number(item.quantity),
            unit_price: product?.price || 0,
          }
        })

        const { error: itemsError } = await supabase
          .from("order_items")
          .insert(orderItems)

        if (itemsError) throw itemsError
      } else {
        // Create new order
        const { data: orderData, error: orderError } = await supabase
          .from("orders")
          .insert([
            {
              customer_id: values.customer_id,
              billing_contact_name: values.billing_contact_name,
              billing_contact_email: values.billing_contact_email,
              billing_contact_address: values.billing_contact_address,
              order_term: values.order_term,
              term_start_date: values.term_start_date,
              term_end_date: values.term_end_date,
              one_time_fee: Number(values.one_time_fee),
              account_executive: values.account_executive,
              special_notes: values.special_notes || null,
              status: values.status,
              total_amount,
              user_id: user.id,
            },
          ])
          .select()
          .single()

        if (orderError) throw orderError

        // Create order items
        const orderItems = values.items.map(item => {
          const product = products.find(p => p.id === item.product_id)
          return {
            order_id: orderData.id,
            product_id: item.product_id,
            quantity: Number(item.quantity),
            unit_price: product?.price || 0,
          }
        })

        const { error: itemsError } = await supabase
          .from("order_items")
          .insert(orderItems)

        if (itemsError) throw itemsError
      }

      toast({
        title: "Success",
        description: `Order ${mode === 'edit' ? 'updated' : 'created'} successfully`,
      })
      form.reset()
      onSuccess?.()
    } catch (error) {
      console.error(`Error ${mode === 'edit' ? 'updating' : 'creating'} order:`, error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : `Failed to ${mode === 'edit' ? 'update' : 'create'} order. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === 'edit' ? 'Edit Order' : 'Create Order'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Customer Selection */}
            <FormField
              control={form.control}
              name="customer_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Billing Contact Information */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="billing_contact_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Billing Contact Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="billing_contact_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Billing Contact Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="billing_contact_address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billing Address</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter billing address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Order Terms */}
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="order_term"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order Term</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select term" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="1 year">1 Year</SelectItem>
                        <SelectItem value="2 year">2 Years</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="term_start_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date()
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="term_end_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < form.getValues("term_start_date")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Products */}
            <div className="space-y-4">
              {form.watch("items").map((_, index) => (
                <div key={index} className="flex gap-4 items-end">
                  <FormField
                    control={form.control}
                    name={`items.${index}.product_id`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Product</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select product" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {products.map((product) => (
                              <SelectItem key={product.id} value={product.id}>
                                {product.name} (${product.price})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem className="w-[100px]">
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <Button type="button" variant="outline" onClick={addItem}>
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>

            {/* Additional Fields */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="one_time_fee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>One-time Fee</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="account_executive"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Executive</FormLabel>
                    <FormControl>
                      <Input placeholder="John Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="special_notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter any special notes" {...field} />
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
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="kick-off">Kick-off</SelectItem>
                      <SelectItem value="implementation">Implementation</SelectItem>
                      <SelectItem value="live">Live</SelectItem>
                      <SelectItem value="on-hold">On Hold</SelectItem>
                      <SelectItem value="canceled">Canceled</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading 
                ? `${mode === 'edit' ? 'Updating...' : 'Creating...'}` 
                : `${mode === 'edit' ? 'Update' : 'Create'} Order`}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 