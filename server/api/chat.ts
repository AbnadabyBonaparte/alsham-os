import { streamText, tool } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { Request, Response } from "express";
import { db } from "../db"; // ✅ Conexão nova do Supabase
import { agents } from "../drizzle/schema"; // ✅ Schema correto
import { eq } from "drizzle-orm";

export async function chatHandler(req: Request, res: Response) {
    const { messages, agentId } = req.body;

    // Prompt Padrão (Fallback caso o agente não exista)
    let systemPrompt = "Você é uma inteligência avançada do ALSHAM OS.";
    let temperature = 0.5;
    
    // Configuração do Modelo (Padrão X.2)
    let modelName = "gpt-4o";

    // 1. Busca a Inteligência Real no Banco (Supabase)
    if (agentId && typeof agentId === "string") {
        try {
            // Busca o agente pelo ID
            const result = await db.select().from(agents).where(eq(agents.id, agentId)).limit(1);
            const agent = result[0];

            if (agent) {
                console.log(`🧠 Agente ativado: ${agent.name} (${agent.version})`);
                
                // Define a Personalidade Base
                systemPrompt = agent.systemPrompt;

                // INJEÇÃO DE CONHECIMENTO (RAG / Manuais)
                // Se o agente tiver manuais técnicos, injeta no contexto
                if (agent.knowledgeBase) {
                    systemPrompt += `\n\n### BASE DE CONHECIMENTO TÉCNICO (MEMÓRIA):\n${agent.knowledgeBase}\n\nUse as informações acima como verdade absoluta para responder.`;
                }

                // Ajustes de IA
                temperature = 0.7; // Criatividade balanceada
                modelName = agent.modelName || "gpt-4o"; // Usa o modelo definido no banco
            }
        } catch (e) {
            console.error("❌ Erro ao buscar cérebro do agente no Supabase:", e);
            // Em caso de erro, mantém o prompt padrão para não travar o chat
        }
    }

    try {
        // 2. Invoca a IA com Streaming
        const result = await streamText({
            model: openai(modelName),
            system: systemPrompt,
            temperature,
            messages,
            // Ferramentas (Tools) - Mantidas para funcionalidades visuais do Dashboard
            tools: {
                getFinancialStats: tool({
                    description: "Obtém estatísticas financeiras e receita",
                    parameters: z.object({}),
                    execute: async () => ({
                        title: "Receita Mensal",
                        value: 45250,
                        prefix: "R$ ",
                        trend: "up",
                        trendValue: "+12.5%",
                        data: [10, 25, 15, 35, 20, 45, 60].map(v => ({ value: v })),
                    }),
                }),
                getSalesStats: tool({
                    description: "Obtém estatísticas de vendas",
                    parameters: z.object({}),
                    execute: async () => ({
                        title: "Vendas Totais",
                        value: 1240,
                        suffix: " un",
                        trend: "up",
                        trendValue: "+8.2%",
                        color: "#22c55e",
                        data: [40, 30, 45, 50, 65, 60, 80].map(v => ({ value: v })),
                    }),
                }),
                getAgentStatus: tool({
                    description: "Lista de agentes ativos no sistema visual",
                    parameters: z.object({}),
                    execute: async () => ({
                        agents: [
                            { id: "1", name: "Architect.v9", role: "System Core", cluster: "Dev", status: "online" },
                            { id: "2", name: "Sales.Bot.01", role: "Lead Gen", cluster: "Vendas", status: "processing" },
                            { id: "3", name: "Guardian.X", role: "Security", cluster: "Compliance", status: "online" },
                        ],
                    }),
                }),
                getSystemActivity: tool({
                    description: "Status e atividade do sistema",
                    parameters: z.object({}),
                    execute: async () => ({
                        status: "operational",
                        uptime: "99.9%",
                    }),
                }),
            },
        });

        // 3. Devolve a resposta via Stream para o Frontend
        return result.pipeDataStreamToResponse(res);

    } catch (error) {
        console.error("❌ Erro fatal no chatHandler:", error);
        res.status(500).json({ error: "Erro interno na conexão neural." });
    }
}