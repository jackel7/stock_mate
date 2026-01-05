# Dashboard Page Documentation
**File Path**: `src/app/page.js`

## 1. Page Overview
The **Dashboard** is the first thing an Admin sees. Its job is to provide values "at a glance". It doesn't let you edit data; it only **displays** summarized data (Total Products, Low Stock alerts, etc.).

---

## 2. Component Breakdown

### `Dashboard` Component
*   **Type**: "Client Component" (`"use client"`).
*   **Why?**: It needs to fetch data *after* the page loads using `useEffect`, which is a client-side feature.

### Sub-Components (UI Library)
We use reusable components from `src/components/ui/Card.js` to build the stats boxes:
*   **`<Card>`**: The white box container with a border and shadow.
*   **`<CardHeader>`**: The top part of the box (Title + Icon).
*   **`<CardContent>`**: The bottom part (The big number + "From last week" text).

---

## 3. Technical Concepts & Hooks

### A. `useState` (State Management)
We use State to hold the data we get from the database.
1.  `const [stats, setStats] = useState(...)`
    *   **Initial Value**: Objects with zeros (`products: 0`, `totalValue: 0`).
    *   **Why?**: Before the database replies, we need *something* to show (0). When data arrives, we call `setStats` and the numbers magically update to real values.
2.  `const [loading, setLoading] = useState(true)`
    *   **Why?**: We start with `true`. While this is true, we show a "Spinning Circle" (Loader). When data arrives, we set it to `false` to show the real dashboard.

### B. `useEffect` (The "On Load" Hook)
**Definition**: A hook that runs specific code *only when the component first mounts* (appears on screen).

**Used In Code**:
```javascript
useEffect(() => {
  fetchDashboardData();
}, []); // Empty array [] means "Run only once"
```
*   **Why?**: We don't want to fetch data every millisecond. We only want to fetch it once when you open the page.

### C. `fetch` & `async/await`
**Definition**: How JavaScript asks a server for data.
*   **`async`**: Means "This function takes time (it's not instant)".
*   **`await`**: Means "Pause here and wait for the server to reply before moving to the next line".
*   **`res.json()`**: Converts the server's raw text reply into a JavaScript Object we can use.

---

## 4. Backend & API Connections

This page calls a specific internal API Route:
*   **Route**: `/api/dashboard`
*   **Method**: `GET`
*   **What it does**:
    1.  The API connects to Supabase.
    2.  It counts rows in `products`, `vendors`, etc.
    3.  It calculates the sum of (Price * Quantity).
    4.  It returns a JSON object with these totals.

---

## 5. Exam Questions (Q&A)

### Easy Level
1.  **Q: What is the purpose of the empty array `[]` in `useEffect`?**
    *   **A:** It tells React to run the effect **only once**, immediately after the component mounts. If we omitted it, the effect would run on every update, causing an infinite loop of crashing.
2.  **Q: Why do we store `stats` in `useState` instead of a normal variable?**
    *   **A:** Normal variables don't trigger a "re-render". If we updated a normal variable, the screen would still show "0". Updating State forces React to repaint the screen with the new numbers.
3.  **Q: What does the `loading` state do here?**
    *   **A:** It conditionally renders a loading spinner. If `loading` is true, we return the spinner JSX. If false, we return the Dashboard JSX. This prevents the user from seeing "0" or broken layouts while data is fetching.

### Medium Level
5.  **Q: How are the icons (Package, DollarSign) rendered?**
    *   **A:** We use a library called `lucide-react`. These are SVG components that we import and place like normal HTML tags.
6.  **Q: What happens if the API fails (e.g., Server Error)?**
    *   **A:** The `catch (error)` block runs. We log the error to the console. In a production app, we would also set `loading(false)` (which we do in `finally`) and maybe show an error message on screen.
7.  **Q: Why is the component labeled `"use client"`?**
    *   **A:** Because it uses `useEffect` and `useState`. These are hooks that only exist in the browser's React environment, not on the server.

### Hard Level
8.  **Q: How is `totalValue` formatted with commas (e.g., $1,200)?**
    *   **A:** We use the built-in JavaScript method `.toLocaleString()`. It automatically adds commas based on the user's locale settings.
9.  **Q: Explain the `finally` block in `fetchDashboardData`.**
    *   **A:** `finally` runs whether the request succeeded (try) or failed (catch). We put `setLoading(false)` there to guarantee the spinner stops spinning, even if the API crashes.
10. **Q: Could we make this a Server Component instead?**
    *   **A:** Yes! In Next.js App Router, we could make this `async function Dashboard()` and fetch data directly inside the component without `useEffect`. However, we chose Client Component here for easier state management and real-time updates later.
