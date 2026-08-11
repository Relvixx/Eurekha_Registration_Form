# E-Cell MET × Eureka Registration Wizard

## PRODUCT_SPEC.md

**Version:** 1.0\
**Status:** Product specification draft for implementation\
**Primary backend:** Supabase\
**Design authority:** Existing E-Cell MET `DESIGN.md`

------------------------------------------------------------------------

## 1. Purpose

The E-Cell MET Eureka Registration Wizard is a dedicated multi-step
registration experience on the E-Cell MET website.

Its purpose is to:

1.  Identify whether the participant is registering as a Student or
    Startup.
2.  Collect team information.
3.  Collect idea/startup information.
4.  Provide the E-Cell MET NEC referral code and guide the participant
    to the Eureka registration portal.
5.  Collect proof of successful Eureka registration.
6.  Allow the participant to review and submit the completed
    registration to E-Cell MET.

The wizard should reduce participant confusion and form fatigue while
collecting the information required by the E-Cell team.

------------------------------------------------------------------------

## 2. Product Principles

### Participant-first

The wizard should be easy for a student or startup participant to
understand without requiring technical knowledge.

### Six logical steps

1.  Participant Type
2.  Team Details
3.  Idea / Startup Details
4.  Eureka Registration
5.  Registration Confirmation
6.  Review & Submit

The success state is not a seventh step.

### Existing website consistency

The existing E-Cell MET `DESIGN.md` is the visual source of truth. The
wizard must look and behave like a native part of the existing E-Cell
MET website.

The existing design system uses a dark visual foundation, including
`#0A0A0A` as the primary background, `#FF1744` as the primary red
accent, `#00E5FF` as a secondary accent, dark/glass surfaces, rounded
cards, pill-shaped CTAs, and responsive layouts.

### Progressive disclosure

Only information relevant to the current step should be shown.

### Recoverability

The participant should not lose entered information because of ordinary
navigation, refreshes, or temporary network failures where technically
recoverable.

### Accuracy over assumptions

Where official Eureka requirements have not yet been verified, field
names, team-size limits, categories, stages, and exact Eureka
terminology remain configurable rather than being treated as confirmed
official requirements.

------------------------------------------------------------------------

# 3. Target Users

### Student

A student or student team participating through the Eureka-related
E-Cell MET workflow.

### Startup

An existing startup/team participating through the Eureka-related E-Cell
MET workflow.

------------------------------------------------------------------------

# 4. Complete User Journey

``` text
Landing / Entry
      ↓
1. Participant Type
      ↓
2. Team Details
      ↓
3. Idea / Startup Details
      ↓
4. Eureka Registration
      ↓
5. Registration Confirmation
      ↓
6. Review & Submit
      ↓
Submission Success
```

The participant should always understand where they are, what is
required, and what comes next.

------------------------------------------------------------------------

# 5. Wizard Navigation

## Progress indicator

The wizard communicates six total steps.

Recommended labels:

1.  Type
2.  Team
3.  Idea / Startup
4.  Eureka
5.  Proof
6.  Review

The visual treatment must follow the existing E-Cell MET design system.

## Navigation controls

Most steps provide:

-   Back
-   Continue

Step 1 does not need Back if it is the entry point.

Step 6 provides:

-   Back
-   Submit Registration

## Navigation rules

-   Continue must not proceed when required fields are invalid.
-   Back preserves entered information.
-   Step 6 Edit actions return directly to the relevant step.
-   Returning to Step 6 after editing shows the latest values.
-   Previously supplied data should not need to be re-entered.

------------------------------------------------------------------------

# 6. STEP 1 --- PARTICIPANT TYPE

## Objective

Identify whether the participant is a Student or Startup before
collecting remaining information.

## UI

Two selectable options:

### Student

> I'm participating as a student/team of students.

### Startup

> We're participating as an existing startup/team.

## Field

  Field              Type     Required
  ------------------ ------ ----------
  Participant Type   Enum          Yes

Values:

-   `student`
-   `startup`

## Validation

Exactly one participant type must be selected.

## Behavior

The selected value controls the content shown in Step 3.

------------------------------------------------------------------------

# 7. STEP 2 --- TEAM DETAILS

## Objective

Collect team identity and team-member information.

The person filling the wizard is treated as the Team Leader.

## Team information

