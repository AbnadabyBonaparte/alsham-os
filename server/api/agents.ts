import { Request, Response } from "express";
import { db } from "../db"; // ✅ Conexão nova (Supabase)
import { agents } from "../drizzle/schema"; // ✅ Schema novo
import { desc, eq } from "drizzle-orm";

export async function agentsHandler(req: Request, res: Response) {
    try {
        // Busca agentes ativos ordenados por versão (X.2 -> X.1 -> X.0)
        // Nota: No novo schema o campo chama 'active', não 'isActive'
        const allAgents = await db
            .select()
            .from(agents)
            .where(eq(agents.active, true))
            .orderBy(desc(agents.version));

        res.json(allAgents);
    } catch (error) {
        console.error("❌ Erro ao buscar lista de agentes:", error);
        res.status(500).json({ error: "Erro interno ao conectar com a Central de Inteligência." });
    }
}