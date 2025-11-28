'use client';

import type { Metadata } from 'next';
import QuantumBackground from '@/components/background/QuantumBackground';
import ParticleField from '@/components/background/ParticleField';
import { ThemeProvider } from '@/lib/themes/ThemeProvider';
import '@/app/globals.css';

// Importa o ThemeSwitcher (já criado na Etapa 1)
import ThemeSwitcher from '@/components/ui/theme-switcher/ThemeSwitcher';

export const metadata: Metadata = {
  title: 'ALSHAM OS • Santuário Digital',
  description: 'Superinteligência Corporativa • Tália X.1',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/icons/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#000814" />
        <link rel="manifest" href="/manifest.json" />
      </head>

      <body className="min-h-screen bg-black text-white antialiased overflow-x-hidden">
        <ThemeProvider>
          {/* Fundo Quântico + Partículas 3D */}
          <QuantumBackground />
          <ParticleField />

          {/* Camada principal com conteúdo */}
          <div className="relative z-10 min-h-screen flex flex-col">
            {/* Header fixo com ThemeSwitcher */}
            <header className="fixed top-0 left-0 right-0 z-50 glass-backdrop border-b border-white/5 backdrop-blur-2xl">
              <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center shadow-2xl glow">
                    <span className="text-xl font-bold text-white">A</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                      ALSHAM OS
                    </h1>
                  </div>
                </div>

                {/* Theme Switcher no canto direito */}
                <ThemeSwitcher />
              </div>
            </header>

            {/* Espaço pro header fixo não sobrepor conteúdo */}
            <div className="pt-20 flex-1">
              {children}
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}