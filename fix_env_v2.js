import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const log = (msg) => fs.appendFileSync('debug_fix_v2.log', msg + '\n');

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
                url.port = '5432';

                // 3. Update User
                // Project ID: rmomtdeojaxsnyqwikcr
                const projectId = 'rmomtdeojaxsnyqwikcr';
                if (url.username === 'postgres') {
                    url.username = `postgres.${projectId}`;
                    log('Updated username to: ' + url.username);
                } else if (!url.username.includes(projectId)) {
                    log('Warning: Username is ' + url.username + ', not updating.');
                }

                // 4. Update Protocol
                url.protocol = 'postgres:';

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
    log('Successfully updated .env file v2');

} catch (err) {
    log('Global Error: ' + err.message);
}
