# GearNest Client

GearNest is a Next.js client for an equipment-rental marketplace. Customers can
find and book equipment, owners can manage listings, and admins can review
marketplace activity. Authentication and rental data are provided by the
GearNest API.

## Requirements

- Node.js 20.9 or newer
- npm
- A running GearNest API for authentication and marketplace data

## Local development

Install dependencies and start the development server:

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The client defaults to an
API at `http://localhost:5000`; override it in `.env.local` when your API runs
elsewhere:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:5000
```

`NEXT_PUBLIC_SUPPORT_EMAIL` is an optional public contact address used on the
Contact page. Values prefixed with `NEXT_PUBLIC_` are included in browser code;
do not put credentials or other secrets in them.

## Authentication and deployment

The client uses Better Auth for email/password, Google, and GitHub sign-in.
Google and GitHub provider credentials belong on the backend, not in this
repository.

In production, set `NEXT_PUBLIC_API_URL` to the backend origin and
`NEXT_PUBLIC_AUTH_URL` to the frontend origin. The frontend routes
`/api/auth/*` to the backend, keeping browser authentication requests
same-origin. Configure the backend's `BETTER_AUTH_URL` and `CLIENT_URL` to the
frontend origin, and register these provider callback URLs:

```text
<frontend-origin>/api/auth/callback/google
<frontend-origin>/api/auth/callback/github
```

Keep the frontend origin, backend Better Auth URL, and provider callback URLs
aligned. The API remains responsible for authorization; dashboard pages use
the authenticated user's role to show the appropriate customer, owner, or
admin experience.

## Project commands

```bash
npm run dev       # Start the development server
npm run lint      # Run ESLint
npx tsc --noEmit  # Check TypeScript types
npm run build     # Create a production build
npm run start     # Serve the production build
```

## Main routes

- `/equipment` — search and filter equipment listings
- `/equipment/[id]` — listing details and booking
- `/login` and `/register` — account access
- `/dashboard` — role-specific account and marketplace management
- `/payment/success` and `/payment/cancel` — Stripe Checkout return pages
