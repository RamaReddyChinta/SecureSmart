# SecureSmart

SecureSmart is a runnable React/Vite personal-finance application: manage money, build wealth, and secure your future.

## Supabase setup

1. Create a Supabase project and run [the migration](supabase/migrations/20260719_initial_schema.sql) in its SQL editor.
2. Copy `.env.example` to `.env.local`, then add the project URL and anon key.
3. Enable Email and Google providers in Supabase Authentication, and add your local/production URLs to the redirect allow-list.

The browser app only uses the anon key. Row Level Security policies in the migration enforce per-user access for every data table.

## Run it

```powershell
npm.cmd run dev
```

Open the local address Vite prints. Build a production bundle with `npm.cmd run build`.

## What is implemented

- Add, edit, and delete expenses
- Search and category filtering
- Monthly-budget editing and remaining-budget progress
- Category spending breakdown, totals, and average transaction value
- Browser persistence with `localStorage`
- Responsive desktop and mobile layout

## Prototype architecture

The original uploaded prototype was a single-screen React implementation. It has:

- A normalized-looking mock data layer (`USER`, `SPACE`, `ACCOUNT`, `CATEGORY`, `TRANSACTION`, `RECURRING_TEMPLATE`, and `BUDGET`), followed by selectors that flatten data for rendering.
- Reusable presentational components such as `PremiumCard`, `TransactionCard`, `AccountCard`, navigation `Tab`, and category `Chip`.
- Six state-driven views: Home, Accounts, Add Transaction, Transactions, Insights, and More.
- Only local `useState` mutations: new transactions and categories are lost on refresh; account balances, budgets, recurring templates, authentication, and settings are display-only.

## Dependencies needed to run the original prototype unchanged

It imports `react`, `lucide-react`, `recharts`, and Tailwind utility classes. Therefore it needs those packages plus a configured Tailwind build pipeline. This implementation uses regular CSS instead, so it only needs React and Vite.

## Recommended next production steps

1. Replace browser storage with an API/database matching the prototype's entities and enforce `user_id` / `space_id` ownership server-side.
2. Add authentication and a real active user/space context.
3. Make account balances derived from transaction records, not independently editable display values.
4. Add scheduled server-side processing for recurring templates, and create corresponding transactions idempotently.
5. Add validation, tests, CSV export, accessibility review, and an encrypted backup/export strategy before handling real financial data.
