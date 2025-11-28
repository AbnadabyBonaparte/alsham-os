import type { Config } from 'drizzle-kit';
import dotenv from 'dotenv';

dotenv.config();

export default {
  schema: './server/drizzle/schema.ts',
  out: './server/drizzle/migrations',
  dialect: 'postgresql', // MUDANÇA CRÍTICA: De 'sqlite' para 'postgresql'
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
