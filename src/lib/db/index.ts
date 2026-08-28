import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

export * from "./schema";
export * from "./repository";

const connectionString = process.env.DATABASE_URL;

// PostgreSQL connection client
export const pgClient = connectionString
  ? postgres(connectionString, {
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
      ssl: connectionString.includes("localhost") ? false : "require",
    })
  : null;

export const db = pgClient ? drizzle(pgClient, { schema }) : null;

export const isDbConnected = Boolean(db);
