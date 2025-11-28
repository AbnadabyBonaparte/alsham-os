'use client';

import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { toast } from "sonner";

// COMPONENTS
import { Button } from "@/components/ui/button";
import { TaliaChat } from "@/components/TaliaChat";
import { NexusVisualization } from "@/components/NexusVisualization";
import { AgentCommandPalette } from "@/components/AgentCommandPalette";
import ThemeSwitcher from "@/components/ui/theme-switcher/ThemeSwitcher";

// BACKGROUND QUE CRIAMOS
import QuantumBackground from "@/components/background/QuantumBackground";
import ParticleField from "@/components/background/ParticleField";

// HOOKS
import { useAlshamAgent } from "@/hooks/use-alsham-agent";
import { useSoundEngine } from "@/hooks/useSoundEngine";

// ÍCONES
import {
  Sparkles, LogOut, Search, Grid3x3,
  Volume2, VolumeX
} from "lucide-react";

export default function Home() {
  const [, setLocation] = useLocation();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const { playClick, playHover, toggleAmbient } = useSoundEngine();

  const user = { name: "Abnad", email: "abnad@alsham.io" };
  const isAuthenticated = true;

  const agentHook = useAlshamAgent();

  // Loading com background ativo
  if (!agentHook?.currentAgent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
        <QuantumBackground />
        <ParticleField />
        <div className="relative z-10 text-center space-y-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="inline-block"
          >
            <Sparkles className="w-32 h-32 text-cyan-400 opacity-80" />
          </motion.div>
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-black bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              ALSHAM OS
            </h1>
            <p className="text-2xl md:text-3xl text-cyan-300 font-light">Invocando Tália X.1...</p>
            <p className="text-lg text-gray-500">Conectando ao Santuário Digital v13.3</p>
          </div>
        </div>
      </div>
    );
  }

  const {
    messages,
    sendMessage,
    isTyping,
    hasMessages,
    currentAgent,
    setAgentId,
  } = agentHook;

  // CMD+K + ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setPaletteOpen(v => !v);
        playClick();
      }
      if (e.key === "Escape") setPaletteOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [playClick]);

  // Ambient sound
  useEffect(() => {
    toggleAmbient(soundEnabled);
  }, [soundEnabled, toggleAmbient]);

  return (
    <>
      <QuantumBackground />
      <ParticleField />

      <AgentCommandPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        onSelect={(id) => {
          setAgentId(id);
          setPaletteOpen(false);
          playClick();
        }}
      />

      {/* Header Fixo */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10 backdrop-blur-3xl">
        <div className="container mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo + Agente Atual */}
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center glow shadow-2xl ring-2 ring-white/20"
                style={{
                  background: currentAgent.uiConfig?.gradient || "linear-gradient(135deg, #8b5cf6, #ec4899)",
                }}
              >
                <span className="text-3xl">{currentAgent.uiConfig?.icon || "Diamond"}</span>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  ALSHAM OS
                </h1>
                <p className="text-xs text-cyan-300 tracking-wider">SANTUÁRIO DIGITAL • v13.3</p>
              </div>
            </div>

            {/* Ações */}
            <div className="flex items-center gap-3 md:gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setPaletteOpen(true); playClick(); }}
                onMouseEnter={playHover}
                className="gap-2 hover:bg-white/10"
              >
                <Search className="w-4 h-4" />
                Invocar Agente
                <kbd className="hidden md:inline ml-2 px-2 py-0.5 text-xs border border-white/30 rounded bg-white/5">CMD K</kbd>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setLocation("/agents"); playClick(); }}
                onMouseEnter={playHover}
                className="hover:bg-white/10"
              >
                <Grid3x3 className="w-4 h-4 mr-1 md:mr-2" />
                Galeria
              </Button>

              <ThemeSwitcher />

              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  const newState = !soundEnabled;
                  setSoundEnabled(newState);
                  playClick();
                }}
                onMouseEnter={playHover}
              >
                {soundEnabled ?
                  <Volume2 className="w-5 h-5 text-cyan-400" /> :
                  <VolumeX className="w-5 h-5 text-gray-500" />
                }
              </Button>

              <div className="hidden md:block h-10 w-px bg-white/20 mx-2" />

              <div className="hidden md:flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-semibold text-white">{user.name}</p>
                  <p className="text-xs text-cyan-400">{user.email}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => toast.success("Logout em breve")}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 pt-24 md:pt-28 pb-8 flex overflow-hidden">
        <div className="flex-1 relative z-10">
          <TaliaChat
            messages={messages}
            onSendMessage={sendMessage}
            isTyping={isTyping}
          />
        </div>

        <aside className={`w-96 glass border-l border-white/5 p-6 md:p-8 hidden 2xl:block transition-all duration-1000 ${hasMessages ? "opacity-20 blur-md" : "opacity-100"
          }`}>
          <NexusVisualization />
        </aside>
      </main>
    </>
  );
}