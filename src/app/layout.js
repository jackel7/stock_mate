import { Inter } from "next/font/google";
import "./globals.css";
import { MainLayout } from "@/components/layout/MainLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Inventory System",
  description: "Student-level General Purpose Inventory System",
};

import { AuthProvider } from "@/components/params/AuthProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
            <MainLayout>{children}</MainLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
