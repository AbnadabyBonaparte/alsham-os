import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";

interface StatsCardProps {
    title: string;
    value: number;
    prefix?: string;
    suffix?: string;
    trend?: "up" | "down" | "neutral";
    trendValue?: string;
    data?: { value: number }[];
    color?: string;
}

export function StatsCard({
    title,
    value,
    prefix = "",
    suffix = "",
    trend = "up",
    trendValue = "+12.5%",
    data = [
        { value: 10 },
        { value: 25 },
        { value: 15 },
        { value: 35 },
        { value: 20 },
        { value: 45 },
        { value: 60 },
    ],
    color = "#8b5cf6", // Primary purple
}: StatsCardProps) {
    const spring = useSpring(0, { bounce: 0, duration: 2000 });
    const displayValue = useTransform(spring, (current) =>
        Math.floor(current).toLocaleString("pt-BR")
    );
    const [displayString, setDisplayString] = useState("0");

    useEffect(() => {
        spring.set(value);
    }, [value, spring]);

    useEffect(() => {
        return displayValue.on("change", (latest) => {
            setDisplayString(latest);
        });
    }, [displayValue]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="glass p-5 rounded-2xl border border-white/10 relative overflow-hidden group"
        >
            {/* Background Glow */}
            <div
                className="absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity"
                style={{ backgroundColor: color }}
            />

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                        <div
                            className="p-2 rounded-lg bg-white/5 border border-white/10"
                            style={{ color: color }}
                        >
                            <TrendingUp className="w-4 h-4" />
                        </div>
                        <span className="text-sm text-muted-foreground font-medium">
                            {title}
                        </span>
                    </div>
                    <div
                        className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full border ${trend === "up"
                                ? "bg-green-500/10 text-green-400 border-green-500/20"
                                : "bg-red-500/10 text-red-400 border-red-500/20"
                            }`}
                    >
                        {trend === "up" ? (
                            <ArrowUpRight className="w-3 h-3" />
                        ) : (
                            <ArrowDownRight className="w-3 h-3" />
                        )}
                        {trendValue}
                    </div>
                </div>

                <div className="flex items-end justify-between gap-4">
                    <div>
                        <h3 className="text-3xl font-bold tracking-tight">
                            <span className="text-muted-foreground/50 text-xl mr-1">
                                {prefix}
                            </span>
                            {displayString}
                            <span className="text-muted-foreground/50 text-xl ml-1">
                                {suffix}
                            </span>
                        </h3>
                    </div>

                    <div className="h-12 w-24">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={color} stopOpacity={0.4} />
                                        <stop offset="100%" stopColor={color} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke={color}
                                    strokeWidth={2}
                                    fill={`url(#gradient-${title})`}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
