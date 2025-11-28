import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './drizzle/schema';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('FATAL: DATABASE_URL não encontrada no .env');
}

// Em dev, desabilitamos "prepare" para evitar conflitos com pooler do Supabase (Transaction Mode)
const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });
