# Vendors Page Documentation
**File Path**: `src/app/vendors/page.js`

## 1. Page Overview
The **Vendors Page** manages the companies you buy stock from. It is a standard "Address Book" style CRUD application.

---

## 2. Component Breakdown

### `VendorsPage` Component
*   **Structure**: Almost identical to Categories and Inventory, reusing the same Design System (`MainLayout`, `Table`, `Modal`).
*   **Key UI**:
    *   **Avatar Generation**: We generate a simple avatar using the first letter of the contact name (`vendor.contact_name.charAt(0)`).
    *   **Contact Icons**: Uses `Mail` and `Phone` icons from `lucide-react` to make the table look professional.

---

## 3. Technical Concepts & Hooks

### A. Pure API Architecture (Important Difference)
Unlike the Categories page (which mixed Supabase calls and API calls), the Vendors page relies **100% on API Routes**.

*   **Create**: `POST /api/vendors`
*   **Update**: `PUT /api/vendors/${id}`
*   **Delete**: `DELETE /api/vendors/${id}`

**Why is this better?**
It moves all the logic (validation, security checks) to the Server. The frontend just "asks" the server to do it. This is considered more secure and professional than direct DB calls from the browser.

### B. `useEffect` & `fetch`
*   Standard pattern: Load data on mount.
*   `setLoading(true)` -> `fetch` -> `setLoading(false)`.

---

## 4. Backend & API Connections

*   **GET /api/vendors**: Returns the list.
*   **POST /api/vendors**:
    *   Body: `{ size, name, email ... }`
    *   Function: Inserts into `vendors` table.
*   **PUT /api/vendors/[id]**:
    *   Body: `{ size, name, email ... }`
    *   Function: Updates the specific row.
*   **DELETE /api/vendors/[id]**:
    *   Function: Deletes the specific row.

---

## 5. Exam Questions (Q&A)

### Easy Level
1.  **Q: How do we generate the Vendor Avatar (the colored box with a letter)?**
    *   **A:** We take the first character of the Contact Name: `contact_name.charAt(0)`. We display it inside a `div` with a colored background.
2.  **Q: What fields are required to create a vendor?**
    *   **A:** Only `Name` is strictly required (marked with `*`). Email, Phone, and Address are optional but recommended.
3.  **Q: How do you handle empty contact info (e.g., no email)?**
    *   **A:** We use conditional rendering (`{vendor.email ? ... : null}`). If the email is missing, that line simply doesn't appear on the screen.

### Medium Level
4.  **Q: Explain the `PUT` request logic.**
    *   **A:** When submitting the edit form, we check if `editingVendor` exists. If so, we call `fetch('/api/vendors/' + id, { method: 'PUT', body: ... })`.
5.  **Q: Why use `JSON.stringify(formData)`?**
    *   **A:** The `fetch` API sends strings, not JavaScript Objects. We must convert our state object into a JSON string before sending it over the network.

### Hard Level
6.  **Q: Compare Categories Page vs. Vendors Page architecture.**
    *   **A:**
        *   **Categories**: Hybrid (Direct Supabase for some actions). Faster to code, less secure.
        *   **Vendors**: Pure API (All actions via `/api/`). More secure, cleaner separation of concerns ("Backend for Frontend" pattern).
7.  **Q: How would we validate that the Email is in the correct format?**
    *   **A:** Currently, we use `type="email"` in the HTML Input. This provides basic browser validation. For strict validation, we would add a Regex check in the `handleSubmit` function before sending the data.
8.  **Q: What happens if we delete a vendor who supplies 50 products?**
    *   **A:** In the database, we likely have a "Foreign Key Constraint".
        *   **Option A**: The DB blocks the delete (Error).
        *   **Option B (Cascade)**: The products are also deleted (Dangerous).
        *   **Option C**: The product's `vendor_id` becomes NULL.
        *   *Self-Correction*: In this specific code, we catch the error in `try...catch(alert)`. If the DB blocks it, the user sees an alert.
