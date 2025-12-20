AI ENGINEERING RULES

These rules apply to every output, every line of code, every decision, and every development step you take while building the CRM Dashboard.

1. PRD ADHERENCE RULES

You MUST:

Fully obey all specifications in PRD.md, DB_SCHEMA.md, and API_SPEC.md.

Never invent features outside the PRD without explicit user approval.

Never downgrade, oversimplify, or remove required features.

Always resolve conflicts in favor of the PRD unless the user specifies otherwise.

If ambiguity exists:

You MUST stop, explain the ambiguity, and ask the user before continuing.

2. STEP-BY-STEP DEVELOPMENT RULES

You MUST:

Break all work into small, clearly defined phases.

Ask for approval before starting each phase.

Provide a preview of what will be built in the current step.

Deliver code only after approval.

Never jump ahead or skip steps.

3. QUALITY STANDARDS

You MUST:

Write modular, maintainable, and documented code.

Follow Firebase best practices.

Follow standard design patterns (MVC, service layers, reusable components).

Use TypeScript when possible.

Properly name variables, collections, and functions.

Avoid coupling UI logic with backend logic.

4. SECURITY RULES

You MUST:

Enforce Firebase Auth + role-based access control.

Prevent unauthorized reads/writes of Firestore documents.

Validate all inputs.

Avoid exposing internal API keys.

Use Firebase Cloud Functions for privileged operations.

Sanitize all user-generated text before writing to DB.

5. FIREBASE DEVELOPMENT RULES

You MUST:

Use Firebase Firestore according to DB_SCHEMA.md.

Use Firebase Functions for server logic.

Use Firestore indexes for large filtered queries.

Use Firestore security rules referencing user roles in JWT.

Store timestamps as Firebase Timestamp objects.

Use Cloud Scheduler for auto-fetch (where required).

Follow Firebase Hosting best practices for frontend deployment.

6. FRONTEND UI/UX RULES

You MUST:

Follow the UI flow described in PRD.md exactly.

Use responsive layouts.

Keep the UI clean, fast, and intuitive.

Ensure the Internship Table supports:

sorting

pagination

virtualization for performance

column visibility toggles

Ensure the Detail Drawer has 3 tabs exactly.

Use consistent color coding for statuses.

7. AI INTEGRATION RULES

You MUST:

Only generate AI outputs in the allowed contexts: outreach, follow-up suggestions, status recommendations.

Log every AI action into ai_outreach_history.

Do not hallucinate company metadata; only use DB values.

8. RELIABILITY & TESTING RULES

You MUST:

Write tests for all Firebase Functions.

Handle errors gracefully with clear messages.

Log errors to Firebase Crashlytics or console.

Ensure long-running fetch jobs are resumable or safe to retry.

9. PERFORMANCE RULES

You MUST:

Use Firestore indexes for filtering and sorting.

Optimize reads using where + limit.

Use pagination or lazy-loading for large tables.

Avoid reading large collections without filters.

10. COMMUNICATION RULES

You MUST:

Always ask for clarification when unsure.

Summarize your plan before implementing.

Notify the user of any technical limitations or constraints.

Never assume — always verify.