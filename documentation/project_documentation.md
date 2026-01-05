# 2. METHODOLOGY AND REQUIREMENTS

## 2.1 Introduction

This chapter describes the software development methodology and system requirements adopted for the development of Stock Mate – Inventory Management System. The methodology defines the structured approach followed during the system’s development life cycle, while the requirements specify what the system must accomplish to meet user and organizational needs.

## 2.2 Existing Methodologies:

Several software development methodologies are commonly used in modern system development, including:
• Agile
• Spiral Model
• Extreme Programming (XP)
• Scrum
• Waterfall Model

Each methodology has its own strengths depending on project scope, complexity, and requirement stability.

### 2.2.1 Selected Model

There are other development approaches accessible, however Waterfall methodology is the one that works best for our project.

*[Figure 1 Waterfall]*

After evaluating different development approaches, we selected the Waterfall Model for the development of Stock Mate.

**Reason for Selecting Waterfall Model**

The Waterfall model is a linear and sequential approach where each phase must be completed before moving to the next. We chose this model because:
• We clearly defined the project requirements from the beginning.
• The system scope was fixed and unlikely to change frequently.
• We required proper documentation for academic evaluation.
• We could review and approve each development phase before proceeding.
• The clear separation of "Backend API" and "Frontend UI" fit the sequential design process perfectly.

**Phases of Waterfall Model Applied in Stock Mate**

• Requirement Analysis: We gathered all functional and non functional requirements, including user roles (Admin), product creation, inventory tracking, vendor management, and reporting.
• System Design: We designed the system architecture, database schemas (Products, Categories, Vendors tables), API design, and UI layouts.
• Implementation: We implemented the system using:
    • Frontend: Next.js 14 + Tailwind CSS (Responsive Design)
    • Backend: Next.js API Routes (Serverless Architecture)
    • Database: Supabase (PostgreSQL with Foreign Keys)
• Testing: We tested individual modules such as authentication, inventory CRUD, search logic, and dashboard stats for correctness.
• Deployment & Maintenance: We prepared the system for deployment and future enhancements with minimal changes.

## 2.3 General requirements

### 2.3.1 User requirements

We designed the system to be user friendly and efficient for all users. The key user requirements include:
• **Secure Authentication**: Robust login system ensuring only authorized personnel access sensitive data.
• **Efficient Workflow**: Streamlined process for creating, editing, and deleting inventory items.
• **Real-time Status**: Immediate visibility of stock status (e.g., Low Stock warnings).
• **Vendor Tracking**: centralized capability to manage supplier details and reordering.
• **Role based Access**: Strict Admin level permissions to prevent unauthorized modifications.
• **Performance**: High speed response times for data retrieval and submission.
• **Simplicity**: Intuitive user interface requiring minimal technical training.

### 2.3.2 Functional requirements

The functional requirements describe the core features and behavior of the system. The Stock Mate Inventory System shall:

• **Authentication Module**:
    • Allow users to log in securely using Supabase Authentication.
    • Support persistent sessions so users remain logged in.
    • Automatically redirect unauthorized users to the login page.
    • Provide clear error messages for invalid credentials (e.g. "Invalid Login").

• **Access Control**:
    • Implement Role Based Access Control (RBAC) for Admin users.
    • Secure API endpoints to reject unauthenticated requests.
    • Prevent deletion of critical data (e.g., Categories) if dependencies exist.

• **Core Inventory Management**:
    • Enable admins to create new products with extensive details.
    • Allow reading/viewing of the entire product catalog in both Grid and List formats.
    • Permit updating of product details (Price, Quantity, Description) instantly.
    • Facilitate deletion of obsolete products from the system.

• **Product Attributes**:
    • Maintain precise "Cost Price" and "Selling Price" for profit calculation.
    • Store unique "SKU" (Stock Keeping Unit) identifiers for every item.
    • Track "Unit" measurements (e.g., Pieces, Kg, Liters) for accuracy.
    • Store "Reorder Levels" to trigger automated alerts.

• **Stock Intelligence**:
    • Update "Quantity on Hand" immediately after adjustments.
    • Calculate "Total Asset Value" dynamically based on current stock.
    • Display visual "Low Stock" warning badges for items below threshold.
    • Highlight "Out of Stock" items prominently to prompt reordering.

• **Organizational Features**:
    • Manage dynamic "Categories" (e.g., Electronics, Groceries) for grouping.
    • Maintain a "Vendor Directory" with supplier contact info.
    • Link Products to specific Vendors and Categories via relational logic.
    • Prevent data corruption by enforcing Foreign Key constraints.

• **Search & Discovery**:
    • Provide a global "Search Bar" to find items by Name or SKU.
    • Support Case Insensitive filtering for better user experience.
    • Allow sorting of inventory lists by date or status.

• **Media Handling**:
    • Integrate with Cloud Storage (Supabase) for product images.
    • Support secure file uploads via the frontend interface.
    • Generate optimized public URLs for displaying product thumbnails.
    • Handle missing images gracefully with placeholder icons.

• **Reporting & Dashboard**:
    • aggregate key statistics (Total Products, Low Stock Count).
    • Visualize core metrics using clear, color coded Interface cards.
    • Provide a "Pro Tip" or insight section for inventory optimization.

### 2.3.3 Non Functional Requirements (NFR)

Non functional requirements define system quality attributes rather than specific behaviors.

1. Performance:
• The system responds to CRUD operations in under 200ms.
• Dashboards load aggregated statistics in under 2 seconds.
• Search filters operate instantaneously on the client side without page reloads.

2. Reliability:
• Ensures 99.9 percentage system availability via cloud based Supabase infrastructure.
• Prevents data incompatibility through strict Database Schema Constraints.
• Handles network errors gracefully with user friendly Toast notifications.

3. Security:
• Encrypts user passwords using Supabase Auth industry standards.
• Restricts API access to authenticated sessions only via Middleware.
• Sanitizes all user inputs (SQL/HTML) to prevent Injection attacks.

4. Usability:
• Features a clean, modern "Dashboard" layout for high level overview.
• Uses standard icons (Trash, Edit, Plus) to ensure familiarity.
• Provides immediate visual feedback (Loading Spinners, Success Messages).

5. Scalability:
• Designed to handle thousands of product SKUs without architectural changes.
• "Serverless" API functions scale automatically with increased load.
• Database structure supports future addition of modules (e.g., Transactions).

6. Compatibility:
• Fully responsive design works on Desktops, Tablets, and Mobile devices.
• Compatible with all modern browsers (Chrome, Firefox, Edge, Safari).
• UI adapts automatically to different screen resolutions.

7. Maintainability:
• Codebase organized by feature (src/app/inventory, src/app/vendors).
• Uses "Next.js App Router" for clear separation of Frontend and Backend logic.
• Configuration (API Keys) isolated in Environment Variables (.env).

8. Compliance:
• Respects user data privacy by storing only necessary business information.
• Follows standard web accessibility (A/AA) guidelines where possible.

**Conclusion**

By adopting the Waterfall development model, we developed the Stock Mate Inventory Management System in a structured and disciplined manner. Clearly defined requirements, proper documentation, and systematic implementation ensure that the system meets both functional and non functional expectations, making it reliable, secure, and suitable for academic and real world use.
