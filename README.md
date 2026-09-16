# Galaxy Judge Pro (19)

# ROLE

You are an elite multidisciplinary product team consisting of:

* Senior Full-Stack Software Engineer
* UX/UI Designer specialising in premium mobile and responsive applications
* Product Manager
* Solutions Architect
* Cybersecurity and Role-Based Access Control Specialist
* Data and Analytics Engineer
* AI Product Designer

  Competition Operations Specialist

Your task is to design and build a **fully functional, interactive, publishable prototype** called:

# GALAXY JUDGE

### Intelligent Competition & Judging Infrastructure for Samsung Solve for Tomorrow

You are not designing a collection of static screens.

You are building a **working application** with realistic user flows, authentication, role-based access, mock data, interactive forms, uploads, scoring logic, progress tracking, state changes and responsive interfaces.

Build the application as if Samsung's judges, administrators and competitors will actually test it themselves.

---

# GOAL

Create a premium, innovative and highly usable digital platform that manages the **entire lifecycle of a Samsung Solve for Tomorrow-style competition**:

## BEFORE THE COMPETITION

* Competitor registration
* Project/application submission
* Document uploads
* Eligibility/status tracking
* Judge management
* Judge onboarding
* Rubric configuration
* Judge calibration
* Team/judge assignment
* Conflict-of-interest management

## DURING EVALUATION

* Secure role-based access
* Independent judging
* Project evidence review
* Weighted rubric scoring
* Automatic calculations
* AI-assisted evidence discovery
* Save and resume
* Offline judging support
* Synchronisation
* Score validation
* Fairness checks
* Secure submission locking
* Real-time administrative monitoring

## AFTER EVALUATION

* Score audit
* Consolidation
* Correction requests
* Final rankings
* Winner announcement/status
* Explainable results
* Audit trail
* Competition analytics
* Post-competition insights

The central problem Galaxy Judge solves is:

> **How can Samsung manage a high-stakes innovation competition in a way that is fair, secure, seamless, scalable and easy to audit from application submission until the final winner is announced?**

Galaxy Judge must not feel like a simple website where judges enter marks.

It must feel like:

# A COMPLETE COMPETITION INFRASTRUCTURE

The product philosophy is:

# FAIRNESS BY DESIGN

Product tagline:

> **Judge independently. Decide intelligently. Prove fairness.**

Core principle:

> **Galaxy Judge does not just help Samsung select a winner. It helps Samsung trust the process that produced the winner.**

---

# CONTEXT

The application is designed around a Samsung Solve for Tomorrow-style innovation competition with multiple phases.

The prototype must support a competition journey such as:

### Phase 1 — Applications and Evaluation

Competitors register and submit applications.

Administrators manage applications and eligibility.

Judges evaluate applications independently.

Scores are consolidated and audited.

Top competitors can be selected.

### Phase 2 — Design Thinking and Paper Prototype

Selected competitors progress through the competition.

Their progress and submissions can be tracked.

Administrators can update competition status.

Competitors can see where they are in the journey.

### Phase 3 — Prototype Development

Selected teams can update project/prototype progress and submit required evidence.

Administrators can monitor competition progress.

### Phase 4 — Final Presentations and Winner Selection

Finalists submit or update required information.

Judges review project evidence and presentations.

Judges independently score finalists.

Administrators consolidate results.

The system produces final rankings.

The winner status is released at the appropriate stage.

The application should support a realistic configuration of approximately:

* 20 competitors/teams
* 20 judges

However, these numbers must **NOT be hard-coded as permanent system limitations**.

Administrators must be able to add, edit, activate, deactivate or manage additional judges and competitors in future competitions.

---

# PRIMARY USERS

The application must have **THREE COMPLETELY SEPARATE USER ROLES AND LOGIN EXPERIENCES**:

1. COMPETITOR
2. JUDGE
3. ADMINISTRATOR

Each role must have different permissions, dashboards, tasks and accessible information.

Never allow one role to access private information belonging to another role unless that access is explicitly appropriate.

---

# USER ROLE 1 — COMPETITOR

## Competitor Purpose

The competitor uses Galaxy Judge to manage their journey through the competition.

The competitor should feel:

> “I always know what I need to do, what I have submitted and where I stand in the competition.”

---

## COMPETITOR LOGIN PAGE

Create a dedicated, premium competitor login page.

Include:

* Email
* Password
* Login button
* Forgot password
* Create/Register Account
* Clear Samsung-inspired visual identity

Registration should allow a new competitor/team to create an account.

Fields may include:

* Full name
* Email
* Phone number
* School/organisation
* Team name
* Project title
* Competition category/theme
* Password
* Confirm password

Include validation and clear error messages.

---

## COMPETITOR DASHBOARD

After login, display a clean and simple dashboard.

### Welcome section

Example:

> Welcome back, Team AquaSense

### Competition Journey

Create a visually attractive progress timeline:

**Application Submitted**
↓
**Under Review**
↓
**Phase 1 Evaluation**
↓
**Top 20 Selected**
↓
**Paper Prototype**
↓
**Prototype Development**
↓
**Final Presentation**
↓
**Competition Result**

