import fs from "fs";
import path from "path";
import { db } from "../server/db";
import { agents } from "../server/drizzle/schema";

const AGENTES_DIR = path.join(process.cwd(), "AGENTES_ATIVOS");

console.log("Sincronizando agentes da pasta:", AGENTES_DIR);

async function syncAgents() {
  if (!fs.existsSync(AGENTES_DIR)) {
    console.log("Criando pasta AGENTES_ATIVOS...");
    fs.mkdirSync(AGENTES_DIR, { recursive: true });
  }

  const files = getAllMdFiles(AGENTES_DIR);
  console.log(`Encontrados ${files.length} arquivos de agente`);

  for (const file of files) {
    const content = fs.readFileSync(file, "utf-8");
    const filename = path.basename(file, ".md");

    const nameMatch = filename.match(/^(.*?)(\s+X\.\d+|$|\s+ULTIMATE|\s+SUPREMO|\s+SUPREMA)?$/i);
    const name = nameMatch?.[1]?.trim() || filename;
    const version = nameMatch?.[2]?.trim() || "X.0";

    const roleMatch = content.match(/ROLE[:\s]+(.+)/i);
    const role = roleMatch ? roleMatch[1].trim() : "Agente Supremo";

    const rarityMatch = content.match(/RARIDADE[:\s]+(.+)/i);
    const clusterMatch = content.match(/CLUSTER[:\s]+(.+)/i);
    const rarity = rarityMatch 
      ? rarityMatch[1].trim() 
      : (version.includes("X.1") || /ULTIMATE|SUPREMO|SUPREMA/i.test(version) ? "Mythic" : "Common");
    const cluster = clusterMatch ? clusterMatch[1].trim() : "Geral";

    // systemPrompt = tudo depois da última linha de SINERGIA ou o conteúdo inteiro
    const systemPromptLines = content.split("\n").filter(line => 
      !line.match(/^(#|RARIDADE|CLUSTER|ROLE|ICON|Conhecimento|Velocidade|Precisão|SINERGIA)/i)
    );
    const systemPrompt = systemPromptLines.join("\n").trim() || "Você é um agente do ALSHAM OS.";

    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    await db.insert(agents).values({
      id,
      name,
      role,
      version,
      rarity,
      cluster,
      systemPrompt,
      content,
      active: true,
    }).onConflictDoUpdate({
      target: agents.id,
      set: { name, role, version, rarity, cluster, systemPrompt, content, active: true }
    });
  }

  console.log("TODOS OS AGENTES SINCRONIZADOS COM SUCESSO!");
}

function getAllMdFiles(dir: string): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(getAllMdFiles(fullPath));
    } else if (item.endsWith(".md")) {
      results.push(fullPath);
    }
  }
  return results;
}

syncAgents().catch(console.error);