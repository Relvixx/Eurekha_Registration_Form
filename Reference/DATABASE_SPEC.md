# E-Cell MET × Eureka Registration Wizard

## DATABASE_SPEC.md

**Version:** 1.0\
**Status:** Database architecture specification\
**Primary backend:** Supabase PostgreSQL + Supabase Storage\
**Source of product requirements:** `PRODUCT_SPEC.md`\
**Authentication model:** Public participant wizard; no participant
account required for MVP\
**Security model:** Server/Edge Function mediated writes + private
Storage + restrictive RLS

------------------------------------------------------------------------

# 1. Purpose

This document defines the Supabase data architecture for the E-Cell MET
× Eureka Registration Wizard.

It translates the product requirements in `PRODUCT_SPEC.md` into:

-   PostgreSQL tables
-   relationships
-   columns and data types
-   constraints
-   indexes
-   registration states
-   draft/recovery strategy
-   screenshot storage
-   Row Level Security (RLS)
-   server-side validation boundaries
-   audit events
-   data lifecycle considerations

The database must support the six-step wizard without creating
unnecessary or duplicated data structures.

------------------------------------------------------------------------

# 2. Design Principles

## 2.1 One registration = one parent record

The `registrations` table is the root entity.

One completed wizard corresponds to one registration record.

``` text
registrations
      │
      ├── team_members
      │
      ├── registration_proofs
      │
      └── registration_events
```

## 2.2 Team members are relational records

Do NOT create fixed columns such as:

``` text
member_1_name
member_2_name
member_3_name
member_4_name
```

Use a separate `team_members` table so that additional members can be
added dynamically.

## 2.3 Derived values should not be duplicated unnecessarily

Team size should be derived from `team_members`.

Do not require a participant to enter team size manually.

## 2.4 Server controls sensitive fields

Participants must not be able to directly set:

-   registration status
-   internal reference code
-   NEC referral code
-   submitted timestamp
-   audit events
-   privileged metadata

These values are controlled by the server/Edge Function.

## 2.5 Proof files are private

Eureka screenshots can contain personal information.

The Storage bucket must be private.

Participants must not receive unrestricted public access to the proof
bucket.

## 2.6 Official Eureka requirements remain configurable

The product specification intentionally leaves some Eureka requirements
open.

Therefore the database must not hard-code:

-   official minimum team size
-   official maximum team size
-   official categories
-   official stages
-   final Eureka identifier terminology

Those values can be configured or changed later without redesigning the
core relational model.

------------------------------------------------------------------------

# 3. High-Level Architecture

``` text
                         Browser
                            │
                            │ HTTPS
                            ▼
                 Application / Edge Function
                            │
                 ┌──────────┴──────────┐
                 │                     │
                 ▼                     ▼
          Supabase PostgreSQL     Supabase Storage
                 │                     │
        ┌────────┼────────┐            │
        │        │        │            │
        ▼        ▼        ▼            ▼
 registrations  team_   events     eureka-proofs
                members
```

The browser should not receive unrestricted database or Storage
privileges.

Recommended write path:

``` text
Browser
   ↓
Edge Function / trusted server endpoint
   ↓
Validation
   ↓
PostgreSQL / Storage
```

------------------------------------------------------------------------

# 4. Tables

MVP uses four core tables:

1.  `registrations`
2.  `team_members`
3.  `registration_proofs`
4.  `registration_events`

No separate `users` table is required for the participant because the
MVP does not require participant accounts.

------------------------------------------------------------------------

# 5. TABLE: `registrations`

## Purpose

Parent record representing one wizard registration.

## Proposed schema

