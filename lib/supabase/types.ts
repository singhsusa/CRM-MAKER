export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          description: string
          price: number
          category: string
          status: 'active' | 'inactive'
          created_at: string
        }
        Insert: Omit<Products['Row'], 'id' | 'created_at'>
        Update: Partial<Products['Row']>
      }
      customers: {
        Row: {
          id: string
          company_name: string
          contact_name: string
          contact_email: string
          phone_number: string
          address: string
          industry_type: string
          created_at: string
        }
        Insert: Omit<Customers['Row'], 'id' | 'created_at'>
        Update: Partial<Customers['Row']>
      }
      orders: {
        Row: {
          id: string
          customer_id: string
          billing_contact_name: string
          billing_contact_email: string
          billing_address: string
          order_term: 'monthly' | '1year' | '2year'
          term_start_date: string
          term_end_date: string
          one_time_fee: number
          account_executive: string
          special_notes: string | null
          order_date: string
          status: 'pending' | 'completed' | 'canceled'
          total_value: number
          created_at: string
        }
        Insert: Omit<Orders['Row'], 'id' | 'created_at'>
        Update: Partial<Orders['Row']>
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          units: number
          price_per_unit: number
          created_at: string
        }
        Insert: Omit<OrderItems['Row'], 'id' | 'created_at'>
        Update: Partial<OrderItems['Row']>
      }
      product_status: {
        Row: {
          id: string
          customer_id: string
          product_id: string
          status: 'active' | 'on_hold' | 'terminated'
          start_date: string
          end_date: string
          created_at: string
        }
        Insert: Omit<ProductStatus['Row'], 'id' | 'created_at'>
        Update: Partial<ProductStatus['Row']>
      }
      invoices: {
        Row: {
          id: string
          customer_id: string
          total_amount: number
          invoice_date: string
          due_date: string
          payment_status: 'paid' | 'unpaid' | 'overdue'
          created_at: string
        }
        Insert: Omit<Invoices['Row'], 'id' | 'created_at'>
        Update: Partial<Invoices['Row']>
      }
    }
  }
} 