### Team Name

  Field       Type     Required
  ----------- ------ ----------
  Team Name   Text          Yes

Team size should be derived from team-member records rather than
manually entered.

## Team Leader

The first member block is always the Team Leader.

  Field                                  Type            Required
  -------------------------------------- ------------- ----------
  Full Name                              Text                 Yes
  Email                                  Email                Yes
  Mobile Number                          Phone                Yes
  College / Institution / Organisation   Text                 Yes
  Role                                   Fixed value          Yes

Role is automatically `Team Leader`.

The leader cannot be removed.

## Member 2

A second member block is rendered by default.

**Member 2 is NOT mandatory.**

  Field                                  Type       Required when member is added
  -------------------------------------- -------- -------------------------------
  Full Name                              Text                                 Yes
  Email                                  Email                                Yes
  Mobile Number                          Phone                           Optional
  College / Institution / Organisation   Text                                 Yes
  Role in Team                           Select                               Yes

If Member 2 is unused, the participant may continue without completing
it.

If the participant starts filling Member 2, its required fields must be
complete before continuing.

## Additional members

Provide:

`+ Add Team Member`

Each added member creates another member block.

Each non-leader member can be removed.

The leader must never be removable.

## Proposed role options

-   Founder
-   Co-Founder
-   Developer / Technical
-   Design
-   Marketing
-   Business
-   Research
-   Operations
-   Other

If `Other` is selected, show a custom role input.

These are implementation defaults and must be adjusted if official
Eureka requirements specify different terminology.

## Team-size limits

Do not hard-code a maximum team size until the official Eureka
requirement is verified. The final limit should be configurable.

------------------------------------------------------------------------

# 8. STEP 3 --- IDEA / STARTUP DETAILS

## Objective

Collect idea or startup information. Fields depend on Step 1.

## Student mode

Heading: `Idea Details`

  Field                           Type          Required
  ------------------------------- ----------- ----------
  Idea Name                       Text               Yes
  Problem Statement               Long Text          Yes
  Proposed Solution               Long Text          Yes
  Domain / Category               Select             Yes
  Current Stage                   Select             Yes
  Short Description               Long Text          Yes
  Website / Demo / Project Link   URL           Optional

### Proposed student stages

-   Idea
-   Research
-   Prototype
-   MVP
-   Other

These are proposed defaults, not verified official Eureka terminology.

## Startup mode

Heading: `Startup Details`

  Field                      Type          Required
  -------------------------- ----------- ----------
  Startup Name               Text               Yes
  Problem Statement          Long Text          Yes
  Solution                   Long Text          Yes
  Domain / Category          Select             Yes
  Current Stage              Select             Yes
  Short Description          Long Text          Yes
  Website                    URL           Optional
  LinkedIn / Relevant Link   URL           Optional

### Proposed startup stages

-   Idea
-   Prototype
-   MVP
-   Early Revenue
-   Growth
-   Other

These are proposed defaults, not verified official Eureka terminology.

## Form behavior

-   Textareas should support comfortable reading/editing.
-   URL fields should validate URL format.
-   Character limits should be defined during implementation and
    displayed where useful.
-   Do not turn this into an unnecessarily long application form.
-   Add fields only when required by finalized Eureka/E-Cell
    requirements.

------------------------------------------------------------------------

# 9. STEP 4 --- EUREKA REGISTRATION

## Objective

Guide the participant to complete external Eureka registration using the
E-Cell MET NEC referral code.

This is primarily an instruction/action step, not a large
data-collection step.

## NEC Referral Code

Display a read-only referral-code card:

``` text
YOUR NEC REFERRAL CODE

XXXXXXXX

[ COPY ]
```

The participant cannot edit it.

The actual value should be controlled by application
configuration/backend rather than participant input.

## Copy action

Provide a Copy button.

After copying, show temporary feedback such as:

`✓ Copied`

## Eureka CTA

Primary CTA:

`Register on Eureka ↗`

Prefer opening the external registration page in a new tab/window so the
participant can return to the wizard.

## Instructions

1.  Copy the NEC ID.
2.  Open the Eureka registration portal.
3.  Use the NEC ID as the referral code.
4.  Complete Eureka registration.
5.  Return to this wizard.

Tell the participant to keep the current page available while
registering.

## Confirmation

Required checkbox:

