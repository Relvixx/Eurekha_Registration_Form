# E-Cell MET × Eureka Registration Wizard

## IMPLEMENTATION_GUIDE.md

**Version:** 1.0\
**Status:** Implementation guide\
**Primary backend:** Supabase\
**Frontend:** Existing E-Cell MET website/project\
**Design authority:** Existing E-Cell MET `DESIGN.md`\
**Product authority:** `PRODUCT_SPEC.md`\
**Database authority:** `DATABASE_SPEC.md`

------------------------------------------------------------------------

# 1. Purpose

This document defines how the Eureka Registration Wizard should be
implemented inside the existing E-Cell MET website.

It is an execution guide for the development agent and developers.

The implementation must follow these source-of-truth rules:

1.  `DESIGN.md` controls visual design.
2.  `PRODUCT_SPEC.md` controls product behavior and user flow.
3.  `DATABASE_SPEC.md` controls persistence and database architecture.
4.  This document controls implementation strategy and development
    workflow.
5.  Official Eureka requirements override assumptions marked as
    provisional in the product/database specifications once verified.

Do not invent a new product architecture when the existing project
already provides a suitable pattern.

------------------------------------------------------------------------

# 2. Core Implementation Philosophy

## 2.1 Extend the existing website

The wizard is a feature of the existing E-Cell MET website, not a
separate standalone visual product.

Prefer:

``` text
Existing E-Cell MET website
        ↓
Existing routing/layout
        ↓
New Eureka Wizard route
        ↓
Reusable wizard components
```

Avoid creating an unrelated second frontend unless the existing
repository genuinely cannot support the feature.

## 2.2 Reuse before rebuilding

Before creating components, inspect the existing project for:

-   buttons
-   inputs
-   cards
-   typography
-   modal/dialog components
-   navigation
-   page containers
-   form validation
-   toast/notification components
-   icons
-   loading states
-   responsive utilities
-   existing Supabase utilities

Reuse compatible existing components instead of creating duplicates.

## 2.3 Design before decoration

Do not invent a new visual language.

Follow `DESIGN.md` for:

-   colors
-   typography
-   spacing
-   borders
-   shadows
-   glass surfaces
-   radius
-   buttons
-   inputs
-   responsive behavior
-   animations

The wizard should look like it was always part of the E-Cell website.

## 2.4 Controlled implementation

Do not build all six phases in one request.

Each phase must:

1.  inspect relevant code,
2.  plan changes,
3.  implement only its approved scope,
4.  run checks,
5.  report changes,
6.  stop.

The next phase starts only after review.

------------------------------------------------------------------------

# 3. Source-of-Truth Hierarchy

When instructions conflict, use this order:

``` text
Official verified Eureka requirement
            ↓
PRODUCT_SPEC.md
            ↓
DATABASE_SPEC.md
            ↓
DESIGN.md for visual decisions
            ↓
IMPLEMENTATION_GUIDE.md
            ↓
Developer/AI assumptions
```

Important:

If an implementation assumption conflicts with an officially verified
Eureka requirement, update the affected specification before coding
further.

Do not silently overwrite a product requirement with an AI assumption.

------------------------------------------------------------------------

# 4. Initial Repository Audit

Before writing feature code, the development agent must inspect the
existing repository.

## Audit objectives

Identify:

### Frontend

-   framework
-   build tool
-   routing
-   styling approach
-   component library
-   form library
-   validation library
-   state management
-   existing reusable components

### Backend

-   existing API/server
-   serverless functions
-   Supabase integration
-   authentication
-   environment configuration

### Existing E-Cell website

Identify:

-   homepage structure
-   global layout
-   header/navigation
-   footer
-   page container
-   existing form patterns
-   CTA patterns
-   dark/glass components
-   responsive patterns

### Tooling

Identify:

-   package manager
-   linting
-   formatting
-   type checking
-   testing
-   build command
-   deployment configuration

## Audit rule

Do not modify application code during the initial audit unless a
modification is explicitly required to run a harmless diagnostic
command.

The first output should be an implementation plan, not a code dump.

------------------------------------------------------------------------

# 5. Project Structure Strategy

The exact folder structure must follow the existing repository
conventions.

A possible feature-oriented structure is:

