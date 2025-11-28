import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const log = (msg) => fs.appendFileSync('debug_fix.log', msg + '\n');

try {
    const envPath = path.join(process.cwd(), '.env');
    if (!fs.existsSync(envPath)) {
        log('FATAL: .env file not found');
        process.exit(1);
    }

    const envContent = fs.readFileSync(envPath, 'utf8');
    log('Read .env file, length: ' + envContent.length);

    const lines = envContent.split('\n');
    let newLines = [];
    let dbUrlFound = false;

    for (let line of lines) {
        if (line.trim().startsWith('DATABASE_URL=')) {
            dbUrlFound = true;
            log('Found DATABASE_URL line: ' + line);

            let urlStr = line.trim().substring('DATABASE_URL='.length);
            // Remove quotes if present
            if (urlStr.startsWith('"') && urlStr.endsWith('"')) {
                urlStr = urlStr.slice(1, -1);
            } else if (urlStr.startsWith("'") && urlStr.endsWith("'")) {
                urlStr = urlStr.slice(1, -1);
            }

            log('Extracted URL string: ' + urlStr);

            try {
                const url = new URL(urlStr);
                log('Parsed URL hostname: ' + url.hostname);

                url.hostname = 'aws-0-sa-east-1.pooler.supabase.com';
                url.port = '6543';

                const newUrl = url.toString();
                log('New URL: ' + newUrl);
                newLines.push(`DATABASE_URL="${newUrl}"`);

            } catch (e) {
                log('URL parsing failed: ' + e.message);
                let newUrlStr = urlStr.replace(/db\.[a-z0-9]+\.supabase\.co/, 'aws-0-sa-east-1.pooler.supabase.com');
                if (newUrlStr.includes(':5432')) {
                    newUrlStr = newUrlStr.replace(':5432', ':6543');
                }
                log('Fallback replacement result: ' + newUrlStr);
                newLines.push(`DATABASE_URL="${newUrlStr}"`);
            }
        } else {
            newLines.push(line);
        }
    }

    if (!dbUrlFound) {
        log('DATABASE_URL not found in .env');
    } else {
        const newContent = newLines.join('\n');
        fs.writeFileSync(envPath, newContent);
        log('Successfully updated .env file');
    }

} catch (err) {
    log('Global Error: ' + err.message + '\n' + err.stack);
}
