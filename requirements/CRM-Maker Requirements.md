# CRM-Maker System Requirements Document

## Project Overview
The CRM-Maker system is designed to store and manage all customer-related data for UZIO. The system will consist of multiple UI portals to handle various aspects of customer and product management. The development will utilize the following technology stack:
- **Frontend**: Next.js
- **Backend/Database**: Supabase

## Functional Requirements

### 1. Product Portal
**Purpose**: To maintain a master list of products offered by UZIO.

**Features**:
- Add new products with details such as:
  - Product Name
  - Product Description
  - Pricing Details
  - Product Category
  - Status (Active/Inactive)
- Edit and update product details.
- View a list of all products with filtering and sorting capabilities.
- Archive or delete products.

### 2. Customer Portal
**Purpose**: To capture and manage customer details.

**Features**:
- Add new customer profiles with details such as:
  - Customer ID (auto-generated)  
  - Company Name
  - Contact Person Name
  - Contact Email
  - Phone Number
  - Address
  - Industry Type
- Edit and update customer details.
- View a list of all customers with filtering and sorting options.
- Search functionality for customer profiles.

### 3. Order Portal
**Purpose**: To capture and manage order details for each customer.

**Features**:
- Add a new order for a customer with fields such as:
  - Order ID (auto-generated)
  - Customer Name (linked to Customer Portal)
  - Name of Billing contact person
  - Email of Billing contact person
  - Address of Billing contact person
  - Order term (monthly, 1 year,  2 year)
  - Order term start date
  - Order term end date
  - Product(s) Ordered (linked to Product Portal)
  - # of units of the product Ordered
  - Price per unit
  - One time fee
  - Name of the Account Executive (AE)
  - Special Notes
  - Order Date
  - Order Status (Pending, Completed, Canceled)
  - Total Order Value
- Edit and update order details.
- View a list of orders with filtering and sorting options.
- Search functionality for orders.

### 4. Customer Status Portal
**Purpose**: To track the status of various products ordered by a customer.

**Features**:
- View a dashboard for each customer displaying:
  - Products ordered
  - Status of each product (Active, On Hold, Terminated)
  - Start Date and End Date for each product's status.
- Update the status of a product for a customer.
- Generate reports of product statuses for a customer.

### 5. Customer Invoicing Portal
**Purpose**: To showcase invoicing details for customers.

**Features**:
- View invoice history for each customer with details such as:
  - Invoice ID
  - Invoice Date
  - Amount Due
  - Payment Status (Paid, Unpaid, Overdue)
- Generate new invoices with fields such as:
  - Invoice ID (auto-generated)
  - Customer Name (linked to Customer Portal)
  - Products and Services (linked to Product Portal)
  - Total Amount
  - Payment Due Date
  - Payment Status
- Send invoices to customers via email.
- Export invoice details as PDF.

## Non-Functional Requirements
- **Scalability**: The system should handle a growing number of customers, products, and orders efficiently.
- **Performance**: Ensure fast response times for database queries and UI interactions.
- **Security**:
  - Implement authentication and authorization for different user roles (e.g., Admin, Sales Representative).
- **Usability**: Provide a clean and intuitive UI for all portals.
- **Integration**: Ensure easy integration with third-party tools for email notifications and payment processing.

## Technology Stack
- **Frontend**: Next.js
- **Backend/Database**: Supabase
- **Authentication**: Supabase Auth


## Development Milestones
1. **Setup and Configuration**:
   - Configure Next.js and Supabase environments.
   - Set up database schema for customers, products, orders, and invoices.
2. **Develop Product Portal**:
   - Build UI and backend for managing the master product list.
3. **Develop Customer Portal**:
   - Build UI and backend for managing customer profiles.
4. **Develop Order Portal**:
   - Build UI and backend for managing customer orders.
5. **Develop Customer Status Portal**:
   - Build UI and backend for tracking product statuses.
6. **Develop Customer Invoicing Portal**:
   - Build UI and backend for invoicing and payment management.
7. **Testing and QA**:
   - Perform unit and integration testing for all components.
   - Ensure security and performance standards are met.
8. **Deployment**:
   - Deploy the application to a production environment.

## Database Schema (High-Level)

### Tables
1. **Products**:
   - ProductID (Primary Key)
   - Name
   - Description
   - Category
   - Price
   - Status

2. **Customers**:
   - CustomerID (Primary Key)
   - CompanyName
   - ContactName
   - ContactEmail
   - PhoneNumber
   - Address
   - IndustryType

3. **Orders**:
   - OrderID (Primary Key)
   - CustomerID (Foreign Key)
 - Name of Billing contact person
  - Email of Billing contact person
- Order term (monthly, 1 year,  2 year)
  - Order term start date
  - Order term end date   
- ProductID (Foreign Key)
   - Price of Product per unit
   - # of units ordered of each product
   - One time fee
   - Name of the AE
   - Special comments
   - OrderDate
   - Status
   - TotalValue

4. **ProductStatus**:
   - StatusID (Primary Key)
   - CustomerID (Foreign Key)
   - ProductID (Foreign Key)
   - Status
   - StartDate
   - EndDate

5. **Invoices**:
   - InvoiceID (Primary Key)
   - CustomerID (Foreign Key)
   - TotalAmount
   - InvoiceDate
   - DueDate
   - PaymentStatus

## Deliverables
- Fully functional CRM system with all specified portals.
- Documentation for deployment and maintenance.
- Testing reports and results.

---

Please use this document as the blueprint for developing the CRM system.

# Current File Structure

Please maintain the following file structure:
CRM-MAKER/
├── .next/
├── app/
├── components/
├── lib/
├── node_modules/
├── requirements/
│   └── CRM-Maker Requirements.md
├── .eslintrc.json
├── .gitignore
├── components.json
├── next-env.d.ts
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md
├── tailwind.config.ts
└── tsconfig.json

# Rules
- All new components should be added to the components folder and named like example-component.tsx unless otherwise specified.
- All new pages should be added to the app folder and named like page.tsx unless otherwise specified.

# CRM-Maker Requirements

## Core Features

### Authentication
- [x] User registration
- [x] User login
- [x] Password reset
- [x] Protected routes

### Customer Management
- [x] View customers list
- [x] Add new customers
- [x] View customer details
- [x] Edit customer information
- [x] Customer status tracking
- [x] View customer orders

### Product Management
- [x] View products list
- [x] Add new products
- [x] Edit product information
- [x] Track product inventory
- [x] Product pricing

### Order Management
- [x] View orders list
- [x] Create new orders
- [x] Add/remove order items
- [x] Order status tracking
- [x] Order total calculation
- [x] Link orders to customers

## Additional Features

### Dashboard
- [x] Overview statistics
- [x] Recent orders
- [x] Sales charts
- [ ] Customer activity

### Data Management
- [ ] Export data to CSV
- [ ] Import data from CSV
- [ ] Bulk operations
- [ ] Data backup

### User Experience
- [x] Responsive design
- [x] Dark/light mode
- [x] Search functionality
- [x] Sorting and filtering
- [ ] Keyboard shortcuts

### Reporting
- [ ] Sales reports
- [ ] Customer reports
- [ ] Product performance
- [ ] Custom report builder

## Technical Requirements

### Performance
- [ ] Optimized database queries
- [ ] Lazy loading
- [ ] Caching
- [ ] Image optimization

### Security
- [x] Row Level Security
- [x] Input validation
- [x] XSS protection
- [x] CSRF protection

### Infrastructure
- [x] Database schema
- [x] API endpoints
- [x] Error handling
- [ ] Logging system