Show:

* Completed stages
* Current stage
* Upcoming stages
* Locked/future stages

Do not reveal results before they are officially released.

---

## COMPETITOR TASKS

Competitors must be able to:

### 1. Register

Create a competition account.

### 2. Complete their profile

View and edit appropriate information.

### 3. Submit an application

Include:

* Problem statement
* Proposed solution
* Innovation
* Intended users
* Expected impact
* Technology used
* Team information

### 4. Upload required documents

Create a proper upload interface for:

* Application documents
* Project proposal
* Presentation
* Paper prototype
* Prototype evidence
* Images
* Supporting documents
* Final presentation

Display:

* File name
* File type
* Upload status
* Date uploaded
* Replace option where permitted
* Delete option before submission deadline where permitted

### 5. Save draft

Allow competitors to save incomplete applications and continue later.

### 6. Submit

Before final submission:

Show a checklist.

Example:

✓ Problem statement complete
✓ Solution complete
✓ Supporting document uploaded
⚠ Presentation missing

Prevent final submission where critical required fields are incomplete.

After submission:

Display:

> **Submission Received ✓**

Include timestamp and submission status.

### 7. Track application status

Examples:

* Draft
* Submitted
* Under Review
* Shortlisted
* Top 20
* Not Selected
* Progressed to Phase 2
* Progressed to Phase 3
* Finalist
* Winner
* Competition Completed

The competitor must never see private judge scores or confidential internal administrative information.

### 8. Receive announcements

Create a Competition Updates/Announcements section.

Examples:

> Top 20 announcement released.

> Paper prototype submission is now open.

> Final presentation schedule available.

### 9. View final status

At the appropriate end stage, the competitor should be able to see their official status.

Example:

> 🥇 Competition Winner

or:

> Competition completed. Thank you for participating.

Do not reveal rankings or winner information before administrators officially release them.

---

# USER ROLE 2 — JUDGE

## Judge Purpose

The judge needs to evaluate projects quickly, independently and fairly.

The judge experience must answer:

> “What do I need to judge next, what evidence do I need and have I completed everything correctly?”

---

# JUDGE LOGIN PAGE

Create a completely separate Judge login page.

Include:

* Email
* Password
* Forgot password
* Secure login
* Samsung-inspired premium visual design

Do not allow judges to register themselves into unrestricted judging access.

New judges should be created/invited by the administrator.

This protects competition integrity.

---

# JUDGE DASHBOARD

Display:

## My Judging

### Progress

Example:

**8 / 20 Evaluations Completed**

Progress bar.

Show:

* Completed
* In Progress
* Not Started
* Remaining

Then:

### Continue Judging

Show the next incomplete evaluation.

Example:

**Team SFT-08**

Project:

> EcoGrid

Button:

**Continue Evaluation**

---

# JUDGE TEAM LIST

Show assigned teams.

Example:

| Team   | Project    | Status      |
| ------ | ---------- | ----------- |
| SFT-01 | AquaSense  | Completed   |
| SFT-02 | SolarGuard | In Progress |
| SFT-03 | SmartLearn | Not Started |

Judges must only access teams assigned to them.

---

# INDEPENDENT JUDGING

Judges must NEVER see:

* Other judges' scores
* Other judges' comments
* Live average scores
* Rankings while judging is active
* Winner predictions
* Administrative data

Display a subtle:

# 🔒 Independent Evaluation Active

This protects fair and independent scoring.

---

# JUDGE CALIBRATION CENTRE

Before judging begins, require judges to complete a short calibration exercise.

Use a fictional sample project.

Example:

> Sample Project: AquaSense Demo

The judge reviews sample evidence and practices using the rubric.

After completion, provide guidance explaining what each rubric criterion means.

Do NOT tell the judge what score they should have given.

Do NOT force the judge to match a “correct” score.

The purpose is to improve consistency in understanding the rubric, not to manipulate judgement.

Display:

> **Calibration Complete ✓**
>
> You are ready for independent evaluation.

This is a major innovation of Galaxy Judge.

---

# TEAM/PROJECT EVALUATION WORKSPACE

When a judge opens a team, provide everything required in a focused workspace.

Display:

### Team ID

For example:

> Team SFT-08

Support an optional blind judging mode where school identity is hidden and the judge focuses primarily on the project.

### Project information

* Problem
* Proposed solution
* Intended users
* Technology
* Expected impact
* Innovation

### Evidence

Create tabs:

* Overview
* Documents
* Presentation
* Video
* Images
* Prototype Evidence

The judge must be able to easily move between evidence and scoring.

On desktop/tablet:

Use a split-screen layout where practical:

LEFT: Evidence

RIGHT: Rubric and scoring

---

# AI EVIDENCE COPILOT

Create an innovative feature:

# ✨ AI Evidence Copilot

This must NOT be a generic chatbot.

It should help the judge locate relevant evidence for a selected scoring criterion.

Example:

