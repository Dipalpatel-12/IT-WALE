"use client";
import { useState } from "react";
import RadioPlayer from "@/app/components/RadioPlayer";
import {playlists} from "@/app/lib/playlists";

export default function Home() {
    const [activeIndex, setActiveIndex] = useState<number | null>(0); // 👈 0 = 90s default
    const activePlaylist = activeIndex !== null ? playlists[activeIndex] : null;

    return (
        <main
            className="relative min-h-screen flex flex-col items-center justify-center px-4"
            style={{
                backgroundImage: "url('/it.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <div className="absolute inset-0" style={{ background: "rgba(10, 6, 4, 0.25)" }} />

            <div className="relative z-10 flex flex-col items-center text-center gap-6 pb-32">
                {/*<h1*/}
                {/*    className="text-6xl md:text-8xl leading-none"*/}
                {/*    style={{ fontFamily: "'Baloo 2', sans-serif", color: "#f3e4c8" }}*/}
                {/*>*/}
                {/*    IT WAALE<span style={{ color: "#d68c2f" }}>.</span>*/}
                {/*</h1>*/}
                <p
                    className="text-sm tracking-widest uppercase"
                    style={{ fontFamily: "'Space Mono', monospace", color: "#d9c9b4" }}
                >
                    3 vibes. Endless memories.
                </p>

                <div className="flex flex-wrap justify-center gap-4 mt-4">
                    {playlists.map((p, i) => (
                        <button
                            key={p.slug}
                            onClick={() => setActiveIndex(i)}
                            className="flex items-center gap-3 rounded-xl px-6 py-4 transition-all duration-200"
                            style={{
                                background: activeIndex === i ? "rgba(20,14,10,0.9)" : "rgba(10,6,4,0.75)",
                                border: `2px solid ${activeIndex === i ? "#d68c2f" : "rgba(255,255,255,0.25)"}`,
                                backdropFilter: "blur(10px)",
                                boxShadow: activeIndex === i
                                    ? "0 0 20px rgba(214,140,47,0.5)"
                                    : "0 4px 12px rgba(0,0,0,0.4)",
                            }}
                        >
                            <span className="text-3xl">{p.icon}</span>
                            <span className="text-left">
                <span className="block text-base font-semibold" style={{ color: "#f3e4c8" }}>{p.title}</span>
                <span className="block text-xs" style={{ color: "#c9b8a3" }}>{p.subtitle}</span>
              </span>
                        </button>
                    ))}
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