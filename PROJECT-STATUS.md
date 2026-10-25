# CraftConnect project status

Last audited: 2026-10-25

## Current baseline

- This is a React 19, TypeScript, and Vite frontend prototype. The existing UI is the visual baseline to preserve.
- The app has in-memory page switching rather than URL routes. Its creator, job, review, notification, and dashboard examples are hardcoded.
- Forms and interactions are demo-only. Some data is stored in browser `localStorage`; it is not account-scoped, shared, or suitable for production.
- There is no configured or connected backend, database, authentication, or application authorization. The first Supabase profile migration and pgTAP tests are now present but have not been applied or run. Student verification, real file upload, payment integration, and an admin area are not implemented.
- The currency audit found 13 literal dollar-prefixed amounts in `src/App.tsx`, more templated dollar displays, and one `Budget (USD)` label. No INR or rupee formatting was found.
- `npm run build` passed during the audit and after the profile-schema task. No frontend test or lint script is defined. pgTAP database tests are authored but have not been executed.
- No live database or deployment is configured. No external provider approvals have been obtained or confirmed.
- Git checkpoint `b154e86` (`chore: capture prototype baseline`) contains the existing prototype and audit status. The worktree was clean when checked; the tracked checkpoint contains no `.env` files, `node_modules`, or `dist` output. No application feature code was changed during the audit or baseline setup.

## Product decisions

- **Student verification direction:** begin with institutional email verification; do not collect or retain student documents. This is a product preference only, not a verified coverage, provider, legal, or compliance determination.
- **Still to confirm before implementation:** whether the chosen auth/email service can verify relevant Indian institutions; handling for students whose institution email is unavailable; account recovery and anti-abuse rules; and any professional/privacy review needed for the flow.
- **Payments and payouts:** Razorpay Route is a documented technical candidate, but CraftConnect eligibility and current FY27 onboarding are unverified. Do not integrate until Razorpay confirms the requirements and grants the required account/product approval.
- **Cancellation/refunds and moderation:** undecided. Keep those business workflows blocked until the relevant product/provider decisions and reviews are complete.

## Checklist

- [x] Inspect the current project structure, frontend, package manifest, and README.
- [x] Identify mock, hardcoded, and browser-local behavior; check currency usage and backend integrations.
- [x] Run the existing production build.
- [x] Record an implementation roadmap and current verification status.
- [x] Create and verify a recoverable Git baseline before changing application code (`b154e86`; clean worktree verified).
- [ ] Confirm remaining product/provider decisions for student-email coverage and exceptions, payment/payout model, cancellation/refunds, and moderation.
- [ ] Apply and verify the initial profile migration and pgTAP tests against a clean local Supabase database before connecting application screens.
- [ ] Implement and verify the phases below in order; update this checklist, changed-file list, migrations, tests, deployment, and approvals as work progresses.

## Recommended architecture

- Keep React, TypeScript, and Vite; preserve the current presentation while replacing demo data and handlers incrementally.
- Use Supabase PostgreSQL, Auth, Storage, Realtime, and Edge Functions where appropriate. Manage schema changes as reviewed migrations and enforce access with Row Level Security; do not rely on client-side checks for permissions.
- Keep payment order creation, signature and webhook verification, refunds, idempotency, and payout operations server-side. Keep payment code provider-agnostic until marketplace eligibility and terms are confirmed. Do not represent a payment hold as escrow without an approved, legally reviewed provider flow.
- Separate development fixtures from production data. Add automated tests for authorization boundaries, money calculations, lifecycle transitions, and payment event handling before enabling public use.

## Phased roadmap and acceptance criteria

### 0. Recoverable baseline and product decisions

- [x] Initialize Git, inspect the ignore rules, and create a baseline commit containing the existing prototype but no secrets, `node_modules`, or build output.
- [x] Record the initial student-verification direction and data-minimization preference: institutional email, no student-document retention.
- [ ] Confirm institutional-email coverage, exception handling, and any required review; decide the marketplace payment/payout model, cancellation/refund rules, and moderation process before implementing those flows.
- **Accept when:** the original prototype can be restored from the baseline; the worktree is clean; decisions with provider, legal, or privacy implications are documented without claiming unverified compliance.

