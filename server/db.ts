import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './drizzle/schema';
import { eq } from 'drizzle-orm'; // Adicionado para fazer buscas
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('FATAL: DATABASE_URL não encontrada no .env');
}

// Em dev, desabilitamos "prepare" para evitar conflitos com pooler do Supabase
const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });

// --- FUNÇÕES QUE FALTAVAM ---

// Buscar usuário pelo ID do provedor de login (ex: Google/GitHub)
export async function getUserByOpenId(openId: string) {
  // Nota: Assumindo que existe uma tabela 'users' no schema. 
  // Se der erro aqui depois, verificaremos o schema.ts
  const result = await db.query.users.findFirst({
    where: eq(schema.users.openId, openId),
  });
  return result;
}

// Criar ou Atualizar usuário (Login)
export async function upsertUser(userData: {
  openId: string;
  email?: string;
  name?: string;
  avatarUrl?: string;
  platform?: string;
}) {
  // Tenta inserir, se der conflito (já existe), atualiza os dados
  const result = await db
    .insert(schema.users)
    .values({
      openId: userData.openId,
      email: userData.email,
      name: userData.name,
      avatarUrl: userData.avatarUrl,
      platform: userData.platform,
      // Define admin se for o primeiro usuário ou baseado em lógica (opcional)
      role: 'user', 
    })
    .onConflictDoUpdate({
      target: schema.users.openId,
      set: {
        email: userData.email,
        name: userData.name,
        avatarUrl: userData.avatarUrl,
        lastLoginAt: new Date(),
      },
    })
    .returning();

  return result[0];
}