``` sql
create table public.registrations (
  id uuid primary key default gen_random_uuid(),

  reference_code text unique,

  participant_type text not null
    check (participant_type in ('student', 'startup')),

  team_name text not null,

  idea_name text,
  startup_name text,

  problem_statement text not null,
  solution_description text not null,
  short_description text not null,

  category text not null,
  current_stage text not null,

  website_url text,
  linkedin_url text,

  nec_referral_code text not null,

  eureka_registration_id text,

  status text not null default 'DRAFT'
    check (
      status in (
        'DRAFT',
        'EUREKA_PENDING',
        'EUREKA_PROOF_PENDING',
        'EUREKA_PROOF_SUBMITTED',
        'SUBMITTED'
      )
    ),

  current_step smallint not null default 1
    check (current_step between 1 and 6),

  eureka_link_clicked boolean not null default false,
  eureka_self_confirmed boolean not null default false,
  final_confirmation boolean not null default false,

  draft_token_hash text unique,

  draft_expires_at timestamptz,

  last_saved_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  submitted_at timestamptz
);
```

------------------------------------------------------------------------

# 6. `registrations` FIELD REFERENCE

  -----------------------------------------------------------------------------------
  Column                     Type                          Required Purpose
  -------------------------- ---------------- --------------------- -----------------
  `id`                       UUID                               Yes Internal primary
                                                                    key

  `reference_code`           TEXT               No until submission Human-facing
                                                                    E-Cell reference

  `participant_type`         TEXT                               Yes `student` /
                                                                    `startup`

  `team_name`                TEXT                               Yes Team name

  `idea_name`                TEXT                       Conditional Student idea name

  `startup_name`             TEXT                       Conditional Startup name

  `problem_statement`        TEXT                               Yes Problem being
                                                                    addressed

  `solution_description`     TEXT                               Yes Proposed solution

  `short_description`        TEXT                               Yes Short overview

  `category`                 TEXT                               Yes Domain/category

  `current_stage`            TEXT                               Yes Idea/startup
                                                                    stage

  `website_url`              TEXT                                No Optional
                                                                    website/demo

  `linkedin_url`             TEXT                                No Optional relevant
                                                                    LinkedIn/link

  `nec_referral_code`        TEXT                               Yes Server-supplied
                                                                    NEC code used

  `eureka_registration_id`   TEXT                   No until Step 5 Eureka
                                                                    registration
                                                                    identifier

  `status`                   TEXT                               Yes Registration
                                                                    workflow state

  `current_step`             SMALLINT                           Yes Resume/UI state

  `eureka_link_clicked`      BOOLEAN                            Yes Tracks Eureka CTA
                                                                    click

  `eureka_self_confirmed`    BOOLEAN                            Yes Step 4
                                                                    confirmation

  `final_confirmation`       BOOLEAN                            Yes Step 6
                                                                    declaration

  `draft_token_hash`         TEXT                            Drafts Hash of private
                                                                    resume token

  `draft_expires_at`         TIMESTAMPTZ                     Drafts Optional draft
                                                                    expiry

  `last_saved_at`            TIMESTAMPTZ                        Yes Last draft
                                                                    persistence time

  `created_at`               TIMESTAMPTZ                        Yes Creation
                                                                    timestamp

  `updated_at`               TIMESTAMPTZ                        Yes Last update
                                                                    timestamp

  `submitted_at`             TIMESTAMPTZ                         No Final submission
                                                                    timestamp
  -----------------------------------------------------------------------------------

------------------------------------------------------------------------

# 7. Conditional Idea / Startup Fields

The product has two modes.

## Student

Required:

``` text
idea_name
problem_statement
solution_description
category
current_stage
short_description
```

`startup_name` should be NULL.

## Startup

Required:

``` text
startup_name
problem_statement
solution_description
category
current_stage
short_description
```

`idea_name` should be NULL.

A database constraint can enforce the mutually exclusive names:

``` sql
check (
  (participant_type = 'student'
    and idea_name is not null
    and startup_name is null)
  or
  (participant_type = 'startup'
    and startup_name is not null
    and idea_name is null)
)
```

This should be combined with application-level validation.

------------------------------------------------------------------------

# 8. URL Handling

