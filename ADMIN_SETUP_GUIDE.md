# E-Cell Eurekha Admin Dashboard Setup Guide

This guide covers the necessary steps to configure and secure the new Admin Dashboard for the E-Cell Eurekha Registration System.

## Prerequisites

Before starting, ensure you have access to:
1. Your project's Supabase dashboard.
2. Your project's deployment environment (e.g., Vercel) or local `.env.local` file.

---

## Step 1: Database Migration

The dashboard requires two new columns (`admin_status` and `internal_notes`) on both the `immediate_registrations` and `registrations` tables.

### Option A: Run via Supabase SQL Editor (Recommended)

1. Open your Supabase dashboard and go to the **SQL Editor**.
2. Create a new query.
3. Paste and run the following SQL exactly as written:

```sql
-- Add admin columns to immediate_registrations
ALTER TABLE public.immediate_registrations ADD COLUMN IF NOT EXISTS admin_status TEXT DEFAULT 'pending';
ALTER TABLE public.immediate_registrations ADD COLUMN IF NOT EXISTS internal_notes TEXT;

-- Add admin columns to registrations
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS admin_status TEXT DEFAULT 'pending';
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS internal_notes TEXT;

-- Enable update for service_role on immediate_registrations if not already present
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE schemaname = 'public'
          AND tablename = 'immediate_registrations'
          AND policyname = 'service_role_all'
    ) THEN
        CREATE POLICY "service_role_all" ON public.immediate_registrations FOR ALL USING (auth.role() = 'service_role');
    END IF;
END
$$;
```

### Option B: Local Migration
If you use the Supabase CLI:
```bash
supabase db push
```
*(Assuming `20260812120000_admin_dashboard.sql` was created in your `supabase/migrations` folder)*

---

## Step 2: Environment Variables

You must configure several environment variables for the dashboard to function and be secure.

### Local Development (`.env.local`)
Update your `.env.local` file with the following variables:

```env
# Existing Supabase Variables
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# [IMPORTANT] Required for Dashboard Realtime Updates!
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# Admin Dashboard Variables
ADMIN_PASSWORD="your-secure-password"
ADMIN_SESSION_SECRET="a-very-long-random-string-used-for-signing-cookies"
```

### Production (Vercel)
Go to your project settings in Vercel (or your hosting provider) -> **Environment Variables** and add:
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: (Found in Supabase -> Settings -> API)
- `ADMIN_PASSWORD`: A very strong password you will use to log into the dashboard.
- `ADMIN_SESSION_SECRET`: A random string (e.g., use a password generator or `openssl rand -base64 32`).

---

## Step 3: Usage & Security Notes

### Accessing the Dashboard
- Navigate to **`http://localhost:3000/admin`** (or your production URL `https://your-site.com/admin`).
- Enter the `ADMIN_PASSWORD` you configured in Step 2.

### Features
- **Realtime Updates:** The dashboard listens for new submissions on both the short form and the main wizard. When a new submission arrives, a toast notification will appear and the list will update automatically.
- **Secure File Access:** Pitch decks and Eureka proofs are stored securely. Clicking them in the dashboard generates a temporary signed URL valid for 60 seconds, ensuring files cannot be accessed publicly.
- **Internal Notes:** Any notes you type in the detail panel are auto-saved when you click away (onBlur).
- **CSV Export:** The Export button is tab-aware. It will export Quick Leads if you are on the Quick Leads tab, and Full Applications if you are on the Full Applications tab. The export handles CSV escaping to prevent format breaking.

### Security Architecture (Why it's safe)
1. **Next.js Proxy (`proxy.ts`):** We use Next.js 16's standard proxy feature to intercept all requests to `/api/admin-data` and `/api/admin-signed-url`. It ensures that these endpoints cannot be hit without a valid session cookie.
2. **HttpOnly Signed Cookies:** When you log in, a session cookie is created. It is marked `HttpOnly` (preventing XSS attacks) and mathematically signed using `ADMIN_SESSION_SECRET` (preventing cookie spoofing).
3. **No Service Keys in Browser:** The dashboard never exposes the `SUPABASE_SERVICE_ROLE_KEY` to the browser. All elevated queries (like reading the private proofs bucket) happen server-side via the protected `/api/admin-*` routes.
