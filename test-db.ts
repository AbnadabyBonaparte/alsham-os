import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from "./drizzle/schema";
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';

try {
    const sqlite = new Database('sqlite.db');
    const db = drizzle(sqlite, { schema });
    console.log("✅ DB Connected successfully with schema");

    console.log("⏳ Running migrations...");
    await migrate(db, { migrationsFolder: './drizzle/migrations' });
    console.log("✅ Migrations completed successfully!");
} catch (e) {
    console.error("❌ Failed:", e);
}