``` text
src/
├── pages/
│   └── EurekaWizard/
│
├── components/
│   └── eureka-wizard/
│       ├── WizardShell
│       ├── WizardProgress
│       ├── WizardNavigation
│       ├── StepParticipantType
│       ├── StepTeamDetails
│       ├── StepIdeaStartup
│       ├── StepEureka
│       ├── StepProof
│       ├── StepReview
│       └── SubmissionSuccess
│
├── lib/
│   ├── validation/
│   ├── supabase/
│   └── eureka/
│
└── types/
    └── eureka.ts
```

This is a reference architecture, not a mandatory folder structure.

If the existing project uses a different architecture, follow the
existing convention.

------------------------------------------------------------------------

# 6. Wizard Architecture

The wizard should use a single controlled state model.

Conceptually:

``` text
WizardState
├── participant
├── team
├── ideaOrStartup
├── eureka
├── proof
└── submission
```

The state should have one authoritative source.

Avoid maintaining the same field in multiple unrelated states.

## Recommended conceptual model

``` text
participantType
team
teamMembers[]
ideaDetails
startupDetails
eureka
proof
currentStep
submissionState
```

Student and Startup fields may share a common base while retaining their
conditional fields.

------------------------------------------------------------------------

# 7. Step Architecture

Each step should be isolated enough to be understandable and testable.

``` text
WizardShell
   │
   ├── Step 1
   ├── Step 2
   ├── Step 3
   ├── Step 4
   ├── Step 5
   └── Step 6
```

The shell owns:

-   current step
-   navigation
-   shared wizard state
-   progress
-   step transition rules

Individual steps own:

-   field rendering
-   field-level validation
-   step-specific interaction

Do not let individual steps independently control global wizard
navigation.

------------------------------------------------------------------------

# 8. Validation Architecture

Validation must exist at multiple levels.

## Level 1 --- Field validation

Examples:

-   required
-   email format
-   URL format
-   file type
-   file size

## Level 2 --- Step validation

Before Continue:

``` text
validate current step
      ↓
valid?
 ┌────┴────┐
yes       no
 ↓         ↓
next     show errors
```

## Level 3 --- Final validation

Before submission, validate the complete payload again.

Never rely only on client-side validation.

The server/backend boundary must validate critical values again.

------------------------------------------------------------------------

# 9. Team Member Implementation

The team structure must support:

``` text
Leader
Member 2
Member 3
Member 4
...
```

## Leader

-   always exists
-   first member
-   role fixed to Team Leader
-   cannot be removed

## Member 2

-   rendered by default
-   optional
-   can be left empty
-   once partially completed, required member fields must be completed

## Additional members

Use:

``` text
+ Add Team Member
```

Each added member gets its own block.

Non-leader members can be removed.

Do not create a fixed number of member fields.

------------------------------------------------------------------------

# 10. Student / Startup Conditional Architecture

Step 1 stores:

``` text
participantType:
  student | startup
```

Step 3 reads this value.

Conceptually:

``` text
if student
    render Idea Details
else if startup
    render Startup Details
```

Do not duplicate the entire wizard for Student and Startup.

Use shared components where fields/behavior are common.

------------------------------------------------------------------------

# 11. Eureka Integration Architecture

The Eureka registration portal is external.

The wizard should not pretend that it controls the external Eureka
system.

The application controls:

-   NEC ID display
-   copy action
-   Eureka CTA
-   link-click tracking where implemented
-   participant confirmation
-   Eureka identifier input
-   proof collection

The application does not automatically claim successful external
registration unless verified through an official integration.

------------------------------------------------------------------------

# 12. NEC ID Configuration

The NEC ID must not be scattered through UI components.

Use a centralized configuration source.

Conceptually:

``` text
EUREKA_NEC_REFERRAL_CODE
EUREKA_REGISTRATION_URL
```

The actual production values must be provided through the appropriate
environment/configuration mechanism.

The UI reads the configured value.

The participant cannot edit it.

------------------------------------------------------------------------

# 13. External Registration Link

The Eureka CTA should:

-   use the configured Eureka URL
-   clearly indicate external navigation
-   preferably open in a new tab
-   use safe external-link attributes when applicable

The wizard page should remain available so participants can return after
registering.

------------------------------------------------------------------------

# 14. Supabase Integration

Supabase is the primary backend.

The frontend must not expose privileged Supabase credentials.

Never place a service-role key in browser/client code.

Use the public client configuration only where appropriate.

