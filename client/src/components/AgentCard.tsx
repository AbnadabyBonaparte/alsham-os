import { motion } from "framer-motion";
import { Brain, Scale, DollarSign, Cpu, TrendingUp, Crown, Sparkles, Star, Gem } from "lucide-react";

interface AgentCardProps {
    agent: {
        id: string;
        name: string;
        role: string;
        version: string;
        cluster: string;
        color: string;
        icon: string;
        rarity?: string;
    };
    onClick: () => void;
}

const iconMap: Record<string, any> = {
    Brain,
    Scale,
    DollarSign,
    Cpu,
    TrendingUp,
    Crown,
};

const rarityConfig: Record<string, { border: string; glow: string; badge: string; icon: any }> = {
    Mythic: {
        border: "border-amber-400/60",
        glow: "shadow-[0_0_20px_rgba(251,191,36,0.3)]",
        badge: "bg-gradient-to-r from-amber-500 to-orange-500 text-white",
        icon: Crown,
    },
    Legendary: {
        border: "border-orange-400/60",
        glow: "shadow-[0_0_15px_rgba(251,146,60,0.2)]",
        badge: "bg-gradient-to-r from-orange-500 to-red-500 text-white",
        icon: Gem,
    },
    Epic: {
        border: "border-purple-500/50",
        glow: "shadow-[0_0_15px_rgba(168,85,247,0.2)]",
        badge: "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
        icon: Star,
    },
    Rare: {
        border: "border-blue-400/50",
        glow: "shadow-[0_0_10px_rgba(96,165,250,0.15)]",
        badge: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white",
        icon: Star,
    },
    Common: {
        border: "border-white/10",
        glow: "",
        badge: "bg-white/5 text-white/40",
        icon: Star,
    },
};

import { useSoundEngine } from "../hooks/useSoundEngine";

export function AgentCard({ agent, onClick }: AgentCardProps) {
    const Icon = iconMap[agent.icon] || Brain;
    const isSupreme = agent.version.includes("X.1") || agent.version.includes("ULTIMATE");
    const rarity = agent.rarity || "Common";
    const rarityStyle = rarityConfig[rarity] || rarityConfig.Common;
    const RarityIcon = rarityStyle.icon;
    const { playClick, playHover } = useSoundEngine();

    return (
        <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
                playClick();
                onClick();
            }}
            onMouseEnter={playHover}
            className="relative group cursor-pointer h-full min-h-[280px]"
        >
            {/* Glow Effect */}
            <div
                className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl ${rarity === 'Mythic' ? 'animate-pulse' : ''}`}
                style={{ backgroundColor: rarity === 'Mythic' ? '#facc15' : agent.color }}
            />

            <div className={`relative h-full bg-white/5 backdrop-blur-xl border-2 ${rarityStyle.border} ${rarityStyle.glow} rounded-2xl p-6 flex flex-col items-center text-center overflow-hidden shadow-lg group-hover:border-opacity-100 transition-all`}>

                {/* Rarity Badge */}
                <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-full ${rarityStyle.badge} text-[10px] font-bold flex items-center gap-1`}>
                    <RarityIcon className="w-3 h-3" />
                    {rarity}
                </div>

                {/* Supreme Badge */}
                {isSupreme && (
                    <div className="absolute top-0 right-0 bg-gradient-to-bl from-yellow-500/20 to-transparent p-2 rounded-bl-2xl border-b border-l border-yellow-500/30">
                        <Crown className="w-4 h-4 text-yellow-400 animate-pulse" />
                    </div>
                )}

                {/* Icon Container */}
                <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(0,0,0,0.3)] border border-white/10 relative mt-6"
                    style={{
                        backgroundColor: `${agent.color}20`,
                        borderColor: `${agent.color}40`
                    }}
                >
                    <Icon className="w-8 h-8" style={{ color: agent.color }} />
                    {rarity === 'Mythic' && (
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 rounded-full border border-dashed border-yellow-500/30"
                        />
                    )}
                </div>

                {/* Text Content */}
                <h3 className="text-lg font-bold text-white mb-1 line-clamp-2">{agent.name}</h3>
                <p className="text-xs text-white/60 uppercase tracking-wider mb-2 line-clamp-2">{agent.role}</p>

                <div className="mt-auto flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-[10px] text-white/40">
                        {agent.version}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-[10px] text-white/40">
                        {agent.cluster}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}
