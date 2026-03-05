const { spawnSync } = require('node:child_process');
const path = require('node:path');
const fs = require('node:fs');

const scriptCommand = process.argv[2];
const commandMap = {
  generate: 'generate',
  migrate: 'migrate',
  push: 'push',
  viewdb: 'studio',
};

const drizzleCommand = commandMap[scriptCommand];

if (!drizzleCommand) {
  console.error(`Unsupported drizzle command: ${scriptCommand ?? '<empty>'}`);
  process.exit(1);
}

const pkgDir = path.resolve(__dirname, '..');
const cjsConfigPath = path.join(pkgDir, 'drizzle.config.cjs');
const tsConfigPath = path.join(pkgDir, 'drizzle.config.ts');
const configPath = fs.existsSync(cjsConfigPath) ? cjsConfigPath : tsConfigPath;
const envPath = path.join(pkgDir, '.env');
const drizzleBin = path.join(pkgDir, 'node_modules', 'drizzle-kit', 'bin.cjs');

if (!fs.existsSync(drizzleBin)) {
  console.error('drizzle-kit is not installed in packages/db. Run pnpm install first.');
  process.exit(1);
}

const result = spawnSync(process.execPath, [drizzleBin, drizzleCommand, `--config=${configPath}`], {
  cwd: pkgDir,
  stdio: 'inherit',
  env: {
    ...process.env,
    DOTENV_CONFIG_PATH: envPath,
  },
});

if (typeof result.status === 'number') {
  process.exit(result.status);
}

console.error(result.error?.message ?? 'Failed to execute drizzle-kit command.');
process.exit(1);
