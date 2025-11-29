// api/index.js - Adaptador Vercel Serverless

// Importa o build gerado pelo esbuild
// Nota: A Vercel roda isso da raiz, então apontamos para o output
import app from '../dist/index.js';

export default async function handler(req, res) {
  // Aguarda o app estar pronto se for uma promise
  const expressApp = await app;
  
  // Passa a bola para o Express
  expressApp(req, res);
}
