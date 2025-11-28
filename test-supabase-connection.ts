import postgres from 'postgres';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

console.log('🔍 Testando conexão com Supabase...');
console.log('Connection String presente:', !!connectionString);

if (!connectionString) {
    console.error('❌ DATABASE_URL não encontrada no .env');
    process.exit(1);
}

try {
    const client = postgres(connectionString, {
        prepare: false,
        max: 1,
        connect_timeout: 10,
        ssl: 'require'
    });

    console.log('🔌 Tentando conectar...');
    const result = await client`SELECT version()`;
    console.log('✅ Conexão bem-sucedida!');
    console.log('📊 Versão do PostgreSQL:', result[0].version);

    await client.end();
    process.exit(0);
} catch (error) {
    console.error('❌ Erro na conexão:');
    console.error(error);
    fs.writeFileSync('connection_error.log', JSON.stringify(error, null, 2));
    process.exit(1);
}