The judge opens:

### Innovation — 25%

The system displays:

### Relevant Evidence Found

**Evidence 1**
Sensor-based monitoring

Source:
Project Document — Section 2

**Evidence 2**
Automated alert prototype

Source:
Presentation — Slide 5

**Evidence 3**
Predictive monitoring concept

Source:
Prototype Evidence

Then provide a short AI-generated evidence summary.

Example:

> The project demonstrates innovation through combining sensor monitoring, automated alerts and predictive analysis.

Always display:

> **AI assists with evidence discovery. Final judgement remains with the human judge.**

The AI must NEVER:

* Give the final score
* Recommend a score
* Change a score
* Rank competitors
* Decide the winner

The human judge always makes the decision.

---

# EVIDENCE MAP

Create an innovative visual connection between:

RUBRIC CRITERION
↓
RELEVANT EVIDENCE
↓
JUDGE INTERPRETATION
↓
JUDGE SCORE
↓
JUDGE COMMENT

The judge should be able to click evidence and return to its original source.

This makes decisions more defensible and traceable.

---

# WEIGHTED RUBRIC SCORING

The scoring rubric must be configurable by the administrator.

Support weighted criteria totalling exactly:

# 100%

For the demo, use:

* Innovation — 25%
* Impact — 20%
* Feasibility — 20%
* Presentation — 20%
* Additional Criterion — 15%

Automatically calculate:

weighted score =
(score ÷ maximum score) × criterion weight

Automatically calculate final totals.

Do not require judges to manually calculate percentages.

Validate that total rubric weight equals exactly 100%.

---

# SCORING EXPERIENCE

Do not build one giant overwhelming form.

Use a focused criterion-by-criterion workflow.

Example:

# Innovation

### Weight: 25%

### What to consider

Originality, meaningful differentiation and effective use of technology.

### Evidence

Display relevant evidence.

### Score

Use an elegant interactive scale:

1 2 3 4 5 6 7 8 9 10

Then:

### Judge Notes

Private text area.

Show:

> Criterion 1 of 5

Buttons:

**Previous**

**Save Draft**

**Next Criterion**

---

# FAIRNESS SHIELD

Create an innovative feature:

# 🛡 Fairness Shield

Before final submission, perform a non-invasive consistency review.

Example:

A judge gives:

Innovation: 10/10

Feasibility: 2/10

The system should NOT change the score.

Instead, display:

> **Review Recommended**
>
> There is a significant difference between your Innovation and Feasibility evaluations.
>
> Please review your scores and supporting evidence if necessary.

Buttons:

**Review Evaluation**

**Continue to Submit**

The judge remains in control.

This is designed to prevent accidental scoring mistakes, not influence judgement.

---

# SAVE, RESUME AND AUTO-SAVE

The application must automatically save important judging progress where practical.

Include:

# Save & Continue Later

Display:

> ✓ Draft saved

Example:

> Last saved: 14:32

If the judge leaves and returns:

> **Draft Recovered**
>
> Continue your evaluation where you left off.

---

# OFFLINE-FIRST JUDGING

This is an important resilience feature.

Create a demonstrable offline mode.

When connectivity disappears:

Display:

> 🔴 Connection unavailable
>
> Your work is safely stored on this device.

Allow the judge to continue scoring.

Display:

> Offline Evaluation Active

When connection returns:

Display:

> 🔄 Synchronising secure evaluation...

Then:

> ✓ Evaluation synchronised successfully.

Do not position offline mode as the only innovation.

It is part of Galaxy Judge's broader **resilient competition infrastructure**.

---

# SCORE VALIDATION

Before submission, automatically check:

* All required criteria completed
* Scores are within valid range
* Required comments completed
* Required evidence reviewed where applicable

Example:

# Final Review

✓ Innovation completed
✓ Impact completed
✓ Feasibility completed
⚠ Presentation missing
✓ Additional Criterion completed

Display:

> **1 item requires attention before submission.**

Prevent incomplete submissions.

---

# SUBMIT AND LOCK

Before final submission:

Display:

# Ready to Submit?

Show completed criteria.

Show calculated score.

Warning:

> Once submitted, this evaluation will be locked.

Button:

# Submit & Lock Evaluation

After submission:

# 🔒 Evaluation Locked

Display:

> Your independent evaluation has been securely recorded.

Include:

* Timestamp
* Submission ID
* Status

A judge cannot silently edit a locked evaluation.

---

# CORRECTION REQUEST WORKFLOW

After locking, a judge may click:

**Request Correction**

The judge selects:

* Team
* Criterion
* Current score
* Requested correction
* Reason

The administrator reviews the request.

The administrator can:

**Approve**

or

**Reject**

Every correction must create a permanent audit event.

Example:

> Score changed from 7 → 8
> Correction approved
> Reason recorded
> Timestamp recorded
> Administrator recorded

---

# CONFLICT OF INTEREST

Before judging an assigned team, support an:

# Independence Check

Ask:

> Do you have a personal, professional, institutional or other relationship with this team that could affect your independent judgement?

