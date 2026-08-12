-- Table to store immediate (short form) registrations
CREATE TABLE immediate_registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    participant_type TEXT NOT NULL CHECK (participant_type IN ('student', 'startup')),
    team_name TEXT NOT NULL,
    lead_name TEXT NOT NULL,
    lead_email TEXT NOT NULL,
    lead_phone TEXT NOT NULL,
    lead_alt_phone TEXT,
    lead_college TEXT NOT NULL,
    lead_branch TEXT,
    lead_year TEXT,
    members_names TEXT,
    idea_category TEXT NOT NULL,
    idea_stage TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE immediate_registrations ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for the public form)
CREATE POLICY "Enable insert for anonymous users" ON immediate_registrations
    FOR INSERT WITH CHECK (true);

-- Allow authenticated users to view all
CREATE POLICY "Enable read access for authenticated users" ON immediate_registrations
    FOR SELECT TO authenticated USING (true);
