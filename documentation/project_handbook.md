# Stock Mate Project Handbook
*A Complete Guide for Your Defense*

This handbook breaks down every single page of your project. It explains the **Code**, the **Technologies**, the **Data Flow**, and provides **Questions** your examiner might ask.

---

## Table of Contents
1.  [Project Structure & Technical Concepts](#project-structure--technical-concepts)
2.  [Dashboard](#dashboard)
3.  [Inventory](#inventory)
4.  [Categories](#categories)
5.  [Vendors](#vendors)
6.  [Layout & Sidebar](#layout--sidebar)

---

## 1. Project Structure & Technical Concepts

Before diving into lines of code, you must understand the core concepts used:

*   **Next.js 14 App Router**: We use the `src/app` folder. Use `page.js` for the UI and `route.js` for the Backend API.
*   **"use client"**: Tells Next.js to run the component in the browser (Client Side) so we can use React state (`useState`) and effects (`useEffect`).
*   **Supabase Client**: Configured in `src/lib/supabase.js`. It connects to the database using your environment variables (`NEXT_PUBLIC_Supabase_URL`).
*   **Hybrid Architecture**:
    - Some pages (like **Vendors**) talk to your **API Routes** (`/api/vendors`).
    - Some pages (like **Inventory**) talk **Directly** to Supabase for speed.
    - This demonstrates you know *both* ways to build apps!

---

## 2. Dashboard (`src/app/page.js`)

**Purpose**: Landing page. Shows high-level statistics.
**Data Source**: Reads from `/api/dashboard`.

### Code Breakdown
*   **`useEffect`**: runs `fetchDashboardData()` when the page loads.
*   **`fetchDashboardData()`**: GET request to your own API.
*   **`Stats` State**: Stores numbers for "Products", "Low Stock", etc.
*   **`API Route` (`src/app/api/dashboard/route.js`)**:
    - Uses `Promise.all` to run 3+ queries in parallel (faster).
    - Calculates "Total Value" by summing `quantity * cost_price` for all items.

### Defense Questions
1.  **Low**: Where does this data come from? (A: Supabase Database, via my API).
2.  **Medium**: How is "Low Stock" calculated? (A: The API counts products where `quantity < 10`).
3.  **High**: Why use `Promise.all`? (A: To fetch Products, Vendors, and Counts simultaneously instead of one-by-one, reducing load time).

---

## 3. Inventory (`src/app/inventory/page.js`)

**Purpose**: Main CRUD page. Add, Edit, Delete products.
**Data Source**: Reads via API, Writes directly to Supabase.

### Code Breakdown
*   **`fetchData()`**: Fetches Products, Categories, and Vendors so we can show names (like "Electronics") instead of IDs.
*   **`handleSubmit`**:
    - **Logic**: Checks `if (editingProduct)`.
    - **Update**: Calls `supabase.from("products").update(...)`.
    - **Create**: Calls `supabase.from("products").insert(...)`.
*   **`Image Upload`**:
    - Uses `supabase.storage`.
    - Uploads file -> Gets Public URL -> Saves URL in `products` table.

### Defense Questions
1.  **Low**: How do I add a product? (A: Click "Add Product", fill modal, it sends an INSERT command to Supabase).
2.  **Medium**: How does the image upload work? (A: It goes to a Supabase Storage Bucket, I just save the link).
3.  **High**: Why write directly to Supabase here? (A: It's a serverless pattern. It reduces backend boilerplate for simple forms).

---

## 4. Categories (`src/app/categories/page.js`)

**Purpose**: Manage product categories (e.g., Electronics, Furniture).
**Data Source**: API for Read/Create. Supabase for Update.

### Code Breakdown
*   **`fetchCategories()`**: Calls `/api/categories`.
*   **`handleDelete`**:
    - **Safety Check**: First checks if any products *use* this category.
    - `if (count > 0) alert(...)`: Prevents breaking the database integrity.
*   **`Filtered List`**: Uses JavaScript `.filter()` to search by name instantly on the client side.

### Defense Questions
1.  **Low**: Can I delete any category? (A: No, the code prevents deleting categories that have products assigned to them).
2.  **Medium**: How is search implemented? (A: Client-side filtering. It matches the search string against the category name).
3.  **High**: What happens to the "Description" field? (A: It's optional text stored in the database for admin notes).

---

## 5. Vendors (`src/app/vendors/page.js`)

**Purpose**: Manage suppliers.
**Data Source**: Pure API Implementation (RESTful).

### Code Breakdown
*   **Full API Flow**: Unlike Inventory, this page uses your backend API for everything.
    - GET `/api/vendors`
    - POST `/api/vendors`
    - PUT `/api/vendors/[id]`
    - DELETE `/api/vendors/[id]`
*   **`route.js`**:
    - Defines `GET` and `POST` functions.
    - The dynamic route `[id]/route.js` defines `PUT` and `DELETE`.

### Defense Questions
1.  **Low**: What is a "Vendor"? (A: The supplier who provides the products).
2.  **Medium**: How is this page different from Inventory? (A: This page strictly uses my custom API routes for all operations, ensuring valid JSON responses).
3.  **High**: What is `[id]` in the folder structure? (A: It's a Next.js Dynamic Route parameter, capturing the Vendor ID from the URL).

---

## 6. Layout & Sidebar (`src/components/layout/Sidebar.js`)

**Purpose**: Navigation and consistent UI structure.

### Code Breakdown
*   **`navItems` Array**: A simple list of objects `{ name, href, icon }`.
*   **`pathname` Hook**: `usePathname()` from Next.js.
    - Used to highlight the "Active" tab (e.g., if I'm on `/inventory`, that link turns blue).
*   **Responsive Design**: The sidebar collapses on mobile (using CSS `translate-x`) and can be minimized on desktop.

### Defense Questions
1.  **Low**: How do I change the links? (A: Just edit the `navItems` array in Sidebar.js).
2.  **Medium**: How does the active link highlight work? (A: I compare `pathname` with the link's `href`).
3.  **High**: Is this component rendered on the server? (A: No, it uses `use client` because it needs to track window size and current path).