Options:

**No Conflict**

**Declare Conflict**

If conflict is declared:

Prevent scoring.

Notify the administrator.

Allow the administrator to reassign the team.

---

# USER ROLE 3 — ADMINISTRATOR

## Admin Purpose

The administrator manages the competition and ensures that the competition process is secure, complete, fair and operationally seamless.

The admin should not need to search through multiple pages to discover problems.

The Admin Dashboard should immediately show the health of the competition.

---

# ADMIN LOGIN PAGE

Create a separate secure Administrator login page.

Include:

* Email
* Password
* Forgot password
* Secure access design

Administrator accounts should be created and managed securely.

---

# ADMIN COMMAND CENTRE

Create a premium dashboard called:

# Competition Command Centre

Display key information immediately.

### Competition Overview

* Total Competitors
* Total Judges
* Total Evaluations
* Evaluation Completion %
* Draft Evaluations
* Locked Evaluations
* Correction Requests
* Integrity Alerts

Example:

**Competitors: 20**

**Judges: 20**

**Evaluations: 320 / 400**

**Completion: 80%**

---

# ADMIN COMPETITOR MANAGEMENT

The administrator must be able to:

* Add competitor/team
* Edit competitor/team
* View profiles
* Activate/deactivate accounts
* Review submissions
* View application status
* Update phase/status
* Manage required documents
* View missing submissions

Include:

# + Add Competitor

The competition may begin with 20 teams, but the system must be scalable.

Do NOT hard-code the system permanently to only 20 competitors.

---

# ADMIN JUDGE MANAGEMENT

The administrator must be able to:

* Add judge
* Edit judge
* Activate/deactivate judge
* View judge status
* Assign teams
* Reassign teams
* Monitor progress
* View conflict declarations

Include:

# + Add Judge

Do not hard-code the system permanently to 20 judges.

---

# JUDGE ASSIGNMENT MANAGEMENT

Create an intuitive assignment interface.

Example:

Judge 01 → Teams 01–10

Judge 02 → Teams 01–10

Support multiple judges evaluating the same team independently.

The system must prevent unauthorised judges from accessing teams outside their assignments.

Highlight potential problems.

Example:

> ⚠ Judge 04 has declared a conflict with Team SFT-12.

Button:

**Reassign Team**

---

# LIVE JUDGING MONITOR

The administrator should see judging progress.

Example:

| Judge    | Assigned | Completed | Drafts | Status      |
| -------- | -------: | --------: | -----: | ----------- |
| Judge 01 |       20 |        20 |      0 | Complete    |
| Judge 02 |       20 |        16 |      2 | In Progress |
| Judge 03 |       20 |        20 |      0 | Complete    |

Do not unnecessarily expose private judge scores on the main monitoring screen.

The purpose here is operational progress.

---

# INTEGRITY CENTRE

Create one of the strongest admin features:

# 🔐 Integrity Centre

Display:

### Competition Integrity

Score Privacy: ✓ Protected

Unauthorised Changes: 0

Locked Evaluations: 320

Unresolved Correction Requests: 2

Sync Conflicts: 0

Missing Evaluations: 4

Audit Events: 1,284

Status:

> 🟢 Competition Integrity Healthy

or show relevant warnings.

---

# JUDGE CONSISTENCY MONITOR

Create a feature that analyses broad scoring patterns without accusing judges of bias.

Display:

# Scoring Pattern Review

Examples:

* Scoring range
* Criterion-level variation
* Completion patterns
* Unusual outliers

Use neutral language.

Example:

> Judge 08 is using a narrower scoring range than the overall panel.

Status:

> Review Recommended

Never say:

> Judge 08 is biased.

Do not automatically change scores.

Do not influence the judge.

This is for administrative oversight.

---

# SCORE AUDIT AND CONSOLIDATION

Support a dedicated post-evaluation stage where administrators can:

* Verify completion
* Review missing scores
* Resolve correction requests
* Check synchronisation
* Confirm score integrity
* Consolidate final scores

Results should remain appropriately restricted until the competition stage allows release.

Display:

# RESULTS LOCKED

Until the administrator officially closes judging.

---

# CLOSE JUDGING

Admin action:

# Close Judging

Display confirmation:

> Once judging is closed, standard evaluations can no longer be submitted.

Button:

**Confirm and Close Judging**

After closing:

# RESULTS UNLOCKED

---

# FINAL RANKINGS

Automatically calculate rankings using actual mock score data and the configured weighted rubric.

Display:

# Final Results

🥇 Rank 1 — Team SFT-14

Score: 91.4

🥈 Rank 2 — Team SFT-03

Score: 89.8

🥉 Rank 3 — Team SFT-17

Score: 87.9

Do not hard-code rankings if calculations can be performed dynamically.

Rankings should update from underlying scoring data.

---

# EXPLAINABLE RESULTS

Create a major Galaxy Judge innovation:

# Why Did This Team Win?

When the administrator selects a ranked team:

Display:

### Final Score

91.4

### Criterion Breakdown