`website_url` and `linkedin_url` are stored as text.

The application/server must validate them as URLs before persistence.

Do not assume every optional link must be a LinkedIn URL unless the
finalized product requirements explicitly require that restriction.

------------------------------------------------------------------------

# 9. TABLE: `team_members`

## Purpose

Stores all members belonging to a registration.

The person filling the form is always the leader.

## Proposed schema

``` sql
create table public.team_members (
  id uuid primary key default gen_random_uuid(),

  registration_id uuid not null
    references public.registrations(id)
    on delete cascade,

  full_name text not null,
  email text not null,
  mobile_number text,

  institution text not null,

  role text not null,
  custom_role text,

  is_leader boolean not null default false,

  member_order integer not null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (registration_id, member_order)
);
```

------------------------------------------------------------------------

# 10. `team_members` FIELD REFERENCE

  Column              Type               Required Purpose
  ------------------- ------------- ------------- ----------------------------------
  `id`                UUID                    Yes Member primary key
  `registration_id`   UUID                    Yes Parent registration
  `full_name`         TEXT                    Yes Member name
  `email`             TEXT                    Yes Member email
  `mobile_number`     TEXT                     No Optional member phone
  `institution`       TEXT                    Yes College/institution/organisation
  `role`              TEXT                    Yes Team role
  `custom_role`       TEXT            Conditional Used when role = `Other`
  `is_leader`         BOOLEAN                 Yes Leader flag
  `member_order`      INTEGER                 Yes UI/display order
  `created_at`        TIMESTAMPTZ             Yes Creation time
  `updated_at`        TIMESTAMPTZ             Yes Update time

------------------------------------------------------------------------

# 11. Team Member Rules

## Leader

Exactly one member must be the leader.

Leader:

``` text
is_leader = true
member_order = 1
```

The leader cannot be deleted by the participant.

## Member 2

Member 2 has:

``` text
member_order = 2
is_leader = false
```

It may be absent.

This is intentional.

## Additional members

Additional members use:

``` text
member_order >= 3
is_leader = false
```

## Dynamic team size

Team size is:

``` sql
select count(*)
from public.team_members
where registration_id = :registration_id;
```

Do not store a manually entered `team_size` in `registrations`.

------------------------------------------------------------------------

# 12. Role Validation

Initial proposed role values:

``` text
Founder
Co-Founder
Developer / Technical
Design
Marketing
Business
Research
Operations
Other
```

If:

``` text
role = 'Other'
```

then:

``` text
custom_role
```

must be supplied.

These values are implementation defaults, not confirmed official Eureka
requirements.

------------------------------------------------------------------------

# 13. Team-Size Validation

Do NOT put a fixed maximum into the database until the official Eureka
requirement is verified.

Once the official limit is known, it should be enforced server-side.

Example:

``` text
MIN_TEAM_SIZE = configurable
MAX_TEAM_SIZE = configurable
```

The database architecture itself does not need to change.

------------------------------------------------------------------------

# 14. TABLE: `registration_proofs`

## Purpose

Stores metadata for the Eureka registration screenshot.

The actual image file lives in Supabase Storage.

## Proposed schema

``` sql
create table public.registration_proofs (
  id uuid primary key default gen_random_uuid(),

  registration_id uuid not null
    references public.registrations(id)
    on delete cascade,

  storage_bucket text not null default 'eureka-proofs',
  storage_path text not null,

  original_filename text not null,
  mime_type text not null,
  file_size_bytes bigint not null,

  uploaded_at timestamptz not null default now(),

  unique (registration_id)
);
```

MVP keeps one current proof per registration.

------------------------------------------------------------------------

# 15. Proof Validation

Allowed MIME types:

``` text
image/jpeg
image/png
```

Extensions accepted by the UI:

``` text
.jpg
.jpeg
.png
```

Maximum file size:

``` text
5 MB
```

Validation must occur:

1.  Client-side for immediate UX.
2.  Server-side before the file is accepted.

