# E-Cell MET × Eureka Registration Wizard

## Product Requirements Document (PRD)

**Version:** 1.0\
**Status:** Product Requirements\
**Product:** E-Cell MET Eureka Registration Wizard\
**Backend:** Supabase\
**Design Authority:** Existing E-Cell MET `DESIGN.md`

------------------------------------------------------------------------

# 1. Executive Summary

E-Cell MET needs a dedicated registration experience for students and
startups participating in the Eureka-related workflow.

The product will be a multi-step wizard integrated into the existing
E-Cell MET website.

The wizard will:

1.  Identify whether the participant is a Student or Startup.
2.  Collect team details.
3.  Collect idea/startup information.
4.  Provide the E-Cell MET NEC referral code and direct the participant
    to Eureka registration.
5.  Collect the participant's Eureka registration proof.
6.  Allow the participant to review and submit their information to
    E-Cell MET.

The primary objective is to make the process simple for participants
while giving E-Cell MET a structured, usable dataset for its internal
coordination and submission workflow.

------------------------------------------------------------------------

# 2. Problem Statement

The current Eureka-related process requires participants to interact
with an external registration system while also ensuring that E-Cell MET
receives the information needed from those participants.

This creates several potential problems:

-   Participants may not know what information E-Cell MET needs.
-   Participants may forget to use the correct NEC referral code.
-   E-Cell MET may receive participant information in an inconsistent
    format.
-   There may be no single structured place to collect team and idea
    information.
-   Participants may complete Eureka registration but fail to provide
    proof to E-Cell MET.
-   A disconnected form can create unnecessary confusion and friction.

The proposed wizard solves this by combining the E-Cell MET
information-collection process and Eureka-registration guidance into one
coherent user journey.

------------------------------------------------------------------------

# 3. Product Vision

Create a **simple, trustworthy, visually consistent and technically
reliable registration experience** that connects:

``` text
Participant
     ↓
E-Cell MET
     ↓
NEC Referral Code
     ↓
Eureka Registration
     ↓
Registration Proof
     ↓
Structured E-Cell Submission
```

The participant should feel that the wizard is a natural part of the
E-Cell MET website rather than an unrelated third-party form.

------------------------------------------------------------------------

# 4. Product Goals

## Primary Goals

### G1 --- Reduce participant friction

Make the registration process understandable and manageable through a
six-step wizard rather than one large form.

### G2 --- Collect structured participant data

Collect team, participant, idea/startup, Eureka and proof information in
a consistent structure.

### G3 --- Improve Eureka referral-code usage

Clearly display the E-Cell MET NEC ID and make it easy to copy before
the participant opens Eureka.

### G4 --- Capture registration proof

Collect the Eureka registration identifier and screenshot so E-Cell MET
can verify the participant's submitted information.

### G5 --- Maintain website consistency

Make the wizard visually and behaviorally consistent with the existing
E-Cell MET website.

### G6 --- Create a reliable backend

Use Supabase to securely persist registrations, team members and proof
files.

### G7 --- Make the system maintainable

Build the product in controlled phases using reusable components and a
clear architecture.

------------------------------------------------------------------------

# 5. Non-Goals

The MVP is not intended to become a complete Eureka management platform.

The following are outside the initial product scope:

-   Eureka judging
-   participant ranking
-   payment processing
-   certificate generation
-   public participant directory
-   automated Eureka selection decisions
-   AI-based screenshot verification
-   automatic Eureka registration verification unless an official
    integration becomes available
-   complex analytics dashboards
-   full participant communication platform

These may be considered in future versions.

------------------------------------------------------------------------

# 6. Target Users

## 6.1 Student

A student or student team participating through the E-Cell MET Eureka
workflow.

## 6.2 Startup

An existing startup/team participating through the E-Cell MET Eureka
workflow.

------------------------------------------------------------------------

# 7. User Needs

Participants need to:

-   understand what type of registration they are completing
-   provide team information without filling an unnecessarily long form
-   describe their idea or startup
-   easily find and copy the NEC referral code
-   access Eureka registration
-   return to the E-Cell MET wizard after Eureka registration
-   upload registration proof
-   review their information
-   submit successfully

E-Cell MET needs to:

-   receive structured participant information
-   associate members with a team
-   distinguish students and startups
-   retain Eureka registration proof
-   reduce manual data collection
-   protect participant data

------------------------------------------------------------------------

# 8. Product Experience

The product uses six logical steps:

``` text
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
   Success
```

Success is a completion state, not a seventh step.

------------------------------------------------------------------------

# 9. High-Level Requirements

## PR-01 --- Participant Type

The system shall allow the participant to choose:

-   Student
-   Startup

Exactly one option must be selected.

The selected type determines the relevant Step 3 experience.

------------------------------------------------------------------------

## PR-02 --- Team Details

The system shall collect team information.

The participant filling the form shall automatically be treated as the
Team Leader.

The Team Leader shall be required.

A second member block shall be visible by default but shall remain
optional.

The system shall allow additional members to be added dynamically.