Privileged operations must occur through an appropriate trusted backend
boundary, such as:

-   Supabase Edge Functions
-   an existing secure server/API
-   another trusted server-side mechanism

The exact choice must follow the existing project architecture.

------------------------------------------------------------------------

# 15. Persistence Strategy

The participant may need to leave the wizard temporarily to register on
Eureka.

Therefore, draft persistence is important.

Recommended lifecycle:

``` text
Start wizard
    ↓
Create draft
    ↓
Persist progress
    ↓
External Eureka registration
    ↓
Return to wizard
    ↓
Upload proof
    ↓
Review
    ↓
Final submit
```

Do not require every keystroke to generate a network request.

Persist at sensible checkpoints, such as:

-   step completion
-   explicit Continue
-   meaningful changes before leaving for Eureka
-   proof upload
-   final submission

The implementation must balance recoverability with unnecessary database
traffic.

------------------------------------------------------------------------

# 16. Proof Upload Architecture

The screenshot is sensitive participant-submitted data.

Use private Supabase Storage.

Conceptual flow:

``` text
Browser
   ↓
Validate file locally
   ↓
Trusted upload mechanism
   ↓
Private Storage bucket
   ↓
Store file metadata
   ↓
Associate proof with registration
```

## Required checks

Client:

-   MIME/type
-   size

Trusted backend:

-   validate type
-   validate size
-   validate ownership/registration context
-   prevent unauthorized file access

The exact storage policies belong to `DATABASE_SPEC.md`.

------------------------------------------------------------------------

# 17. File Naming

Do not use raw user-provided filenames as storage object identifiers.

Use a generated path such as:

``` text
{registration-id}/{proof-id}.{extension}
```

or the equivalent secure structure defined by the database/storage
implementation.

Avoid exposing email addresses, phone numbers, or other personal data in
storage paths.

------------------------------------------------------------------------

# 18. Submission Architecture

Final submission must be treated as a controlled state transition.

Conceptually:

``` text
Review
  ↓
Validate
  ↓
Check submission state
  ↓
Persist final data
  ↓
Generate reference
  ↓
Mark SUBMITTED
  ↓
Success
```

Duplicate submissions must be prevented.

The system must not create multiple final registrations because a
participant double-clicks Submit or retries after a slow network
response.

------------------------------------------------------------------------

# 19. E-Cell Reference Code

The internal reference code should be generated by the trusted
backend/database layer.

Format example:

``` text
ECELL-EUR-XXXXXXXX
```

The exact generation mechanism should be deterministic enough to avoid
collisions and must not depend on client-generated random identifiers
alone.

------------------------------------------------------------------------

# 20. Security Requirements

Minimum requirements:

-   no service-role credentials in frontend
-   private proof storage
-   least-privilege database policies
-   validation on trusted backend boundary
-   controlled write operations
-   no unrestricted public reads
-   no sensitive data in logs
-   no sensitive data in URL query parameters
-   no personal data embedded in storage filenames
-   duplicate submission protection
-   safe external-link handling
-   environment secrets excluded from repository

Security implementation must be verified before production.

------------------------------------------------------------------------

# 21. Error and Recovery Strategy

Every important asynchronous operation needs:

-   loading state
-   success state
-   failure state
-   retry/recovery path

Important operations include:

-   draft save
-   Eureka event tracking
-   screenshot upload
-   final submission

The UI should preserve local state when a request fails where practical.

Do not clear a form because a network request failed.

------------------------------------------------------------------------

# 22. Loading States

Avoid blank screens.

Examples:

### Upload

``` text
Uploading...
[progress/loader]
```

### Submit

``` text
Submitting...
```

### Draft save

Use subtle non-blocking feedback where appropriate.

Do not interrupt the participant with unnecessary modal dialogs for
every save.

------------------------------------------------------------------------

# 23. Design Implementation Rules

The wizard must follow `DESIGN.md`.

Implementation must preserve:

-   dark background
-   glass/dark cards
-   existing typography
-   existing red accent
-   existing button language
-   existing radius system
-   existing spacing system
-   existing responsive behavior
-   existing motion philosophy

Do not introduce:

-   white/light form cards that conflict with the site
-   unrelated gradients
-   a new color palette
-   unrelated component libraries
-   generic SaaS dashboard styling
-   excessive animations

The wizard should visually belong to E-Cell MET.