### 1. Application foundation and data model

- [ ] Add a development, test, and production configuration strategy with secrets kept out of source control.
- [x] Draft the initial Supabase profile migration with signup profile creation, private-by-default visibility, ownership RLS, validation constraints, and pgTAP policy tests. Migration execution and test results remain unverified.
- [ ] Apply the profile migration and pass its pgTAP tests against a clean local Supabase database.
- [ ] Add subsequent reviewed migrations and typed data access for creator services, jobs, proposals, commissions/projects, milestones, messages, notifications, reviews, reports, and audit events.
- [ ] Add unit/integration test tooling and a deployment-safe production build.
- **Accept when:** migrations apply to a clean test database; RLS tests pass; production builds contain no demo business records; automated tests pass.

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

- [x] Review Razorpay Route's published marketplace capabilities and stated eligibility gates. Current access and approval for CraftConnect remain unconfirmed.
- [ ] Obtain written confirmation of current FY27 marketplace eligibility, seller onboarding/KYC, settlement and payout behavior, dispute/refund responsibilities, sandbox access, and Route-specific fees before integrating provider APIs.
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

### Razorpay Route assessment (official public documentation reviewed 2026-10-25)

**Assessment: conditional technical fit; eligibility is a stop gate.** Razorpay describes Route as a marketplace/one-to-many product with linked accounts, split transfers, settlements, refunds/reversals, and APIs. This confirms documented product capability, not CraftConnect's approval, legal suitability, or a right to use the product. A standard UPI/card checkout alone is not a marketplace payout solution.

**Published access requirements and uncertainty**

- The Route overview and FAQ currently state domestic turnover above **₹40 lakh** or export turnover above **₹5 lakh** for FY26 or FY25, with domestic evidence described as cumulative GST-3B outward taxable supplies and export evidence as a bank-issued FIRC. The FAQ says first-year or GST-exempt businesses may submit a self-declaration for assessment; this is not stated as a waiver of eligibility.
- Route also requires a payer-payee transparency declaration: the linked third party must directly interact with the customer to supply the goods/services; Razorpay reviews the use case.
- The published overview says the compliance-information deadline was **December 31, 2025** and warns that access may be disabled for existing accounts that missed submission. The pages still refer to FY25/FY26 although this review is dated October 2026 (FY27 has begun). Public docs therefore do not establish the current applicable turnover period, how new applications are handled after the published deadline, or whether CraftConnect's proposed service marketplace satisfies the provider's transparency interpretation.
- A student's founder status alone neither establishes nor disproves eligibility. Razorpay's linked-account docs require linked-account business/contact and bank or VPA details and KYC. The exact primary-business entity/KYC requirements and individual student-creator onboarding treatment need direct provider confirmation.

**Capabilities confirmed in product docs**

- **Creator onboarding:** linked accounts can be added in the dashboard or via API, with account contact, bank account details or VPA, and a KYC form. Bank details are penny-tested. Account creation and access are not proof that a specific marketplace or creator has provider approval.
- **Settlement and splits:** transfers can be configured during order creation (API only), initiated from a captured payment, or made as direct transfers from account balance. Linked-account bank settlements are documented as T+2 working days. Order transfers are documented as INR-only, disallowed for partial-payment orders, and have up to three retries after a failure. Transfer status webhooks/reports support tracking.
- **Payout alternatives within Route:** VPA settlement is documented, but Route must be active and VPA settlement separately enabled by support. It requires beneficiary name matching and an active Indian UPI ID; the documented NPCI ceiling is ₹1 lakh per transaction and per beneficiary per day. Bank settlement is the documented alternative above that amount. VPA payout timing, availability, and operational commitments must be reconfirmed with the provider.
- **Refunds and reversals:** full and partial refunds are documented. Refunds require sufficient available/nodal balance; linked-account refund access is configurable and refund credits require an account-manager request. Route documents reversing transfers when refunding. Refund responsibility, account balance exposure, and exact refund/reversal edge cases need confirmation and testing.
- **Disputes:** Razorpay documents a primary-account dispute workflow with dashboard actions to accept or contest and submit evidence, plus dispute webhooks. A lost dispute debits the business account; evidence deadlines, dispute-fee treatment, and allocation of losses between platform and creator need confirmation. The Route docs do not make dispute handling an automatic marketplace guarantee.

