import * as React from "react";
import { Command } from "cmdk";
import { Search, Brain, Scale, Zap, Globe, Sparkles } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { AGENTS } from "@/const/agents"; // Fallback static agents

interface Agent {
    id: string;
    name: string;
    role: string;
    version: string;
    cluster: string;
    color: string;
    icon: string;
}

interface AgentCommandPaletteProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelectAgent: (agentId: string) => void;
}

import { useSoundEngine } from "../hooks/useSoundEngine";

export function AgentCommandPalette({
    open,
    onOpenChange,
    onSelectAgent,
}: AgentCommandPaletteProps) {
    const [agents, setAgents] = React.useState<Agent[]>([]);
    const [loading, setLoading] = React.useState(false);
    const { playClick, playHover } = useSoundEngine();

    React.useEffect(() => {
        if (open) {
            setLoading(true);
            fetch("/api/agents")
                .then((res) => {
                    if (res.ok) return res.json();
                    throw new Error("Failed to fetch");
                })
                .then((data) => {
                    if (Array.isArray(data) && data.length > 0) {
                        setAgents(data);
                    } else {
                        // Fallback to static if API returns empty (e.g. DB empty)
                        const staticAgents = Object.values(AGENTS).map(a => ({
                            id: a.id,
                            name: a.name,
                            role: a.role,
                            version: "X.0", // default
                            cluster: "General",
                            color: a.uiConfig.color,
                            icon: "Brain"
                        }));
                        setAgents(staticAgents);
                    }
                })
                .catch(() => {
                    // Fallback on error
                    const staticAgents = Object.values(AGENTS).map(a => ({
                        id: a.id,
                        name: a.name,
                        role: a.role,
                        version: "X.0",
                        cluster: "General",
                        color: a.uiConfig.color,
                        icon: "Brain"
                    }));
                    setAgents(staticAgents);
                })
                .finally(() => setLoading(false));
        }
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="p-0 overflow-hidden shadow-2xl max-w-2xl bg-black/80 backdrop-blur-xl border-white/10">
                <Command className="bg-transparent">
                    <div className="flex items-center border-b border-white/10 px-4">
                        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                        <Command.Input
                            placeholder="Buscar agente por nome, função ou cluster..."
                            className="flex h-14 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                    <Command.List className="max-h-[60vh] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                        {loading && (
                            <div className="py-6 text-center text-sm text-muted-foreground">
                                Carregando inteligência coletiva...
                            </div>
                        )}

                        {!loading && agents.length === 0 && (
                            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
                                Nenhum agente encontrado.
                            </Command.Empty>
                        )}

                        {!loading && (
                            <>
                                <Command.Group heading="Agentes Supremos (X.1)">
                                    {agents.filter(a => a.version === 'X.1').map((agent) => (
                                        <AgentItem key={agent.id} agent={agent} onSelect={() => {
                                            playClick();
                                            onSelectAgent(agent.id);
                                            onOpenChange(false);
                                        }} />
                                    ))}
                                </Command.Group>

                                <Command.Group heading="Especialistas (X.0)">
                                    {agents.filter(a => a.version !== 'X.1').map((agent) => (
                                        <AgentItem key={agent.id} agent={agent} onSelect={() => {
                                            playClick();
                                            onSelectAgent(agent.id);
                                            onOpenChange(false);
                                        }} />
                                    ))}
                                </Command.Group>
                            </>
                        )}
                    </Command.List>
                </Command>
            </DialogContent>
        </Dialog>
    );
}

function AgentItem({ agent, onSelect }: { agent: Agent; onSelect: () => void }) {
    return (
        <Command.Item
            value={`${agent.name} ${agent.role} ${agent.cluster}`}
            onSelect={onSelect}
            className="relative flex cursor-default select-none items-center rounded-lg px-3 py-3 text-sm outline-none data-[selected=true]:bg-white/10 data-[selected=true]:text-white transition-colors group"
        >
            <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 mr-4"
                style={{ borderColor: agent.color }}
            >
                {/* Simple icon mapping or default */}
                <Brain className="h-5 w-5" style={{ color: agent.color }} />
            </div>
            <div className="flex flex-col flex-1">
                <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{agent.name}</span>
                    {agent.version === 'X.1' && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border border-amber-500/30">
                            SUPREMO
                        </span>
                    )}
                    <span className="text-[10px] text-muted-foreground/50 border border-white/10 px-1.5 rounded uppercase tracking-wider">
                        {agent.cluster}
                    </span>
                </div>
                <span className="text-xs text-muted-foreground line-clamp-1">
                    {agent.role}
                </span>
            </div>
            {agent.version === 'X.1' && (
                <Sparkles className="h-4 w-4 text-amber-500/50 opacity-0 group-data-[selected=true]:opacity-100 transition-opacity" />
            )}
        </Command.Item>
    )
}
