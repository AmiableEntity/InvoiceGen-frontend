# StellarInvoice — Frontend

A modern crypto invoicing frontend built with Next.js, TailwindCSS, and Freighter wallet integration. Freelancers can create invoices and clients can pay using XLM or USDC on the Stellar network.

## Features

- Landing page with fintech-style UI
- Dashboard with invoice stats and management
- Invoice creation form with line items
- Shareable public invoice link
- Freighter wallet connect/disconnect
- Pay invoice flow (build → sign → submit → verify)
- Light/dark mode
- Responsive mobile-first design
- Mock data for offline development

## Architecture

```
app/                  Next.js App Router pages
components/
  ui/                 Base UI components (Button, Card, Input, etc.)
  invoice/            Invoice-specific components
  wallet/             Wallet connect components
  layout/             Navbar, ThemeToggle
hooks/                useWallet, useInvoices
lib/                  api.ts, stellar.ts, utils.ts, mockData.ts
types/                Shared TypeScript types
styles/               Global CSS with CSS variables
```

## Setup

### Prerequisites

- Node.js 18+
- [Freighter wallet extension](https://www.freighter.app/) installed in your browser

### Install

```bash
npm install
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in values:

```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL |
| `NEXT_PUBLIC_STELLAR_NETWORK` | `testnet` or `mainnet` |
| `NEXT_PUBLIC_HORIZON_URL` | Stellar Horizon server URL |
| `NEXT_PUBLIC_CONTRACT_ID` | Deployed Soroban contract ID |
| `NEXT_PUBLIC_APP_URL` | App base URL for shareable links |

### Run

```bash
npm run dev        # Development server (http://localhost:3000)
npm run build      # Production build
npm run start      # Start production server
npm run type-check # TypeScript check
```

## Wallet Setup (Freighter)

1. Install [Freighter](https://www.freighter.app/) browser extension
2. Create or import a Stellar wallet
3. Switch to **Testnet** in Freighter settings for development
4. Fund your testnet account at [Stellar Laboratory](https://laboratory.stellar.org/#account-creator?network=test)
5. Click "Connect Wallet" in the app

## Deployment

Deploy to Vercel:

```bash
npx vercel --prod
```

Set all `NEXT_PUBLIC_*` environment variables in your Vercel project settings.

## Future Improvements

- Email notifications when invoice is paid
- PDF invoice export
- Multi-currency conversion rates
- Invoice templates
- Recurring invoices
- Analytics dashboard
