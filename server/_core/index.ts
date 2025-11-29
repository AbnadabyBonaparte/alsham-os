import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth.ts";
import { appRouter } from "../routers.ts";
import { createContext } from "./context.ts";
import { serveStatic, setupVite } from "./vite.ts";
import { chatHandler } from "../api/chat.ts";
import { agentsHandler } from "../api/agents.ts";

// Inicializa o App Express
const app = express();
const server = createServer(app);

// 1. Configurações Globais (Body Parser)
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// 2. Registro de Rotas (API)
registerOAuthRoutes(app);

// tRPC
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// Rotas Customizadas (Chat & Agentes)
app.post("/api/chat", chatHandler);
app.get("/api/agents", agentsHandler);

// 3. Configuração de Ambiente (Frontend)
const isProduction = process.env.NODE_ENV === "production";

const initializeServer = async () => {
  // Em desenvolvimento local, ativamos o Vite Middleware
  if (!isProduction) {
    await setupVite(app, server);
  } else {
    // Em produção, servimos os arquivos estáticos da pasta dist
    serveStatic(app);
  }

  // 4. Lógica de Inicialização (O Pulo do Gato para Vercel)
  // Só rodamos o app.listen se estivermos LOCALMENTE.
  // Na Vercel, a variável 'VERCEL' existe, então pulamos isso para não dar erro de porta.
  if (!process.env.VERCEL) {
    const port = parseInt(process.env.PORT || "3000");
    server.listen(port, "0.0.0.0", () => {
      console.log(`🚀 Server running on http://localhost:${port}/`);
    });
  }
};

// Executa a inicialização (Configura Vite/Static)
initializeServer().catch((err) => {
  console.error("Failed to start server:", err);
});

// 5. Exportação Obrigatória para Vercel Serverless
export default app;