------------------------------------------------------------------------

# 24. Responsive Implementation

Implement mobile behavior intentionally.

Do not wait until the end to make desktop CSS responsive.

Test:

-   narrow mobile
-   normal mobile
-   tablet
-   desktop

Check:

-   progress indicator
-   form fields
-   team-member cards
-   upload preview
-   navigation buttons
-   review sections
-   long text
-   error messages

No horizontal scrolling should be required for normal usage.

------------------------------------------------------------------------

# 25. Accessibility Implementation

At minimum:

-   semantic labels
-   keyboard navigation
-   focus states
-   accessible errors
-   keyboard-accessible Add/Remove member controls
-   accessible upload control
-   accessible progress indication
-   sufficient contrast
-   no color-only error communication

------------------------------------------------------------------------

# 26. Testing Strategy

Testing should happen continuously rather than only in Phase 6.

## Functional testing

Test:

-   Student path
-   Startup path
-   leader
-   empty Member 2
-   completed Member 2
-   added members
-   removed members
-   invalid email
-   invalid URL
-   missing required fields
-   Eureka confirmation
-   invalid upload
-   oversized upload
-   successful upload
-   failed upload
-   review editing
-   final submission
-   duplicate submit

## Persistence testing

Test:

-   refresh during wizard
-   returning after Eureka registration
-   failed network request
-   retry
-   draft restoration

## Security testing

Test:

-   unauthorized data access
-   unauthorized proof access
-   invalid registration IDs
-   malicious/invalid file uploads
-   duplicate submission attempts

## Responsive testing

Test mobile, tablet and desktop.

------------------------------------------------------------------------

# 27. Development Phases

The product must be developed in exactly six controlled phases.

------------------------------------------------------------------------

## PHASE 1 --- FOUNDATION

### Goal

Integrate the wizard into the existing E-Cell website and establish the
reusable wizard foundation.

### Tasks

1.  Audit repository.
2.  Audit existing design/component system.
3.  Identify correct route/page location.
4.  Create wizard route/page.
5.  Build WizardShell.
6.  Build progress indicator.
7.  Build navigation system.
8.  Establish wizard state architecture.
9.  Establish reusable form primitives where missing.
10. Implement responsive shell.
11. Verify visual consistency with existing website.

### Do NOT implement

-   final Supabase schema
-   proof upload
-   final submission
-   complex Eureka logic

### Exit criteria

-   wizard page loads through intended route
-   existing site layout remains intact
-   shell visually matches website
-   progress/navigation work
-   responsive shell works
-   no unrelated site regressions

------------------------------------------------------------------------

## PHASE 2 --- PARTICIPANT + TEAM

### Goal

Implement Steps 1 and 2.

### Tasks

-   Student/Startup selector
-   team name
-   leader block
-   Member 2 default block
-   Member 2 optional behavior
-   Add Member
-   Remove Member
-   member validation
-   step navigation
-   state persistence within wizard

### Exit criteria

-   all team interactions work
-   Member 2 remains optional
-   leader cannot be removed
-   added members validate correctly
-   mobile layout works
-   no regressions in Phase 1

------------------------------------------------------------------------

## PHASE 3 --- IDEA / STARTUP

### Goal

Implement Step 3.

### Tasks

-   Student Idea Details
-   Startup Details
-   conditional rendering
-   shared fields
-   validation
-   character limits
-   URL validation
-   navigation

### Exit criteria

-   Student sees correct fields
-   Startup sees correct fields
-   switching type does not leave inconsistent hidden data
-   validation works
-   responsive behavior works

------------------------------------------------------------------------

## PHASE 4 --- EUREKA REGISTRATION

### Goal

Implement Step 4.

### Tasks

-   NEC ID card
-   Copy action
-   Eureka CTA
-   external-link behavior
-   instructions
-   confirmation
-   link-click tracking where supported

### Exit criteria

-   NEC ID is read-only
-   Copy works
-   Eureka URL is configuration-driven
-   confirmation is required
-   wizard state survives external navigation

------------------------------------------------------------------------

## PHASE 5 --- SUPABASE + PROOF

### Goal

Connect the wizard to Supabase and implement Step 5.

### Tasks

-   create/use database schema
-   create draft registration
-   persist participant/team/idea data
-   implement status transitions
-   private Storage bucket
-   proof upload
-   proof metadata
-   replace/remove
-   server-side validation
-   RLS/security
-   error recovery

