import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("[db] Missing required environment variable: DATABASE_URL");
}

// In dev, reuse the same Pool across hot reloads
declare global {
  // eslint-disable-next-line no-var
  var _pgPool: Pool | undefined;
}

export const pool: Pool =
  global._pgPool ??
  new Pool({
    connectionString,
    // You can add ssl config later if your provider requires it
    // ssl: { rejectUnauthorized: false },
  });

if (process.env.NODE_ENV !== "production") {
  global._pgPool = pool;
}
