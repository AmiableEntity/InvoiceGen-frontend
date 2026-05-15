# StellarInvoice — Frontend

> A modern crypto invoicing app for freelancers. Create invoices, share a payment link, and get paid in XLM or USDC on the Stellar network — all from the browser.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38bdf8?logo=tailwindcss)
![License](https://img.shields.io/badge/license-MIT-green)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)
![Good First Issues](https://img.shields.io/github/issues/AmiableEntity/InvoiceGen-frontend/good%20first%20issue)

---

## What is this?

StellarInvoice lets freelancers:
- Create professional invoices with line items
- Share a public payment link with clients
- Accept payment in XLM or USDC via the Stellar blockchain
- Track payment status in real time

This repo is the **frontend only**. It talks to the [backend repo](https://github.com/AmiableEntity/InvoiceGen-backend) and optionally the [smart contract repo](https://github.com/AmiableEntity/InvoiceGen-Contract).

---

## Tech Stack

| Tool | Purpose |
|---|---|
| Next.js 14 (App Router) | Framework |
| TypeScript | Type safety |
| TailwindCSS + shadcn/ui | Styling |
| Freighter API | Stellar wallet integration |
| Stellar SDK | Transaction building |
| React Hook Form + Zod | Form validation |
| Axios | API calls |
| next-themes | Light/dark mode |

---

## Project Structure

```
app/                        Next.js App Router pages
  page.tsx                  Landing page
  dashboard/                Dashboard + invoice management
  invoice/[id]/             Public shareable invoice page
components/
  ui/                       Base UI primitives (Button, Card, Input...)
  invoice/                  Invoice-specific components
  wallet/                   Freighter wallet button
  layout/                   Navbar, ThemeToggle
hooks/
  useWallet.ts              Freighter connect/disconnect/sign
  useInvoices.ts            Fetch and manage invoices
lib/
  api.ts                    Axios API client
  stellar.ts                Transaction builder + verifier
  utils.ts                  Helpers (formatting, class merging)
  mockData.ts               Sample data for offline dev
types/
  index.ts                  Shared TypeScript types
styles/
  globals.css               CSS variables + Tailwind base
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- [Freighter wallet](https://www.freighter.app/) browser extension

### 1. Clone and install

```bash
git clone https://github.com/AmiableEntity/InvoiceGen-frontend.git
cd InvoiceGen-frontend
npm install
```

### 2. Set up environment

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org
NEXT_PUBLIC_CONTRACT_ID=YOUR_CONTRACT_ID_HERE
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> The app works with mock data even without a backend. Just leave `NEXT_PUBLIC_API_URL` blank.

### 3. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Wallet Setup (Freighter)

1. Install [Freighter](https://www.freighter.app/) for Chrome or Firefox
2. Create or import a Stellar wallet
3. Switch to **Testnet** in Freighter settings
4. Fund your testnet account at [Stellar Laboratory](https://laboratory.stellar.org/#account-creator?network=test)
5. Click **Connect Wallet** in the app

---

## Available Scripts

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run start        # Start production server
npm run type-check   # TypeScript check (no emit)
npm run lint         # ESLint
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | No | Backend API base URL |
| `NEXT_PUBLIC_STELLAR_NETWORK` | Yes | `testnet` or `mainnet` |
| `NEXT_PUBLIC_HORIZON_URL` | Yes | Stellar Horizon URL |
| `NEXT_PUBLIC_CONTRACT_ID` | No | Deployed Soroban contract ID |
| `NEXT_PUBLIC_APP_URL` | Yes | App base URL for shareable links |

---

## Deployment

Deploy to Vercel in one command:

```bash
npx vercel --prod
```

Set all `NEXT_PUBLIC_*` variables in your Vercel project dashboard under **Settings → Environment Variables**.

---

## Related Repos

| Repo | Description |
|---|---|
| [InvoiceGen-backend](https://github.com/AmiableEntity/InvoiceGen-backend) | Express + PostgreSQL API |
| [InvoiceGen-Contract](https://github.com/AmiableEntity/InvoiceGen-Contract) | Soroban smart contract (Rust) |

---

## Contributing

We welcome contributions of all sizes — from fixing a typo to building a new feature. See [CONTRIBUTING.md](./CONTRIBUTING.md) to get started.

---

## Future Improvements

- PDF invoice export
- Email notifications on payment
- Invoice templates
- Recurring invoices
- Multi-currency conversion rates
- Analytics charts

---

## License

MIT — see [LICENSE](./LICENSE)
