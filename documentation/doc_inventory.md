# Inventory Page Documentation
**File Path**: `src/app/inventory/page.js`

## 1. Page Overview
The **Inventory Page** is the heart of the system. It allows the Admin to:
1.  View all products (Grid or List view).
2.  Search and Filter products.
3.  **Create** new products.
4.  **Edit** existing products.
5.  **Delete** products.
6.  Upload product images.

---

## 2. Component Breakdown

### `InventoryPage` Component
*   **Type**: "Client Component".
*   **Why**: Deep interactivity. We handle modals, form inputs, local filtering, and image previews in the browser.

### Key Sub-Components
*   **`<Modal>`**: A custom popup window that appears when you click "Add Product". It darkens the background and forces focus on the form.
*   **`<Table>`**: Used in "List View" to show data in rows and columns.
*   **`<Input>`** & **`<Button>`**: Reusable UI elements for consistency.

---

## 3. Technical Concepts & Hooks

This page uses almost every major React concept.

### A. `Promise.all` (Efficient Fetching)
**Used In Code**: `async function fetchData()`
```javascript
const [pRes, cRes, vRes] = await Promise.all([
    fetch('/api/products'),
    fetch('/api/categories'),
    fetch('/api/vendors')
]);
```
*   **Explanation**: We need Products, Categories, and Vendors to display the page.
*   **Why**: Instead of fetching one, waiting, then fetching the next (Serial), we fetch all 3 **at the same time** (Parallel). This makes the page load 3x faster.

### B. `useSearchParams` (URL Query)
**Used In Code**: `const searchParams = useSearchParams();`
*   **Why**: If `Header.js` sends us here with `?search=iphone`, this hook lets us read "iphone" from the URL and automatically filter the list.

### C. `useState` for Modals & Editing
We use a trick to re-use the same Modal for both Adding and Editing.
1.  `const [isModalOpen, setIsModalOpen] = useState(false)`: Shows/Hides the popup.
2.  `const [editingProduct, setEditingProduct] = useState(null)`:
    *   If **null**: We are in "Add Mode" (Empty form).
    *   If **Product Object**: We are in "Edit Mode" (Form pre-filled with this product's data).

### D. Supabase Internal Storage (Image Upload)
**Code Logic**: `onChange={async (e) => ...}`
1.  User selects a file.
2.  We generate a unique name: `${Math.random()}.${ext}`.
3.  `supabase.storage.from('product-images').upload(...)` sends the file to the cloud.
4.  `getPublicUrl(...)` gives us a link (e.g., `https://supabase.co/.../image.jpg`).
5.  We save this **Link** (String) to our database, not the actual image file.

---

## 4. Backend & API Connections

This page interacts with multiple APIs:

*   **GET** `/api/products`: Loads the main list.
*   **POST** to Supabase `products` table: Adds a new row.
*   **UPDATE** (PATCH) to Supabase `products` table: Changes an existing row.
*   **DELETE** from Supabase `products` table: Removes a row.

---

## 5. Exam Questions (Q&A)

### Easy Level
1.  **Q: How do you switch between Grid and List view?**
    *   **A:** We use a state variable `viewMode` ("grid" or "list"). The JSX checks this variable: `viewMode === "list" ? <Table... /> : <Grid... />`.
2.  **Q: What happens when you delete a product?**
    *   **A:** We first ask for confirmation (`confirm()`). If yes, we call `supabase.delete().eq('id', id)`. Then we assume it succeeded and call `fetchData()` to refresh the visible list.
3.  **Q: Why don't we store images directly in the database table?**
    *   **A:** Databases are for text/numbers. Storing large binary files (images) makes the database slow and expensive. We store images in **Storage Buckets** and only keep the *link* (URL) in the database.

### Medium Level
5.  **Q: Explain the Search Filter logic.**
    *   **A:** We fetch *all* products first. Then, in the render function, we run `.filter()` on the array. We check if the `name` OR `sku` includes the `searchTerm` string.
6.  **Q: What is the purpose of `e.stopPropagation()` on the Delete button?**
    *   **A:** The entire product card is clickable (it opens the details). The delete button is *inside* the card. `stopPropagation` stops the click from "bubbling up" to the card, so clicking "Delete" doesn't accidentally open the details page.
7.  **Q: How do you handle "Low Stock" styling?**
    *   **A:** logic: `const isLowStock = product.quantity <= product.reorder_level`. If true, we apply a specific CSS class (e.g., `text-red-500`) to show a warning icon.

### Hard Level
8.  **Q: Why do we use `formData` state object instead of many individual states?**
    *   **A:** Since the form has 10+ fields (Name, Price, SKU...), managing 10 separate state variables would be messy. `formData` groups them all. We update it using `setFormData({ ...formData, field: value })`.
9.  **Q: Explain how `Promise.all` improves performance here.**
    *   **A:** If fetching products takes 1s, categories 1s, and vendors 1s:
        *   **Serial**: 1s + 1s + 1s = 3 seconds total wait.
        *   **Parallel (Promise.all)**: All start now. Total wait = The slowest one (~1 second).
10. **Q: How does the "Edit" feature distinguish between creating and updating?**
    *   **A:** We check if `editingProduct` is set. If standard `supabase.insert` is called. If set, we call `supabase.update(...).eq('id', editingProduct.id)`. The Payload (data) is the same, but the DB command differs.
11. **Q: Why do we parse numbers (`parseInt`, `parseFloat`) before submitting?**
    *   **A:** HTML inputs (`type="number"`) actually return Strings representing numbers. The Database expects strict Numbers. If we send a generic String, the API/Database might reject it or store it incorrectly.
12. **Q: How would you add Pagination to this page?**
    *   **A:** Currently, we filter client-side. To add pagination, we would send `page=1` to the API (`/api/products?page=1`). The API would return only 20 items. We would add "Next/Prev" buttons to increment the page state variables.