Innovation — 94%

Impact — 92%

Feasibility — 89%

Presentation — 91%

Additional Criterion — 91%

### Evaluation Integrity

✓ Required evaluations completed

✓ Scores consolidated

✓ No unauthorised changes

✓ Audit trail available

✓ Correction workflow completed

### Supporting Evidence

Show traceable evidence connected to high-level evaluation dimensions where possible.

Never invent explanations.

Explain the ranking using actual available scoring and evaluation data.

---

# AUDIT REPLAY

Create a readable chronological:

# Audit Trail

Example:

14:02 — Judge 08 authenticated

14:08 — Team SFT-06 opened

14:12 — Innovation criterion scored

14:16 — Evaluation saved

14:23 — Evaluation submitted

14:23 — Evaluation locked

Allow filtering by:

* User
* Role
* Team
* Action
* Date
* Status

The purpose is to answer:

> What happened, who did it and when?

---

# COMPETITION INTELLIGENCE

After the competition, provide Samsung with value beyond identifying the winner.

Create:

# Competition Intelligence

Use charts and insights based on mock data.

Examples:

### Common Technology Themes

AI

IoT

Mobile

Sustainability Technology

### Common Problem Areas

Education

Environment

Healthcare

Water

Community Safety

### Highest Average Scoring Areas

Example:

Innovation — 86%

### Areas Where Competitors Struggled

Example:

Feasibility — 68%

### Competition Insight

> Teams demonstrated strong innovation but feasibility and scalability were common challenges.

Insights must be generated from the mock data where possible.

This turns Galaxy Judge into a system that can help Samsung understand its innovation ecosystem.

---

# ADMIN ANNOUNCEMENT MANAGEMENT

Allow Admin to create competition announcements.

Examples:

* Applications Open
* Applications Closed
* Top 20 Announcement
* Paper Prototype Submission Open
* Prototype Development Commencement
* Final Presentation Schedule
* Winner Announcement

Competitors should see announcements relevant to their competition stage.

---

# ROLE-BASED ACCESS CONTROL

Implement clear access control.

## COMPETITOR

Can access:

* Own account
* Own profile
* Own application
* Own uploads
* Own progress
* Competition announcements
* Own final status when released

Cannot access:

* Judge scores
* Other competitors' private information
* Admin dashboard
* Internal rankings before release
* Other competitors' applications

## JUDGE

Can access:

* Own account
* Assigned teams
* Project evidence
* Rubric
* Own draft scores
* Own submitted evaluation status
* Correction requests

Cannot access:

* Other judges' scores
* Other judges' private information
* Admin controls
* Rankings during active judging
* Unassigned teams

## ADMIN

Can access:

* Competition management
* Competitor management
* Judge management
* Assignments
* Competition progress
* Score consolidation
* Correction requests
* Audit data
* Rankings
* Competition insights
* Announcements

Use proper role-based navigation.

If a user attempts to access a restricted route:

Display:

# Access Restricted

> Your role does not have permission to access this information.

---

# MOCK DATA — REQUIRED

Create all mock data independently.

Do NOT require me to manually create data before testing the application.

Create:

* 20 fictional competitors/teams
* 20 fictional judges
* Fictional schools/organisations
* Project names
* Project descriptions
* Intended users
* Problem statements
* Technology categories
* Project evidence
* Uploaded documents
* Presentation placeholders
* Prototype image placeholders
* Draft applications
* Submitted applications
* Different competition statuses
* Draft evaluations
* Completed evaluations
* Locked evaluations
* Correction requests
* Audit events
* Competition announcements
* Ranking data
* Competition analytics

All data must be fictional.

Use realistic, polished content rather than generic:

> Lorem ipsum

or:

> Team 1 Project.

Create believable example projects such as:

* AquaSense
* SolarGuard
* SmartLearn
* SafeRoute
* AgriVision
* CleanWave
* HealthLink
* EcoGrid
* AirAware
* EduBridge
* FarmSense
* WasteWise
* SignaLearn
* AquaShield
* PowerPulse
* FoodSafe
* CareConnect
* SolarFlow
* BlueWatch
* SafeCity

Use these as fictional prototype content.

---

# DEMO LOGIN CREDENTIALS — REQUIRED

Create completely NEW fictional demo accounts.

Do NOT reuse or expose any existing credentials that may already exist in the current application.

The system must generate its own fresh demo credentials.

Create at least:

## COMPETITOR DEMO ACCOUNT

Name:

Demo Team Alpha

Email:

`competitor01@galaxyjudge.demo`

Password:

Create a new secure fictional demo password.

## JUDGE DEMO ACCOUNT

Name:

Demo Judge 01

Email:

`judge01@galaxyjudge.demo`

Password:

Create a new secure fictional demo password.

## ADMIN DEMO ACCOUNT

Name:

Galaxy Judge Administrator

Email:

`admin@galaxyjudge.demo`

Password:

Create a new secure fictional demo password.

Do not reuse passwords between roles.

Optionally create additional test accounts.

---

# DEMO ACCESS

