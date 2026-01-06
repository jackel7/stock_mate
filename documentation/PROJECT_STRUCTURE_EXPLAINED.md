# Stock Mate - Project Structure

This document provides a visual overview and detailed explanation of the `Stock Mate` project structure.

## **📂 Visual Project Tree**

```text
Stock_Mate/
├── .env.local                    # 🔒 Secrets (API Keys, DB URL)
├── next.config.js                # ⚙️ Next.js Configuration
├── package.json                  # 📦 Dependencies & Scripts
├── tailwind.config.js            # 🎨 Styling Configuration
├── jsconfig.json                 # 🔧 Import Paths (@/*)
│
├── src/
│   ├── app/                      # 🌐 MAIN APPLICATION (Routes)
│   │   ├── page.js               #    -> "/" (Dashboard)
│   │   ├── login/                #    -> "/login"
│   │   ├── inventory/            #    -> "/inventory" (List/Grid)
│   │   │   └── [id]/             #    -> "/inventory/123" (Details)
│   │   ├── vendors/              #    -> "/vendors"
│   │   ├── categories/           #    -> "/categories"
│   │   ├── layout.js             #    Root Layout (Providers, Fonts)
│   │   └── api/                  # 🤖 BACKEND API ROUTES
│   │       ├── products/         #    Product logic
│   │       ├── vendors/          #    Vendor logic
│   │       ├── categories/       #    Category logic
│   │       └── dashboard/        #    Stats calculation
│   │
│   ├── components/               # 🧩 REUSABLE UI BLOCKS
│   │   ├── layout/               #    (Sidebar, Header, MainShell)
│   │   ├── ui/                   #    (Buttons, Cards, Modals, Inputs)
│   │   └── params/               #    (AuthProvider)
│   │
│   └── lib/                      # 🛠️ UTILITIES
│       ├── supabase.js           #    Database Connection
│       └── utils.js              #    Helper functions
│
└── documentation/                # 📚 Project Guides
    ├── doc_*.md                  #    Specific feature docs
    └── PROJECT_STRUCTURE.md      #    This file
```

---

## **📂 Detailed File Explanations**

### **1. System Configuration (Root)**
Files that configure how the app builds and runs.

*   `package.json`: The **manifest**. Lists libraries like `next`, `react`, `@supabase/supabase-js`, and defines commands like `npm run dev`.
*   `.env.local`: **Secrets**. Stores your Supabase URL and Anon Key. This file is **private** and ignored by Git.
*   `next.config.js`: **Next.js Config**. Controls server settings, image domains, and strict mode.
*   `tailwind.config.js`: **Style Config**. Defines your color palette (`brand-500`), fonts, and responsive breakpoints.

---

### **2. The Frontend (`src/app`)**
Files that determine what the user **sees** and **navigates** to.

*   **`page.js` (Dashboard)**: The homepage. Displays summary cards (Total Stock, Low Stock) and charts.
*   **`layout.js`**: The **Master Template**. It wraps every other page. It loads the Authenticator and Global CSS.
*   **`login/page.js`**: A standalone page for user sign-in.
*   **`inventory/page.js`**: The core workspace. Displays products in a Grid or Table. Includes "Add Product" modal.
*   **`inventory/[id]/page.js`**: A **Dynamic Route**. Shows details for a *specific* product ID (e.g., history, dedicated view).
*   **`vendors/page.js`**: Management page for supplier contacts.
*   **`categories/page.js`**: Management page for product categories.

---

### **3. The Backend (`src/app/api`)**
Server-side code that the Frontend calls to fetch or change data.

*   **`api/dashboard/route.js`**: A heavy-lifter. Calculates total asset value and counts alerts so the Dashboard loads fast.
*   **`api/products/route.js`**: Handles `GET` (List all) and `POST` (Create new) for products.
*   **`api/products/[id]/route.js`**: Handles `PATCH` (Update) and `DELETE` (Remove) for a single product.
*   **`api/vendors/route.js`** & **`api/categories/route.js`**: Standard CRUD endpoints for auxiliary data.

---

### **4. Reusable Components (`src/components`)**
Small blocks of code imported into pages.

*   **`layout/`**:
    *   `Sidebar.js`: The left-hand navigation menu.
    *   `Header.js`: The top bar with Search and User Profile.
    *   `MainLayout.js`: Combines Sidebar + Header to create the logged-in view.
*   **`ui/`**: "Dumb" components that strictly handle visuals (Buttons, Inputs, Cards, Tables, Modals).
*   **`params/AuthProvider.js`**: The **Gatekeeper**. Checks if a user is logged in. If not, redirects them to Login.

---

### **5. Utilities (`src/lib`)**
*   **`supabase.js`**: Initializes the Supabase client once so it can be reused everywhere.
*   **`utils.js`**: Contains the `cn()` helper to merge Tailwind classes cleanly.