### Exit criteria

-   data persists correctly
-   proof is stored privately
-   unauthorized access is blocked
-   upload failures recover
-   draft can be recovered
-   no privileged credentials reach the browser

------------------------------------------------------------------------

## PHASE 6 --- REVIEW + SUBMIT + PRODUCTION QA

### Goal

Complete the product and make it production-ready.

### Tasks

-   Step 6 review
-   Edit navigation
-   final declaration
-   final validation
-   duplicate submission protection
-   trusted final submission
-   E-Cell reference generation
-   success state
-   complete functional QA
-   responsive QA
-   accessibility QA
-   security QA
-   production build

### Exit criteria

-   full six-step journey works
-   final submission is reliable
-   duplicate submission prevented
-   success reference generated
-   security checks pass
-   production build passes
-   no critical/high-priority defects remain

------------------------------------------------------------------------

# 28. Antigravity Development Protocol

Antigravity should follow this protocol for every phase.

## Step 1 --- Inspect

Read:

-   relevant source files
-   `DESIGN.md`
-   `PRODUCT_SPEC.md`
-   `DATABASE_SPEC.md`
-   this guide

## Step 2 --- Plan

Before modifying files, identify:

-   files to create
-   files to modify
-   reusable components
-   dependencies required
-   risks

## Step 3 --- Implement

Implement only the current phase.

Do not silently implement later phases.

## Step 4 --- Test

Run the project's appropriate:

-   lint
-   type check
-   unit tests
-   build

Use the existing project commands.

## Step 5 --- Review

Check:

-   specification compliance
-   design compliance
-   responsive behavior
-   accessibility
-   security implications
-   unnecessary changes

## Step 6 --- Report

Report:

-   files changed
-   features implemented
-   tests run
-   failures
-   known limitations
-   next recommended action

## Step 7 --- STOP

After completing the requested phase, stop.

Do not automatically continue to the next phase.

------------------------------------------------------------------------

# 29. Antigravity Coding Rules

Always:

-   inspect existing code before creating duplicates
-   follow existing project conventions
-   use TypeScript if the existing project uses TypeScript
-   keep components focused
-   keep business logic out of purely presentational components
-   validate critical data at trusted boundaries
-   use environment variables for configuration/secrets
-   keep external URLs configurable
-   avoid unnecessary dependencies
-   avoid unrelated refactors
-   preserve existing website behavior

Never:

-   rewrite the whole application unnecessarily
-   replace the existing design system
-   expose Supabase service-role credentials
-   hard-code secrets
-   make proof files public
-   bypass validation
-   silently change product requirements
-   implement future phases without approval
-   delete unrelated code to solve a local problem

------------------------------------------------------------------------

# 30. Dependency Policy

Before adding a dependency:

1.  Check whether the repository already has an equivalent.
2.  Check whether the feature can be implemented with existing tools.
3.  Add a dependency only when it provides meaningful value.
4.  Explain why it is needed.

Do not add large libraries for small features.

------------------------------------------------------------------------

# 31. Git / Change Management

Development should use small, understandable changes.

Recommended conceptual checkpoints:

``` text
phase-1-foundation
phase-2-team
phase-3-idea-startup
phase-4-eureka
phase-5-supabase-proof
phase-6-production
```

If Git commits are used, keep commits focused and descriptive.

Do not mix unrelated website changes with wizard work.

------------------------------------------------------------------------

# 32. Definition of Done

A phase is not done merely because the code compiles.

A phase is done when:

-   intended functionality works
-   validation works
-   error states work
-   responsive behavior works
-   design follows `DESIGN.md`
-   no unrelated regressions are introduced
-   appropriate tests/checks pass
-   implementation matches the relevant product/database specification
-   known limitations are documented

------------------------------------------------------------------------

# 33. Final Implementation Principle

The goal is not to produce the maximum amount of code.

The goal is to produce the smallest clean implementation that:

-   satisfies `PRODUCT_SPEC.md`
-   respects `DATABASE_SPEC.md`
-   follows `DESIGN.md`
-   integrates cleanly with the existing E-Cell website
-   protects participant data
-   remains understandable and maintainable
-   can be extended after the MVP

When uncertain, inspect the existing project and the source-of-truth
documents before making assumptions.