Non-leader members shall be removable.

The Team Leader shall not be removable.

------------------------------------------------------------------------

## PR-03 --- Idea / Startup Details

The system shall collect relevant information based on the participant
type.

### Student

The system shall collect information about the student's idea.

### Startup

The system shall collect information about the startup.

Shared information may use common components, while
participant-type-specific information may be conditionally rendered.

------------------------------------------------------------------------

## PR-04 --- NEC Referral Code

The system shall display the E-Cell MET NEC referral code in a read-only
interface.

The participant shall be able to copy the code.

The participant shall not be able to modify the configured code.

------------------------------------------------------------------------

## PR-05 --- Eureka Registration

The system shall provide a clear CTA that takes the participant to the
Eureka registration portal.

The participant should be able to keep the E-Cell MET wizard available
while completing Eureka registration.

The wizard shall instruct the participant to use the displayed NEC
referral code.

------------------------------------------------------------------------

## PR-06 --- Eureka Confirmation

The participant shall explicitly confirm that they completed Eureka
registration using the provided NEC ID.

This confirmation is not considered automatic verification of Eureka
registration.

------------------------------------------------------------------------

## PR-07 --- Registration Proof

The participant shall provide:

-   Eureka registration ID/team ID
-   registration screenshot/proof

The screenshot shall support the defined allowed formats and file-size
limit.

The participant shall be able to preview, replace and remove an uploaded
proof before final submission.

------------------------------------------------------------------------

## PR-08 --- Review

Before final submission, the participant shall see a consolidated review
of the information they entered.

The participant shall be able to edit individual sections without
restarting the entire wizard.

------------------------------------------------------------------------

## PR-09 --- Final Submission

The system shall validate the complete registration before submission.

The final submission shall:

-   prevent duplicate submission
-   persist the final registration
-   generate/store an E-Cell reference
-   show a success state

------------------------------------------------------------------------

# 10. UX Requirements

## UX-01 --- Progressive Disclosure

The participant should only see information relevant to the current
step.

## UX-02 --- Clear Progress

The interface shall communicate:

-   current step
-   total steps
-   available navigation

## UX-03 --- Low Form Fatigue

The wizard should avoid unnecessary fields.

The product should not collect information merely because it could be
useful later.

## UX-04 --- Error Clarity

Errors should tell participants what needs to be corrected.

Example:

> Please enter a valid email address.

rather than:

> Invalid input.

## UX-05 --- Data Preservation

Moving backward, temporary network failures and recoverable navigation
should not unnecessarily erase entered information.

## UX-06 --- Responsive Experience

The product must work on:

-   mobile
-   tablet
-   desktop

Mobile should be treated as a first-class experience.

------------------------------------------------------------------------

# 11. Design Requirements

The wizard must use the existing E-Cell MET website's design system.

The existing `DESIGN.md` is the visual source of truth.

The wizard must not introduce a separate visual identity.

The implementation should preserve the existing website's:

-   dark visual foundation
-   color system
-   typography
-   spacing
-   cards
-   glass/dark surfaces
-   buttons
-   border/radius system
-   motion
-   responsive behavior

The wizard should appear to be a native part of the E-Cell MET website.

------------------------------------------------------------------------

# 12. Backend Requirements

Supabase will be used as the primary backend.

The backend shall support:

-   registration persistence
-   team member persistence
-   draft state
-   final submission state
-   Eureka registration information
-   proof-file metadata
-   private proof storage
-   controlled access
-   security policies
-   duplicate submission protection

The browser must never receive privileged Supabase credentials.

------------------------------------------------------------------------

# 13. Data Requirements

The product needs to persist at minimum:

### Participant

-   participant type
-   leader information

### Team

-   team name
-   team members
-   member roles

### Idea / Startup

-   relevant idea/startup information

### Eureka

-   NEC referral-code context
-   Eureka registration identifier
-   relevant confirmation state

### Proof

-   uploaded proof metadata
-   proof storage reference

### Submission

-   registration status
-   internal E-Cell reference
-   timestamps
-   relevant audit events

Exact schema and security rules are defined in `DATABASE_SPEC.md`.

------------------------------------------------------------------------

# 14. Registration Lifecycle

The product should conceptually support:

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

The exact database implementation is defined separately.

------------------------------------------------------------------------

# 15. Security Requirements

Because the product collects personal information and registration
screenshots, security is a core requirement.

The system must:

-   protect participant information
-   keep proof files private
-   enforce least-privilege access
-   validate important data on the trusted backend
-   prevent unauthorized reads
-   prevent unauthorized writes
-   avoid exposing secrets
-   avoid storing sensitive information in URLs
-   prevent duplicate final submissions
-   avoid sensitive information in logs where unnecessary

------------------------------------------------------------------------

# 16. Performance Requirements

The wizard should feel responsive during normal usage.

Requirements include:

-   fast initial page load consistent with the existing website
-   no unnecessary API requests
-   sensible draft persistence
-   optimized image handling where appropriate
-   loading states for asynchronous operations
-   graceful handling of slow connections

