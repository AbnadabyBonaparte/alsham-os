import fs from "fs";
import path from "path";
import { db } from "../server/db";
import { agents } from "../server/drizzle/schema";

const DIRS_TO_SCAN = ["AGENTES_ATIVOS", "ESTRUTURA_AGENTES_ALSHAM"];

console.log("Iniciando sincronização de agentes...");

async function syncAgents() {
  for (const dirName of DIRS_TO_SCAN) {
    const dirPath = path.join(process.cwd(), dirName);

    if (!fs.existsSync(dirPath)) {
      console.log(`Diretório não encontrado, criando: ${dirName}`);
      fs.mkdirSync(dirPath, { recursive: true });
      continue;
    }

    console.log(`Lendo diretório: ${dirName}`);
    const items = fs.readdirSync(dirPath);

    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // Lógica NOVA (X.2 Capsule)
        await processAgentDirectory(fullPath, item);
      } else if (item.endsWith(".md")) {
        // Lógica ANTIGA (X.0/X.1 Single File)
        await processAgentFile(fullPath, item);
      }
    }
  }

  console.log("TODOS OS AGENTES SINCRONIZADOS COM SUCESSO!");
}

async function processAgentDirectory(dirPath: string, folderName: string) {
  console.log(`Processando Agente (Cápsula): ${folderName}`);

  const profilePath = path.join(dirPath, "profile.md");
  const attributesPath = path.join(dirPath, "attributes.json");
  const skillsPath = path.join(dirPath, "skills.config.json");
  const knowledgePath = path.join(dirPath, "knowledge.md");

  // Validação básica: precisa pelo menos do profile e attributes
  if (!fs.existsSync(profilePath) || !fs.existsSync(attributesPath)) {
    console.log(`Skipping ${folderName}: profile.md or attributes.json missing.`);
    return;
  }

  // 1. Ler Profile (System Prompt)
  const profileContent = fs.readFileSync(profilePath, "utf-8");
  let systemPrompt = profileContent;

  // 2. Ler Attributes (Metadata)
  const attributesRaw = fs.readFileSync(attributesPath, "utf-8");
  let attributes: any = {};
  try {
    attributes = JSON.parse(attributesRaw);
  } catch (e) {
    console.error(`Erro ao ler JSON de ${folderName}`, e);
    return;
  }

  const name = attributes.basic_info?.name || folderName;
  const rarity = attributes.basic_info?.rarity || "Mythic";
  const level = attributes.basic_info?.level || 1;
  const stats = attributes.stats || {};
  const synergies = attributes.synergies || [];

  // 3. Ler Skills (Config)
  let config = null;
  if (fs.existsSync(skillsPath)) {
    try {
      const skillsRaw = fs.readFileSync(skillsPath, "utf-8");
      config = JSON.parse(skillsRaw);
    } catch (e) {
      console.error(`Erro ao ler skills.config.json de ${folderName}`, e);
    }
  }

  // 4. Ler Knowledge (Append to System Prompt)
  let knowledgeBase = "";
  if (fs.existsSync(knowledgePath)) {
    knowledgeBase = fs.readFileSync(knowledgePath, "utf-8");
    systemPrompt += `\n\n${knowledgeBase}`;
  }

  // Gerar ID
  const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  // Upsert no Banco
  await db.insert(agents).values({
    id,
    name,
    role: "Agente X.2", // Default role se não especificado, ou extrair do profile se necessário
    version: "X.2",
    rarity,
    cluster: "Ultimate", // Default cluster
    systemPrompt,
    knowledgeBase, // Opcional salvar separado também
    config,
    stats: { ...stats, synergies, level },
    active: true,
  }).onConflictDoUpdate({
    target: agents.id,
    set: {
      name,
      version: "X.2",
      rarity,
      cluster: "Ultimate",
      systemPrompt,
      knowledgeBase,
      config,
      stats: { ...stats, synergies, level },
      active: true
    }
  });

  console.log(`Agente X.2 Sincronizado: ${name}`);
}

async function processAgentFile(filePath: string, filename: string) {
  // Lógica legada mantida simplificada
  const content = fs.readFileSync(filePath, "utf-8");
  const nameBase = path.basename(filename, ".md");

  const nameMatch = nameBase.match(/^(.*?)(\s+X\.\d+|$|\s+ULTIMATE|\s+SUPREMO|\s+SUPREMA)?$/i);
  const name = nameMatch?.[1]?.trim() || nameBase;
  const version = nameMatch?.[2]?.trim() || "X.0";

  const roleMatch = content.match(/ROLE[:\s]+(.+)/i);
  const role = roleMatch ? roleMatch[1].trim() : "Agente Supremo";

  const rarityMatch = content.match(/RARIDADE[:\s]+(.+)/i);
  const clusterMatch = content.match(/CLUSTER[:\s]+(.+)/i);
  const rarity = rarityMatch
    ? rarityMatch[1].trim()
    : (version.includes("X.1") || /ULTIMATE|SUPREMO|SUPREMA/i.test(version) ? "Mythic" : "Common");
  const cluster = clusterMatch ? clusterMatch[1].trim() : "Geral";

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

  console.log(`Agente Legacy Sincronizado: ${name}`);
}

syncAgents().catch((err) => {
  console.error("\n❌ ERRO FATAL NA SINCRONIZAÇÃO:");
  if (err.message && (err.message.includes("Invalid URL") || err.code === "ECONNREFUSED")) {
    console.error("⚠️  ERRO DE CONEXÃO COM O BANCO DE DADOS:");
    console.error("   Verifique sua DATABASE_URL no arquivo .env.");
    console.error("   DICA: Se sua senha contém caracteres especiais (ex: #, @, $, !), você DEVE codificá-los (URL Encode).");
    console.error("   Exemplo: 'M!nha@Senha' -> 'M%21nha%40Senha'");
  } else {
    console.error(err);
  }
  process.exit(1);
});