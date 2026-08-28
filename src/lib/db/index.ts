import * as schema from "./schema";

export * from "./schema";
export * from "./repository";

// Lightweight wrapper for Drizzle DB client
export interface DbClient {
  schema: typeof schema;
  isReady: boolean;
}

export const db: DbClient = {
  schema,
  isReady: false,
};