Do not introduce heavy dependencies without a clear benefit.

------------------------------------------------------------------------

# 17. Accessibility Requirements

The product should support:

-   keyboard navigation
-   visible focus states
-   semantic labels
-   accessible errors
-   accessible upload controls
-   readable text
-   sufficient contrast
-   controls that do not rely only on color

------------------------------------------------------------------------

# 18. MVP Scope

## Included

-   six-step wizard
-   Student/Startup selection
-   team leader
-   optional Member 2
-   dynamic additional members
-   idea/startup details
-   NEC ID display
-   NEC ID copy
-   Eureka registration link
-   Eureka confirmation
-   Eureka registration identifier
-   screenshot upload
-   screenshot preview/replace/remove
-   review/edit
-   final declaration
-   submission
-   success state
-   Supabase persistence
-   private proof storage
-   responsive UI
-   security controls

## Excluded

-   AI/OCR proof verification
-   automatic Eureka verification
-   judging
-   ranking
-   payments
-   certificates
-   public directory
-   advanced analytics
-   complex notification workflows

------------------------------------------------------------------------

# 19. Success Metrics

The MVP should be evaluated using practical metrics.

## Participant metrics

-   wizard completion rate
-   step drop-off rate
-   average completion time
-   proof-upload success rate
-   validation-error frequency
-   submission failure rate

## Operational metrics

-   percentage of registrations with complete required data
-   percentage with valid proof
-   duplicate registration rate
-   manual correction rate
-   support requests related to registration

These metrics should be added only where they can be collected
responsibly and without unnecessary participant tracking.

------------------------------------------------------------------------

# 20. Product Quality Bar

The product is successful only when it satisfies all of the following:

### Usability

A normal participant can understand and complete the flow without
needing personal assistance.

### Visual quality

The wizard looks like part of the existing E-Cell MET website.

### Data quality

E-Cell MET receives structured and usable information.

### Reliability

Participants do not lose data during ordinary failures or navigation.

### Security

Participant data and proof files are appropriately protected.

### Maintainability

The implementation is understandable and can be extended without
rewriting the entire feature.

------------------------------------------------------------------------

# 21. Development Approach

The product will be developed in six controlled phases:

### Phase 1 --- Foundation

Existing-site integration, wizard shell, progress, navigation and design
integration.

### Phase 2 --- Participant + Team

Student/Startup selection and complete team-management experience.

### Phase 3 --- Idea / Startup

Conditional idea/startup data collection.

### Phase 4 --- Eureka

NEC ID, Eureka link, instructions and confirmation.

### Phase 5 --- Supabase + Proof

Persistence, draft state, private proof upload and security.

### Phase 6 --- Review + Production

Review, edit, final submission, success state, testing, security and
production QA.

Detailed implementation instructions are defined in
`IMPLEMENTATION_GUIDE.md`.

------------------------------------------------------------------------

# 22. Open Requirements

The following must be verified before production:

1.  Official Eureka team-size limits.
2.  Exact official Eureka registration identifier terminology.
3.  Official Eureka categories.
4.  Official stage options.
5.  Any additional mandatory Eureka fields.
6.  Final Eureka registration URL.
7.  Final NEC referral code.
8.  Any official file-format or proof requirements.
9.  Any official privacy/data-retention requirements.

These must not be guessed.

------------------------------------------------------------------------

# 23. Acceptance Criteria

The product meets the PRD when:

-   participants can choose Student or Startup
-   participants can create a team with themselves as leader
-   Member 2 is optional
-   additional members can be added/removed
-   the correct idea/startup fields are shown
-   NEC ID is clearly displayed and copyable
-   participants can access Eureka registration
-   participants can confirm Eureka registration
-   Eureka registration proof can be uploaded
-   participants can review and edit information
-   final submission is validated
-   duplicate final submission is prevented
-   successful submission generates an E-Cell reference
-   participant data is securely persisted
-   proof files are not publicly exposed
-   the wizard works on mobile, tablet and desktop
-   the wizard matches the existing E-Cell MET design
-   the implementation follows the project's approved specifications

------------------------------------------------------------------------

# 24. Document Relationship

This PRD defines the **product requirements and business intent**.

The other documents provide implementation detail:

``` text
PRD.md
  ↓
Why + What the product must achieve

PRODUCT_SPEC.md
  ↓
Exact user flow + fields + behavior

DATABASE_SPEC.md
  ↓
Data model + Supabase + security

IMPLEMENTATION_GUIDE.md
  ↓
How the development agent should build it

DESIGN.md
  ↓
How the existing E-Cell MET website should look
```

Together, these documents form the product's implementation foundation.

------------------------------------------------------------------------

# 25. Final Product Principle

Build a registration experience that is:

**Simple for participants.\
Useful for E-Cell MET.\
Consistent with the existing website.\
Secure with participant data.\
Reliable under real-world usage.\
Simple enough to maintain.**

Do not add complexity merely because it is technically possible.
