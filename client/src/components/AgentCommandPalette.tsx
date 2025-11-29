'use client';

import { useEffect, useState } from "react";
import { AGENT_LIST } from "@/const/agents";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { useSoundEngine } from "@/hooks/useSoundEngine";

interface AgentCommandPaletteProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelect: (agentId: string) => void;
}

export function AgentCommandPalette({
    open,
    onOpenChange,
    onSelect,
}: AgentCommandPaletteProps) {
    const { playClick, playHover } = useSoundEngine();
    const [search, setSearch] = useState("");

    // Reset search when dialog closes
    useEffect(() => {
        if (!open) {
            setSearch("");
        }
    }, [open]);

    return (
        <CommandDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Invocar Agente"
            description="Selecione um agente especializado para conversar"
            className="max-w-2xl"
        >
            <CommandInput
                placeholder="Buscar agentes..."
                value={search}
                onValueChange={setSearch}
            />
            <CommandList>
                <CommandEmpty>Nenhum agente encontrado.</CommandEmpty>
                <CommandGroup heading="Agentes Disponíveis">
                    {AGENT_LIST.map((agent) => {
                        const Icon = agent.uiConfig.icon;
                        return (
                            <CommandItem
                                key={agent.id}
                                value={agent.name}
                                onSelect={() => {
                                    onSelect(agent.id);
                                    playClick();
                                }}
                                onMouseEnter={playHover}
                                className="flex items-center gap-3 px-4 py-3 cursor-pointer"
                            >
                                <div
                                    className="w-10 h-10 rounded-lg flex items-center justify-center shadow-lg"
                                    style={{
                                        backgroundColor: agent.uiConfig.color,
                                    }}
                                >
                                    <Icon className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1">
                                    <div className="font-bold text-sm">{agent.name}</div>
                                    <div className="text-xs text-muted-foreground">
                                        {agent.role}
                                    </div>
                                </div>
                            </CommandItem>
                        );
                    })}
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    );
}