> I have completed my Eureka registration using the NEC ID provided
> above.

This is participant confirmation only. It is not treated as proof; proof
is collected in Step 5.

## Tracking

The system should be able to record:

-   whether the Eureka link was clicked
-   whether the participant confirmed completion

------------------------------------------------------------------------

# 10. STEP 5 --- REGISTRATION CONFIRMATION

## Objective

Collect structured Eureka registration information and proof.

## Eureka Registration ID / Team ID

Required text field.

The exact label must use the terminology confirmed from the official
Eureka flow once verified.

Current working label:

`Eureka Registration ID / Team ID`

## Registration screenshot

Required upload.

Instruction:

> Upload a screenshot showing your successful Eureka registration or
> registration details.

Allowed types:

-   JPG
-   JPEG
-   PNG

Maximum size:

5 MB

## Upload states

### Empty

`Choose File`

### Uploading

`Uploading...`

### Uploaded

Show:

-   image preview
-   filename
-   Replace
-   Remove

### Failed

Show an actionable error and allow retry.

## Screenshot validation

Minimum validation:

-   file exists
-   supported MIME/type
-   maximum file size

Automatic OCR/AI verification is NOT required for MVP.

## Confirmation

Required checkbox:

> I confirm that the details provided above correspond to my Eureka
> registration.

------------------------------------------------------------------------

# 11. STEP 6 --- REVIEW & SUBMIT

## Objective

Give the participant a final opportunity to inspect and correct all
information.

No new information should be requested here.

## Review sections

### Participation Type

Display selected Student/Startup value.

Action: `Edit`

### Team Details

Display:

-   Team Name
-   Team Leader
-   All team members
-   relevant member details

Action: `Edit`

### Idea / Startup Details

Display all collected Step 3 information.

Action: `Edit`

### Eureka Registration

Display:

-   NEC referral code
-   Eureka Registration ID / Team ID
-   proof uploaded status
-   screenshot thumbnail

Action: `Edit`

## Edit behavior

Each Edit action navigates directly to its corresponding step.

After editing, returning to review shows updated information.

------------------------------------------------------------------------

# 12. Final Declaration

Required checkbox:

> I confirm that the information provided above is accurate and that I
> have completed my Eureka registration using the provided NEC referral
> code.

The Submit button must not be accepted until this confirmation is
selected.

------------------------------------------------------------------------

# 13. Submission

Primary CTA:

`Submit Registration →`

When clicked:

1.  Validate all required information again.
2.  Prevent duplicate submissions.
3.  Show a loading state.
4.  Persist/finalize the registration.
5.  Generate/store the E-Cell reference code.
6.  Show the success state.

Button state:

`Submitting...`

The button is disabled while final submission is in progress.

------------------------------------------------------------------------

# 14. SUCCESS STATE

Success is not Step 7.

Display:

## Registration Submitted

Suggested message:

> Your registration details have been successfully submitted to E-Cell
> MET.

Display an internal E-Cell reference:

``` text
ECELL-EUR-XXXXXXXX
```

This is an E-Cell reference, not the Eureka registration ID.

Provide:

`Back to E-Cell MET`

Do not claim selection or official acceptance unless that has actually
happened.

------------------------------------------------------------------------

# 15. Validation Rules

## General

-   Required fields must be completed.
-   Email fields must use valid email formats.
-   Phone fields must pass the chosen phone validation rules.
-   URLs must pass URL validation when supplied.
-   Empty optional fields are allowed.
-   Added team members must be complete.
-   Leader must always be complete.
-   Participant type must be selected.

## Step-specific

### Step 1

Participant type required.

### Step 2

Team name and leader required. Member 2 is optional. Any additional
member that has been added must satisfy that member's required fields.

### Step 3

Required fields depend on Student/Startup mode.

### Step 4

Eureka confirmation required before continuing.

### Step 5

Eureka identifier + screenshot + confirmation required.

### Step 6

Final declaration required.

------------------------------------------------------------------------

# 16. Error Handling

Errors must be specific and actionable.

Bad:

`Invalid input.`

Better:

`Please enter a valid email address.`

Bad:

`Upload failed.`

Better:

`We couldn't upload your screenshot. Check your connection and try again.`

The user should never lose already entered information because one field
fails validation.

------------------------------------------------------------------------

# 17. Responsive Requirements