On each appropriate login page, include a subtle:

# Demo Access

section.

Allow easy testing of the prototype.

Where appropriate, include:

**Use Demo Account**

or clearly provide test credentials.

These credentials are for prototype testing only.

---

# IMPORTANT: PROVIDE CREDENTIALS AFTER BUILDING

After completing the prototype, provide a separate, clear section titled:

# GALAXY JUDGE TEST CREDENTIALS

List:

### Competitor

Email:
Password:

### Judge

Email:
Password:

### Administrator

Email:
Password:

Also explain briefly what can be tested with each account.

I must be able to use these credentials immediately after publishing the prototype.

---

# FULL FUNCTIONALITY REQUIREMENT

This application must NOT consist of beautiful but non-functional screens.

Every major workflow must be interactive.

Buttons must perform meaningful actions.

Forms must validate input.

Status must change.

Scores must calculate.

Role permissions must work.

The application should behave like a real product.

---

# REQUIRED FUNCTIONAL FLOWS

## COMPETITOR FLOW

REGISTER

↓

LOGIN

↓

COMPLETE PROFILE

↓

CREATE APPLICATION

↓

SAVE DRAFT

↓

UPLOAD DOCUMENTS

↓

SUBMIT

↓

TRACK STATUS

↓

RECEIVE ANNOUNCEMENTS

↓

PROGRESS THROUGH COMPETITION PHASES

↓

VIEW FINAL STATUS

---

## JUDGE FLOW

LOGIN

↓

COMPLETE CALIBRATION

↓

VIEW ASSIGNED TEAMS

↓

OPEN TEAM

↓

REVIEW EVIDENCE

↓

USE AI EVIDENCE COPILOT

↓

SCORE RUBRIC

↓

SAVE DRAFT

↓

SIMULATE OFFLINE MODE

↓

CONTINUE SCORING

↓

SYNC

↓

FAIRNESS SHIELD

↓

FINAL VALIDATION

↓

SUBMIT

↓

LOCK EVALUATION

↓

OPTIONAL CORRECTION REQUEST

---

## ADMIN FLOW

LOGIN

↓

VIEW COMMAND CENTRE

↓

MANAGE COMPETITORS

↓

MANAGE JUDGES

↓

ASSIGN JUDGES TO TEAMS

↓

MONITOR PROGRESS

↓

MANAGE ANNOUNCEMENTS

↓

VIEW INTEGRITY CENTRE

↓

REVIEW CORRECTION REQUESTS

↓

AUDIT SCORES

↓

CONSOLIDATE RESULTS

↓

CLOSE JUDGING

↓

UNLOCK RESULTS

↓

VIEW RANKINGS

↓

WHY DID THIS TEAM WIN?

↓

VIEW COMPETITION INTELLIGENCE

↓

RELEASE FINAL RESULTS

---

# INNOVATIVE FEATURES THAT MUST MAKE GALAXY JUDGE STAND OUT

Galaxy Judge's innovation must NOT be reduced to only an offline feature.

Include these differentiating features:

## 1. FAIRNESS BY DESIGN

The entire platform protects independent judgement.

## 2. JUDGE CALIBRATION CENTRE

Helps judges consistently understand the rubric.

## 3. AI EVIDENCE COPILOT

Finds relevant evidence without making decisions for judges.

## 4. EVIDENCE-TO-SCORE MAP

Visually connects:

Criterion → Evidence → Interpretation → Score → Notes.

## 5. FAIRNESS SHIELD

Flags possible accidental inconsistencies without changing a judge's score.

## 6. BLIND/FOCUS MODE

Reduces possible identity-based influence during judging.

## 7. OFFLINE-FIRST JUDGING

Judges can continue during temporary connectivity loss.

## 8. AUTO-SAVE AND DRAFT RECOVERY

Prevents work from being lost.

## 9. SECURE SUBMIT AND LOCK

Protects final evaluations.

## 10. CORRECTION WORKFLOW

Allows controlled, documented changes.

## 11. INTEGRITY CENTRE

Gives administrators one view of competition health.

## 12. JUDGE SCORING PATTERN REVIEW

Supports administrative oversight without accusing judges or changing scores.

## 13. AUDIT REPLAY

Provides a chronological, human-readable record.

## 14. EXPLAINABLE RESULTS

Answers:

> Why did this team win?

Using actual scoring and evaluation information.

## 15. COMPETITION INTELLIGENCE

Gives Samsung insights beyond identifying winners.

## 16. SMART COMPETITION JOURNEY

Competitors clearly understand their current phase and next action.

---

# SAMSUNG / GALAXY DESIGN DIRECTION

The design must feel premium and inspired by the modern Samsung Galaxy ecosystem.

Do NOT create a generic blue corporate dashboard.

The design should communicate:

* Samsung
* Innovation
* Trust
* Technology
* Premium quality
* Simplicity
* Intelligence

---

# COLOUR SYSTEM

Use a Samsung-inspired design system.

Primary:

Deep Samsung-inspired Blue:

#1428A0

