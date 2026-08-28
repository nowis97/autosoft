import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Autosoft 360 | Plataforma de Gestión Automotriz",
  description: "DMS, Multipublicación a Mercado Libre y Chileautos, CRM y Financiamiento F&I para automotoras.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="font-sans antialiased min-h-screen bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
