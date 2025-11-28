import { Brain, Scale, Zap, Globe, LucideIcon } from "lucide-react";

export interface AgentConfig {
    id: string;
    name: string;
    role: string;
    uiConfig: {
        color: string;
        icon: LucideIcon;
    };
}

export const AGENTS: Record<string, AgentConfig> = {
    talia: {
        id: "talia",
        name: "Tália X.1",
        role: "Superinteligência Operacional",
        uiConfig: {
            color: "oklch(0.65 0.25 280)", // Primary Purple
            icon: Brain,
        },
    },
    arkhan: {
        id: "arkhan",
        name: "ARKHAN X.0",
        role: "Oráculo Atemporal Supremo",
        uiConfig: {
            color: "oklch(0.70 0.20 50)", // Gold/Amber
            icon: Scale,
        },
    },
    nomadkey: {
        id: "nomadkey",
        name: "NOMADKEY X.0",
        role: "Especialista em Viralização",
        uiConfig: {
            color: "oklch(0.65 0.25 150)", // Green/Teal
            icon: Zap,
        },
    },
    citizen: {
        id: "citizen",
        name: "CITIZEN SUPREMO X.1",
        role: "Arquiteto de Realidades Digitais",
        uiConfig: {
            color: "oklch(0.65 0.25 220)", // Blue
            icon: Globe,
        },
    },
};

export const AGENT_LIST = Object.values(AGENTS);
