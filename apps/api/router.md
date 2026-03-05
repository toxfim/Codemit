# Router Changes (`apps/api`)

## What I changed

1. Added `clients` router:
- File: `src/routes/clients/router.clients.ts`
- Endpoints:
  - `GET /clients` (paginated list)
  - `GET /clients/:id` (single client)
- Only GET methods are implemented, as requested.

2. Implemented `creators` router:
- File: `src/routes/creators/router.creators.ts`
- Endpoints:
  - `POST /creators`
  - `PUT /creators/:id`
  - `GET /creators`
  - `GET /creators/:id`
- Uses `createCreatorSchema` and `updateCreatorSchema` validators.

3. Added `profiles` router:
- File: `src/routes/profiles/router.profiles.ts`
- Endpoints:
  - `POST /profiles`
  - `PUT /profiles/:id`
  - `GET /profiles/:id`
- Uses `createProfileSchema` and `updateProfileSchema` validators.

4. Added/updated validation files:
- `src/validation/profiles.ts` (new)
- `src/validation/client.ts` (filled)
- `src/validation/index.ts` (exports all validation modules)

5. Wired routers into app router:
- Updated `src/routes/router.ts`
- Mounted routes:
  - `/clients`
  - `/creators`
  - `/profiles`

## Notes
- Existing `src/routes/create-user.ts` was not removed in this change, but the main router now uses dedicated resource routers.
