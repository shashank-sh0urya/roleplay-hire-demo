# SmartHire real-backend upgrade

## Goal
Keep the current SmartHire branding, navigation, responsive layout, and AI/demo modules while separating clearly labelled sample data from real account-backed hiring activity.

## Work
1. Add email/password account creation and sign-in, session-aware account controls, and secure candidate/recruiter role selection. Keep the existing sample-account switch separate from real accounts. Gate account-linked profile records until the profile-storage answer arrives, and gate administrator access until the first-admin email is provided.
2. Create the production data model for candidate and recruiter profiles, companies, recruiter-owned jobs, applications, shortlists, interviews, notifications, interview roadmaps/progress, chat history, resumes, and separate user roles. Add ownership policies and server-checked authorization; candidates cannot change recruitment decisions, recruiters can only manage their own companies/jobs/applicants, and admin functions remain restricted.
3. Keep sample companies/jobs clearly labelled and out of real job results. Connect existing profile editing, private profile-photo/resume uploads, job discovery and filters, shortlist, application deadline/duplicate checks, recruiter job management, candidate decisions, interview scheduling/confirmation, selection details, and notifications to saved records.
4. Add realtime updates for applications, interviews, and notifications. Generate map directions only from recruiter-entered company addresses or verified coordinates. Preserve HireMate, preparation, mock interview, resume assistance, and skill matching as labelled demo fallbacks until AI access is configured.
5. After a sender domain you own is verified, use Lovable’s managed app-email delivery for application, status, selection, and interview messages. Send only after successful record updates, deduplicate status-transition sends, and use managed delivery history rather than creating a separate email queue/table.

## Technical details
- Use Lovable Cloud migrations for schema changes, explicit grants and row-level security for every public table, private Storage policies, and server functions for privileged operations.
- Use `auth.users` for login identities; keep authorization roles in a protected `user_roles` table, not profile fields or browser storage.
- Preserve the shared workspace provider and named TanStack pages; add focused server-function modules and account screens without replacing existing modules.
- Leave all existing demo behavior usable and visibly distinct from real listings and accounts.

## Validation and dependencies
- Run schema/security checks and focused tests for duplicate applications, deadline enforcement, owner scoping, and allowed status transitions.
- Exercise the candidate-to-recruiter-to-interview-to-selection flow with real test accounts when the auth and admin setup permits; verify email only after sender-domain setup. Check desktop and mobile layouts and report each test as passed only if executed.
- App emails are blocked until a verified domain you own is configured. The profile-storage choice and initial administrator email are still awaiting your answers.