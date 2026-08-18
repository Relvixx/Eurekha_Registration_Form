-- Migration Script: Sync old large form submissions to immediate_registrations
-- Run this securely in the Supabase SQL Editor.

INSERT INTO immediate_registrations (
    participant_type,
    team_name,
    lead_name,
    lead_email,
    lead_phone,
    lead_college,
    lead_branch,
    lead_year,
    members_names,
    idea_category,
    idea_stage
)
SELECT DISTINCT ON (LOWER(TRIM(r.team_name)))
    r.participant_type,
    r.team_name,
    tm_leader.full_name AS lead_name,
    tm_leader.email AS lead_email,
    tm_leader.mobile_number AS lead_phone,
    tm_leader.institution AS lead_college,
    'N/A' AS lead_branch,
    'N/A' AS lead_year,
    (
        SELECT STRING_AGG(tm_other.full_name, ', ') 
        FROM team_members tm_other 
        WHERE tm_other.registration_id = r.id AND tm_other.is_leader = false
    ) AS members_names,
    r.category AS idea_category,
    r.current_stage AS idea_stage
FROM 
    registrations r
JOIN 
    team_members tm_leader ON tm_leader.registration_id = r.id AND tm_leader.is_leader = true
WHERE 
    r.status = 'SUBMITTED'
    -- Prevent duplicate inserts if the team name is already in immediate_registrations
    AND NOT EXISTS (
        SELECT 1 
        FROM immediate_registrations ir 
        WHERE LOWER(TRIM(ir.team_name)) = LOWER(TRIM(r.team_name))
    )
ORDER BY 
    LOWER(TRIM(r.team_name)), r.submitted_at DESC;
