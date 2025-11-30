import { pgTable, text, timestamp, serial, jsonb, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// --- TABELA DE USUÁRIOS (A que faltava) ---
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: text("open_id").unique().notNull(), // ID do Google/GitHub
  email: text("email"),
  name: text("name"),
  avatarUrl: text("avatar_url"),
  platform: text("platform"),
  role: text("role").default("user"),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// --- TABELA DE AGENTES ---
export const agents = pgTable("agents", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  version: text("version").default("X.0"),
  rarity: text("rarity").default("Common"),
  cluster: text("cluster").default("Geral"),
  systemPrompt: text("system_prompt").notNull(),
  knowledgeBase: text("knowledge_base"),
  modelProvider: text("model_provider").default("openai"),
  modelName: text("model_name").default("gpt-4o"),
  content: text("content"),
  stats: jsonb("stats"),
  config: jsonb("config"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// --- TABELA DE MENSAGENS ---
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  agentId: text("agent_id").references(() => agents.id),
  role: text("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// --- RELACIONAMENTOS ---
export const agentsRelations = relations(agents, ({ many }) => ({
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  agent: one(agents, {
    fields: [messages.agentId],
    references: [agents.id],
  }),
}));
