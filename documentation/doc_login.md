# Login Page Documentation
**File Path**: `src/app/login/page.js`

## 1. Page Overview
The **Login Page** is the entry point of the "Stock Mate" application. Its purpose is to verify who the user is before letting them access the Dashboard.

It supports two modes of entry:
1.  **Dummy Admin** (For Presentations): You enter specific hardcoded credentials, and the system lets you in instantly without checking the internet.
2.  **Supabase Auth** (For Real Production): It connects to the database to verify real users.

---

## 2. Component Breakdown

The entire page is built using **one main component**: `LoginPage`.

### `LoginPage` Component
*   **Type**: "Client Component" (indicated by `"use client"` at the very top).
*   **Why Client?**: Because we need interactivity. We need to handle user typing (inputs), clicking buttons, and showing loading spinners. Server components cannot do this.

### UI Structure (JSX)
The UI is a simple "Card" centered on the screen.
*   **`<div className="min-h-screen ...">`**: This outer box takes up the full height of the screen to center the card.
*   **`<form onSubmit={handleLogin}>`**: The actual form that handles the "Enter" key or "Submit" button click.
*   **`<input>`**: Standard HTML inputs for Email and Password.

---

## 3. Technical Concepts & Hooks

We use **React Hooks** to make the page "alive". Here is every single hook used:

### A. `useState`
**Definition**: A way to store "memory" inside a component. When this memory changes, the screen updates.

**Used In Code**:
1.  `const [loading, setLoading] = useState(false);`
    *   **Why?**: needed to know *if* we are currently logging in. When `true`, we disable the button and show a spinner so the user doesn't click twice.
2.  `const [email, setEmail] = useState("");`
    *   **Why?**: Stores what the user types in the "Email" box.
3.  `const [password, setPassword] = useState("");`
    *   **Why?**: Stores what the user types in the "Password" box.
4.  `const [error, setError] = useState(null);`
    *   **Why?**: If the password is wrong, we store the error message here to display a red box.

### B. `useRouter`
**Definition**: A hook from Next.js that allows us to change the URL (navigate).

**Used In Code**:
*   `const router = useRouter();`
*   `router.push("/");`
*   **Why?**: After a successful login, we need to programmatically send the user to the Dashboard (`/`).

### C. `localStorage`
**Definition**: A browser feature that saves data on your computer even if you close the Chrome window.

**Used In Code**:
*   `localStorage.setItem("stockmate_mock_session", "true");`
*   **Why?**: This is for the **Dummy Admin**. Since we aren't using a real database session, we "flag" your browser as "logged in" by saving this tiny piece of text.

---

## 4. Backend & API Connections

This page connects to:

### 1. **Local Logic (Dummy)**
*   **Check**: If `email === "admin@stockmate.com"` AND `password === "admin123"`.
*   **Action**: Sets `localStorage` and reloads the page.
*   **Why**: Reliability during demos.

### 2. **Supabase API (Real)**
*   **Function**: `supabase.auth.signInWithPassword({ email, password })`
*   **Where**: Imported from `@/lib/supabase`.
*   **Action**: Sends a request to the Supabase Cloud. If valid, Supabase returns a "Session Token".
*   **Why**: Secure, real-world authentication.

---

## 5. Exam Questions (Q&A)

Here are questions your professor might ask, sorted from Easy to Hard.

### Easy Level
1.  **Q: What does `"use client"` do at the top of the file?**
    *   **A:** It tells Next.js that this component runs in the browser (Client), not the server. We need it because we use `useState` for inputs and buttons.
2.  **Q: Where does the user go after logging in?**
    *   **A:** They are redirected to the home route (`/`) which is the Dashboard.
3.  **Q: How do you handle wrong passwords?**
    *   **A:** We catch the error in the `try...catch` block and save the message to the `error` state. This displays a red alert box on the screen.
4.  **Q: What is the purpose of the `loading` state?**
    *   **A:** To improve User Experience (UX). It ensures the user knows something is happening and prevents them from spamming the "Login" button.

### Medium Level
5.  **Q: Explain how the "Dummy Admin" works.**
    *   **A:** We check if the email/password matches a hardcoded string. If it does, we save a flag in `localStorage`. The `AuthProvider` sees this flag and treats us as logged in.
6.  **Q: What is `e.preventDefault()` used for?**
    *   **A:** By default, a form acts like a classic HTML form and refreshes the whole page when submitted. `preventDefault()` stops that, allowing React to handle the login smoothly without blinking.
7.  **Q: Why do we use `router.refresh()` after login?**
    *   **A:** To clear the Next.js Client Cache. It ensures the Dashboard loads fresh data for the new user instead of showing stale, empty data.
8.  **Q: What is the `AuthProvider`?**
    *   **A:** It is a "Wrapper" component (Context) that sits around the whole app. It checks if you are logged in. If not, it kicks you back to this Login page.

### Hard Level
9.  **Q: Why do we force a window reload (`window.location.href`) for the Dummy Admin?**
    *   **A:** Because `localStorage` changes don't automatically trigger React updates across different files. A reload forces the app to restart, check `localStorage`, and realize the user is now logged in.
10. **Q: How is this page secured against SQL Injection?**
    *   **A:** We don't write raw SQL queries here. We use the `supabase-js` client library, which automatically sanitizes inputs before sending them to the database.
11. **Q: Could we implement "Forgot Password" here?**
    *   **A:** Yes, Supabase supports `resetPasswordForEmail`. We would just need to add a button that calls that function with the user's email.
12. **Q: What happens if the internet cuts out during login?**
    *   **A:** The `supabase.auth` call will fail (throw an exception). Our `catch` block handles this and displays a "Network Error" or "Fetch Failed" message to the user.
