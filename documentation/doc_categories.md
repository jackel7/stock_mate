# Categories Page Documentation
**File Path**: `src/app/categories/page.js`

## 1. Page Overview
The **Categories Page** allows the Admin to organize products into groups (e.g., "Electronics", "Furniture"). It is simpler than the Inventory page but features a critical safety check: **You cannot delete a category if products are using it.**

---

## 2. Component Breakdown

### `CategoriesPage` Component
*   **Structure**:
    *   **Header**: Title + "Add Category" button.
    *   **Filter Bar**: Search input.
    *   **Table**: Lists existing categories.
    *   **Modal**: The popup form for Creating and Editing.

---

## 3. Technical Concepts & Hooks

### A. `useState` (Form Management)
Used for the simple Add/Edit form.
```javascript
const [formData, setFormData] = useState({ name: "", description: "" });
```
*   **Why**: Unlike the complex Inventory form, here we only have 2 fields, so we initialize it with empty strings.

### B. Dependency Check (The Safety Lock)
**Code Logic**:
```javascript
const { count } = await supabase
  .from("products")
  .select("*", { count: "exact", head: true })
  .eq("category_id", id);
```
*   **What it does**: Before deleting a category, it asks the database: "How many products use this category ID?".
*   **Why**: If we deleted "Electronics" while "iPhone" is assigned to it, the "iPhone" data would break (orphaned record). If count > 0, we alert the user and Stop.

### C. Mixed API Strategy
This page demonstrates two ways to talk to the backend:
1.  **Creation**: Uses `/api/categories` (POST).
2.  **Update/Delete**: Uses `supabase` client directly.
*   **Note**: This shows flexibility. API routes are better for complex logic, while direct Supabase calls are faster for simple edits.

---

## 4. Backend & API Connections

*   **GET** `/api/categories`: Fetches the list.
*   **POST** `/api/categories`: creates a new category.
*   **UPDATE/DELETE**: Performed via `supabase-js` client in the browser.

---

## 5. Exam Questions (Q&A)

### Easy Level
1.  **Q: What is the purpose of this page?**
    *   **A:** To create and manage classifications for products, making the inventory easier to browse.
2.  **Q: How does the filtering work?**
    *   **A:** Client-side filtering. We fetch all categories, then use `.filter()` to match the `searchTerm` against the category name.

### Medium Level
3.  **Q: Why do we prevent deletion of used categories?**
    *   **A:** To maintain **Referential Integrity**. We don't want products pointing to a defined category that doesn't exist.
4.  **Q: How does the Modal know if we are Adding or Updating?**
    *   **A:** We check the `editingCategory` state variable. If it's `null`, we are adding. If it contains an object, we are editing.

### Hard Level
5.  **Q: Explain `{ count: "exact", head: true }` in the Supabase query.**
    *   **A:**
        *   `count: "exact"`: Tells Supabase to return the total number of matching rows.
        *   `head: true`: Tells Supabase "Don't send me the actual data (the JSON body), just send the HTTP headers with the count". This is much faster and saves bandwidth.
6.  **Q: Why use `formData` object instead of separate `name` and `desc` states?**
    *   **A:** It scales better. If we add a 3rd field later, we don't need a new variable; we just add a key to the object. It also makes clearing the form easier (`setFormData(initialState)`).
