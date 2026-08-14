// "use client";
// import { useEffect, useRef, useState } from "react";
// import Image from "next/image";
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
//     const [isReady, setIsReady] = useState(false);
//     const [videoId, setVideoId] = useState("");
//     const [title, setTitle] = useState("Loading...");
//     const [duration, setDuration] = useState(0);
//     const [currentTime, setCurrentTime] = useState(0);
//     const [volume, setVolume] = useState(80);
//     const [isMuted, setIsMuted] = useState(false);
//     const [isSeeking, setIsSeeking] = useState(false);
//
//     useEffect(() => {
//         setIsReady(false);
//         setIsPlaying(false);
//         setVideoId("");
//         setTitle("Loading...");
//         setDuration(0);
//         setCurrentTime(0);
//
//         function createPlayer() {
//             playerRef.current = new window.YT.Player("yt-player-" + playlistId, {
//                 height: "0",
//                 width: "0",
//                 playerVars: { listType: "playlist", list: playlistId, autoplay: 1 },
//                 events: {
//                     onReady: (e: any) => {
//                         e.target.setVolume(volume);
//                         setIsReady(true);
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
//             if (playerRef.current?.getCurrentTime && !isSeeking) {
//                 setCurrentTime(playerRef.current.getCurrentTime());
//             }
//         }, 1000);
//
//         return () => {
//             if (intervalRef.current) clearInterval(intervalRef.current);
//             playerRef.current?.destroy?.();
//         };
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [playlistId]);
//
//     const togglePlay = () => {
//         if (!playerRef.current || !isReady) return;
//         isPlaying ? playerRef.current.pauseVideo() : playerRef.current.playVideo();
//     };
//     const playNext = () => {
//         if (!playerRef.current || !isReady) return;
//         playerRef.current.nextVideo();
//     };
//     const playPrev = () => {
//         if (!playerRef.current || !isReady) return;
//         playerRef.current.previousVideo();
//     };
//
//     // Spacebar se play/pause toggle
//     useEffect(() => {
//         const handleKeyDown = (e: KeyboardEvent) => {
//             const target = e.target as HTMLElement;
//             const isTyping = ["INPUT", "TEXTAREA"].includes(target.tagName);
//             if (e.code === "Space" && !isTyping) {
//                 e.preventDefault();
//                 togglePlay();
//             }
//         };
//         window.addEventListener("keydown", handleKeyDown);
//         return () => window.removeEventListener("keydown", handleKeyDown);
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [isReady, isPlaying]);
//
//     const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const v = Number(e.target.value);
//         setVolume(v);
//         setIsMuted(v === 0);
//         playerRef.current?.setVolume?.(v);
//         if (v > 0 && playerRef.current?.unMute) playerRef.current.unMute();
//     };
//
//     const toggleMute = () => {
//         if (!playerRef.current) return;
//         if (isMuted) {
//             playerRef.current.unMute();
//             playerRef.current.setVolume(volume || 80);
//             setIsMuted(false);
//         } else {
//             playerRef.current.mute();
//             setIsMuted(true);
//         }
//     };
//
//     // Timeline seek — ab onChange pe hi seek hota hai (keyboard ke liye bhi kaam karega)
//     const handleSeekStart = () => setIsSeeking(true);
//     const handleSeekEnd = () => setIsSeeking(false);
//     const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const seekTime = Number(e.target.value);
//         setCurrentTime(seekTime);
//         playerRef.current?.seekTo?.(seekTime, true);
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
//     const effectiveVolume = isMuted ? 0 : volume;
//     const showThumbnail = Boolean(videoId);
//
//     return (
//         <div
//             className="fixed bottom-10 sm:bottom- md:bottom-12 left-1/2 -translate-x-1/2 z-20
//                        w-[94%] sm:w-[92%] max-w-2xl
//                        rounded-2xl sm:rounded-full
//                        px-3 sm:px-4 py-2.5 sm:py-3
//                        flex items-center gap-2 sm:gap-4"
//             style={{
//                 background: "linear-gradient(180deg, rgba(38, 22, 16, 0.94), rgba(20, 11, 8, 0.96))",
//                 backdropFilter: "blur(16px)",
//                 border: "1px solid rgba(214, 140, 47, 0.22)",
//                 boxShadow: "0 10px 34px rgba(0,0,0,0.55)",
//             }}
//         >
//             <div id={"yt-player-" + playlistId} className="hidden" />
//
//             {showThumbnail ? (
//                 <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl overflow-hidden shrink-0"
//                      style={{ border: "1px solid rgba(214, 140, 47, 0.35)", background: "#2B1A12" }}
//                 >
//                     <Image
//                         src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
//                         alt={title}
//                         fill
//                         sizes="100px"
//                         quality={100}
//                         className="object-cover scale-140"
//                     />
//                 </div>
//             ) : (
//                 <div
//                     className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl shrink-0 flex items-center justify-center text-lg sm:text-xl"
//                     style={{ border: "1px solid rgba(214, 140, 47, 0.35)", background: "#2B1A12" }}
//                 >
//                     🎵
//                 </div>
//             )}
//
//             {/* Title + timeline — min-w-0 is critical here so this column can actually
//                shrink on narrow phones instead of forcing horizontal overflow. */}
//             <div className="min-w-0 flex-1">
//                 <p
//                     className="text-[13px] sm:text-[16px] truncate leading-tight"
//                     style={{ color: "#FFFFFF", fontFamily: "'Work Sans', sans-serif", fontWeight: 700 }}
//                 >
//                     {title}
//                 </p>
//                 <p
//                     className="text-[11px] sm:text-[13px] truncate leading-tight mt-[2px]"
//                     style={{ color: "#B8A894", fontFamily: "'Work Sans', sans-serif", fontWeight: 500 }}
//                 >
//                     {categoryTitle}
//                 </p>
//                 <div className="flex items-center gap-1.5 sm:gap-2 mt-[6px]">
//                     <span
//                         className="text-[10px] sm:text-[12px] whitespace-nowrap"
//                         style={{ fontFamily: "'Space Mono', monospace", color: "#FFFFFF", fontWeight: 600 }}
//                     >
//                         {formatTime(currentTime)}
//                     </span>
//
//                     <div className="relative flex-1 h-[3px] rounded-full" style={{ background: "rgba(255,255,255,0.18)" }}>
//                         <div
//                             className="h-[3px] rounded-full pointer-events-none"
//                             style={{ width: `${progress}%`, background: "#FFF6E8" }}
//                         />
//                         <input
//                             type="range"
//                             min={0}
//                             max={duration || 0}
//                             step={0.1}
//                             value={currentTime}
//                             onMouseDown={handleSeekStart}
//                             onTouchStart={handleSeekStart}
//                             onMouseUp={handleSeekEnd}
//                             onTouchEnd={handleSeekEnd}
//                             onChange={handleSeekChange}
//                             disabled={!isReady || !duration}
//                             className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
//                             aria-label="Seek"
//                         />
//                     </div>
//
//                     <span
//                         className="text-[10px] sm:text-[12px] whitespace-nowrap"
//                         style={{ fontFamily: "'Space Mono', monospace", color: "#FFFFFF", fontWeight: 600 }}
//                     >
//                         {formatTime(duration)}
//                     </span>
//                 </div>
//             </div>
//
//             <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
//                 <button
//                     onClick={playPrev}
//                     aria-label="Previous"
//                     disabled={!isReady}
//                     className="flex items-center justify-center cursor-pointer transition-transform duration-150 hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
//                     style={{ color: "#E8D9C4" }}
//                 >
//                     <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="sm:w-5 sm:h-5">
//                         <path d="M6 5h2v14H6zM20 5v14l-11-7z" />
//                     </svg>
//                 </button>
//
//                 <button
//                     onClick={togglePlay}
//                     aria-label={isPlaying ? "Pause" : "Play"}
//                     disabled={!isReady}
//                     className="w-11 h-11 sm:w-14 sm:h-14 rounded-full flex items-center justify-center cursor-pointer  disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 shrink-0"
//                     style={{
//                         background: "#FFF6E8",
//                         color: "#241209",
//                         boxShadow: "0 4px 14px rgba(0,0,0,0.35)",
//                     }}
//                 >
//                     {isPlaying ? (
//                         <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="sm:w-[18px] sm:h-[18px]">
//                             <rect x="6" y="5" width="4" height="14" rx="1" />
//                             <rect x="14" y="5" width="4" height="14" rx="1" />
//                         </svg>
//                     ) : (
//                         <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: "2px" }} className="sm:w-[27px] sm:h-[27px]">
//                             <path d="M8 5v14l11-7z" />
//                         </svg>
//                     )}
//                 </button>
//
//                 <button
//                     onClick={playNext}
//                     aria-label="Next"
//                     disabled={!isReady}
//                     className="flex items-center justify-center cursor-pointer transition-transform duration-150 hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
//                     style={{ color: "#E8D9C4" }}
//                 >
//                     <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="sm:w-5 sm:h-5">
//                         <path d="M16 5h2v14h-2zM4 5v14l11-7z" />
//                     </svg>
//                 </button>
//             </div>
//
//             {/* Mute toggle stays visible on phones; the volume slider only shows from
//                sm up since it doesn't fit comfortably next to the transport controls. */}
//             <div className="flex items-center gap-2 shrink-0">
//                 <button
//                     onClick={toggleMute}
//                     aria-label={isMuted ? "Unmute" : "Mute"}
//                     className="flex items-center justify-center cursor-pointer"
//                     style={{ color: "#E8D9C4" }}
//                 >
//                     {isMuted || effectiveVolume === 0 ? (
//                         <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-[18px] sm:h-[18px]">
//                             <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none" />
//                             <line x1="23" y1="9" x2="17" y2="15" />
//                             <line x1="17" y1="9" x2="23" y2="15" />
//                         </svg>
//                     ) : (
//                         <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-[18px] sm:h-[18px]">
//                             <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none" />
//                             <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
//                             <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
//                         </svg>
//                     )}
//                 </button>
//                 <input
//                     type="range"
//                     min={0}
//                     max={100}
//                     value={effectiveVolume}
//                     onChange={handleVolumeChange}
//                     className="hidden sm:block w-20 accent-[#FFF6E8] cursor-pointer"
//                     aria-label="Volume"
//                 />
//             </div>
//         </div>
//     );
// }




