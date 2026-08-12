// "use client";
// import { useEffect, useRef, useState } from "react";
//
// declare global {
//     interface Window {
//         YT: any;
//         onYouTubeIframeAPIReady: () => void;
//     }
// }
//
// interface RadioPlayerProps {
//     playlistId: string;
//     categoryTitle: string;
// }
//
// export default function RadioPlayer({ playlistId, categoryTitle }: RadioPlayerProps) {
//     const playerRef = useRef<any>(null);
//     const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
//     const [isPlaying, setIsPlaying] = useState(false);
//     const [videoId, setVideoId] = useState("");
//     const [title, setTitle] = useState("Loading...");
//     const [duration, setDuration] = useState(0);
//     const [currentTime, setCurrentTime] = useState(0);
//     const [volume, setVolume] = useState(80);
//
//     useEffect(() => {
//         function createPlayer() {
//             playerRef.current = new window.YT.Player("yt-player-" + playlistId, {
//                 height: "0",
//                 width: "0",
//                 playerVars: { listType: "playlist", list: playlistId, autoplay: 1 },
//                 events: {
//                     onReady: (e: any) => {
//                         e.target.unMute();
//                         e.target.setVolume(volume);
//                     },
//                     onStateChange: (e: any) => {
//                         const S = window.YT.PlayerState;
//                         if (e.data === S.PLAYING) {
//                             setIsPlaying(true);
//                             const data = playerRef.current.getVideoData();
//                             setVideoId(data.video_id);
//                             setTitle(data.title);
//                             setDuration(playerRef.current.getDuration());
//                         } else if (e.data === S.PAUSED) {
//                             setIsPlaying(false);
//                         }
//                     },
//                 },
//             });
//         }
//
//         if (window.YT && window.YT.Player) {
//             createPlayer();
//         } else {
//             const tag = document.createElement("script");
//             tag.src = "https://www.youtube.com/iframe_api";
//             document.body.appendChild(tag);
//             window.onYouTubeIframeAPIReady = createPlayer;
//         }
//
//         intervalRef.current = setInterval(() => {
//             if (playerRef.current?.getCurrentTime) {
//                 setCurrentTime(playerRef.current.getCurrentTime());
//             }
//         }, 1000);
//
//         return () => {
//             if (intervalRef.current) clearInterval(intervalRef.current);
//             playerRef.current?.destroy?.();
//         };
//     }, [playlistId]);
//
//     const togglePlay = () => {
//         if (!playerRef.current) return;
//         isPlaying ? playerRef.current.pauseVideo() : playerRef.current.playVideo();
//     };
//     const playNext = () => playerRef.current?.nextVideo();
//     const playPrev = () => playerRef.current?.previousVideo();
//
//     const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const v = Number(e.target.value);
//         setVolume(v);
//         if (playerRef.current) {
//             playerRef.current.unMute();
//             playerRef.current.setVolume(v);
//         }
//     };
//
//     const toggleMute = () => {
//         if (!playerRef.current) return;
//         if (volume === 0) {
//             setVolume(50);
//             playerRef.current.unMute();
//             playerRef.current.setVolume(50);
//         } else {
//             setVolume(0);
//             playerRef.current.setVolume(0);
//         }
//     };
//
//     const formatTime = (s: number) => {
//         if (!s || isNaN(s)) return "0:00";
//         const m = Math.floor(s / 60);
//         const sec = Math.floor(s % 60);
//         return `${m}:${sec.toString().padStart(2, "0")}`;
//     };
//
//     const progress = duration ? (currentTime / duration) * 100 : 0;
//
//     return (
//         <div
//             className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl rounded-full px-5 py-3 flex items-center gap-4"
//             style={{
//                 background: "rgba(28, 16, 12, 0.92)",
//                 backdropFilter: "blur(14px)",
//                 border: "1px solid rgba(214, 140, 47, 0.25)",
//                 boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
//             }}
//         >
//             <div id={"yt-player-" + playlistId} className="hidden" />
//
//             <img
//                 src={videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : ""}
//                 alt={title}
//                 className="w-12 h-12 rounded-lg object-cover shrink-0"
//                 style={{ border: "1px solid rgba(214, 140, 47, 0.4)", background: "#2b1a12" }}
//             />
//
//             <div className="min-w-0" style={{ width: "160px" }}>
//                 <p
//                     className="text-[15px] truncate"
//                     style={{ color: "#fff6e8", fontFamily: "'Work Sans', sans-serif", fontWeight: 600 }}
//                 >
//                     {title}
//                 </p>
//                 <p
//                     className="text-[12px] truncate"
//                     style={{ color: "#a08a73", fontFamily: "'Work Sans', sans-serif" }}
//                 >
//                     {categoryTitle}
//                 </p>
//                 <div className="flex items-center gap-2 mt-1">
//                     <div className="flex-1 h-[3px] rounded-full" style={{ background: "rgba(255,255,255,0.15)" }}>
//                         <div className="h-[3px] rounded-full" style={{ width: `${progress}%`, background: "#e8d9c4" }} />
//                     </div>
//                     <span
//                         className="text-[11px] whitespace-nowrap"
//                         style={{ fontFamily: "'Space Mono', monospace", color: "#a08a73" }}
//                     >
//             {formatTime(currentTime)} / {formatTime(duration)}
//           </span>
//                 </div>
//             </div>
//
//             {/* Center controls */}
//             <div className="flex items-center gap-4 mx-auto">
//                 <button onClick={playPrev} aria-label="Previous" className="text-lg" style={{ color: "#e8d9c4" }}>⏮</button>
//                 <button
//                     onClick={togglePlay}
//                     aria-label={isPlaying ? "Pause" : "Play"}
//                     className="w-10 h-10 rounded-full flex items-center justify-center text-base"
//                     style={{
//                         background: "transparent",
//                         color: "#fff6e8",
//                         border: "2px solid #4a90d9",
//                         boxShadow: "0 0 0 2px rgba(74,144,217,0.25)",
//                     }}
//                 >
//                     {isPlaying ? "❚❚" : "▶"}
//                 </button>
//                 <button onClick={playNext} aria-label="Next" className="text-lg" style={{ color: "#e8d9c4" }}>⏭</button>
//             </div>
//
//             {/* Volume */}
//             <div className="flex items-center gap-2 shrink-0">
//                 <button onClick={toggleMute} aria-label="Toggle volume">
//                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e8d9c4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                         <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
//                         {volume > 0 && <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />}
//                         {volume > 40 && <path d="M18.07 5.93a9 9 0 0 1 0 12.73" />}
//                     </svg>
//                 </button>
//                 <input
//                     type="range"
//                     min={0}
//                     max={100}
//                     value={volume}
//                     onChange={handleVolumeChange}
//                     className="w-20 accent-[#e8d9c4]"
//                 />
//             </div>
//         </div>
//     );
// }

