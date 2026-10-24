# CraftConnect project status

Last audited: 2026-10-25

## Current baseline

- This is a React 19, TypeScript, and Vite frontend prototype. The existing UI is the visual baseline to preserve.
- The app has in-memory page switching rather than URL routes. Its creator, job, review, notification, and dashboard examples are hardcoded.
- Forms and interactions are demo-only. Some data is stored in browser `localStorage`; it is not account-scoped, shared, or suitable for production.
- There is no backend, database, authentication, authorization, student verification, real file upload, payment integration, admin area, or automated test suite.
- The currency audit found 13 literal dollar-prefixed amounts in `src/App.tsx`, more templated dollar displays, and one `Budget (USD)` label. No INR or rupee formatting was found.
- `npm run build` passed during the audit. No test or lint script is defined.
- No database migrations exist. No deployment is configured. No external provider approvals have been obtained or confirmed.
- No Git repository is initialized in this workspace. No application code was changed during the audit.

## Checklist

- [x] Inspect the current project structure, frontend, package manifest, and README.
- [x] Identify mock, hardcoded, and browser-local behavior; check currency usage and backend integrations.
- [x] Run the existing production build.
- [x] Record an implementation roadmap and current verification status.
- [ ] Create and verify a recoverable Git baseline before changing application code.
- [ ] Confirm product and provider decisions that affect payment flows, student verification, and retention of verification evidence.
- [ ] Implement and verify the phases below in order; update this checklist, changed-file list, migrations, tests, deployment, and approvals as work progresses.

## Recommended architecture

- Keep React, TypeScript, and Vite; preserve the current presentation while replacing demo data and handlers incrementally.
- Use Supabase PostgreSQL, Auth, Storage, Realtime, and Edge Functions where appropriate. Manage schema changes as reviewed migrations and enforce access with Row Level Security; do not rely on client-side checks for permissions.
- Keep payment order creation, signature and webhook verification, refunds, idempotency, and payout operations server-side. Keep payment code provider-agnostic until marketplace eligibility and terms are confirmed. Do not represent a payment hold as escrow without an approved, legally reviewed provider flow.
- Separate development fixtures from production data. Add automated tests for authorization boundaries, money calculations, lifecycle transitions, and payment event handling before enabling public use.

## Phased roadmap and acceptance criteria

### 0. Recoverable baseline and product decisions

- [ ] Initialize Git, inspect the ignore rules, and create a baseline commit containing the existing prototype but no secrets, `node_modules`, or build output.
- [ ] Confirm the verification method and minimal data-retention policy, marketplace payment/payout model, cancellation/refund rules, and moderation process before implementing them.
- **Accept when:** the original prototype can be restored from the baseline; the worktree is clean; decisions with provider, legal, or privacy implications are documented without claiming unverified compliance.

### 1. Application foundation and data model

- [ ] Add a development, test, and production configuration strategy with secrets kept out of source control.
- [ ] Add database migrations and typed data access for profiles, creator services, jobs, proposals, commissions/projects, milestones, messages, notifications, reviews, reports, payment records, and audit events.
- [ ] Add unit/integration test tooling and a deployment-safe production build.
- **Accept when:** migrations apply to a clean test database; production builds contain no demo business records; automated tests pass.

### 2. Authentication, profiles, and student verification

- [ ] Implement registration, email verification, login, password reset, sign-out, account deletion, and profile settings through the selected auth provider.
- [ ] Design a least-data student verification process and protected storage/review workflow before collecting any verification evidence.
- [ ] Enforce profile and verification permissions in database policies and server-side operations.
- **Accept when:** auth flows work across sessions; users cannot read or change another user's private profile or verification records; verification evidence is not publicly accessible.

### 3. Discovery, portfolios, jobs, and proposals

