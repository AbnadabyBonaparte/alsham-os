import { pgTable, text, timestamp, boolean, jsonb, serial } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// TABELA DE AGENTES (A Base da Inteligência)
export const agents = pgTable('agents', {
  // Identificação Principal
  id: text('id').primaryKey(), // Ex: 'talia-x-1', 'heimdall-ultimate'
  name: text('name').notNull(),
  role: text('role').notNull(),

  // Metadados de Classificação
  version: text('version').default('X.0'), // X.0, X.1, X.2 (Ultimate)
  rarity: text('rarity').default('Common'),
  cluster: text('cluster').default('Geral'),

  // Cérebro e Personalidade
  systemPrompt: text('system_prompt').notNull(), // A personalidade "System Instruction"
  knowledgeBase: text('knowledge_base'),         // Conteúdo fundido de Manuais/PDFs (RAG Simples)

  // MOTOR DE INTELIGÊNCIA (Arquitetura X.2)
  // Define qual "cérebro" esse agente usa:
  modelProvider: text('model_provider').default('openai'), // 'openai', 'anthropic', 'google', 'image-gen'
  modelName: text('model_name').default('gpt-4o'),         // 'claude-3-5-sonnet', 'gpt-4o', 'dall-e-3'

  // UI e Conteúdo Bruto
  content: text('content'), // Backup do markdown original
  stats: jsonb('stats'),    // JSON flexível para atributos: { knowledge: 100, speed: 99 }
  active: boolean('active').default(true),

  // Datas de Controle
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// TABELA DE MENSAGENS (Histórico Persistente)
export const messages = pgTable('messages', {
  id: serial('id').primaryKey(), // ID Auto-incremental (1, 2, 3...)
  agentId: text('agent_id').references(() => agents.id), // Link com a tabela agents
  role: text('role').notNull(), // 'user', 'assistant', 'system'
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// RELACIONAMENTOS (Para facilitar queries do Drizzle)
export const agentsRelations = relations(agents, ({ many }) => ({
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  agent: one(agents, {
    fields: [messages.agentId],
    references: [agents.id],
  }),
}));