The wizard must work on:

-   desktop
-   tablet
-   mobile

Mobile is a first-class experience, not a compressed desktop layout.

Requirements:

-   single-column form layout where appropriate
-   comfortable touch targets
-   readable labels and helper text
-   full-width primary CTA where appropriate
-   no horizontal overflow
-   screenshot preview must fit the viewport
-   long text must remain readable
-   navigation controls remain accessible

Exact breakpoints and design tokens must follow the existing E-Cell MET
`DESIGN.md`.

------------------------------------------------------------------------

# 18. Accessibility Requirements

Minimum requirements:

-   every input has a visible label
-   keyboard-accessible controls
-   visible focus states
-   meaningful button labels
-   checkbox labels are clickable
-   errors are associated with relevant inputs
-   adequate contrast
-   accessible image-upload text
-   progress indicator clearly communicates current step

------------------------------------------------------------------------

# 19. Data Persistence Expectations

The wizard should not rely exclusively on in-memory browser state.

The product should support a recoverable registration draft where
practical.

Before leaving for external Eureka registration, participant information
should already be persisted sufficiently that the participant does not
lose form data.

Final persistence architecture is defined separately in
`DATABASE_SPEC.md`.

------------------------------------------------------------------------

# 20. Product States

Conceptual states:

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

Exact database representation is defined in `DATABASE_SPEC.md`.

------------------------------------------------------------------------

# 21. MVP Scope

## Included

-   Six-step wizard
-   Student/Startup selection
-   Team leader
-   Optional Member 2
-   Dynamic additional members
-   Idea/Startup details
-   NEC ID display and copy
-   Eureka external link
-   Eureka confirmation
-   Eureka registration ID/team ID field
-   Screenshot upload
-   Screenshot preview/replace/remove
-   Review/edit
-   Final declaration
-   Final submission
-   Success state
-   Responsive UI
-   Supabase persistence
-   Private proof storage
-   Appropriate security controls

## Not required for initial MVP

-   AI/OCR screenshot verification
-   automatic Eureka registration verification
-   participant ranking
-   judging system
-   payment
-   certificate generation
-   public participant directory
-   advanced analytics dashboard
-   complex notification system

------------------------------------------------------------------------

# 22. Important Open Decisions

The following must NOT be silently assumed as official requirements:

1.  Official Eureka minimum/maximum team size.
2.  Exact official terminology for the Eureka identifier.
3.  Official Eureka categories.
4.  Official stage options.
5.  Any additional mandatory participant/team fields required by the
    competition.
6.  Exact Eureka registration URL if it changes.
7.  Final NEC referral code value.

These must be verified before production release.

------------------------------------------------------------------------

# 23. Acceptance Criteria

The product specification is considered implemented when:

-   A participant can select Student or Startup.
-   The participant can complete team information with themselves as
    leader.
-   Member 2 is visible by default but remains optional.
-   Additional members can be added and removed.
-   Step 3 changes appropriately for Student vs Startup.
-   The NEC referral code is displayed read-only and can be copied.
-   The participant can open the Eureka registration portal.
-   The participant can confirm Eureka registration.
-   The participant can enter the Eureka identifier.
-   The participant can upload a valid screenshot.
-   Invalid screenshot types/sizes are rejected with useful messages.
-   Uploaded screenshots can be previewed, replaced, and removed.
-   The participant can review all information before submission.
-   Each review section can be edited directly.
-   Final submission validates the complete registration.
-   Duplicate final submission is prevented.
-   A successful submission produces an E-Cell reference code.
-   A clear success state is shown.
-   The entire experience is responsive.
-   The wizard visually belongs to the existing E-Cell MET website.
-   Existing `DESIGN.md` rules are respected instead of introducing a
    separate light/foreign UI.
-   Sensitive participant/proof data is not publicly exposed.

------------------------------------------------------------------------

# 24. Development Principle

The product will be developed in six controlled phases:

### Phase 1

Foundation, existing-site integration, wizard shell and design system.

### Phase 2

Participant Type + Team Details.

### Phase 3

Idea / Startup Details.

### Phase 4

Eureka Registration.

### Phase 5

Supabase persistence + Registration Proof.

### Phase 6

Review, Submit, Success, Security and production QA.

Each phase should be completed, tested, and reviewed before moving to
the next phase.
