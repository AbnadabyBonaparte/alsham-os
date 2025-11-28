import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AgentCard } from "../components/AgentCard";
import { AgentProfileModal } from "../components/AgentProfileModal";
import { useLocation } from "wouter";
import { Search, ArrowLeft } from "lucide-react";

interface Agent {
  id: string; name: string; role: string; version: string; cluster: string;
  color: string; icon: string; rarity?: string; stats?: string; synergies?: string;
}

export default function AgentsGallery() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [, setLocation] = useLocation();
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  useEffect(() => {
    fetch("/api/agents").then(r => r.json()).then(data => { setAgents(data); setLoading(false); });
  }, []);

  const filtered = agents.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.role.toLowerCase().includes(search.toLowerCase()) ||
    a.cluster.toLowerCase().includes(search.toLowerCase())
  );

  const supreme = filtered.filter(a => a.version.includes("X.1") || a.version.toUpperCase().includes("ULTIMATE"));
  const specialists = filtered.filter(a => !a.version.includes("X.1") && !a.version.toUpperCase().includes("ULTIMATE"));

  return (
    <div className="min-h-screen bg-black text-white overflow-y-auto scrollbar-thin scrollbar-thumb-purple-600/30">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/80 border-b border-white/10">
        <div className="px-4 md:px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setLocation("/")} className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-all">
              <ArrowLeft className="w-6 h-6 text-cyan-400" />
            </button>
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">
                ALSHAM NEXUS
              </h1>
              <p className="text-white/60 text-sm tracking-widest uppercase mt-1">
                Catálogo de Inteligência Operacional
              </p>
            </div>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Buscar agente, função ou cluster..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-12 pr-6 text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-500/60 transition-all"
            />
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="px-4 md:px-6 py-12 pb-32 space-y-20">
        {loading ? (
          <div className="text-center py-32 text-2xl text-white/50 animate-pulse">Despertando a Rede Neural...</div>
        ) : (
          <>
            {supreme.length > 0 && (
              <section>
                <h2 className="text-3xl font-black text-yellow-400 uppercase tracking-widest text-center mb-12">
                  CONSELHO SUPREMO
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                  {supreme.map(a => (
                    <motion.div key={a.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                      <AgentCard agent={a} onClick={() => setSelectedAgent(a)} />
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            <section>
              <h2 className="text-2xl font-bold text-white/80 uppercase tracking-widest text-center mb-12">
                ESPECIALISTAS OPERACIONAIS
              </h2>
              <div className="grid grid-cols-1 min-[450px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                {specialists.map(a => (
                  <motion.div key={a.id} whileHover={{ scale: 1.08, y: -8 }} whileTap={{ scale: 0.95 }} className="h-full">
                    <AgentCard agent={a} onClick={() => setSelectedAgent(a)} />
                  </motion.div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      <AgentProfileModal agent={selectedAgent} open={!!selectedAgent} onClose={() => setSelectedAgent(null)} onInvoke={id => { setSelectedAgent(null); setLocation(`/?agent=${id}`); }} />
    </div>
  );
}