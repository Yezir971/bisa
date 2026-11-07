import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./db-schema";

export function createNeonDrizzleClient() {
  const connectionString =
    process.env.POSTGRES_URL || process.env.DATABASE_URL;
  if (!connectionString) {
    return null;
  }
  const sql = neon(connectionString);
  return drizzle(sql, { schema });
}
