// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jarqyn",
  description: "Система отчетов о проблемах города",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" suppressHydrationWarning={true}>
      <body suppressHydrationWarning={true}>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}