# Drizzle Relation Fix (profile -> locations)

## Branch
- `codex/fix-db-profile-location-relations`

## Problem
- Drizzle failed with: `Invalid relation "locations" for table "profile"`.

## Changes made
- Updated `src/schemas/profile.ts`:
  - Replaced barrel import (`from "."`) with direct imports from `./creators` and `./locations` to avoid schema import cycle issues.
  - Added explicit relation name on `profileRelations.locations`:
    - `many(locationsTable, { relationName: "profileLocations" })`
- Updated `src/schemas/locations.ts`:
  - Added `locationsRelations` with explicit reverse relation to `profileTable`:
    - `one(profileTable, { fields: [locationsTable.businessId], references: [profileTable.id], relationName: "profileLocations" })`
  - Replaced barrel import (`from "."`) with direct import from `./profile`.

## Verification
- `pnpm --filter @codemit/db typecheck` passed.
- `pnpm --filter @codemit/db generate` ran successfully and recognized all tables/relations.
- Removed unrelated generated migration artifacts to keep this fix scoped to relation config only.