- [ ] Replace sample creator/job arrays with authenticated database-backed discovery, search, filters, saved creators/jobs, packages, portfolios, job posting, and proposals.
- [ ] Add safe, authorized file upload rules for portfolio material.
- [ ] Apply INR formatting and validated integer/paise money handling consistently; never parse free-form currency strings as authoritative amounts.
- **Accept when:** records persist across devices, production contains no hardcoded marketplace accounts or listings, and access-control and money-format tests pass.

### 4. Commission lifecycle, messaging, reviews, and notifications

- [ ] Implement permission-checked project creation, milestones, progress, revisions, delivery, acceptance, cancellation, and applicable refund state transitions.
- [ ] Add persistent private messaging and notifications with server-side access checks.
- [ ] Allow reviews only for eligible completed projects; add reporting and moderation workflows.
- **Accept when:** invalid or unauthorized transitions are rejected server-side; private content is inaccessible to non-participants; reviews cannot be created without an eligible project.

### 5. Payments and creator payouts (approval-gated)

- [ ] Obtain written confirmation of marketplace eligibility, seller onboarding, settlement/payout, refund, and fee terms from the selected provider before integrating provider APIs.
- [ ] Implement sandbox-only server-side order creation, signature verification, webhook verification, idempotency, transaction records, failure handling, refunds, and supported payout workflows.
- [ ] Add reconciliation and tests for duplicate, delayed, invalid, and out-of-order provider events.
- **Accept when:** sandbox tests demonstrate the complete supported flow; secrets remain server-side; duplicate events cannot duplicate financial effects; live transactions remain disabled until explicit owner approval and provider approval.

### 6. Security, administration, and operational readiness

- [ ] Add a properly separated administrative area, audited staff actions, input validation, rate limits where appropriate, and security tests for unauthorized access.
- [ ] Review upload access, account deletion, logs, backups, monitoring, accessibility, responsive behavior, and India timezone/date handling.
- [ ] Resolve professional/provider questions on legal, tax, privacy, and marketplace obligations rather than encoding assumptions.
- **Accept when:** security tests cover user isolation and administrative boundaries; operational and incident procedures are documented; accessibility and mobile checks pass.

### 7. Staged deployment

- [ ] Deploy first to a private/staging environment with separate test data and sandbox payment credentials.
- [ ] Verify migrations, auth redirects, storage policies, webhooks, monitoring, backups, and rollback procedures in staging.
- [ ] Obtain explicit approval before public launch or enabling live transactions.
- **Accept when:** the staging checklist passes, recovery has been tested, approvals are recorded, and public/live status is explicitly confirmed.

## External provider notes checked for this audit

- Supabase's official pricing page lists a Free plan at USD 0/month and says inactive Free projects are paused after one week. Its Pro plan starts at USD 25/month; actual cost may change with compute and usage. These are vendor-published prices, not a total operating-cost estimate: [Supabase pricing](https://supabase.com/pricing).
- Razorpay's official Route documentation describes linked accounts and split transfers for marketplace-style one-to-many flows. It currently states turnover thresholds (more than INR 40 lakh domestic or more than INR 5 lakh export turnover for FY25/FY26) and a payer-payee transparency review. This may make Route unavailable to a new marketplace until Razorpay confirms eligibility: [Razorpay Route eligibility and overview](https://razorpay.com/docs/payments/route/).
- Razorpay's published India pricing lists a standard 2% platform fee per successful domestic transaction plus 18% GST on that fee, with no setup or annual maintenance charge shown. This is not a Route quote or approval, and provider terms can change: [Razorpay pricing](https://razorpay.com/pricing/).
- Before selecting a payment/payout provider, obtain current written confirmation of eligibility, fees, seller onboarding, settlements, refunds, and supported test/live workflows. No provider approval or legal/tax conclusion is implied by this audit.

## Work log

| Date | Changed files | Migrations | Verification | Deployment / approvals |
|---|---|---|---|---|
| 2026-10-25 | `PROJECT-STATUS.md` (audit checklist and roadmap only) | None | `npm run build` passed; no automated tests are configured | No deployment or external approvals |
