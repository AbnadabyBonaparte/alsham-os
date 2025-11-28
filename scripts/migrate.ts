import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { db } from '../server/db';

async function runMigrations() {
    console.log('⏳ Running migrations...');
    try {
        await migrate(db, { migrationsFolder: './drizzle/migrations' });
        console.log('✅ Migrations completed successfully!');
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

runMigrations();
