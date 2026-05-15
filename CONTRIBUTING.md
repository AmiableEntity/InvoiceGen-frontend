# Contributing to StellarInvoice Frontend

First off — thanks for taking the time to contribute! Every contribution helps, whether it's a bug report, a feature suggestion, or a pull request.

This guide will get you from zero to your first PR.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Ways to Contribute](#ways-to-contribute)
- [Good First Issues](#good-first-issues)
- [Local Setup](#local-setup)
- [Branch Naming](#branch-naming)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

---

## Code of Conduct

Be kind. We're all here to learn and build something useful. Harassment, discrimination, or hostile behavior of any kind will not be tolerated.

---

## Ways to Contribute

You don't have to write code to contribute:

- **Report a bug** — open an issue with steps to reproduce
- **Suggest a feature** — open an issue describing the use case
- **Improve docs** — fix typos, clarify setup steps, add examples
- **Write tests** — we have very few right now, all help welcome
- **Fix a bug** — pick an open issue and submit a PR
- **Build a feature** — check the roadmap issues first to avoid duplication

---

## Good First Issues

New here? These are great starting points:

- [ ] Add a toast notification when a shareable link is copied
- [ ] Add loading skeleton to invoice cards
- [ ] Add `aria-label` to all icon-only buttons (accessibility)
- [ ] Display wallet balance (XLM + USDC) in the navbar when connected
- [ ] Add a "no invoices yet" empty state illustration
- [ ] Write unit tests for `lib/utils.ts` helper functions
- [ ] Add form validation error summary at the top of `CreateInvoiceForm`
- [ ] Make invoice due date show "Overdue" in red when past today

Look for issues tagged [`good first issue`](https://github.com/AmiableEntity/InvoiceGen-frontend/issues?q=label%3A%22good+first+issue%22) on GitHub.

---

## Local Setup

```bash
# 1. Fork the repo on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/InvoiceGen-frontend.git
cd InvoiceGen-frontend

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env.local
# Edit .env.local — the app works with mock data, no backend needed

# 4. Start the dev server
npm run dev
# → http://localhost:3000
```

---

## Branch Naming

```
feat/short-description        New feature
fix/short-description         Bug fix
docs/short-description        Documentation only
chore/short-description       Tooling, deps, config
test/short-description        Tests only
```

Examples:
```
feat/pdf-invoice-export
fix/wallet-disconnect-state
docs/freighter-setup-guide
```

---

## Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add PDF export button to invoice view
fix: resolve wallet state not clearing on disconnect
docs: clarify Freighter testnet setup steps
chore: upgrade stellar-sdk to v12
test: add unit tests for formatAmount utility
```

Rules:
- Use present tense ("add" not "added")
- Keep the first line under 72 characters
- Add a body if the change needs more context

---

## Pull Request Process

1. **Fork** the repo and create your branch from `main`
2. **Make your changes** — keep them focused (one feature or fix per PR)
3. **Check for errors** before opening the PR:
   ```bash
   npm run type-check
   npm run lint
   npm run build
   ```
4. **Open the PR** with:
   - A clear title following the commit message style
   - A description of what changed and why
   - Screenshots for any UI changes
   - `Closes #123` if it resolves an issue
5. **Respond to review feedback** — we aim to review within a few days

> Small, focused PRs get reviewed and merged much faster than large ones.

---

## Coding Standards

- **TypeScript strict mode** — no `any` types, no `@ts-ignore` without a comment explaining why
- **Use `cn()`** from `lib/utils` for all conditional Tailwind class merging
- **Component files** — PascalCase, one component per file
- **Hook files** — camelCase with `use` prefix (e.g. `useWallet.ts`)
- **No inline styles** — use Tailwind classes only
- **Accessibility** — all interactive elements need keyboard support and appropriate ARIA attributes
- **Comments** — add a comment for any logic that isn't immediately obvious

---

## Reporting Bugs

Open an issue and include:

1. What you expected to happen
2. What actually happened
3. Steps to reproduce
4. Browser + OS
5. Screenshots or console errors if relevant

---

## Suggesting Features

Open an issue with:

1. The problem you're trying to solve
2. Your proposed solution
3. Any alternatives you considered

We'll discuss it before you invest time building it — this avoids wasted effort.

---

Thanks again for contributing. Every PR, issue, and suggestion makes this project better.
