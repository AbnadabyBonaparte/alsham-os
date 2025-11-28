import fs from 'fs';
import path from 'path';
import { db } from '../server/db';
import { agents } from '../server/drizzle/schema';
import { eq } from 'drizzle-orm';
import dotenv from 'dotenv';

dotenv.config();

// Mapeie aqui as pastas raízes onde seus agentes estão
const ROOT_DIRS = [
    'AGENTES_ATIVOS',
    'ESTRUTURA_AGENTES_ALSHAM',
    'AGENTES_X.0',
    'AGENTES_X.1'
];

// Helper para ler diretórios recursivamente
function getAgentFolders(dir: string): string[] {
    let results: string[] = [];
    if (!fs.existsSync(dir)) return results;

    const list = fs.readdirSync(dir);

    // Verifica se a pasta atual já parece ser um agente (tem arquivos .md)
    const mdFiles = list.filter(f => f.endsWith('.md'));
    const hasSystemPrompt = mdFiles.some(f => /adapta|prompt|system|manual|guia/i.test(f));

    if (hasSystemPrompt) {
        results.push(dir); // É uma pasta de agente!
    }

    // Continua descendo para subpastas
    for (const file of list) {
        const filePath = path.join(dir, file);
        // Proteção contra erro de permissão ou atalhos quebrados
        try {
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                results = results.concat(getAgentFolders(filePath));
            }
        } catch (e) {
            // Ignora pastas que não consegue ler
        }
    }
    return results;
}

// Helper para extrair metadados do texto (Regex)
function extractMetadata(content: string, key: string): string | null {
    const regex = new RegExp(`${key}[:\\s]+(.*?)(?:\\n|$)`, 'i');
    const match = content.match(regex);
    return match ? match[1].trim() : null;
}

async function sync() {
    console.log('🚀 INICIANDO SINCRONIZAÇÃO ULTIMATE (ALSHAM X.2)...');

    let totalAgentes = 0;

    for (const rootName of ROOT_DIRS) {
        const rootPath = path.join(process.cwd(), rootName);
        if (!fs.existsSync(rootPath)) {
            console.log(`⚠️  Pasta raiz não encontrada (pular): ${rootName}`);
            continue;
        }

        const agentFolders = getAgentFolders(rootPath);
        console.log(`📂 Encontrados ${agentFolders.length} possíveis agentes em ${rootName}`);

        for (const folderPath of agentFolders) {
            try {
                const folderName = path.basename(folderPath);

                // 1. Inteligência de Nome e Cargo (Baseado no padrão "NOME - CARGO")
                let name = folderName;
                let role = 'Especialista ALSHAM';

                if (folderName.includes(' - ')) {
                    const parts = folderName.split(' - ');
                    name = parts[0].trim();
                    role = parts.slice(1).join(' - ').trim(); // Pega o resto como cargo
                } else {
                    name = folderName.replace(/_/g, ' ').replace(/-/g, ' ');
                }

                // Inferir versão
                let version = 'X.0';
                if (name.includes('X.1')) version = 'X.1';
                if (name.includes('ULTIMATE') || name.includes('X.2') || name.includes('SUPREMO')) version = 'X.2';

                // 2. Leitura dos Arquivos
                const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.md'));

                let systemPrompt = '';
                let knowledgeBase = '';
                let rarity = 'Common';
                let cluster = 'Geral';

                for (const file of files) {
                    const content = fs.readFileSync(path.join(folderPath, file), 'utf-8');
                    const lowerName = file.toLowerCase();

                    // Tenta extrair metadados do conteúdo
                    const extractedRarity = extractMetadata(content, 'RARIDADE');
                    if (extractedRarity) rarity = extractedRarity;

                    const extractedCluster = extractMetadata(content, 'CLUSTER');
                    if (extractedCluster) cluster = extractedCluster;
                    
                    const extractedRole = extractMetadata(content, 'ROLE');
                    if (extractedRole && role === 'Especialista ALSHAM') role = extractedRole;

                    // Lógica de Fusão: O que é Personalidade vs O que é Conhecimento
                    if (lowerName.includes('adapta') || lowerName.includes('gpt') || lowerName.includes('persona') || lowerName.includes('prompt')) {
                        systemPrompt += `\n\n--- FONTE: ${file} ---\n${content}`;
                    } else {
                        // Manuais, Pesquisas, Teorias vão para o KnowledgeBase
                        knowledgeBase += `\n\n--- CONHECIMENTO TÉCNICO: ${file} ---\n${content}`;
                    }
                }

                // Fallback: Se não achou arquivo de adaptação, usa o Knowledge como prompt base
                if (!systemPrompt && knowledgeBase) {
                    systemPrompt = "Você é um especialista do ecossistema ALSHAM OS. Use sua base de conhecimento para responder.";
                }

                if (!systemPrompt && !knowledgeBase) {
                    console.log(`⚠️  Pasta vazia ou sem MDs úteis: ${folderName}`);
                    continue; 
                }

                const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

                // 3. Inserção no Supabase
                console.log(`⚡ Sincronizando: [${version}] ${name} (${role})`);

                await db.insert(agents).values({
                    id,
                    name,
                    role: role.slice(0, 100), // Limite de caracteres por segurança
                    version,
                    rarity,
                    cluster,
                    systemPrompt: systemPrompt.slice(0, 100000),
                    knowledgeBase: knowledgeBase.slice(0, 100000),
                    modelProvider: 'openai',
                    modelName: 'gpt-4o',
                    active: true,
                    stats: { syncDate: new Date().toISOString() } // Metadados extras
                }).onConflictDoUpdate({
                    target: agents.id,
                    set: {
                        name,
                        role,
                        version,
                        rarity,
                        cluster,
                        systemPrompt,
                        knowledgeBase,
                        updatedAt: new Date()
                    }
                });

                totalAgentes++;

            } catch (err) {
                console.error(`❌ Erro ao processar pasta ${folderPath}:`, err);
            }
        }
    }

    console.log(`\n🎉 SUCESSO TOTAL: ${totalAgentes} Agentes sincronizados na nuvem!`);
    process.exit(0);
}

sync().catch((err) => {
    console.error("Erro fatal no script:", err);
    process.exit(1);
});