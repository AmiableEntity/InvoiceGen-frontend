import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "StellarInvoice — Crypto Invoicing for Freelancers",
  description:
    "Generate professional invoices and get paid in XLM or USDC on the Stellar network.",
  keywords: ["stellar", "invoice", "crypto", "freelancer", "USDC", "XLM", "blockchain"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
