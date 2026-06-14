import Link from "next/link";
import { ArrowRight, Zap, Shield, Globe, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/layout/Navbar";

const features = [
  {
    icon: Zap,
    title: "Instant Payments",
    description: "Get paid in seconds with Stellar's 3-5 second settlement time.",
  },
  {
    icon: Shield,
    title: "Secure & Transparent",
    description: "Every payment is recorded on the Stellar blockchain — immutable and verifiable.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Accept XLM or USDC from clients anywhere in the world, no banks needed.",
  },
  {
    icon: Clock,
    title: "Auto Verification",
    description: "Payments are automatically verified on-chain. No manual confirmation needed.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-background to-stellar-purple/5" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -z-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />

        <div className="max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm text-muted-foreground">
            <Zap className="h-3.5 w-3.5 text-primary" />
            Powered by Stellar Blockchain
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            Invoice clients.
            <br />
            <span className="bg-gradient-to-r from-stellar-blue to-stellar-purple bg-clip-text text-transparent">
              Get paid in crypto.
            </span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            StellarInvoice lets freelancers create professional invoices and receive payments in
            XLM or USDC — fast, borderless, and on-chain.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/dashboard">
              <Button variant="stellar" size="xl">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/invoice/demo">
              <Button variant="outline" size="xl">
                View Sample Invoice
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12">
            Everything you need to get paid
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, description }) => (
              <Card key={title} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6 space-y-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-xl mx-auto space-y-4">
          <h2 className="text-3xl font-bold">Ready to get paid on-chain?</h2>
          <p className="text-muted-foreground">
            Connect your Freighter wallet and create your first invoice in under 2 minutes.
          </p>
          <Link href="/dashboard">
            <Button variant="stellar" size="xl">
              Launch Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t py-8 px-4">
        <div className="container max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <span>© {new Date().getFullYear()} StellarInvoice. Built on the Stellar Network.</span>
          <div className="flex items-center gap-4">
            <a
              href="https://stellar.org"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Stellar
            </a>
            <a
              href="https://www.freighter.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Freighter
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
