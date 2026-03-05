# Changes in `packages/db`

## What I changed

1. Updated `package.json` scripts:
- `generate`: from `drizzle-kit generate` to `node ./scripts/drizzle.cjs generate`
- `migrate`: from `drizzle-kit migrate` to `node ./scripts/drizzle.cjs migrate`
- `push`: from `drizzle-kit push` to `node ./scripts/drizzle.cjs push`

2. Added `scripts/drizzle.cjs`:
- Runs drizzle-kit through Node with a fixed package-local config path.
- Always passes `--config=<absolute path>` and does not depend on drizzle-kit defaults.
- Prefers `drizzle.config.cjs`, falls back to `drizzle.config.ts` if needed.
- Forces execution from `packages/db` (`cwd` set to package root).
- Sets `DOTENV_CONFIG_PATH` to `packages/db/.env` so env resolution is stable.
- Validates allowed commands (`generate`, `migrate`, `push`) and fails clearly on invalid input.

3. Added `drizzle.config.cjs`:
- CommonJS drizzle config equivalent to the existing TS config.
- Gives the wrapper a non-TS config target, which is more robust for CLI execution across environments.

## Why this was needed

The old scripts depended on CLI defaults (current working directory and implicit config/env resolution). In a workspace setup this can break depending on where the command is launched from.

The new wrapper makes `generate` and `migrate` deterministic by pinning:
- the exact drizzle config file,
- the execution directory,
- and the `.env` file used for `DATABASE_URL`.

This removes ambiguity and makes the commands reliable when run directly in `packages/db` or via workspace tooling.