**Published cost information**

- Razorpay's India pricing page, marked last updated May 2026, lists standard domestic payment processing at 2% per successful transaction plus 18% GST on the fee, and lists no setup, AMC, refund-processing, or integration/support fee for that standard product pricing.
- That page does not establish CraftConnect's Route-specific split/transfer/payout pricing or terms. Do not use the standard processing fee as a complete Route quote. Request written pricing for Route, payouts/settlements, refunds, chargebacks/disputes, and any minimums or tax treatment.
- Razorpay's Route pages describe business KYC, turnover checks and provider review; approval/onboarding costs and required entity documents are not fully determined from the reviewed public pages. No paid account or live transaction was created.

**Security architecture if—and only if—approved**

1. The trusted server calculates a validated price and creates the provider order; store rupee amounts as integer paise and currency as `INR`. The browser must not choose the authoritative amount or tell the server a payment succeeded.
2. Keep API credentials and webhook secrets in server-side secrets management. Verify checkout signatures server-side and verify webhook HMAC against the exact raw request bytes before processing.
3. Persist provider order/payment/transfer/refund/dispute identifiers and append-only state changes to a database ledger. Treat provider-confirmed events and reconciliation queries—not browser callbacks—as payment evidence.
4. Make each webhook/event handler idempotent, tolerate retries and out-of-order events, validate amount/currency and ownership, and reconcile unresolved records against provider APIs/reports. Record failures explicitly; never auto-retry a financial side effect without an idempotency strategy.
5. Model settlement delay as a provider transfer state, not CraftConnect escrow. Do not promise funds are protected or held in escrow absent explicit provider and professional confirmation.

