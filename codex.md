You are working in an existing monorepo. Do NOT invent new domain models, do NOT rename tables casually, and do NOT duplicate auth/business entities.

Goal:
Build and align the schema for auth + business membership safely, without breaking existing architecture.

Hard rules:
1. Do NOT create any new table unless explicitly required below.
2. Do NOT replace or duplicate existing concepts with new names.
3. Do NOT introduce `creators` or any parallel auth identity model.
4. Do NOT change business logic semantics.
5. Do NOT touch unrelated files.
6. Before editing, first inspect the current schema and list what already exists.
7. Reuse existing helpers like `Enums` and `timestampstz`.
8. Keep file names in snake_case.
9. Keep exports through folder `index.ts`.
10. Use Drizzle relations correctly and avoid circular semantic confusion.

Final domain model:
- `users` = the only auth identity table
- `businesses` = businesses
- `members` = join table between users and businesses
- `sessions` = auth sessions
- `accounts` = OAuth provider links

Role rules:
- `users.systemRole` stores only global system roles:
  - `ADMIN`
  - `USER`
- `members.role` stores only business roles:
  - `OWNER`
  - `MANAGER`
  - `EMPLOYEE`

Business rules:
- One user can own multiple businesses.
- `OWNER` can appear in multiple businesses.
- `MANAGER` and `EMPLOYEE` belong to only one business at a time (enforce in service/application logic, not by changing schema shape unexpectedly).
- A user must not be inserted twice into the same business.
- Therefore `members` must have a unique constraint on `(businessId, userId)`.

Required foreign keys:
- `businesses.ownerUserId -> users.id`
- `members.userId -> users.id`
- `members.businessId -> businesses.id`
- `sessions.userId -> users.id`
- `accounts.userId -> users.id`

Required relation semantics:
- `users` has many `ownedBusinesses`
- `users` has many `memberships`
- `users` has many `sessions`
- `users` has many `accounts`
- `businesses` has one `owner`
- `businesses` has many `members`
- `members` belongs to one `user`
- `members` belongs to one `business`
- `sessions` belongs to one `user`
- `accounts` belongs to one `user`

Critical naming rules:
- If a column references `users.id`, its name must be `userId` or `ownerUserId`
- If a column references `members.id`, its name must be `memberId`
- Never create a column named `ownerUserId` that references `members.id`
- Never use misleading names

Implementation rules:
- Use Drizzle `references(() => table.id)` only on the child side.
- Use Drizzle `relations(...)` to describe one/many relations matching the real foreign keys.
- Do not create fake one-to-one relations where a join table is required.
- Do not keep both old and new conflicting models alive.

Process you must follow:
1. Inspect existing schema files.
2. Print a short audit:
   - existing tables
   - conflicting names
   - wrong foreign keys
   - duplicate concepts
3. Propose a minimal refactor plan.
4. Apply the smallest safe changes.
5. Show final schema files only for the affected tables.
6. Explain every changed foreign key in one sentence.
7. Do not modify service logic until schema naming and relations are consistent.

Expected tables:
- users
- businesses
- members
- sessions
- accounts

Expected `members` table shape:
- id
- businessId
- userId
- role
- timestamps
- unique(businessId, userId)

Expected `businesses` table shape:
- id
- ownerUserId
- name
- description
- status
- timestamps

Expected output format:
1. Audit
2. Refactor plan
3. Final schema code
4. Final relations summary
5. Files changed

Important:
You must preserve existing architecture and avoid “creative rewrites”.
Prefer minimal safe edits over large rewrites.
If something is ambiguous, preserve current naming unless it violates the rules above.

Fix Drizzle schema relations only.

Rules:
- `businesses.ownerUserId` must reference `users.id`
- `members.userId` must reference `users.id`
- `members.businessId` must reference `businesses.id`
- `sessions.userId` must reference `users.id`
- `accounts.userId` must reference `users.id`

Use `relations(...)` so that:
- users -> many ownedBusinesses
- users -> many memberships
- users -> many sessions
- users -> many accounts
- businesses -> one owner
- businesses -> many members
- members -> one user
- members -> one business

Do not invent tables.
Do not rename concepts.
Do not touch unrelated code.