Supporting:

* White
* Near-black
* Soft cool greys
* Light blue accents
* Subtle blue gradients

Use:

Green sparingly for success.

Amber sparingly for warnings.

Red only for critical errors.

Do not overuse colours.

The UI must remain elegant.

---

# UI/UX STYLE

Use a premium modern interface inspired by One UI principles:

* Rounded surfaces
* Large comfortable touch targets
* Strong visual hierarchy
* Generous whitespace
* Clean typography
* Minimal unnecessary borders
* Subtle elevation/shadows
* Smooth micro-interactions
* Easy one-handed mobile navigation
* Clear status indicators
* Calm professional experience

Avoid:

* Clutter
* Tiny text
* Dense forms
* Excessive gradients
* Excessive glass effects
* Neon colours
* Gaming aesthetics
* Overly complex dashboards

---

# TYPOGRAPHY

Use Samsung-style typography where technically appropriate and legally available.

Otherwise use:

Inter

Use:

* Large bold headings
* Clear section titles
* Highly readable body text
* Prominent numerical statistics

---

# RESPONSIVE DESIGN

The application must work beautifully on:

## Galaxy Smartphone / Mobile

Prioritise:

* One-handed navigation
* Bottom navigation
* Large touch targets
* Focused judging

## Galaxy Tablet

Prioritise:

* Evidence review
* Split-screen scoring
* Large media viewing
* Side-by-side information

## Desktop / DeX-Style Experience

Prioritise:

* Admin Command Centre
* Tables
* Analytics
* Audit Trail
* Competition management

Create responsive layouts rather than merely stretching the same design.

---

# GALAXY DEVICE EXPERIENCE

Include a concept called:

# Galaxy Continuity

Where practical in the prototype, simulate:

> Continue on another Galaxy device

Example:

A judge saves progress on a mobile layout and continues using a tablet layout.

Clearly label this as a prototype/device continuity concept where it is simulated.

Do not falsely claim unavailable proprietary Samsung integrations.

---

# ANIMATION

Use subtle, purposeful animation.

Examples:

* Score selection feedback
* Save confirmation
* Synchronisation animation
* Submission lock animation
* Progress transitions
* Ranking reveal

Animations must communicate state.

Do not add animation merely for decoration.

---

# ACCESSIBILITY

Ensure:

* High contrast
* Readable font sizes
* Clear labels
* Keyboard support where applicable
* Clear focus states
* Status not communicated by colour alone
* Large touch targets

---

# SECURITY AND PRIVACY

Implement realistic prototype-level security concepts:

* Authentication
* Role-based access control
* Protected routes
* Separate dashboards
* Private judge scores
* Secure submission locking
* Audit logging
* Controlled corrections

For the prototype, do not claim production-grade Samsung security certifications or proprietary integrations that are not actually implemented.

---

# BACKEND AND DATA

Use an appropriate backend/data solution if available.

Prefer a reliable architecture such as:

* Supabase
* Firebase
* Another suitable supported backend

Support where practical:

* Authentication
* Role storage
* User profiles
* Competitor records
* Judge records
* Applications
* File metadata/uploads
* Evaluations
* Scores
* Rubric
* Announcements
* Audit logs

If a full backend cannot be implemented immediately, create a reliable mock/local data architecture so that the prototype still behaves interactively and can be demonstrated.

Do not sacrifice the functional user experience merely to add unnecessary backend complexity.

---

# CODE ACCESS REQUIREMENT

I need access to the code used to create Galaxy Judge for my own learning, future development and maintenance.

Structure the project cleanly.

Use clear organisation.

Separate:

* Components
* Pages
* Authentication
* Role-based logic
* Mock data
* Services
* Scoring calculations
* Styling

Add clear comments where helpful.

Avoid unnecessarily complicated architecture.

At completion, provide a clear explanation of:

* Technology/framework used
* Project structure
* Where authentication is handled
* Where mock data is stored
* Where login credentials are configured
* Where scoring calculations are implemented
* Where role permissions are controlled
* How to replace mock data with a real backend later

Do not provide only a visual prototype without allowing the project to remain understandable and maintainable.

---

# EDITABILITY AFTER PUBLISHING

This is a strict requirement.

After the application is published, I must still be able to:

* Return to the project
* Edit screens
* Change features
* Modify mock data
* Update UI
* Add functionality
* Change text
* Change competition settings
* Add new users
* Continue developing the application

Publishing must NOT make the application permanently uneditable.

Preserve the project in an editable state.

Clearly explain how I can return and continue editing the project after publishing.

---

# MAINTAINABILITY

Build Galaxy Judge in a way that can evolve.

Do not tightly hard-code:

* Exactly 20 competitors
* Exactly 20 judges
* Specific competition dates
* Specific project names
* Specific rubric values

These should be configurable where practical.

The prototype should demonstrate 20 competitors and 20 judges but be architected for future competitions.

---

# NO STATIC MOCKUP REQUIREMENT

Do NOT stop after generating screens.

The following must genuinely work in the published prototype:

