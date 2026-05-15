# Contributing to StellarInvoice Frontend

Thanks for your interest in contributing! This guide will help you get started.

## Branch Naming

```
feat/short-description       # New features
fix/short-description        # Bug fixes
chore/short-description      # Maintenance tasks
docs/short-description       # Documentation only
```

Examples: `feat/invoice-pdf-export`, `fix/wallet-connect-error`

## Commit Message Style

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add PDF export for invoices
fix: resolve wallet disconnect state bug
chore: update stellar-sdk to v12
docs: add Freighter setup instructions
```

## Running Locally

```bash
# 1. Clone the repo
git clone https://github.com/your-org/stellar-invoicegen-frontend
cd stellar-invoicegen-frontend

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env.local
# Edit .env.local with your values

# 4. Start dev server
npm run dev
```

## Creating Issues

- Search existing issues before creating a new one
- Use the issue templates when available
- Include steps to reproduce for bugs
- Include screenshots for UI issues

## Pull Request Process

1. Fork the repo and create your branch from `main`
2. Make your changes with clear, focused commits
3. Run `npm run type-check` and `npm run lint` — fix any errors
4. Open a PR with a clear title and description
5. Link any related issues with `Closes #123`
6. Wait for review — address feedback promptly

## Coding Standards

- TypeScript strict mode — no `any` types
- Use `cn()` from `lib/utils` for conditional class names
- Components go in `components/` with PascalCase filenames
- Hooks go in `hooks/` with `use` prefix
- Keep components small and focused
- Add comments for non-obvious logic

## Good First Issues

Looking for a place to start? These are beginner-friendly:

- Add loading skeleton to invoice cards
- Add copy-to-clipboard toast notification
- Improve mobile layout for invoice form
- Add invoice number auto-increment display
- Write unit tests for `lib/utils.ts` functions
- Add `aria-label` attributes to icon-only buttons
