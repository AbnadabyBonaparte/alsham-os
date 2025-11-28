import { useState } from "react";
import { motion } from "framer-motion";
import {
  Code,
  TrendingUp,
  Leaf,
  Heart,
  Shield,
  Palette,
  DollarSign,
  BarChart3,
} from "lucide-react";

interface Cluster {
  id: number;
  name: string;
  icon: React.ElementType;
  color: string;
  active: boolean;
  agents: number;
}

const clusters: Cluster[] = [
  {
    id: 1,
    name: "Desenvolvimento",
    icon: Code,
    color: "oklch(0.65 0.25 280)",
    active: false,
    agents: 15,
  },
  {
    id: 2,
    name: "Vendas",
    icon: TrendingUp,
    color: "oklch(0.65 0.25 220)",
    active: false,
    agents: 12,
  },
  {
    id: 3,
    name: "Sustentabilidade",
    icon: Leaf,
    color: "oklch(0.65 0.25 150)",
    active: false,
    agents: 18,
  },
  {
    id: 4,
    name: "Saúde",
    icon: Heart,
    color: "oklch(0.60 0.25 25)",
    active: false,
    agents: 10,
  },
  {
    id: 5,
    name: "Compliance",
    icon: Shield,
    color: "oklch(0.70 0.20 320)",
    active: false,
    agents: 8,
  },
  {
    id: 6,
    name: "Criativo",
    icon: Palette,
    color: "oklch(0.65 0.25 50)",
    active: false,
    agents: 14,
  },
  {
    id: 7,
    name: "Financeiro",
    icon: DollarSign,
    color: "oklch(0.65 0.25 100)",
    active: false,
    agents: 11,
  },
  {
    id: 8,
    name: "Inteligência",
    icon: BarChart3,
    color: "oklch(0.65 0.25 260)",
    active: false,
    agents: 13,
  },
];

export function NexusVisualization() {
  const [activeCluster, setActiveCluster] = useState<number | null>(null);

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">ALSHAM NEXUS</h3>
        <p className="text-sm text-muted-foreground">
          Visualização em tempo real dos clusters ativos
        </p>
      </div>

      {/* Central Nexus */}
      <div className="flex-1 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Center node */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative z-10"
          >
            <div className="w-20 h-20 rounded-full gradient-primary glow flex items-center justify-center">
              <span className="text-white font-bold text-sm">NEXUS</span>
            </div>
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-primary"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>

          {/* Cluster nodes */}
          {clusters.map((cluster, index) => {
            const angle = (index / clusters.length) * 2 * Math.PI - Math.PI / 2;
            const radius = 120;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            return (
              <motion.div
                key={cluster.id}
                initial={{ scale: 0, x: 0, y: 0 }}
                animate={{ scale: 1, x, y }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  type: "spring",
                }}
                className="absolute"
                style={{
                  left: "50%",
                  top: "50%",
                }}
                onMouseEnter={() => setActiveCluster(cluster.id)}
                onMouseLeave={() => setActiveCluster(null)}
              >
                {/* Connection line */}
                <svg
                  className="absolute pointer-events-none"
                  style={{
                    left: -x,
                    top: -y,
                    width: Math.abs(x) * 2,
                    height: Math.abs(y) * 2,
                  }}
                >
                  <motion.line
                    x1={x > 0 ? 0 : Math.abs(x) * 2}
                    y1={y > 0 ? 0 : Math.abs(y) * 2}
                    x2={x > 0 ? Math.abs(x) * 2 : 0}
                    y2={y > 0 ? Math.abs(y) * 2 : 0}
                    stroke={cluster.color}
                    strokeWidth="2"
                    strokeOpacity={activeCluster === cluster.id ? "0.6" : "0.2"}
                    strokeDasharray="5,5"
                    animate={{
                      strokeDashoffset: [0, -10],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </svg>

                {/* Cluster node */}
                <motion.div
                  className="relative cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div
                    className="w-16 h-16 rounded-full glass flex items-center justify-center border-2 transition-all"
                    style={{
                      borderColor: cluster.color,
                      boxShadow:
                        activeCluster === cluster.id
                          ? `0 0 20px ${cluster.color}`
                          : "none",
                    }}
                  >
                    <cluster.icon
                      className="w-8 h-8"
                      style={{ color: cluster.color }}
                    />
                  </div>

                  {/* Tooltip */}
                  {activeCluster === cluster.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap"
                    >
                      <div className="glass px-3 py-2 rounded-lg text-xs">
                        <p className="font-semibold">{cluster.name}</p>
                        <p className="text-muted-foreground">
                          {cluster.agents} agentes
                        </p>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Clusters List */}
      <div className="mt-6 space-y-2">
        <h4 className="text-sm font-semibold mb-3">Clusters Disponíveis</h4>
        <div className="space-y-2">
          {clusters.map((cluster) => (
            <motion.div
              key={cluster.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: cluster.id * 0.05 }}
              className="flex items-center gap-3 text-xs p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
              onMouseEnter={() => setActiveCluster(cluster.id)}
              onMouseLeave={() => setActiveCluster(null)}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: cluster.color }}
              />
              <span className="flex-1 text-muted-foreground">
                {cluster.name}
              </span>
              <span
                className="text-muted-foreground/60 text-[10px]"
              >
                {cluster.agents} agentes
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
