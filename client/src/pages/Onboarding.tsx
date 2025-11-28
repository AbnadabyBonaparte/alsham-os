import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';

export default function Onboarding() {
    const [, setLocation] = useLocation();
    const [step, setStep] = useState<'boot' | 'warp'>('boot');
    const [lines, setLines] = useState<string[]>([]);

    useEffect(() => {
        if (step !== 'boot') return;

        const bootLines = [
            "INITIALIZING ALSHAM KERNEL v13.3...",
            "LOADING QUANTUM MODULES... [OK]",
            "DECRYPTING USER BIOMETRICS... [OK]",
            "CONNECTING TO NEURAL NET... [OK]",
            "ESTABLISHING SECURE UPLINK... [OK]",
            "MOUNTING VIRTUAL REALITY ENGINE... [OK]",
            "SYNCING WITH GLOBAL SERVERS... [OK]",
            "ACTIVATING 161 SPECIALIZED AGENTS... [OK]",
            "SYSTEM READY."
        ];

        let i = 0;
        const interval = setInterval(() => {
            setLines(prev => [...prev, bootLines[i]]);
            i++;
            if (i >= bootLines.length) {
                clearInterval(interval);
                setTimeout(() => setStep('warp'), 1500);
                setTimeout(() => setLocation('/'), 4000);
            }
        }, 400);

        return () => clearInterval(interval);
    }, [step, setLocation]);

    if (step === 'warp') {
        return (
            <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden">
                <div className="relative">
                    <h1 className="text-7xl md:text-9xl font-black text-cyan-400 animate-ping">
                        ALSHAM
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <h1 className="text-7xl md:text-9xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">
                            ALSHAM
                        </h1>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black flex items-center justify-center p-8">
            <div className="font-mono text-cyan-400 text-lg md:text-xl space-y-2 max-w-3xl">
                {lines.map((line, i) => (
                    <div
                        key={i}
                        className="opacity-0 animate-fadeIn"
                        style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'forwards' }}
                    >
                        {line}
                    </div>
                ))}
                <div className="animate-pulse mt-4">_</div>
            </div>
        </div>
    );
}
