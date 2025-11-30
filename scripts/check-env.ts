import dotenv from 'dotenv';
import path from 'path';

const envPath = path.join(process.cwd(), '.env');
console.log(`Loading .env from: ${envPath}`);
const result = dotenv.config({ path: envPath });

if (result.error) {
    console.error("Error loading .env:", result.error);
} else {
    console.log(".env loaded successfully.");
}

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
    console.error("DATABASE_URL is undefined!");
} else {
    console.log(`DATABASE_URL is defined. Length: ${dbUrl.length}`);
    console.log(`Starts with: ${dbUrl.substring(0, 15)}...`);
    // Check for common issues
    if (dbUrl.includes("placeholder")) {
        console.warn("WARNING: DATABASE_URL seems to be the placeholder!");
    }
    if (dbUrl.includes("YOUR-PASSWORD")) {
        console.warn("WARNING: DATABASE_URL contains 'YOUR-PASSWORD'!");
    }
}
