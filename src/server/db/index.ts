import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env["DATABASE_URL"] || "postgresql://postgres:postgres@localhost:5432/lt_supercom";

let client: postgres.Sql | null = null;
let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  if (!dbInstance) {
    // In production / with active postgres, initialize postgres-js
    try {
      client = postgres(connectionString, {
        max: 10,
        idle_timeout: 20,
        connect_timeout: 10,
        onnotice: () => {}, // Suppress notice spam
      });
      dbInstance = drizzle(client, { schema });
    } catch (e) {
      console.warn("[Database] Postgres connection error:", e);
      throw e;
    }
  }
  return dbInstance;
}

export const db = getDb();
export { schema };
export * from "./schema";
