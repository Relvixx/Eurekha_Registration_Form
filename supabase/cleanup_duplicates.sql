-- ============================================================================
-- SQL SCRIPT TO CLEAN UP EXACT DUPLICATE TEAM NAMES
-- ============================================================================
-- 1. This script finds exact matches in `team_name` (e.g. 'VissionX' == 'VissionX', but 'VissionX' != 'Vission-X').
-- 2. It keeps the most recent submission and removes/marks the older duplicates.
-- ============================================================================


-- OPTION A: CLEAN UP THE SHORT FORM (immediate_registrations)
-- This completely deletes the older duplicate entries.
DELETE FROM immediate_registrations
WHERE id IN (
    SELECT id
    FROM (
        SELECT id,
               ROW_NUMBER() OVER (PARTITION BY team_name ORDER BY id DESC) as rn
        FROM immediate_registrations
    ) sub
    WHERE rn > 1
);


-- OPTION B: CLEAN UP THE LARGE FORM (registrations)
-- It's safer to mark them as 'DUPLICATE' instead of deleting to avoid foreign key errors with proofs/members.
UPDATE registrations
SET status = 'DUPLICATE'
WHERE id IN (
    SELECT id
    FROM (
        SELECT id,
               ROW_NUMBER() OVER (PARTITION BY team_name ORDER BY submitted_at DESC, id DESC) as rn
        FROM registrations
        WHERE status = 'SUBMITTED'
    ) sub
    WHERE rn > 1
);