Client-side validation alone is not a security boundary.

------------------------------------------------------------------------

# 16. Storage Architecture

Create a private Supabase Storage bucket:

``` text
eureka-proofs
```

## Bucket visibility

``` text
PRIVATE
```

Do not make the bucket public.

## Recommended path

``` text
eureka-proofs/
  {registration_id}/
    {proof_uuid}.{extension}
```

Example:

``` text
eureka-proofs/
  8a7b.../
    91f2....png
```

Do not use the participant's name or email in the storage path.

------------------------------------------------------------------------

# 17. Proof Access

The browser should not receive permanent public URLs to participant
screenshots.

Recommended pattern:

``` text
Browser
   ↓
Edge Function / trusted server
   ↓
authorize registration
   ↓
generate short-lived signed URL
   ↓
Browser previews image
```

If the application does not need participant-side re-viewing after
upload, the proof can remain inaccessible to the public entirely.

------------------------------------------------------------------------

# 18. TABLE: `registration_events`

## Purpose

Provides an audit trail for important registration actions.

## Proposed schema

``` sql
create table public.registration_events (
  id uuid primary key default gen_random_uuid(),

  registration_id uuid not null
    references public.registrations(id)
    on delete cascade,

  event_type text not null,

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);
```

------------------------------------------------------------------------

# 19. Event Types

Initial event vocabulary:

``` text
REGISTRATION_CREATED
STEP_STARTED
DRAFT_SAVED
EUREKA_LINK_CLICKED
EUREKA_CONFIRMED
PROOF_UPLOADED
PROOF_REPLACED
PROOF_REMOVED
REGISTRATION_SUBMITTED
SUBMISSION_FAILED
```

Do not create an event for every keystroke.

Events are for meaningful lifecycle/audit actions.

------------------------------------------------------------------------

# 20. Event Metadata

`metadata` is JSONB and may contain non-sensitive operational
information.

Example:

``` json
{
  "step": 4
}
```

For upload:

``` json
{
  "mime_type": "image/png",
  "file_size_bytes": 284193
}
```

Do not store unnecessary personal information in event metadata.

Do not store raw access tokens in event metadata.

------------------------------------------------------------------------

# 21. Registration State Machine

The conceptual states from `PRODUCT_SPEC.md` are:

``` text
DRAFT
  ↓
EUREKA_PENDING
  ↓
EUREKA_PROOF_PENDING
  ↓
EUREKA_PROOF_SUBMITTED
  ↓
SUBMITTED
```

Recommended transition rules:

``` text
DRAFT
 └── participant reaches Step 4
       ↓
EUREKA_PENDING

EUREKA_PENDING
 └── Eureka confirmation
       ↓
EUREKA_PROOF_PENDING

EUREKA_PROOF_PENDING
 └── valid Eureka ID + proof uploaded
       ↓
EUREKA_PROOF_SUBMITTED

EUREKA_PROOF_SUBMITTED
 └── valid final declaration + submit
       ↓
SUBMITTED
```

------------------------------------------------------------------------

# 22. Status Transition Security

Participants must never be able to arbitrarily send:

``` text
status = 'SUBMITTED'
```

from the browser.

The final state transition must happen through trusted server-side logic
after complete validation.

The same applies to:

-   `reference_code`
-   `submitted_at`
-   `nec_referral_code`
-   audit events

------------------------------------------------------------------------

# 23. Draft / Resume Strategy

The MVP does not require participant accounts.

However, the product specification expects recoverability where
practical.

Recommended anonymous draft mechanism:

``` text
Server generates random resume token
        ↓
Token returned to browser once
        ↓
Browser stores token locally
        ↓
Server stores only token hash
```

Example:

``` text
raw token:
RANDOM_SECRET_VALUE

database:
SHA-256(raw token)
```

The raw token should NOT be stored in the database.

The token acts as a bearer credential for that draft, so it must be:

