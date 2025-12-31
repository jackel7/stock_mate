# Stock Mate Inventory: The Complete Evaluation Handbook

**Version**: Final Combined
**Purpose**: This is the single source of truth for your project evaluation. It combines every guide, code snippet, and question bank created during development into one master document.

---

# TABLE OF CONTENTS
1.  **Part I: The Foundation** (Beginner Glossary & Technologies)
2.  **Part II: The Master Guide** (Deep Dive into Every Page with Code)
    *   Dashboard
    *   Inventory (Client-Side Search)
    *   Categories (API Routes)
    *   Vendors (CRUD)
    *   Transactions (Immutable Audit)
    *   Reports (Tabs & Export)
3.  **Part III: Architecture & Backend Logic**
4.  **Part IV: The Ultimate Question Bank** (90+ Questions & Answers)

---

# PART I: THE FOUNDATION (Zero-to-Hero)

Before code, you must speak the language.

### 1. The "Big 4" Technologies
*   **React.js (The Bricks)**: A library for building "Components" (reusable blocks like Buttons/Cards).
*   **Next.js (The House)**: A framework built on React. It adds Structure (Routing) and Plumbing (API Routes).
*   **Tailwind CSS (The Paint)**: Utility-first styling. We write `bg-blue-500` instead of CSS files.
*   **Supabase (The Filing Cabinet)**: A cloud database (PostgreSQL) that stores our data and images.

### 2. Key Concepts Defined for Beginners
*   **Component**: A reusable chunk of UI.
*   **State (`useState`)**: The "Memory" of a component. When it changes, the screen updates.
*   **Effect (`useEffect`)**: The "Automation" of a component. Runs code on load.
*   **Prop**: Data passed from Parent -> Child.
*   **Hook**: Special functions (start with `use`) that give superpowers to components.
*   **Client-Side Rendering (CSR)**: The browser builds the HTML (used for Dashboard/Inventory).
*   **API Route**: A hidden function on the server that the browser talks to (used for Categories).

---

# PART II: THE MASTER GUIDE (Page-by-Page)

## 1. THE DASHBOARD (`src/app/page.js`)

**Concept**: The Command Center. It aggregates detailed stats instantly.

### The Code: Parallel Fetching
We use `Promise.all` to fetch 5 datasets simultaneously.
```javascript
// Actual Code from src/app/page.js
async function fetchDashboardData() {
  const res = await fetch('/api/dashboard');
  const data = await res.json();
  setStats(data.stats);
}
```
*   **Why?**: Performance and Security. We moved the database logic to an internal API Route. The browser just asks for data, and the server fetches it from Supabase.

### Visuals
*   **Gradient Text**: `bg-clip-text text-transparent bg-gradient-to-r...` makes the title shimmer.
*   **Conditional Colors**: The Low Stock card uses `border-t-accent-500` (Red) to signal urgency.

---

## 2. THE INVENTORY PAGE (`src/app/inventory/page.js`)

**Concept**: The Workhorse. Features **Client-Side Search** and **Image Uploads**.

### The Code: Client-Side Search
We fetch all items once, then filter in memory.
```javascript
const filteredProducts = products.filter(p => 
  p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
  p.sku.toLowerCase().includes(searchTerm.toLowerCase())
);
```
*   **Why?**: Instant feedback. Database searching on every keystroke is laggy.

### The Code: Image Upload
We interact with Supabase Storage, not just the DB.
```javascript
// Upload File
const { data, error } = await supabase.storage.from('product-images').upload(filePath, file);

// Get URL
const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(filePath);

// Save URL to State
setFormData(prev => ({ ...prev, image_url: urlData.publicUrl }));
```
*   **Process**: File -> Storage Bucket -> Public URL -> Database Text Column.

---

## 3. THE CATEGORIES PAGE (`src/app/categories/page.js`)

**Concept**: Server-Side Architecture.

### The Twist: API Routes
Unlike Inventory (Direct DB), this page talks to YOUR server.
*   **Frontend**: `fetch('/api/categories', { method: 'POST' ... })`.
*   **Backend (`route.js`)**: Receives request -> Validates -> Inserts into DB.

### Why use API Routes?
1.  **Security**: Hide logic/keys from the browser.
2.  **Validation**: Verify data specifically before touching the DB.

---

## 4. THE VENDORS PAGE (`src/app/vendors/page.js`)

**Concept**: Full CRUD (Create, Read, Update, Delete) & UX Polish.

### Visual Logic: Avatars
We generate a placeholder logo from the name.
```javascript
// Takes first letter, uppercases it
{vendor.contact_name.charAt(0).toUpperCase()}
```

### CRUD Logic
*   **Add vs Edit**: We reuse the same Modal form.
    *   `if (editingVendor)` -> Update.
    *   `else` -> Create.
*   **Delete**: We use `window.confirm("Are you sure?")` to prevent accidents.

---

## 5. THE TRANSACTIONS PAGE (`src/app/transactions/page.js`)

**Concept**: Immutable Audit Log.

### Rule #1: No Edits
Transactions cannot be changed, only corrected with new transactions. This ensures data integrity.

### Visual Logic: Conditional Badges
We color-code the badges for instant recognition.
```javascript
t.type === 'IN' ? "bg-green-100" :   // Purchase
t.type === 'OUT' ? "bg-blue-100" :   // Sale
"bg-orange-100"                      // Adjustment
```

---

## 6. THE REPORTS PAGE (`src/app/reports/page.js`)

**Concept**: Analysis & Export.

### Code Logic: Tabs
We use conditional rendering to "fake" pages.
```javascript
{activeTab === 'movements' ? <MovementsTable /> : <AgentTable />}
```

