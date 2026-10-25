# CraftConnect project instructions

## Product and design

- Work in this existing workspace. Do not create a replacement project or replace the Figma-generated UI.
- Preserve the current visual design while making responsive, accessible changes consistent with existing components and styles.
- CraftConnect is a student-only freelance marketplace for users in India. Do not imply the prototype is a production marketplace.
- Use INR and Indian number formatting for every marketplace amount. Never display `$` or USD as CraftConnect currency. Use safe integer/paise calculations and validate monetary values; do not trust free-form client input as an authoritative amount.
- Do not hardcode production users, profiles, listings, commissions, messages, reviews, balances, verification statuses, or other business records. Clearly isolate any development/test fixtures from production data.

## Security and privacy

- Never request, reveal, or commit passwords, secret API keys, payment credentials, or real student verification documents. Keep secrets in appropriate environment/secret-management systems; never expose server secrets in client code.
- Enforce authentication, authorization, validation, and ownership checks on trusted server-side operations. Use database access policies such as Supabase Row Level Security when applicable; client-side visibility checks are not authorization.
- Protect private messages, student verification evidence, uploads, payment data, and administrative operations. Use least-privilege access and avoid collecting or retaining sensitive data without an agreed need and policy.
- Do not trust client-reported payment success. Keep payment order creation, signature/webhook verification, idempotency, refunds, and supported payout operations server-side. Do not represent a flow as escrow or enable live payments without provider approval and explicit owner approval.
- Surface failures clearly. Do not silently swallow errors or return success-shaped fallbacks.

## Engineering workflow

- Inspect relevant files and existing behavior before editing. Make precise, complete, minimal changes that preserve the current UI and unrelated behavior.
- Work in small, reviewable phases. Do not proceed to the next feature phase until the user confirms.
- Do not overwrite or delete existing work without understanding its purpose. Preserve recoverable Git checkpoints and never discard unrelated user changes.
- Add or update directly relevant documentation and the project checklist when implementation status changes. Never put secrets in documentation.
- Run the smallest relevant existing tests, checks, and build after changes. Add tests for new behavior and security boundaries where appropriate.
- Report exactly what changed and what was tested. Never claim functionality, security, provider eligibility, deployment, or compliance is complete unless verified; clearly label unverified items.
- Do not install dependencies, create external services, incur costs, deploy publicly, or perform real financial transactions without the user's approval.
