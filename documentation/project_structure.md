# Project Structure Documentation
**Project Name**: Stock Mate Inventory System

This document provides a detailed breakdown of the file structure, explaining the purpose of every folder and key file in the application.

```
e:\WEB\New\stock_mate\
├── documentation\          # Project Documentation
│   ├── chapter_4...        # System Design Diagrams
│   ├── doc_login.md        # Detailed Guide: Login Page
│   ├── doc_dashboard.md    # Detailed Guide: Dashboard
│   ├── doc_inventory.md    # Detailed Guide: Inventory
│   ├── doc_categories.md   # Detailed Guide: Categories
│   ├── doc_vendors.md      # Detailed Guide: Vendors
│   └── project_structure.md # (This File)
│
├── src\
│   ├── app\                # Next.js App Router (Pages & API)
│   │   ├── api\            # Backend API Routes (Server-Side Logic)
│   │   │   ├── dashboard\  # GET: Stats for the Unified Dashboard
│   │   │   ├── products\   # GET, POST: Manipulate Products table
│   │   │   ├── categories\ # GET, POST: Manipulate Categories table
│   │   │   └── vendors\    # GET, POST, PUT, DELETE: Vendors CRUD
│   │   │
│   │   ├── login\          # Login Page Route
│   │   │   └── page.js     # The Login Screen UI
│   │   │
│   │   ├── inventory\      # Inventory Page Route
│   │   │   └── page.js     # Main Inventory functionality (Grid/List/Add)
│   │   │
│   │   ├── categories\     # Categories Page Route
│   │   │   └── page.js     # Categories Management UI
│   │   │
│   │   ├── vendors\        # Vendors Page Route
│   │   │   └── page.js     # Vendors Management UI
│   │   │
│   │   ├── globals.css     # Global Styles (Tailwind directives)
│   │   ├── layout.js       # Root Layout (wraps the whole app with AuthProvider)
│   │   └── page.js         # Dashboard (Home) Page Source Code
│   │
│   ├── components\         # Reusable React Blocks
│   │   ├── layout\         # Major Layout Blocks
│   │   │   ├── Header.js   # Top bar (Search, Notifications, Profile)
│   │   │   ├── Sidebar.js  # Left navigation menu
│   │   │   └── MainLayout.js # Coordinates Sidebar + Header + Content
│   │   │
│   │   ├── params\         # Global state/Logic
│   │   │   └── AuthProvider.js # Handles Login/Logout logic & Protection
│   │   │
│   │   └── ui\             # "Lego Bricks" (Small UI elements)
│   │       ├── Button.js   # Standardized Clickable Button
│   │       ├── Card.js     # White box container for Dashboard
│   │       ├── Input.js    # Text entry field
│   │       ├── Modal.js    # Pop-up window container
│   │       └── Table.js    # Standardized Data Table
│   │
│   └── lib\                # Library / Helper Scripts
│       ├── supabase.js     # Connects App to Supabase Database
│       └── utils.js        # Helper for merging CSS classes (cn)
│
├── .env.local              # Secrets (API Keys & Database URL)
├── next.config.mjs         # Next.js Configuration
├── package.json            # List of installed libraries (dependencies)
└── tailwind.config.js      # Design Token configuration (colors, fonts)
```

## detailed Description of Key Directories

### 1. `src/app` (The Router)
In Next.js, the folder structure logic **IS** the router logic.
*   **Files named `page.js`** become actual web pages accessible in the browser.
    *   `src/app/page.js` -> `localhost:3000/` (Home)
    *   `src/app/login/page.js` -> `localhost:3000/login`
*   **Files named `route.js` (inside `api`)** become backend endpoints.
    *   `src/app/api/products/route.js` -> `localhost:3000/api/products`

### 2. `src/components` (The UI)
We organize components by **Scope**:
*   **`layout/`**: Components used once per page to define the "Frame" of the app.
*   **`ui/`**: "Dumb" components that just look good. They don't have logic; they just display what you tell them.
*   **`params/`**: Components that don't draw UI but provide logic (Authentication).

### 3. `src/lib` (The utilities)
*   **`supabase.js`**: The most important file for the backend. It initializes the connection to the cloud database.