### Competitor

* Registration
* Login
* Profile
* Application
* Save draft
* Document upload interaction
* Submission
* Status tracking
* Competition timeline

### Judge

* Login
* Calibration
* Assigned teams
* Evidence viewing
* Scoring
* Weighted calculations
* Save/resume
* Offline simulation
* Sync simulation
* Fairness Shield
* Submission
* Locking
* Correction request

### Admin

* Login
* Competitor management
* Judge management
* Assignment management
* Monitoring
* Announcements
* Integrity Centre
* Audit Trail
* Score consolidation
* Rankings
* Explainable Results
* Competition Intelligence

---

# TESTING REQUIREMENT

Before considering the prototype complete, test the major workflows.

Test:

### Competitor Test

Register/Login → Create application → Save → Upload → Submit → Status update.

### Judge Test

Login → Calibration → Evaluate team → Score → Save → Offline → Sync → Submit → Lock.

### Admin Test

Login → Add/manage users → Monitor progress → Review correction → Audit → Consolidate → Close judging → Rankings.

Test role restrictions.

Test scoring calculations.

Test responsive layouts.

Test navigation.

Fix broken flows.

Do not leave major buttons non-functional.

---

# FINAL OUTPUT FORMAT

After building the application, return the following clearly:

# 1. WORKING PUBLISHED PROTOTYPE

Provide the published prototype so I can immediately open and test it.

# 2. TEST CREDENTIALS

Provide a separate section:

## Competitor

Name:
Email:
Password:

## Judge

Name:
Email:
Password:

## Administrator

Name:
Email:
Password:

These must be fresh fictional credentials generated for this prototype.

# 3. MOCK DATA SUMMARY

Explain what mock data was created, including:

* Number of teams
* Number of judges
* Sample applications
* Sample evaluations
* Announcements
* Audit events
* Rankings

# 4. CODE AND TECHNICAL STRUCTURE

Provide access to or clearly identify the project code.

Explain:

* Framework
* Main folders/files
* Authentication logic
* Role-based access
* Mock data location
* Scoring logic
* Data model

# 5. HOW TO EDIT AFTER PUBLISHING

Provide simple instructions explaining how I can continue editing Galaxy Judge after publishing.

# 6. HOW TO TEST

Provide a short test guide:

### Test as Competitor

Step-by-step.

### Test as Judge

Step-by-step.

### Test as Admin

Step-by-step.

# 7. KNOWN PROTOTYPE SIMULATIONS

Clearly identify anything simulated, for example:

* Offline sync simulation
* AI evidence simulation
* Galaxy device continuity concept

Do not falsely present simulated features as fully integrated proprietary Samsung technology.

---

# FINAL QUALITY CHECK

Before completing, ask:

### FUNCTIONALITY

Can every role actually perform its primary task?

### SECURITY

Can users access information outside their role?

### FAIRNESS

Can judges see other judges' scores?

### JUDGING

Does AI assist rather than decide?

### RESILIENCE

Can the offline workflow be demonstrated?

### DATA

Do weighted scores calculate correctly?

### AUDIT

Can important actions be traced?

### ADMIN

Can the administrator immediately understand competition progress?

### COMPETITOR

Can a competitor clearly understand what to do next?

### RESULTS

Can the system explain how rankings were produced?

### INNOVATION

Do the features solve real competition problems rather than exist merely to look impressive?

### SAMSUNG

Does the application feel premium and relevant to the Galaxy/Samsung innovation ecosystem?

### DESIGN

Would this interface look credible in a first-place hackathon presentation?

If the answer to any important question is NO, improve it before considering the build complete.

---

# FINAL PRODUCT VISION

Galaxy Judge must tell this complete story:

A competitor registers and submits their innovation.

They track their progress through the competition and always know what happens next.

Judges securely enter their own independent environment.

They calibrate their understanding of the rubric.

They review project evidence.

AI helps them find relevant information without making decisions for them.

They score independently.

Their work is saved and protected.

If connectivity fails, they can continue working.

Their evaluation synchronises when connectivity returns.

Before submission, the system helps catch accidental errors without influencing their judgement.

They submit.

The evaluation is locked.

Any correction is controlled and recorded.

Samsung administrators monitor the entire competition from one intelligent command centre.

They manage competitors and judges.

They monitor completion and competition integrity.

They audit the process.

They consolidate the results.

When judging closes, the system calculates the rankings.

Samsung can answer:

> **Why did this team win?**

Galaxy Judge provides a traceable answer.

After the competition, Samsung also gains insights into the innovation themes, strengths and challenges emerging across competitors.

The final product should make a reviewer think:

> **“This is not simply a scoring application. This is a scalable, intelligent competition infrastructure designed around the real problems that happen before, during and after judging.”**

The ultimate question Galaxy Judge answers is:

# **How can Samsung trust the process that produced its winner?**

Build the application around answering that question.

Now create the complete, functional, interactive, stylish and publishable Galaxy Judge prototype.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/b99bb540-0c07-41a0-854b-81c11221114e).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