-   cryptographically random
-   sufficiently long
-   transmitted only over HTTPS
-   never logged
-   never placed in analytics metadata
-   never stored in event metadata

------------------------------------------------------------------------

# 24. Draft Token Scope

A draft token should authorize only the participant's own draft
operations.

It must not allow:

-   access to other registrations
-   access to arbitrary database rows
-   access to the entire Storage bucket
-   status manipulation
-   changing the final reference code
-   reading audit records beyond what is necessary

All token-based operations should go through trusted server/Edge
Function logic.

------------------------------------------------------------------------

# 25. Draft Expiration

A draft may optionally expire after a configurable period.

Example configuration:

``` text
DRAFT_EXPIRY_DAYS = configurable
```

Do not hard-code a business deadline until the E-Cell team decides one.

Expired drafts can be cleaned up by a scheduled job later.

------------------------------------------------------------------------

# 26. Reference Code

The internal E-Cell reference should be generated server-side.

Example format:

``` text
ECELL-EUR-XXXXXXXX
```

Requirements:

-   unique
-   non-guessable enough for user-facing identification
-   generated only by trusted server logic
-   not supplied by the participant

Do not use the database UUID as the primary participant-facing
reference.

------------------------------------------------------------------------

# 27. NEC Referral Code

The NEC referral code is stored in:

``` text
registrations.nec_referral_code
```

Reason:

The current code should be preserved with the historical registration.

However:

-   participant cannot set it
-   participant cannot update it
-   server/configuration supplies it

If the NEC code changes in the future, old submissions still retain the
code that was actually used.

------------------------------------------------------------------------

# 28. Indexes

Recommended indexes:

``` sql
create index idx_registrations_status
  on public.registrations(status);

create index idx_registrations_created_at
  on public.registrations(created_at desc);

create index idx_registrations_participant_type
  on public.registrations(participant_type);

create index idx_team_members_registration_id
  on public.team_members(registration_id);

create index idx_registration_events_registration_id
  on public.registration_events(registration_id);

create index idx_registration_events_type_created
  on public.registration_events(event_type, created_at desc);
```

The unique indexes created by `PRIMARY KEY` and `UNIQUE` constraints are
sufficient for those constrained columns.

------------------------------------------------------------------------

# 29. Updated-at Handling

`updated_at` should be maintained automatically with a PostgreSQL
trigger.

Conceptual implementation:

``` sql
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
```

Apply to:

-   `registrations`
-   `team_members`

------------------------------------------------------------------------

# 30. RLS Security Model

Because this is a public participant wizard with no participant
authentication, **do not create broad anonymous RLS policies such as:**

``` sql
allow anon to select all registrations
allow anon to update all registrations
allow anon to insert anything
```

That would expose or enable manipulation of participant data.

Recommended model:

``` text
anon browser
   │
   ├── limited public access where necessary
   │
   └── all sensitive writes
           ↓
      Edge Function
           ↓
       service role
           ↓
      PostgreSQL
```

The service-role key must never be shipped to the browser.

------------------------------------------------------------------------

# 31. Recommended RLS Baseline

Enable RLS on all application tables:

``` sql
alter table public.registrations enable row level security;
alter table public.team_members enable row level security;
alter table public.registration_proofs enable row level security;
alter table public.registration_events enable row level security;
```

For MVP, the safest default is:

> No direct anonymous table access.

The application uses controlled Edge Functions/server endpoints for
participant operations.

------------------------------------------------------------------------

# 32. Admin Access

The E-Cell team will eventually need an internal way to view
registrations.

Do not solve this by opening the tables to the public.

Recommended future architecture:

``` text
E-Cell Admin
    ↓
Authenticated admin account
    ↓
Admin role / authorization
    ↓
RLS-protected admin queries
```

Admin functionality can be added without changing the participant data
model.

------------------------------------------------------------------------

# 33. Storage Security

Storage bucket:

