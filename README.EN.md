# Yumm!

A viral food pre-order website. Customers place orders for specific event dates, while admins manage orders, products, schedules, payments, and reports from a single dashboard.

**Full documentation:** open the following pages while the application is running.

- [`/documentation/features`](http://localhost:3000/documentation/features) — feature list for prospective users
- [`/documentation/admin-guide`](http://localhost:3000/documentation/admin-guide) — dashboard guide for non-technical admins
- [`/documentation/developer`](http://localhost:3000/documentation/developer) — setup guide, important SQL queries, and recovery instructions

## Tech Stack

| Component | Version | Role |
|---|---|---|
| Next.js | 16.3.8 (App Router, Turbopack) | Main framework |
| React | 19.2.8 | UI library |
| TypeScript | 5.x (strict) | Primary language |
| Tailwind CSS | 4.x | Styling, theme tokens in CSS |
| Supabase | — | Postgres + Auth + Storage + RLS |
| Google OAuth | via Supabase | Login |
| lucide-react | latest | Icons |
| Telegram Bot API | — | Real-time notifications |
| bcryptjs | — | Order password hashing |
| Zod | — | Input validation |
| pnpm | 10+ | Package manager |

**Minimum runtime:** Node.js 20.19+

## Quick Start

```bash
pnpm install
cp .env.example .env.local   # then fill in the values
pnpm dev
```

Complete database setup, environment variables, and Google OAuth configuration are explained on the `/documentation/developer` page after the application is running. All important SQL queries are available there in collapsible blocks.

## Development Standards

These standards apply to all contributions. Consistency is more important than personal preference.

### Folder Structure

```text
src/
├── app/                    # Routes (App Router)
│   ├── (documentation)/    # Documentation pages (easy to remove)
│   ├── admin/              # Admin dashboard
│   ├── order/              # Order form
│   └── ...
├── components/             # Presentational components
│   ├── ui/                 # Base components (Button, Pagination)
│   ├── admin/              # Admin-specific components
│   ├── home/               # Homepage components
│   └── documentation/      # Documentation components
├── features/               # Domain-specific logic
│   ├── orders/
│   │   ├── schema.ts       # Zod validation
│   │   ├── queries.ts      # Data read functions
│   │   ├── actions.ts      # Server Action mutations
│   │   └── types.ts        # Domain types
│   └── ...
├── lib/                    # Cross-feature helpers
│   ├── supabase/           # Clients (browser, server, admin)
│   ├── auth.ts             # getCurrentUser, requireAdmin
│   ├── password.ts         # bcrypt helper
│   └── utils.ts            # cn()
├── types/                  # Global types + generated Supabase types
└── proxy.ts                # Supabase session refresh
```

### File and Naming Rules

- One file, one responsibility. Maximum 200 lines. If longer, split it.
- File and folder names: English, lowercase. Example: `order-form.tsx`, not `form-pesanan.tsx`.
- Component names: PascalCase. Example: `OrderForm`, `ProductModal`.
- Component file names: same as the component name. Example: `OrderForm.tsx`.
- Function names: camelCase, starting with a verb. Example: `getAvailableProducts`, `updateOrderStatus`.
- Variable names: camelCase and descriptive. Avoid unclear abbreviations.
- User-facing text: Indonesian. Example: `"Pesan Sekarang"`, `"Belum dikonfirmasi"`.
- Code, comments, and commit messages: English.

### Server Components vs Client Components

- Default: Server Component. Do not add `"use client"` at the top of a file.
- Add `"use client"` only when you need:
  - State (`useState`, `useReducer`)
  - Effects (`useEffect`)
  - Event handlers (`onClick`, `onChange`)
  - Browser APIs (`window`, `localStorage`, `navigator`)
- Keep the client boundary as deep as possible. If only one button needs interactivity, make that button a Client Component rather than the entire page.

### Layering

- Data queries → `features/*/queries.ts`. Always import `"server-only"` at the top of the file.
- Data mutations → `features/*/actions.ts`. Start the file with `"use server"`.
- Validation → `features/*/schema.ts`. Use Zod.
- Domain types → `features/*/types.ts`.
- Presentational components → `components/`. Do not include queries or Server Actions inside them.
- Generic helpers → `lib/`. Only if used across multiple features.

### Server Actions and Security

- Every admin Server Action must call `requireAdmin()`. Do not rely only on role checks in the layout.
- Validate input with Zod before execution. Never trust data from the client.
- Get `user.id` from the session, not from form input. Prevent spoofing.
- For queries that require bypassing RLS, use `createAdminClient()`. Use it only on the server, never in Client Components.

### Client Components

- Forms with server-side validation must use controlled inputs (`value` + `onChange`), not `defaultValue`. This prevents data loss when submission fails.
- Modals with notifications should use the `mountKey` pattern. The wrapper handles opening and closing, while the form is rendered with a `key` that changes each time it opens. This prevents old notifications from appearing again.
- Loaders and submit buttons should use `useFormStatus`. Do not create manual loading state.

### Styling

- Use Tailwind utility-first classes. Do not create new CSS classes unless necessary.
- Define color, radius, and font tokens in `@theme` inside `globals.css`. Do not hardcode hex/rgb values in `className`.
- Name tokens by function, not value. Example: `--color-surface`, not `--color-gray-100`.
- Tailwind class order:
  1. Layout (`display`, `position`, `z-index`, `overflow`)
  2. Flex and grid
  3. Gap
  4. Sizing
  5. Spacing (`padding`, `margin`)
  6. Typography
  7. Color
  8. Border and radius
  9. Effects (`shadow`, `opacity`, `transition`)
  10. State (`hover`, `focus`, `active`, `disabled`)
  11. Responsive prefixes (`sm`, `md`, `lg`, `xl`, `2xl`)

### Icons

- Always use `lucide-react`.
- Use the `ICON_SIZE` constants from `@/lib/icons`. Do not hardcode numbers.
  - `sm` = 16 px
  - `md` = 18 px
  - `lg` = 20 px
- Brand icons (Instagram, TikTok, Facebook, etc.) are not available in lucide. Use the inline SVGs in `components/home/SocialIcon.tsx`.

### Comments

- Add comments only for things that are not obvious from the code: reasoning, constraints, and pitfalls.
- Do not comment on things that are already clear.
- Write comments in English.

### Git

- Commit messages: English, imperative mood.
  - `add order edit modal`, not `added order edit modal`
  - `fix payment status calculation`
  - `refactor sidebar to use lucide icons`
- One commit per logical change. If a change touches three different features, split it into three commits.
- Do not commit `.env.local`. It is already included in `.gitignore`.

## Environment Variables

| Variable | Purpose | Exposure |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Public |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Anon key for client | Public |
| `SUPABASE_SERVICE_ROLE_KEY` | Bypasses RLS, server only | Server |
| `IP_HASH_SALT` | Salt for IP hash rate limiting | Server |
| `NEXT_PUBLIC_SITE_URL` | Base URL for notification links | Public |
| `TELEGRAM_BOT_TOKEN` | Telegram bot token | Server |
| `TELEGRAM_CHAT_ID` | Notification destination chat ID | Server |

Never add the `NEXT_PUBLIC_` prefix to variables that contain secrets.

## Main Pages

| URL | Description | Access |
|---|---|---|
| `/` | Homepage with 8 sections + calendar | Public |
| `/order` | Order form | Public |
| `/order/success` | Order confirmation | Public |
| `/login` | Google login | Public |
| `/terms` | Terms of service | Public |
| `/documentation/features` | Product features | Public |
| `/documentation/admin-guide` | Admin guide | Public |
| `/documentation/developer` | Developer guide | Public |
| `/admin` | Admin dashboard | Admin |
| `/admin/orders` | Manage orders | Admin |
| `/admin/products` | Manage products | Admin |
| `/admin/schedule` | Manage schedules | Admin |
| `/admin/reports` | Reports | Admin |
| `/admin/users` | Manage users | Admin |
| `/admin/reminders` | Automatic reminders | Admin |
| `/admin/homepage` | Featured products | Admin |
| `/admin/faqs` | Manage FAQs | Admin |
| `/admin/settings` | Content settings | Admin |

## License

Private project. Not to be distributed without permission.