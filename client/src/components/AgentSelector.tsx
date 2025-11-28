import { AGENT_LIST } from "@/const/agents";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface AgentSelectorProps {
    currentAgentId: string;
    onSelectAgent: (agentId: string) => void;
}

export function AgentSelector({
    currentAgentId,
    onSelectAgent,
}: AgentSelectorProps) {
    return (
        <div className="flex items-center gap-2 bg-secondary/20 p-1.5 rounded-full border border-white/5 backdrop-blur-sm">
            <TooltipProvider delayDuration={0}>
                {AGENT_LIST.map((agent) => {
                    const isActive = currentAgentId === agent.id;
                    const Icon = agent.uiConfig.icon;

                    return (
                        <Tooltip key={agent.id}>
                            <TooltipTrigger asChild>
                                <button
                                    onClick={() => onSelectAgent(agent.id)}
                                    className={cn(
                                        "relative w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                                        isActive ? "scale-110" : "hover:scale-105 hover:bg-white/10"
                                    )}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeAgentGlow"
                                            className="absolute inset-0 rounded-full blur-md opacity-50"
                                            style={{ backgroundColor: agent.uiConfig.color }}
                                        />
                                    )}
                                    <div
                                        className={cn(
                                            "relative z-10 w-full h-full rounded-full flex items-center justify-center border transition-colors",
                                            isActive
                                                ? "border-transparent text-white"
                                                : "border-transparent text-muted-foreground"
                                        )}
                                        style={{
                                            backgroundColor: isActive
                                                ? agent.uiConfig.color
                                                : "transparent",
                                        }}
                                    >
                                        <Icon className="w-4 h-4" />
                                    </div>
                                </button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="text-xs">
                                <p className="font-bold">{agent.name}</p>
                                <p className="text-[10px] text-muted-foreground">{agent.role}</p>
                            </TooltipContent>
                        </Tooltip>
                    );
                })}
            </TooltipProvider>
        </div>
    );
}