``` text
eureka-proofs
```

must remain private.

Do not create a policy equivalent to:

``` text
public read all objects
```

Participant upload/download should be scoped to the appropriate
registration through trusted server logic.

------------------------------------------------------------------------

# 34. Transactional Final Submission

Final submission should behave as one controlled operation.

Conceptually:

``` text
BEGIN
   ↓
validate registration
   ↓
validate leader
   ↓
validate members
   ↓
validate participant-specific fields
   ↓
validate Eureka confirmation
   ↓
validate Eureka ID
   ↓
validate proof exists
   ↓
validate final declaration
   ↓
generate reference code
   ↓
set status = SUBMITTED
   ↓
set submitted_at
   ↓
create REGISTRATION_SUBMITTED event
   ↓
COMMIT
```

If a critical database operation fails, the final submission should not
be partially marked as submitted.

------------------------------------------------------------------------

# 35. Duplicate Submission Protection

The final submit endpoint must be idempotent or otherwise protected
against double-clicks/repeated requests.

At minimum:

-   disable the frontend submit button during request
-   revalidate server-side
-   if registration is already `SUBMITTED`, do not create another
    submission
-   preserve the existing reference code

The backend is the actual protection; frontend button disabling is only
UX.

------------------------------------------------------------------------

# 36. Data Integrity Constraints

Recommended database-level protections include:

### Registration

-   valid participant type
-   valid status
-   valid current step
-   unique reference code
-   unique draft token hash

### Team

-   foreign key to registration
-   unique member order per registration
-   exactly one leader enforced through a partial unique index

Example:

``` sql
create unique index uq_one_leader_per_registration
on public.team_members(registration_id)
where is_leader = true;
```

### Proof

-   foreign key to registration
-   one current proof per registration
-   valid positive file size

Example:

``` sql
check (file_size_bytes > 0)
```

------------------------------------------------------------------------

# 37. Leader Integrity

The application/server must guarantee:

``` text
Exactly one leader
Leader = member_order 1
Non-leaders = member_order > 1
```

A database constraint alone may not enforce every business rule cleanly.

Therefore:

-   database constraints protect basic integrity
-   server validation protects workflow/business rules

------------------------------------------------------------------------

# 38. Delete Behavior

If a registration is deleted:

``` text
registrations
    ↓ ON DELETE CASCADE
team_members
registration_proofs
registration_events
```

However, deletion of a database proof row does not automatically delete
the corresponding Storage object.

Storage cleanup must be handled explicitly by trusted backend logic.

For submitted registrations, hard deletion should generally not be
exposed to participants.

------------------------------------------------------------------------

# 39. Proof Replacement

When a participant replaces a screenshot:

1.  Validate the new file.
2.  Upload the new file.
3.  Update the proof metadata.
4.  Record `PROOF_REPLACED`.
5.  Remove the old Storage object after the new file is safely stored.

Do not delete the old file first and then attempt the new upload.

That could create unnecessary data loss on upload failure.

------------------------------------------------------------------------

# 40. Sensitive Data

The database contains:

-   names
-   emails
-   phone numbers
-   institution information
-   startup/idea information
-   Eureka identifiers
-   screenshot metadata
-   potentially sensitive screenshot contents

Therefore:

-   use HTTPS only
-   restrict table access
-   restrict Storage access
-   never expose service-role credentials
-   avoid logging full form payloads
-   avoid logging screenshots
-   avoid logging draft tokens
-   minimize event metadata

------------------------------------------------------------------------

# 41. Logging Rules

Never log:

-   raw draft/resume tokens
-   Supabase service-role keys
-   participant screenshots
-   full participant records unnecessarily
-   authentication secrets

Operational logs should prefer:

``` text
registration_id
event_type
error_code
timestamp
```

over full payload dumps.

------------------------------------------------------------------------

# 42. Data Lifecycle

MVP does not define a permanent retention period.

The E-Cell team must decide:

