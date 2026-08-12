-- 20260812120000_admin_dashboard.sql

-- Add admin columns to immediate_registrations
ALTER TABLE public.immediate_registrations ADD COLUMN IF NOT EXISTS admin_status TEXT DEFAULT 'pending';
ALTER TABLE public.immediate_registrations ADD COLUMN IF NOT EXISTS internal_notes TEXT;

-- Add admin columns to registrations
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS admin_status TEXT DEFAULT 'pending';
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS internal_notes TEXT;

-- RLS policy updates for service_role update access 
-- (registrations and immediate_registrations should allow updates by service_role)
-- The service_role_all policy might already cover registrations, but let's be explicit for immediate_registrations
-- just in case it's not covered (setup_short_form.sql doesn't seem to have service_role policy explicitly, 
-- but service_role usually bypasses RLS. However, explicitly adding it is safer).

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
