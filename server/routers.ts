import { z } from 'zod';
import { router, protectedProcedure, publicProcedure } from './_core/trpc';
import { TRPCError } from '@trpc/server';
import { db } from './db';
import { agents, messages } from './drizzle/schema';
import { eq, desc } from 'drizzle-orm';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { COOKIE_NAME } from '@shared/const';
import { getSessionCookieOptions } from './_core/cookies';
import { systemRouter } from './_core/systemRouter';

// Função auxiliar para escolher o modelo (preparado para Multi-Modelo)
function getModel(provider: string | null, modelName: string | null) {
  const modelId = modelName || 'gpt-4o';

  // Por enquanto, forçamos OpenAI, mas a estrutura já aceita expansão
  switch (provider) {
    case 'openai':
    default:
      return openai(modelId);
  }
}

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  agents: router({
    list: publicProcedure.query(async () => {
      return await db.select().from(agents).where(eq(agents.active, true));
    }),

    getById: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        const results = await db.select().from(agents).where(eq(agents.id, input.id));
        return results[0] || null;
      }),
  }),

  chat: router({
    sendMessage: protectedProcedure
      .input(
        z.object({
          conversationId: z.number().optional(),
          message: z.string().min(1),
          agentId: z.string().min(1),
        })
      )
      .mutation(async ({ ctx, input }) => {
        console.log(`💬 Chat iniciado com Agente: ${input.agentId}`);

        // 1. Buscar a "Mente" do Agente no Banco
        const agentResults = await db.select().from(agents).where(eq(agents.id, input.agentId));
        const agent = agentResults[0];

        if (!agent) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Agente não encontrado no sistema ALSHAM.',
          });
        }

        // 2. Construir o Contexto Supremo (Prompt + Conhecimento RAG)
        let finalSystemMessage = agent.systemPrompt;

        if (agent.knowledgeBase) {
          finalSystemMessage += `\n\n### BASE DE CONHECIMENTO / MEMÓRIA TÉCNICA:\n${agent.knowledgeBase}\n\nUse as informações acima como verdade absoluta para responder.`;
        }

        // 3. Salvar Mensagem do Usuário
        await db.insert(messages).values({
          agentId: agent.id,
          role: 'user',
          content: input.message,
        });

        // 4. Buscar Histórico Recente (Context Window)
        const history = await db
          .select()
          .from(messages)
          .where(eq(messages.agentId, agent.id))
          .orderBy(desc(messages.createdAt))
          .limit(20);

        // Inverter para ordem cronológica (mais antigo primeiro)
        history.reverse();

        // 5. Invocar a Inteligência (Geração de Texto)
        try {
          const model = getModel(agent.modelProvider, agent.modelName);

          console.log(`🧠 Usando modelo: ${agent.modelProvider}/${agent.modelName}`);

          const { text } = await generateText({
            model: model,
            system: finalSystemMessage,
            messages: history.map(msg => ({
              role: msg.role as 'user' | 'assistant',
              content: msg.content,
            })),
          });

          // 6. Salvar Resposta do Agente
          await db.insert(messages).values({
            agentId: agent.id,
            role: 'assistant',
            content: text,
          });

          return {
            message: text,
            agentName: agent.name,
            conversationId: input.conversationId || 0,
          };

        } catch (error) {
          console.error("❌ Erro na AI:", error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Falha na conexão neural. Verifique as credenciais da OpenAI.'
          });
        }
      }),

    getHistory: protectedProcedure
      .input(z.object({ agentId: z.string() }))
      .query(async ({ input }) => {
        return await db
          .select()
          .from(messages)
          .where(eq(messages.agentId, input.agentId))
          .orderBy(desc(messages.createdAt))
          .limit(50);
      }),
  }),
});

export type AppRouter = typeof appRouter;
