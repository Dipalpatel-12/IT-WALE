

"use client";
import { useEffect, useState } from "react";
import RadioPlayer from "@/app/components/RadioPlayer";
import { playlists } from "@/app/lib/playlists";

const STORAGE_KEY = "it-wale-active-playlist";

export default function Home() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        const savedIndex = saved !== null ? Number(saved) : 0;
        if (savedIndex >= 0 && savedIndex < playlists.length) {
            setActiveIndex(savedIndex);
        } else {
            setActiveIndex(0);
        }
        setHydrated(true);
    }, []);

    const handleSelect = (i: number) => {
        setActiveIndex(i);
        localStorage.setItem(STORAGE_KEY, String(i));
    };

    const activePlaylist = activeIndex !== null ? playlists[activeIndex] : null;

    if (!hydrated) return null;

    return (
        <main
            className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden"
            style={{
                backgroundImage: "url('/it-3.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <div className="absolute inset-0" style={{ background: "rgba(10, 6, 4, 0.25)" }} />

            {/* आईटी वाले */}
            <h1
                className="absolute top-6 sm:top-4 md:top-[80px] left-1/2 -translate-x-1/2 z-10 text-7xl  md:text-[120px] lg:text-[140px] tracking-wide text-center leading-none select-none"
                style={{
                    fontFamily: "'Baloo 2', sans-serif",
                    fontWeight: 800,
                    color: "#ffffff",
                    textShadow: `
                        0 0 20px rgba(214,140,47,0.6),
                        0 0 40px rgba(214,140,47,0.4),
                        2px 2px 0 #d68c2f,
                        4px 4px 0 #d68c2f,
                        6px 6px 0 #b8721f,
                        8px 8px 0 #8f5714,
                        10px 10px 0 rgba(0,0,0,0.5),
                        12px 12px 20px rgba(0,0,0,0.7)
                    `,
                }}
            >
                <span className="block">आईटी</span>
                <span className="block">वाले</span>
            </h1>

            {/* Playlist selector — mobile: 2-up-1-down centered wrap | sm+: original top-right column */}
            <div
                className="absolute top-[182px] left-1/2 -translate-x-1/2 right-auto
                           sm:top-28 sm:left-auto sm:translate-x-0 sm:right-6
                           z-10 flex flex-wrap sm:flex-col
                           justify-center sm:justify-start
                           gap-2 sm:gap-3
                           w-[240px] sm:w-auto"
            >
                {playlists.map((p, i) => (
                    <button
                        key={p.slug}
                        onClick={() => handleSelect(i)}
                        className="w-[112px] sm:w-[150px] flex items-center gap-1.5 sm:gap-3 rounded-lg sm:rounded-xl px-2.5 sm:px-4 py-2 sm:py-3 transition-all duration-200 cursor-pointer"
                        style={{
                            background: activeIndex === i ? "rgba(20,14,10,0.95)" : "rgba(10,6,4,0.8)",
                            border: `2px solid ${activeIndex === i ? "#d68c2f" : "rgba(255,255,255,0.25)"}`,
                            backdropFilter: "blur(10px)",
                            boxShadow: activeIndex === i
                                ? "0 0 20px rgba(214,140,47,0.5)"
                                : "0 4px 12px rgba(0,0,0,0.4)",
                        }}
                    >
                        <span className="text-base sm:text-2xl shrink-0">{p.icon}</span>
                        <span className="text-left min-w-0">
                            <span className="block text-[10px] sm:text-sm font-semibold truncate" style={{ color: "#ffffff" }}>{p.title}</span>
                            <span className="hidden sm:block text-[11px] truncate" style={{ color: "#d9c9b4" }}>{p.subtitle}</span>
                        </span>
                    </button>
                ))}
            </div>

            {/* Center tagline */}
            <div className="relative z-10 flex flex-col items-center text-center gap-4 sm:gap-6 pb-48 md:pb-58 lg:pb-68 px-2">
                <p
                    className="text-[12px] sm:text-[15px] tracking-widest uppercase"
                    style={{ fontFamily: "'Space Mono', monospace", color: "#ffffff" }}
                >
                    3 vibes. Endless memories.
                </p>
            </div>

            {activePlaylist && (
                <RadioPlayer
                    key={activePlaylist.playlistId}
                    playlistId={activePlaylist.playlistId}
                    categoryTitle={activePlaylist.title}
                />
            )}
        </main>
    );
}