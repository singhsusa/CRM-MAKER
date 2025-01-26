export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  status: 'active' | 'inactive'
  created_at: string
}

export interface Customer {
  id: string
  company_name: string
  contact_name: string
  contact_email: string
  phone_number: string
  address: string
  industry_type: string
  created_at: string
}

export interface Order {
  id: string
  customer_id: string
  billing_contact_name: string
  billing_contact_email: string
  billing_address: string
  order_term: 'monthly' | '1year' | '2year'
  term_start_date: string
  term_end_date: string
  products: {
    product_id: string
    units: number
    price_per_unit: number
  }[]
  one_time_fee: number
  account_executive: string
  special_notes?: string
  order_date: string
  status: 'pending' | 'completed' | 'canceled'
  total_value: number
}

export interface ProductStatus {
  id: string
  customer_id: string
  product_id: string
  status: 'active' | 'on_hold' | 'terminated'
  start_date: string
  end_date: string
}

export interface Invoice {
  id: string
  customer_id: string
  total_amount: number
  invoice_date: string
  due_date: string
  payment_status: 'paid' | 'unpaid' | 'overdue'
} 