import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { X, Zap, Sparkles, Crown } from "lucide-react";

interface AgentProfileModalProps {
  agent: any;
  open: boolean;
  onClose: () => void;
  onInvoke: (id: string) => void;
}

export function AgentProfileModal({ agent, open, onClose, onInvoke }: AgentProfileModalProps) {
  if (!agent) return null;

  const stats = agent.stats ? JSON.parse(agent.stats) : { knowledge: 50, speed: 50, precision: 50 };
  const synergies = agent.synergies ? JSON.parse(agent.synergies) : [];

  const rarityGradient = {
    Mythic: "from-yellow-400 to-orange-600",
    Legendary: "from-purple-500 to-pink-600",
    Epic: "from-cyan-400 to-blue-600",
    Rare: "from-green-400 to-emerald-600",
    Common: "from-gray-400 to-gray-600",
  }[agent.rarity || "Common"];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full h-full md:w-[95vw] md:h-[90vh] md:max-w-4xl bg-black/95 border border-white/10 text-white p-0 flex flex-col">
        {/* Header */}
        <header className="p-4 md:p-6 border-b border-white/10 bg-gradient-to-br from-purple-900/30 to-black flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 md:gap-6">
            <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br ${rarityGradient} p-1 shadow-2xl`}>
              <div className="w-full h-full rounded-full bg-black/80 flex items-center justify-center text-4xl md:text-5xl">
                {agent.icon}
              </div>
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
                {agent.name}
              </h2>
              <p className="text-lg text-white/80">{agent.role}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
                <Badge className="bg-white/10">{agent.version}</Badge>
                <Badge variant="outline" className="border-cyan-400 text-cyan-400">{agent.cluster}</Badge>
                {agent.rarity && <Badge className={`bg-gradient-to-r ${rarityGradient} font-bold`}>{agent.rarity.toUpperCase()}</Badge>}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition">
            <X className="w-6 h-6" />
          </button>
        </header>

        {/* Conteúdo com rolagem */}
        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-10">
          {/* Stats */}
          <section>
            <h3 className="text-xl font-bold mb-6 flex items-center justify-center md:justify-start gap-3">
              <Zap className="w-7 h-7 text-cyan-400" />
              Atributos de Poder
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Conhecimento", value: stats.knowledge, color: "from-cyan-500 to-blue-500" },
                { label: "Velocidade", value: stats.speed, color: "from-yellow-500 to-orange-500" },
                { label: "Precisão", value: stats.precision, color: "from-purple-500 to-pink-500" },
              ].map((s, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className={`font-medium bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}>{s.label}</span>
                    <span>{s.value}/100</span>
                  </div>
                  <Progress value={s.value} className="h-4 bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${s.value}%` }}
                      transition={{ duration: 1.2, delay: i * 0.2 }}
                      className={`h-full bg-gradient-to-r ${s.color} rounded-full`}
                    />
                  </Progress>
                </div>
              ))}
            </div>
          </section>

          {/* Sinergias */}
          {synergies.length > 0 && (
            <section>
              <h3 className="text-xl font-bold mb-6 flex items-center justify-center md:justify-start gap-3">
                <Sparkles className="w-7 h-7 text-purple-400" />
                Sinergias
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {synergies.map((s: string, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="bg-white/5 border border-purple-500/20 rounded-lg p-4 hover:bg-white/10 transition-all"
                  >
                    <p className="text-purple-300 text-sm md:text-base leading-relaxed">+ {s}</p>
                  </motion.div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Botão fixo */}
        <footer className="p-4 md:p-6 border-t border-white/10 bg-black">
          <Button
            onClick={() => onInvoke(agent.id)}
            size="lg"
            className="w-full h-16 text-xl font-bold bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-400 hover:via-purple-400 hover:to-pink-400 shadow-2xl shadow-purple-500/50 transition-all hover:scale-105"
          >
            <Crown className="w-8 h-8 mr-3" />
            INVOCAR AGENTE
            <Sparkles className="w-8 h-8 ml-3" />
          </Button>
        </footer>
      </DialogContent>
    </Dialog>
  );
}