"use client";
import { useEffect, useRef, useState } from "react";

declare global {
    interface Window {
        YT: any;
        onYouTubeIframeAPIReady: () => void;
    }
}

interface RadioPlayerProps {
    playlistId: string;
    categoryTitle: string;
}

export default function RadioPlayer({ playlistId, categoryTitle }: RadioPlayerProps) {
    const playerRef = useRef<any>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [videoId, setVideoId] = useState("");
    const [title, setTitle] = useState("Loading...");
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(80);
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        function createPlayer() {
            playerRef.current = new window.YT.Player("yt-player-" + playlistId, {
                height: "0",
                width: "0",
                playerVars: { listType: "playlist", list: playlistId, autoplay: 1 },
                events: {
                    onReady: (e: any) => e.target.setVolume(volume),
                    onStateChange: (e: any) => {
                        const S = window.YT.PlayerState;
                        if (e.data === S.PLAYING) {
                            setIsPlaying(true);
                            const data = playerRef.current.getVideoData();
                            setVideoId(data.video_id);
                            setTitle(data.title);
                            setDuration(playerRef.current.getDuration());
                        } else if (e.data === S.PAUSED) {
                            setIsPlaying(false);
                        }
                    },
                },
            });
        }

        if (window.YT && window.YT.Player) {
            createPlayer();
        } else {
            const tag = document.createElement("script");
            tag.src = "https://www.youtube.com/iframe_api";
            document.body.appendChild(tag);
            window.onYouTubeIframeAPIReady = createPlayer;
        }

        intervalRef.current = setInterval(() => {
            if (playerRef.current?.getCurrentTime) {
                setCurrentTime(playerRef.current.getCurrentTime());
            }
        }, 1000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            playerRef.current?.destroy?.();
        };
    }, [playlistId]);

    const togglePlay = () => {
        if (!playerRef.current) return;
        isPlaying ? playerRef.current.pauseVideo() : playerRef.current.playVideo();
    };
    const playNext = () => playerRef.current?.nextVideo();
    const playPrev = () => playerRef.current?.previousVideo();

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = Number(e.target.value);
        setVolume(v);
        setIsMuted(v === 0);
        playerRef.current?.setVolume?.(v);
        if (v > 0 && playerRef.current?.unMute) playerRef.current.unMute();
    };

    const toggleMute = () => {
        if (!playerRef.current) return;
        if (isMuted) {
            playerRef.current.unMute();
            playerRef.current.setVolume(volume || 80);
            setIsMuted(false);
        } else {
            playerRef.current.mute();
            setIsMuted(true);
        }
    };

    const formatTime = (s: number) => {
        if (!s || isNaN(s)) return "0:00";
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return `${m}:${sec.toString().padStart(2, "0")}`;
    };

    const progress = duration ? (currentTime / duration) * 100 : 0;
    const effectiveVolume = isMuted ? 0 : volume;

    return (
        <div
            className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-2xl rounded-full px-4 py-3 flex items-center gap-4"
            style={{
                background: "linear-gradient(180deg, rgba(38, 22, 16, 0.94), rgba(20, 11, 8, 0.96))",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(214, 140, 47, 0.22)",
                boxShadow: "0 10px 34px rgba(0,0,0,0.55)",
            }}
        >
            <div id={"yt-player-" + playlistId} className="hidden" />

            {/* Album art */}
            <img
                src={videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : ""}
                alt={title}
                className="w-12 h-12 rounded-xl object-cover shrink-0"
                style={{ border: "1px solid rgba(214, 140, 47, 0.35)", background: "#2B1A12" }}
            />

            {/* Title + progress */}
            <div className="min-w-0 flex-1" style={{ maxWidth: "190px" }}>
                <p
                    className="text-[16px] truncate leading-tight"
                    style={{ color: "#FFFFFF", fontFamily: "'Work Sans', sans-serif", fontWeight: 700 }}
                >
                    {title}
                </p>
                <p
                    className="text-[13px] truncate leading-tight mt-[2px]"
                    style={{ color: "#B8A894", fontFamily: "'Work Sans', sans-serif", fontWeight: 500 }}
                >
                    {categoryTitle}
                </p>
                <div className="flex items-center gap-2 mt-[6px]">
                    <span
                        className="text-[12px] whitespace-nowrap"
                        style={{ fontFamily: "'Space Mono', monospace", color: "#FFFFFF", fontWeight: 600 }}
                    >
                        {formatTime(currentTime)}
                    </span>
                    <div className="flex-1 h-[3px] rounded-full" style={{ background: "rgba(255,255,255,0.18)" }}>
                        <div
                            className="h-[3px] rounded-full"
                            style={{ width: `${progress}%`, background: "#FFF6E8" }}
                        />
                    </div>
                    <span
                        className="text-[12px] whitespace-nowrap"
                        style={{ fontFamily: "'Space Mono', monospace", color: "#FFFFFF", fontWeight: 600 }}
                    >
                        {formatTime(duration)}
                    </span>
                </div>
            </div>

            {/* Center controls */}
            <div className="flex items-center gap-4 mx-auto shrink-0">
                <button
                    onClick={playPrev}
                    aria-label="Previous"
                    className="flex items-center justify-center"
                    style={{ color: "#E8D9C4" }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 5h2v14H6zM20 5v14l-11-7z" />
                    </svg>
                </button>

                <button
                    onClick={togglePlay}
                    aria-label={isPlaying ? "Pause" : "Play"}
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{
                        background: "#FFF6E8",
                        color: "#241209",
                        boxShadow: "0 4px 14px rgba(0,0,0,0.35)",
                    }}
                >
                    {isPlaying ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <rect x="6" y="5" width="4" height="14" rx="1" />
                            <rect x="14" y="5" width="4" height="14" rx="1" />
                        </svg>
                    ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: "2px" }}>
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    )}
                </button>

                <button
                    onClick={playNext}
                    aria-label="Next"
                    className="flex items-center justify-center"
                    style={{ color: "#E8D9C4" }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M16 5h2v14h-2zM4 5v14l11-7z" />
                    </svg>
                </button>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-2 shrink-0">
                <button
                    onClick={toggleMute}
                    aria-label={isMuted ? "Unmute" : "Mute"}
                    className="flex items-center justify-center"
                    style={{ color: "#E8D9C4" }}
                >
                    {isMuted || effectiveVolume === 0 ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none" />
                            <line x1="23" y1="9" x2="17" y2="15" />
                            <line x1="17" y1="9" x2="23" y2="15" />
                        </svg>
                    ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none" />
                            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                        </svg>
                    )}
                </button>
                <input
                    type="range"
                    min={0}
                    max={100}
                    value={effectiveVolume}
                    onChange={handleVolumeChange}
                    className="w-20 accent-[#FFF6E8]"
                    aria-label="Volume"
                />
            </div>
        </div>
    );
}