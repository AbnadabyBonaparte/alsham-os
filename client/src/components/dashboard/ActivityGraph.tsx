import { motion } from "framer-motion";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

interface ActivityData {
    time: string;
    active: number;
    tasks: number;
}

const defaultData: ActivityData[] = [
    { time: "08:00", active: 120, tasks: 450 },
    { time: "10:00", active: 145, tasks: 680 },
    { time: "12:00", active: 130, tasks: 520 },
    { time: "14:00", active: 158, tasks: 890 },
    { time: "16:00", active: 161, tasks: 920 },
    { time: "18:00", active: 140, tasks: 600 },
];

export function ActivityGraph() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass p-6 rounded-2xl border border-white/10 w-full h-[300px] flex flex-col"
        >
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">Atividade da Rede Neural</h3>
                    <p className="text-sm text-muted-foreground">
                        Processamento em tempo real dos 161 agentes
                    </p>
                </div>
                <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-muted-foreground">Tasks/min</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-secondary" />
                        <span className="text-muted-foreground">Agentes Ativos</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={defaultData}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis
                            dataKey="time"
                            stroke="rgba(255,255,255,0.3)"
                            tick={{ fontSize: 12 }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="rgba(255,255,255,0.3)"
                            tick={{ fontSize: 12 }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "rgba(0,0,0,0.8)",
                                backdropFilter: "blur(10px)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                borderRadius: "12px",
                            }}
                            itemStyle={{ color: "#fff" }}
                        />
                        <Area
                            type="monotone"
                            dataKey="tasks"
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorTasks)"
                        />
                        <Area
                            type="monotone"
                            dataKey="active"
                            stroke="hsl(var(--secondary))"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorActive)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}
