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
            className="relative min-h-[100dvh] flex flex-col items-center overflow-hidden"
            style={{
                backgroundImage: "url('/it-3.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <div className="absolute inset-0" style={{ background: "rgba(10, 6, 4, 0.25)" }} />

            {/* Everything below is a normal flex column now — nothing is absolutely
               positioned against the heading, so it can never overlap on small screens. */}
            <div className="relative z-10 flex flex-col items-center w-full flex-1 px-4 pt-8 sm:pt-10 md:pt-14 pb-44 sm:pb-52">

                {/* आईटी वाले */}
                <h1
                    className="text-5xl sm:text-6xl md:text-8xl lg:text-[120px] xl:text-[140px] tracking-wide text-center leading-[1.05] select-none"
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

                {/* Playlist selector — now sits in normal flow right under the heading
                   on every breakpoint, so it never collides with it. */}
                <div
                    className="flex flex-wrap justify-center gap-2.5 sm:gap-3 mt-6 sm:mt-8 md:mt-10 w-full max-w-[280px] sm:max-w-none"
                >
                    {playlists.map((p, i) => (
                        <button
                            key={p.slug}
                            onClick={() => handleSelect(i)}
                            className="w-[128px] sm:w-[150px] flex items-center gap-2 sm:gap-3 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 transition-all duration-200 cursor-pointer"
                            style={{
                                background: activeIndex === i ? "rgba(20,14,10,0.95)" : "rgba(10,6,4,0.8)",
                                border: `2px solid ${activeIndex === i ? "#d68c2f" : "rgba(255,255,255,0.25)"}`,
                                backdropFilter: "blur(10px)",
                                boxShadow: activeIndex === i
                                    ? "0 0 20px rgba(214,140,47,0.5)"
                                    : "0 4px 12px rgba(0,0,0,0.4)",
                            }}
                        >
                            <span className="text-lg sm:text-2xl shrink-0">{p.icon}</span>
                            <span className="text-left min-w-0">
                                <span className="block text-[12px] sm:text-sm font-semibold truncate" style={{ color: "#ffffff" }}>{p.title}</span>
                                <span className="block text-[11px] sm:text-[12px] truncate" style={{ color: "#d9c9b4" }}>{p.subtitle}</span>
                            </span>
                        </button>
                    ))}
                </div>

                {/* Center tagline */}
                <div className="flex flex-col items-center text-center gap-4 sm:gap-6 mt-10 sm:mt-14 md:mt-20 px-2">
                    <p
                        className="text-[13px] sm:text-[15px] tracking-widest uppercase"
                        style={{ fontFamily: "'Space Mono', monospace", color: "#ffffff" }}
                    >
                        3 vibes. Endless memories.
                    </p>
                </div>
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