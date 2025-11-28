import { getDb } from './db.ts';
import { conversations, messages } from './drizzle/schema.ts';
import { eq, desc } from 'drizzle-orm';
import type { InsertMessage } from './drizzle/schema.ts';

export async function createConversation(userId: number, title?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [conversation] = await db
    .insert(conversations)
    .values({
      userId,
      title: title || "Nova Conversa",
    })
    .returning();

  return conversation.id;
}

export async function getUserConversations(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(conversations)
    .where(eq(conversations.userId, userId))
    .orderBy(desc(conversations.updatedAt));
}

export async function getConversationMessages(conversationId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(messages.createdAt);
}

export async function addMessage(message: InsertMessage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [newMessage] = await db.insert(messages).values(message).returning();
  return newMessage.id;
}
