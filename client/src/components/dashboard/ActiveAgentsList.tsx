import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Brain, Code, Shield, Zap } from "lucide-react";

interface Agent {
    id: string;
    name: string;
    role: string;
    cluster: string;
    status: "online" | "processing" | "idle";
    icon: React.ElementType;
}

const agents: Agent[] = [
    { id: "1", name: "Architect.v9", role: "System Core", cluster: "Desenvolvimento", status: "online", icon: Brain },
    { id: "2", name: "Sales.Bot.01", role: "Lead Gen", cluster: "Vendas", status: "processing", icon: Zap },
    { id: "3", name: "Guardian.X", role: "Security", cluster: "Compliance", status: "online", icon: Shield },
    { id: "4", name: "Coder.Alpha", role: "Frontend", cluster: "Desenvolvimento", status: "idle", icon: Code },
    { id: "5", name: "Analyst.Pro", role: "Data", cluster: "Inteligência", status: "processing", icon: Brain },
];

export function ActiveAgentsList() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-2xl border border-white/10 overflow-hidden"
        >
            <div className="p-4 border-b border-white/5 bg-white/5">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm">Agentes Ativos</h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 animate-pulse">
                        161 Online
                    </span>
                </div>
            </div>

            <ScrollArea className="h-[200px]">
                <div className="p-2 space-y-1">
                    {agents.map((agent, i) => (
                        <motion.div
                            key={agent.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group"
                        >
                            <Avatar className="h-8 w-8 border border-white/10">
                                <AvatarFallback className="bg-background/50 text-xs">
                                    <agent.icon className="w-4 h-4 text-primary" />
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                                        {agent.name}
                                    </p>
                                    <div className="flex items-center gap-1.5">
                                        <div
                                            className={`w-1.5 h-1.5 rounded-full ${agent.status === 'online' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' :
                                                    agent.status === 'processing' ? 'bg-yellow-500 animate-pulse' :
                                                        'bg-slate-500'
                                                }`}
                                        />
                                    </div>
                                </div>
                                <p className="text-[10px] text-muted-foreground truncate">
                                    {agent.role} • {agent.cluster}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </ScrollArea>
        </motion.div>
    );
}
