import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/db/schema";

type Database = PostgresJsDatabase<typeof schema>;

let cachedDb: Database | null = null;

export const getDb = () => {
  if (cachedDb) {
    return cachedDb;
  }

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL belum diatur.");
  }

  // Koneksi dibuat lazy agar build Next.js tidak gagal saat env database belum tersedia.
  const client = postgres(databaseUrl, { max: 1 });
  cachedDb = drizzle(client, { schema });

  return cachedDb;
};
