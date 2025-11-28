import { useCallback, useRef, useEffect } from 'react';

export function useSoundEngine() {
    const clickRef = useRef<HTMLAudioElement | null>(null);
    const hoverRef = useRef<HTMLAudioElement | null>(null);
    const ambientRef = useRef<HTMLAudioElement | null>(null);
    const enabledRef = useRef(false);

    useEffect(() => {
        // Create audio elements (they'll fail silently if files don't exist)
        clickRef.current = new Audio('/sounds/click.mp3');
        hoverRef.current = new Audio('/sounds/hover.mp3');
        ambientRef.current = new Audio('/sounds/ambient.mp3');

        if (ambientRef.current) {
            ambientRef.current.loop = true;
            ambientRef.current.volume = 0.2;
        }

        return () => {
            [clickRef, hoverRef, ambientRef].forEach(ref => {
                if (ref.current) {
                    ref.current.pause();
                    ref.current = null;
                }
            });
        };
    }, []);

    const playClick = useCallback(() => {
        if (!enabledRef.current || !clickRef.current) return;
        try {
            clickRef.current.currentTime = 0;
            clickRef.current.play().catch(() => { });
        } catch (e) { }
    }, []);

    const playHover = useCallback(() => {
        if (!enabledRef.current || !hoverRef.current) return;
        try {
            hoverRef.current.currentTime = 0;
            hoverRef.current.play().catch(() => { });
        } catch (e) { }
    }, []);

    const toggleAmbient = useCallback((play: boolean) => {
        enabledRef.current = play;
        if (!ambientRef.current) return;
        try {
            if (play) {
                ambientRef.current.play().catch(() => { });
            } else {
                ambientRef.current.pause();
            }
        } catch (e) { }
    }, []);

    return { playClick, playHover, toggleAmbient };
}