### Code Logic: CSV Export (The Hacker Way)
We generate the file in the browser without a backend.
```javascript
const link = document.createElement("a");
link.href = "data:text/csv;charset=utf-8," + csvString;
link.download = "report.csv";
link.click();
```

---

# PART III: ARCHITECTURE & BACKEND DEEP DIVE

### The "Atomic Transaction" Logic
Located in `@/app/api/transactions/route.js`.
When you save a transaction, the server performs a customized "Loop":
1.  **Create Transaction Header** (Date, Type).
2.  **LOOP** through items:
    3.  **Insert Line Item**.
    4.  **Fetch Product Stock**.
    5.  **Calculate New Stock** (Current - Sale).
    6.  **Update Product Table**.
    7.  **Log Movement Table**.
*   **Significance**: This ensures Inventory Quantities stay perfectly keyed to Sales History.

---

# PART IV: THE ULTIMATE QUESTION BANK (90 Questions)

## Section A: Dashboard Questions
1.  **Q: What is the first thing this page does?**
    *   A: Runs `useEffect` -> `fetchDashboardData()`.
2.  **Q: Why use `Promise.all`?**
    *   A: To fetch data in parallel for speed.
3.  **Q: How is the Rainbow Text done?**
    *   A: `bg-clip-text` + linear gradient.
4.  **Q: What if the internet is slow?**
    *   A: The `loading` state keeps the spinner visible.
5.  **Q: Where do icons come from?**
    *   A: `lucide-react`.
6.  **Q: Is this Client or Server side?**
    *   A: Client side (`"use client"`).
7.  **Q: How is "Low Stock" determined?**
    *   A: `.lt("quantity", 10)` query.
8.  **Q: Does it update real-time?**
    *   A: No, it updates on page load/refresh.
9.  **Q: What component wraps the numbers?**
    *   A: The `Card` component.
10. **Q: Why are stats initialized to 0?**
    *   A: Because `useState` needs an initial value before data arrives.

## Section B: Inventory Questions
11. **Q: How does the search work?**
    *   A: Client-side filtering (`.filter()`) on the name/sku.
12. **Q: Why use client-side search?**
    *   A: Instant feedback without server lag.
13. **Q: How are images stored?**
    *   A: Supabase Storage bucket.
14. **Q: How do you get the image URL?**
    *   A: `getPublicUrl()` from Supabase storage.
15. **Q: What is the Grid/List toggle?**
    *   A: A state variable `viewMode` that switches rendering between `div` (Grid) and `Table` (List).
16. **Q: What is `key={product.id}`?**
    *   A: A React requirement to track list items efficiently.
17. **Q: How do you join tables?**
    *   A: `.select("*, categories(name)")`.
18. **Q: Can I edit a product?**
    *   A: Yes, it opens a Modal pre-filled with state.
19. **Q: What stops accidental deletions?**
    *   A: `window.confirm()`.
20. **Q: Why use infinite scrolling (or pagination)?**
    *   A: (Future) To handle very large datasets, though currently we fetch all for speed.

## Section C: Categories & Vendors Questions (API & CRUD)
21. **Q: Why use `fetch` instead of `supabase` here?**
    *   A: To use Next.js API Routes (`/api/categories`) for secure server-side logic.
22. **Q: What HTTP verbs are used?**
    *   A: GET (Read), POST (Create), DELETE (Remove).
23. **Q: How do you handle empty states?**
    *   A: Conditional rendering (`length === 0 ? "No items" : "List"`).
24. **Q: How is the Vendor Avatar made?**
    *   A: First letter of contact name (`charAt(0)`).
25. **Q: Can you update a Vendor?**
    *   A: Yes, the form detects an ID and updates instead of creates.
26. **Q: What is `JSON.stringify`?**
    *   A: Converts Objects to Text for the API.
27. **Q: Where is the API code?**
    *   A: `src/app/api/...`.
28. **Q: What is a Dynamic Route?**
    *   A: `[id]/route.js` - matches any ID.
29. **Q: How do you validate inputs?**
    *   A: Browser `required` attribute + Server side checks.
30. **Q: Why separate Vendors from Inventory?**
    *   A: Relational data normalization.

## Section D: Transactions & Reports Questions
31. **Q: Why immutability?**
    *   A: Data integrity for audits.
32. **Q: How do you color-code badges?**
    *   A: Ternary operators on the `type` field.
33. **Q: What is "ADJ"?**
    *   A: Adjustment (Manual correction).
34. **Q: How is pagination handled here?**
    *   A: `.limit(50)` in the query.
35. **Q: How does CSV export work?**
    *   A: `data:` URI + hidden `<a>` tag click.
36. **Q: Do you use a library for CSV?**
    *   A: No, vanilla JavaScript string manipulation.
37. **Q: How do Tabs work?**
    *   A: `activeTab` state determines which component renders.
38. **Q: What is a `stock_movement`?**
    *   A: A granular log of every single quantity change.
39. **Q: How do transactions verify stock?**
    *   A: They fetch current quantity before subtracting.
40. **Q: What sort order is used?**
    *   A: Descending Date (Newest first).

## Section E: General Tech & Architecture (41-90)
41. **Q: Why Next.js?** A: Full-stack capabilities within one project.
42. **Q: Why Tailwind?** A: Consistency and speed of styling.
43. **Q: Why Supabase?** A: Easy PostgreSQL wrapper.
44. **Q: What is a `useEffect` Dependency Array?** A: Controls when the effect runs.
... (Questions 45-90 covering CSS grids, Responsive Design, State Management, Environment Variables, Deployment process, Git workflow, etc. - *See Ultimate Guide for full list*) ...
(Note: Only summarized here to save space, but full 90 questions are in the 'stock_mate_ultimate_evaluation_guide.md').

---

**END OF HANDBOOK**
This document contains the combined knowledge of the Stock Mate development process.
