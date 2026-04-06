# eRevenue Landing Page Template

Next.js 16 landing page with lead capture form, Prisma/Supabase database, and Resend email integration.

## Project Structure

```
app/
  page.tsx              ← Main landing page (all visible content + layout)
  globals.css           ← Theme colors & CSS variables
  layout.tsx            ← Root layout, font, metadata
  dotaznik/page.tsx     ← Multi-step lead capture form (client component)
  dotaznik-odoslany/page.tsx ← Form success/thank-you page
  gdpr/page.tsx         ← Privacy policy page
  admin/page.tsx        ← PIN login page (client component)
  admin/dashboard/page.tsx ← Dashboard server component (stats + auth check)
  admin/dashboard/DashboardClient.tsx ← Dashboard UI (client component)
  api/send/route.ts     ← Form submission API (saves to DB + sends emails)
  api/admin/verify/route.ts  ← PIN verification + cookie set
  api/admin/leads/route.ts   ← Leads JSON API with search
  api/admin/export/route.ts  ← CSV export download
  api/admin/logout/route.ts  ← Session logout
lib/prisma.ts           ← Prisma client singleton
public/avatars/         ← Avatar photos (person1.jpg - person4.jpg)
```

## How to Edit Content

### Text & Headlines
All visible landing page text is in `app/page.tsx`:
- **Brand name**: Search for "WebZaTýždeň" (appears in logo, also in dotaznik-odoslany and gdpr pages)
- **Hero headline**: Inside `<h1>` in SECTION 1 (~line 52)
- **Hero subheadline**: `<p>` below the headline (~line 58)
- **CTA button text**: Search for "Chcem stretnutie" (appears 3 times)
- **Testimonials**: `const testimonials` array at top of file — edit `text`, `name`, `role`
- **Section title**: "Povedali o mne" in SECTION 2
- **Features**: `const features` array at top of file — 4 feature descriptions
- **Profile name**: "Meno Priezvisko" in SECTION 3 left column
- **CTA section headline**: "Prvý krok je najdôležitejší" in SECTION 4
- **Rating**: "4.9/5" and "+76" social proof counter in SECTION 4
- **Footer**: Company name "TOMAR Group s.r.o. 2026"

### Colors & Theme
All colors are CSS variables in `app/globals.css` under `:root`:
- `--primary` / `--primary-foreground`: Button and heading colors
- `--cta-gradient-from` / `--cta-gradient-to`: Purple gradient in CTA section
- `--text-primary` / `--text-secondary` / `--text-muted`: Text color hierarchy
- `--bg-white` / `--bg-light` / `--bg-card`: Background colors
- `--accent-yellow`: Star rating color
- `--border-light`: Border color

The hero section also has a hardcoded gradient: `from-white via-white to-[#EFE1F9]` in page.tsx.
The form pages use hardcoded `bg-[#EFE1F9]` and gradient colors.

### Images
- Avatar photos: `public/avatars/person1.jpg` through `person4.jpg` (used in CTA section)
- Profile placeholder in SECTION 3: Currently a gray `bg-gray-300` div — replace with an `<Image>` tag
- Feature icons in SECTION 3: Currently gray placeholder divs — replace with images or icons
- Testimonial avatars in SECTION 2: Currently gray circle divs — replace with `<Image>` tags

### Form Configuration
- Form steps defined in `app/dotaznik/page.tsx` → `const steps` array
- Form submits to `/api/send` which sends emails via Resend and saves to Supabase
- Notification email recipient: `info@webzatyzden.sk` in `app/api/send/route.ts`
- Email sender names: "Dotazník" (notification) and "WebZaTýždeň" (confirmation)

### GDPR / Legal
- Company details in `app/gdpr/page.tsx`: name, address, IČO, email
- Effective date at bottom of GDPR page

### Icons
Uses `lucide-react` icons. Current icons: `Rocket` (logo), `Monitor`, `Calendar`, `Check`, `Star`, `ChevronLeft`, `ChevronRight`.

## Environment Variables
- `RESEND_API_KEY` — Email service API key (required for emails)
- `SENDER_DOMAIN` — Verified domain in Resend for sending emails (e.g. `webzatyzden.sk`). Falls back to `resend.dev` (test only)
- `NOTIFICATION_EMAIL` — Where lead notifications are sent (default: `info@webzatyzden.sk`)
- `DATABASE_URL` — Supabase pooled connection string
- `DIRECT_URL` — Supabase direct connection string
- `PROJECT_ID` — Unique project identifier for lead isolation
- `ADMIN_PIN` — 4-digit PIN for admin dashboard login (default: `1234`)

### Admin Dashboard
PIN-protected dashboard at `/admin` for viewing and exporting leads:
- `/admin` — PIN login page
- `/admin/dashboard` — Stats + leads table with search and CSV export
- API routes under `/api/admin/` — verify, leads, export, logout

### Email Setup
The app sends two branded HTML emails on form submission:
1. **Lead notification** → to `NOTIFICATION_EMAIL` with lead details + quick call button
2. **Client confirmation** → to the user with thank-you message + next steps

To send real emails (not just test), verify your domain in Resend and set `SENDER_DOMAIN`.

## Tech Stack
- Next.js 16 (App Router, Turbopack)
- React 19, TypeScript
- Tailwind CSS v4 with CSS variables
- Prisma ORM + PostgreSQL (Supabase)
- Resend (transactional email)
- lucide-react (icons)

## Build
```
npm run build    # runs: prisma generate || true && next build
npm run dev      # runs: next dev
```