**Required provider onboarding steps before implementation:** contact Razorpay through its [official support channel](https://razorpay.com/support/); get written confirmation of FY27 turnover rules, post-deadline/new-applicant eligibility, the accepted legal entity and primary-account KYC, Route approval and payer-payee transparency for student freelance commissions, creator KYC and onboarding requirements, sandbox Route/linked-account availability, bank/VPA settlement limits, refund/dispute responsibilities, and all applicable fees. Only after approval should credentials be provisioned through the provider and placed in server-side secret storage. Do not send credentials or private financial documents in chat.

**Current decision:** no provider approval has been demonstrated, and CraftConnect's turnover/organization eligibility is unknown. Stop before payment implementation. The Route FAQ mentions a two-step flow (collect to the business account, then manually transfer to vendors) when Route turnover requirements are not met; this is not an approved workaround or a determination that such a flow is legally or contractually suitable. Obtain provider and professional confirmation before considering it. Until then, do not accept real payments, simulate successful payments, or promise creator payouts.

## Code-verified feature progress

Classifications describe implementation visible in the current code, not a claim that mock flows are production-ready.

| Feature | Classification | Code evidence / limitation |
|---|---|---|
| Existing UI | Implemented and verified | React pages/components render in the Vite prototype; prior build passed and the dev server returned HTTP 200. UI interactions/data are demo-scoped, not marketplace services. |
| Authentication | Documentation/mock UI only | Login/signup form prevents default submission and navigates to the dashboard; there is no auth SDK or server session. |
| Database | Partially implemented | Supabase config, a profiles migration, and pgTAP tests are authored; no Supabase project/local database is configured, and neither migration nor tests have been run. |
| Profiles | Partially implemented | Settings edit localStorage data; the new database table is not connected to the screen. |
| Creator discovery | Documentation/mock UI only | Search/filter/sort operate on a hardcoded creator array; no database query or production catalog. |
| Jobs/proposals | Partially implemented | Forms and state transitions write browser localStorage; jobs and people shown include hardcoded examples. |
| Commissions | Partially implemented | Requests/project state transitions are browser-local; a fallback demo project is hardcoded. |
| Messaging | Partially implemented | Messages are stored in localStorage and include hardcoded sample conversations; no authenticated private service. |
| Notifications | Documentation/mock UI only | Notification items and unread count are hardcoded or component-local; no persisted notification service. |
| Reviews | Partially implemented | Review form writes localStorage; no completed-project eligibility check or shared database. |
| Student verification | Not implemented | Institutional email is only a recorded product direction; no verification flow, provider, or evidence store. |
| File uploads | Documentation/mock UI only | UI describes photo upload as a placeholder; no upload operation, storage bucket, or access policy. |
| Dashboards | Partially implemented | UI mixes hardcoded sample projects/statistics with local demo commission records. |
| Admin/moderation | Not implemented | Policy copy mentions reporting but there is no report submission, moderation workflow, or admin authorization. |
| Payments | Not implemented | No provider integration, transaction ledger, sandbox flow, or payment credentials. |

## Current task: profile database foundation

- Added `supabase/config.toml` with a local project identifier only; it contains no credentials or linked remote project.
- Added `supabase/migrations/20261025000000_create_profiles.sql`. Profiles reference `auth.users`, are private by default, contain only public-profile fields, and are created by a signup trigger. RLS permits anonymous reads of public profiles, authenticated users to read their own profile, and users to insert/update only their own row. There is no client-accessible delete policy.
- Added `supabase/tests/profiles.test.sql` for table/primary-key/RLS presence, anonymous visibility, owner visibility/update, cross-user write denial, field validation, and system-managed timestamps.
- The frontend remains unchanged and is not connected to Supabase. No environment variables were introduced. Later frontend integration will require `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (public client configuration only); privileged keys must never use a `VITE_` prefix or be exposed in browser code.
- `supabase` CLI, PostgreSQL, and Docker are not installed/available in this workspace, so the migration and pgTAP tests could not be executed here. They must pass against a clean local Supabase instance before this schema is considered verified.

## Work log

| Date | Changed files | Migrations | Verification | Deployment / approvals |
|---|---|---|---|---|
| 2026-10-25 | `PROJECT-STATUS.md` (audit checklist and roadmap only) | None | `npm run build` passed; no automated tests were configured at audit time | No deployment or external approvals |
| 2026-10-25 | `.github/copilot-instructions.md`, `PROJECT-STATUS.md` | None | Baseline `b154e86` verified clean before these documentation changes; `npm run dev -- --host 127.0.0.1` served the app with HTTP 200; `npm run build` passed | No deployment or external approvals |
| 2026-10-25 | `PROJECT-STATUS.md` (student-verification decision only) | None | Documentation update; no application behavior changed | Institutional email selected as a direction; coverage and reviews unverified; no provider approval |
| 2026-10-25 | `PROJECT-STATUS.md` (Razorpay Route provider assessment only) | None | Reviewed official Razorpay Route overview, linked-account, transfer, refund, reversals/settlements, dispute, VPA settlement, FAQ, and India pricing pages; documentation-only, no payment code or tests run | Route supports marketplace flows technically; current FY27 eligibility and CraftConnect/provider approval unresolved; no credentials or transactions |
| 2026-10-25 | `supabase/config.toml`, `supabase/migrations/20261025000000_create_profiles.sql`, `supabase/tests/profiles.test.sql`, `PROJECT-STATUS.md` | Initial profiles migration drafted; not applied | `npm run build` passed; `git diff --check` passed; pgTAP test file contains 12 assertions but was not run because Supabase CLI/PostgreSQL/Docker are unavailable | No remote project, credentials, deployment, or provider approvals |
