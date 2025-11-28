import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const log = (msg) => fs.appendFileSync('debug_fix_v3.log', msg + '\n');

try {
    const envPath = path.join(process.cwd(), '.env');
    if (!fs.existsSync(envPath)) {
        log('FATAL: .env file not found');
        process.exit(1);
    }

    const envContent = fs.readFileSync(envPath, 'utf8');
    log('Read .env file');

    const lines = envContent.split('\n');
    let newLines = [];
    let dbUrlFound = false;

    for (let line of lines) {
        if (line.trim().startsWith('DATABASE_URL=')) {
            dbUrlFound = true;
            log('Found DATABASE_URL line');

            let urlStr = line.trim().substring('DATABASE_URL='.length);
            if (urlStr.startsWith('"') && urlStr.endsWith('"')) {
                urlStr = urlStr.slice(1, -1);
            } else if (urlStr.startsWith("'") && urlStr.endsWith("'")) {
                urlStr = urlStr.slice(1, -1);
            }

            try {
                const url = new URL(urlStr);

                // 1. Update Host
                url.hostname = 'aws-0-sa-east-1.pooler.supabase.com';

                // 2. Update Port
                url.port = '5432'; // Session mode

                // 3. Update User
                const projectId = 'rmomtdeojaxsnyqwikcr';
                if (url.username === 'postgres') {
                    url.username = `postgres.${projectId}`;
                }

                // 4. Clean Params
                url.searchParams.delete('pgbouncer');
                url.searchParams.delete('sslmode');
                // Postgres.js handles SSL automatically usually, or we can force it in client options.
                // But connection string param `sslmode=require` is standard.
                // Let's keep it clean for now.

                const newUrl = url.toString();
                log('New URL: ' + newUrl);
                newLines.push(`DATABASE_URL="${newUrl}"`);

            } catch (e) {
                log('URL parsing failed: ' + e.message);
                newLines.push(line);
            }
        } else {
            newLines.push(line);
        }
    }

    const newContent = newLines.join('\n');
    fs.writeFileSync(envPath, newContent);
    log('Successfully updated .env file v3');

} catch (err) {
    log('Global Error: ' + err.message);
}