-   how long submitted registrations are retained
-   when incomplete drafts are deleted
-   how long screenshots are retained
-   whether deletion requests are supported

Until this is decided, do not implement automatic destructive cleanup
for submitted data.

Draft cleanup can be introduced later with an explicit retention policy.

------------------------------------------------------------------------

# 43. Recommended Supabase Configuration

``` text
Supabase Project
│
├── Database
│   ├── registrations
│   ├── team_members
│   ├── registration_proofs
│   └── registration_events
│
├── Storage
│   └── eureka-proofs (private)
│
├── Edge Functions
│   ├── create-registration
│   ├── save-registration
│   ├── upload-proof
│   └── submit-registration
│
└── Auth
    └── Participant accounts not required for MVP
```

The exact number of Edge Functions can be consolidated depending on the
existing project architecture. Do not create functions solely for the
sake of having one function per operation.

------------------------------------------------------------------------

# 44. Recommended Server Operations

The implementation should conceptually expose operations such as:

### Create draft

``` text
createRegistrationDraft()
```

Creates:

-   registration UUID
-   draft token
-   initial state

### Save draft

``` text
saveRegistrationDraft()
```

Updates only fields allowed for the current draft.

### Record Eureka click

``` text
recordEurekaLinkClick()
```

### Confirm Eureka

``` text
confirmEurekaRegistration()
```

### Upload proof

``` text
uploadRegistrationProof()
```

### Submit

``` text
submitRegistration()
```

These are logical operations, not mandatory function names.

------------------------------------------------------------------------

# 45. What the Browser Must NOT Control

The browser must not be trusted to decide:

``` text
status
reference_code
submitted_at
nec_referral_code
registration_events
is_admin
```

The browser may request actions, but the backend decides whether those
actions are valid.

------------------------------------------------------------------------

# 46. Recommended Database ER Diagram

``` text
┌──────────────────────────────┐
│        registrations         │
├──────────────────────────────┤
│ id PK                        │
│ reference_code UNIQUE        │
│ participant_type             │
│ team_name                    │
│ idea_name                    │
│ startup_name                 │
│ problem_statement            │
│ solution_description         │
│ short_description            │
│ category                     │
│ current_stage                │
│ website_url                  │
│ linkedin_url                 │
│ nec_referral_code            │
│ eureka_registration_id       │
│ status                       │
│ current_step                 │
│ eureka_link_clicked          │
│ eureka_self_confirmed        │
│ final_confirmation           │
│ draft_token_hash             │
│ timestamps                   │
└──────────────┬───────────────┘
               │ 1
       ┌───────┼───────────────┐
       │       │               │
       │       │               │
       ▼       ▼               ▼
┌───────────────┐ ┌──────────────────┐ ┌────────────────────┐
│ team_members  │ │registration_proofs│ │registration_events│
├───────────────┤ ├──────────────────┤ ├────────────────────┤
│ id PK         │ │ id PK            │ │ id PK              │
│ registration FK│ │ registration FK  │ │ registration FK    │
│ full_name     │ │ storage_bucket   │ │ event_type         │
│ email         │ │ storage_path     │ │ metadata JSONB     │
│ mobile_number │ │ filename         │ │ created_at         │
│ institution   │ │ mime_type        │ └────────────────────┘
│ role          │ │ file_size_bytes  │
│ custom_role   │ │ uploaded_at      │
│ is_leader     │ └──────────────────┘
│ member_order  │
└───────────────┘
```

------------------------------------------------------------------------

# 47. Database-to-Product Mapping

  -----------------------------------------------------------------------
  Product Step                        Database
  ----------------------------------- -----------------------------------
  Step 1 --- Participant Type         `registrations.participant_type`

  Step 2 --- Team Details             `registrations.team_name` +
                                      `team_members`

  Step 3 --- Idea / Startup           `registrations` idea/startup fields

  Step 4 --- Eureka                   `nec_referral_code`,
                                      `eureka_link_clicked`,
                                      `eureka_self_confirmed`

  Step 5 --- Proof                    `eureka_registration_id` +
                                      `registration_proofs`

  Step 6 --- Review                   Read-only aggregation of all
                                      registration data

  Submit                              `status`, `reference_code`,
                                      `submitted_at`, event

  Success                             `reference_code`
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# 48. What Is Intentionally NOT in This Schema

