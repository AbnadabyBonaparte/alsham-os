"use client";

import { useEffect } from "react";

const themes = [
    "quantum", "cybermatrix", "deepspace", "aurora",
    "amethyst", "rosequartz", "emeraldvoid",
    "nordicnight", "pureblack", "sunset"
];

export function ThemeSelector() {
    useEffect(() => {
        const handleThemeChange = (e: CustomEvent) => {
            document.documentElement.setAttribute("data-theme", e.detail);
        };
        window.addEventListener("themechange" as any, handleThemeChange);
        return () => window.removeEventListener("themechange" as any, handleThemeChange);
    }, []);

    const changeTheme = (theme: string) => {
        document.documentElement.setAttribute("data-theme", theme);
        window.dispatchEvent(new CustomEvent("themechange", { detail: theme }));
    };

    return (
        <div className="fixed top-24 right-4 z-[9999] bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl">
            <p className="text-xs font-bold text-white/60 mb-3 tracking-wider">TEMAS QUÂNTICOS</p>
            <div className="grid grid-cols-3 gap-3">
                {themes.map(t => (
                    <button
                        key={t}
                        onClick={() => changeTheme(t)}
                        className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold uppercase tracking-wider transition-all hover:scale-105"
                        style={{
                            background: t === "cybermatrix" ? "linear-gradient(135deg, #8b5cf6, #ec4899)" :
                                t === "deepspace" ? "#0f172a" :
                                    t === "aurora" ? "linear-gradient(135deg, #10b981, #06b6d4)" : undefined
                        }}
                    >
                        {t.replace("void", "Void").replace("night", "Night")}
                    </button>
                ))}
            </div>
        </div>
    );
}