import { drizzle } from "drizzle-orm/node-postgres";

import { configs } from "./helpers";

import * as schema from "./schemas";

console.log("Initializing database connection...", configs.DATABASE_URL);

const db = drizzle(configs.DATABASE_URL, { schema });

export default db;