Do not add these unless a real requirement appears:

-   participant login accounts
-   passwords
-   OTP authentication
-   payment records
-   judging scores
-   mentor records
-   certificates
-   public profiles
-   rankings
-   AI screenshot analysis
-   analytics event warehouse
-   separate table for every wizard step

The database should remain focused on the actual registration workflow.

------------------------------------------------------------------------

# 49. Acceptance Criteria

The database architecture is considered ready when:

-   One registration can contain one leader and any number of non-leader
    members within configured business limits.
-   Member 2 can be absent.
-   Team size can be calculated from `team_members`.
-   Student and Startup data can be represented without conflicting
    fields.
-   The NEC referral code is stored server-side.
-   Eureka confirmation state is stored.
-   Eureka registration identifier is stored.
-   One current screenshot proof can be associated with a registration.
-   Screenshot metadata is separated from the actual Storage object.
-   Proof storage is private.
-   Registration lifecycle states are constrained.
-   Final submission can be made atomically.
-   Duplicate final submission is prevented.
-   Internal reference codes are unique.
-   Audit events can record important lifecycle actions.
-   Anonymous participants can resume a draft without creating accounts,
    if the draft-token mechanism is enabled.
-   Public anonymous users cannot read or modify other participants'
    records.
-   Service-role credentials are never exposed to the browser.
-   Official Eureka team-size/category/stage requirements can be changed
    without redesigning the core schema.

------------------------------------------------------------------------

# 50. Implementation Order

The database should be implemented in this order:

### Phase A --- Core schema

1.  `registrations`
2.  `team_members`
3.  `registration_proofs`
4.  `registration_events`

### Phase B --- Constraints

1.  foreign keys
2.  status checks
3.  participant-type checks
4.  leader uniqueness
5.  proof uniqueness
6.  indexes

### Phase C --- Security

1.  Enable RLS.
2.  Remove broad anonymous access.
3.  Configure private Storage.
4.  Create controlled server/Edge Function operations.
5.  Keep service-role credentials server-side only.

### Phase D --- Operational logic

1.  draft creation
2.  draft persistence
3.  Eureka click tracking
4.  proof upload/replacement
5.  final submission transaction
6.  reference-code generation
7.  audit events

------------------------------------------------------------------------

# 51. Relationship to `PRODUCT_SPEC.md`

`PRODUCT_SPEC.md` is the source of truth for participant-facing product
behavior.

`DATABASE_SPEC.md` is the source of truth for data persistence and
backend data integrity.

If a future UI change does not require a new persisted value, do not
automatically change the database.

If a new participant requirement introduces a new persistent value,
update both documents together.

Any conflict between the documents must be resolved before
implementation continues.

------------------------------------------------------------------------

# 52. Final Architecture Summary

``` text
                    E-CELL MET
                        │
                        ▼
              Eureka Wizard Frontend
                        │
                        │ HTTPS
                        ▼
             Edge Function / Server
                        │
          ┌─────────────┴─────────────┐
          │                           │
          ▼                           ▼
     PostgreSQL                    Storage
          │                           │
          ├── registrations           └── eureka-proofs
          │
          ├── team_members
          │
          ├── registration_proofs
          │
          └── registration_events

Security:
- Private proof bucket
- RLS enabled
- No unrestricted anonymous table access
- Server-side validation
- Server-side final submission
- Service role never exposed
- Draft token stored only as a hash
```

This architecture is intentionally small, relational, secure, and
extensible enough for the six-phase implementation plan.