"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

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
    const [isReady, setIsReady] = useState(false);
    const [videoId, setVideoId] = useState("");
    const [title, setTitle] = useState("Loading...");
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(80);
    const [isMuted, setIsMuted] = useState(false);
    const [isSeeking, setIsSeeking] = useState(false);

    useEffect(() => {
        setIsReady(false);
        setIsPlaying(false);
        setVideoId("");
        setTitle("Loading...");
        setDuration(0);
        setCurrentTime(0);

        function createPlayer() {
            playerRef.current = new window.YT.Player("yt-player-" + playlistId, {
                height: "0",
                width: "0",
                playerVars: { listType: "playlist", list: playlistId, autoplay: 1, loop: 1 },
                events: {
                    onReady: (e: any) => {
                        e.target.setVolume(volume);
                        setIsReady(true);
                    },
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
                        } else if (e.data === S.ENDED) {
                            // Fallback in case the loop=1 playerVar doesn't kick in —
                            // manually jump back to the first video and resume playback.
                            const p = playerRef.current;
                            if (p?.playVideoAt) {
                                p.playVideoAt(0);
                            }
                            setTimeout(() => {
                                if (playerRef.current?.getPlayerState?.() !== window.YT.PlayerState.PLAYING) {
                                    playerRef.current?.seekTo?.(0, true);
                                    playerRef.current?.playVideo?.();
                                }
                            }, 600);
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
            if (playerRef.current?.getCurrentTime && !isSeeking) {
                setCurrentTime(playerRef.current.getCurrentTime());
            }
        }, 1000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            playerRef.current?.destroy?.();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playlistId]);

    const togglePlay = () => {
        if (!playerRef.current || !isReady) return;
        isPlaying ? playerRef.current.pauseVideo() : playerRef.current.playVideo();
    };
    const playNext = () => {
        if (!playerRef.current || !isReady) return;
        playerRef.current.nextVideo();
    };
    const playPrev = () => {
        if (!playerRef.current || !isReady) return;
        playerRef.current.previousVideo();
    };

    // Spacebar se play/pause toggle
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            const isTyping = ["INPUT", "TEXTAREA"].includes(target.tagName);
            if (e.code === "Space" && !isTyping) {
                e.preventDefault();
                togglePlay();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isReady, isPlaying]);

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
    // Timeline seek — ab onChange pe hi seek hota hai (keyboard ke liye bhi kaam karega)
    const handleSeekStart = () => setIsSeeking(true);
    const handleSeekEnd = () => setIsSeeking(false);
    const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const seekTime = Number(e.target.value);
        setCurrentTime(seekTime);
        playerRef.current?.seekTo?.(seekTime, true);
    };

    const formatTime = (s: number) => {
        if (!s || isNaN(s)) return "0:00";
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return `${m}:${sec.toString().padStart(2, "0")}`;
    };

    const progress = duration ? (currentTime / duration) * 100 : 0;
    const effectiveVolume = isMuted ? 0 : volume;
    const showThumbnail = Boolean(videoId);

    return (
        <div
            className="fixed bottom-10 sm:bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-20
                       w-[94%] sm:w-[92%] max-w-2xl
                       rounded-2xl sm:rounded-full
                       px-3 sm:px-4 py-2.5 sm:py-3
                       flex items-center gap-2 sm:gap-4"
            style={{
                background: "linear-gradient(180deg, rgba(38, 22, 16, 0.94), rgba(20, 11, 8, 0.96))",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(214, 140, 47, 0.22)",
                boxShadow: "0 10px 34px rgba(0,0,0,0.55)",
            }}
        >
            <div id={"yt-player-" + playlistId} className="hidden" />

            {showThumbnail ? (
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl overflow-hidden shrink-0"
                     style={{ border: "1px solid rgba(214, 140, 47, 0.35)", background: "#2B1A12" }}
                >
                    <Image
                        src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
                        alt={title}
                        fill
                        sizes="100px"
                        quality={100}
                        className="object-cover scale-140"
                    />
                </div>
            ) : (
                <div
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl shrink-0 flex items-center justify-center text-lg sm:text-xl"
                    style={{ border: "1px solid rgba(214, 140, 47, 0.35)", background: "#2B1A12" }}
                >
                    🎵
                </div>
            )}
            {/* Title + timeline — min-w-0 is critical here so this column can actually
               shrink on narrow phones instead of forcing horizontal overflow. */}
            <div className="min-w-0 flex-1">
                <p
                    className="text-[13px] sm:text-[16px] truncate leading-tight"
                    style={{ color: "#FFFFFF", fontFamily: "'Work Sans', sans-serif", fontWeight: 700 }}
                >
                    {title}
                </p>
                <p
                    className="text-[11px] sm:text-[13px] truncate leading-tight mt-[2px]"
                    style={{ color: "#B8A894", fontFamily: "'Work Sans', sans-serif", fontWeight: 500 }}
                >
                    {categoryTitle}
                </p>
                <div className="flex items-center gap-1.5 sm:gap-2 mt-[6px]">
                    <span
                        className="text-[10px] sm:text-[12px] whitespace-nowrap"
                        style={{ fontFamily: "'Space Mono', monospace", color: "#FFFFFF", fontWeight: 600 }}
                    >
                        {formatTime(currentTime)}
                    </span>

                    <div className="relative flex-1 h-[3px] rounded-full" style={{ background: "rgba(255,255,255,0.18)" }}>
                        <div
                            className="h-[3px] rounded-full pointer-events-none"
                            style={{ width: `${progress}%`, background: "#FFF6E8" }}
                        />
                        <input
                            type="range"
                            min={0}
                            max={duration || 0}
                            step={0.1}
                            value={currentTime}
                            onMouseDown={handleSeekStart}
                            onTouchStart={handleSeekStart}
                            onMouseUp={handleSeekEnd}
                            onTouchEnd={handleSeekEnd}
                            onChange={handleSeekChange}
                            disabled={!isReady || !duration}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                            aria-label="Seek"
                        />
                    </div>

                    <span
                        className="text-[10px] sm:text-[12px] whitespace-nowrap"
                        style={{ fontFamily: "'Space Mono', monospace", color: "#FFFFFF", fontWeight: 600 }}
                    >
                        {formatTime(duration)}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
                <button
                    onClick={playPrev}
                    aria-label="Previous"
                    disabled={!isReady}
                    className="flex items-center justify-center cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                    style={{ color: "#E8D9C4" }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="sm:w-5 sm:h-5">
                        <path d="M6 5h2v14H6zM20 5v14l-11-7z" />
                    </svg>
                </button>

                <button
                    onClick={togglePlay}
                    aria-label={isPlaying ? "Pause" : "Play"}
                    disabled={!isReady}
                    className="w-11 h-11 sm:w-14 sm:h-14 rounded-full flex items-center justify-center cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 shrink-0"
                    style={{
                        background: "#FFF6E8",
                        color: "#241209",
                        boxShadow: "0 4px 14px rgba(0,0,0,0.35)",
                    }}
                >
                    {isPlaying ? (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="sm:w-[18px] sm:h-[18px]">
                            <rect x="6" y="5" width="4" height="14" rx="1" />
                            <rect x="14" y="5" width="4" height="14" rx="1" />
                        </svg>
                    ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: "2px" }} className="sm:w-[27px] sm:h-[27px]">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    )}
                </button>

                <button
                    onClick={playNext}
                    aria-label="Next"
                    disabled={!isReady}
                    className="flex items-center justify-center cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                    style={{ color: "#E8D9C4" }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="sm:w-5 sm:h-5">
                        <path d="M16 5h2v14h-2zM4 5v14l11-7z" />
                    </svg>
                </button>
            </div>

            {/* Mute toggle stays visible on phones; the volume slider only shows from
               sm up since it doesn't fit comfortably next to the transport controls. */}
            <div className="flex items-center gap-2 shrink-0">
                <button
                    onClick={toggleMute}
                    aria-label={isMuted ? "Unmute" : "Mute"}
                    className="flex items-center justify-center cursor-pointer"
                    style={{ color: "#E8D9C4" }}
                >
                    {isMuted || effectiveVolume === 0 ? (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-[18px] sm:h-[18px]">
                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none" />
                            <line x1="23" y1="9" x2="17" y2="15" />
                            <line x1="17" y1="9" x2="23" y2="15" />
                        </svg>
                    ) : (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-[18px] sm:h-[18px]">
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
                    className="hidden sm:block w-20 accent-[#FFF6E8] cursor-pointer"
                    aria-label="Volume"
                />
            </div>
        </div>
    );
}