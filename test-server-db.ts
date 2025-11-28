import { db } from './server/db';
import { agents } from './drizzle/schema';

async function test() {
    try {
        const result = await db.select().from(agents).limit(1);
        console.log("✅ Server DB Query successful. Agents found:", result.length);
    } catch (e) {
        console.error("❌ Server DB Query failed:", e);
    }
}
test();
