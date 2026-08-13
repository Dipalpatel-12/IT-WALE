"use client";
import { useEffect, useState } from "react";
import RadioPlayer from "@/app/components/RadioPlayer";
import DevQuote from "@/app/components/DevQuote";
import SuggestionPrinter from "@/app/components/SuggestionPrinter";
import { playlists } from "@/app/lib/playlists";
import Image from "next/image";
import OnlineUsers from "@/app/components/OnlineUsers";

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
        <main className="relative min-h-[100dvh] flex flex-col items-center overflow-hidden">
            <div
                className="fixed inset-0 -z-10"
                style={{
                    backgroundImage: "url('/itwale-bg.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            />
            <div
                className="absolute inset-0"
                style={{ background: "rgba(35, 18, 8, 0.35)"  }}
            />

            <OnlineUsers />

            {/* Suggestion box — desktop/tablet only, fixed top-left corner */}
            <div className="hidden sm:block fixed top-3 left-3 md:top-4 md:left-4 z-30 scale-[0.5] md:scale-[0.6] lg:scale-[0.75] origin-top-left">
                <SuggestionPrinter />
            </div>

            {/* Everything below is a normal flex column now — nothing is absolutely
               positioned against the heading, so it can never overlap on small screens. */}
            <div className="relative z-10 flex flex-col items-center w-full flex-1 px-4 pt-8 sm:pt-10 md:pt-14 pb-44 sm:pb-52">

                {/* आईटी वाले */}
                <h1
                    className="text-5xl sm:text-6xl md:text-8xl lg:text-[120px] xl:text-[140px] tracking-wide text-center leading-[1.05] select-none"
                    style={{
                        fontFamily: "'Baloo 2', sans-serif",
                        fontWeight: 800,
                        color: "#FFFFFF",
                        textShadow: `
                            0 0 20px rgba(214,140,47,0.6),
                            0 0 40px rgba(214,140,47,0.4),
                            2px 2px 0 #D68C2F,
                            4px 4px 0 #D68C2F,
                            6px 6px 0 #B8721F,
                            8px 8px 0 #8F5714,
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
                    className="flex flex-wrap justify-center gap-2.5 mt-6 w-full max-w-[280px]
   sm:flex-col sm:flex-nowrap sm:justify-start sm:items-end sm:gap-3
   sm:absolute sm:top-3 sm:right-3 sm:mt-0 sm:w-auto sm:max-w-none
   md:top-4 md:right-8
   lg:top-4 lg:right-12"
                >
                    {playlists.map((p, i) => (
                        <button
                            key={p.slug}
                            onClick={() => handleSelect(i)}
                            className="w-[128px] sm:w-[140px] flex items-center gap-2 sm:gap-3 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 transition-all duration-200 cursor-pointer"
                            style={{
                                background: activeIndex === i ? "rgba(20,14,10,0.95)" : "rgba(10,6,4,0.8)",
                                border: `2px solid ${activeIndex === i ? "#D68C2F" : "rgba(255,255,255,0.25)"}`,
                                backdropFilter: "blur(10px)",
                                boxShadow: activeIndex === i
                                    ? "0 0 20px rgba(214,140,47,0.5)"
                                    : "0 4px 12px rgba(0,0,0,0.4)",
                            }}
                        >
                            <span className="text-lg sm:text-2xl shrink-0">{p.icon}</span>
                            <span className="text-left min-w-0">
                <span className="block text-[10px] sm:text-[12px] font-semibold truncate" style={{ color: "#FFFFFF" }}>{p.title}</span>
                <span className="block text-[11px] sm:text-[12px] truncate" style={{ color: "#D9C9B4" }}>{p.subtitle}</span>
            </span>
                        </button>
                    ))}
                </div>

                {/* Suggestion box — mobile only, same visual position as before (mt-36),
                   but wrapped in a zero-height container so it doesn't add to page height / cause scroll */}
                <div className="sm:hidden h-0 w-full flex justify-center overflow-visible relative z-30">
                    <div className="mt-36 scale-[0.55] origin-top">
                        <SuggestionPrinter />
                    </div>
                </div>
                {/* Center tagline */}
                <div className="flex flex-col items-center text-center gap-4 sm:gap-6 mt-10 sm:mt-14 md:mt-20 px-2">
                    {/*<p*/}
                    {/*    className="text-[13px] sm:text-[15px] tracking-widest uppercase"*/}
                    {/*    style={{ fontFamily: "'Space Mono', monospace", color: "#FFFFFF" }}*/}
                    {/*>*/}
                    {/*    3 vibes. Endless memories.*/}
                    {/*</p>*/}
                </div>
            </div>

            {activePlaylist && (
                <>
                    <DevQuote />
                    <RadioPlayer
                        key={activePlaylist.playlistId}
                        playlistId={activePlaylist.playlistId}
                        categoryTitle={activePlaylist.title}
                    />
                </>
            )}

            {/* Footer credit — bottom-right, out of the way of the center quote/player stack */}
            <a
                href="https://optimitylogics.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-3 sm:bottom-4 right-3 sm:right-5 z-20 flex items-center gap-1.5 sm:gap-2 cursor-pointer transition-opacity duration-200 hover:opacity-70"
            >
                <Image
                    src="/optimity-logo.png"
                    alt="OptimityLogics"
                    width={20}
                    height={20}
                    className="w-4 h-4 sm:w-5 sm:h-5 object-cover"
                />
                <span
                    className="text-[10px] sm:text-[12px] tracking-wide"
                    style={{ color: "#FFFFFF", fontFamily: "'Work Sans', sans-serif", fontWeight: 400 }}
                >
                    Tuned by Optimity Logics
                </span>
            </a>
        </main>
    );
}