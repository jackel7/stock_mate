# Stock Mate - Inventory Management System

A general-purpose, student-level Inventory Management System built with Next.js, TailwindCSS, and Supabase.

## Features
- **Dashboard**: Overview of stock, sales, and low inventory.
- **Inventory Management**: Add, edit, delete products with Categories and Vendors.
- **Transactions**: Record Purchases (IN), Sales (OUT), and Adjustments (ADJ).
- **Stock History**: Automatic logging of all stock movements.
- **Agent Integration**: Built-in UI for an external AI agent.
- **Reports**: View history and export to CSV.

## Setup Instructions

### 1. Database Setup (Supabase)
1. Create a new project on [Supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in the left sidebar.
3. Open the `schema.sql` file (located in the project root) and copy its content.
4. Paste into the SQL Editor and click **Run**.
5. (Optional) Run the content of `seed.sql` to populate sample data.

### 2. Environment Configuration
1. Create a file named `.env.local` in the `inventory-system` folder.
2. Add your Supabase credentials (found in Project Settings -> API):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Installation & Running
1. Open a terminal in the `inventory-system` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Styling**: TailwindCSS
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
