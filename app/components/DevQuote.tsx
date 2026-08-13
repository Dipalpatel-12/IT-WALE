"use client";
import { useEffect, useState } from "react";

const quotes = [
    "Code chal raha hai, samajh nahi aa raha kaise.",
    "Bug nahi hai bhai, feature hai.",
    "Deploy Friday ko? Bhagwan bachaye.",
    "Ek semicolon ne pura din barbaad kar diya.",
    "Stack Overflow hi meri asli senior hai.",
    "Localhost pe sab chalta hai, live pe kuch nahi.",
    "Chai peeke dekhunga, abhi code samajh nahi aa raha.",
    "Git push kiya, ab dua karo.",
    "Ye kaam 5 minute ka hai... 3 ghante ho gaye.",
    "Coffee khatam, motivation bhi khatam.",
];

type Phase = "in" | "hold" | "out";

export default function DevQuote() {
    const [index, setIndex] = useState(0);
    const [phase, setPhase] = useState<Phase>("in");

    useEffect(() => {
        // "in": slide up from bottom into place (short)
        // "hold": stays visible for 2.5s
        // "out": slides further up and fades out (short), then next quote resets to "in"
        let timer: ReturnType<typeof setTimeout>;

        if (phase === "in") {
            timer = setTimeout(() => setPhase("hold"), 400);
        } else if (phase === "hold") {
            timer = setTimeout(() => setPhase("out"), 2500);
        } else if (phase === "out") {
            timer = setTimeout(() => {
                setIndex((prev) => (prev + 1) % quotes.length);
                setPhase("in");
            }, 400);
        }

        return () => clearTimeout(timer);
    }, [phase]);

    const transformClass =
        phase === "in" ? "translate-y-4 opacity-0" :
            phase === "out" ? "-translate-y-4 opacity-0" :
                "translate-y-0 opacity-100";

    return (
        <div className="fixed left-1/2 -translate-x-1/2 z-20 bottom-[126px] sm:bottom-[126px] md:bottom-[142px] flex justify-center px-4 overflow-hidden">
            <div
                className="rounded-full px-4 sm:px-5 py-1.5 sm:py-2 w-[280px] sm:w-[420px]"
                style={{
                    background: "linear-gradient(180deg, rgba(38, 22, 16, 0.9), rgba(20, 11, 8, 0.92))",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(214, 140, 47, 0.18)",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.4)",
                }}
            >
                <p
                    className={`text-[13px] sm:text-[15px] italic text-center truncate transition-all duration-400 ease-out ${transformClass}`}
                    style={{
                        color: "#E8D9C4",
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontWeight: 500,
                    }}
                >
                    "{quotes[index]}"
                </p>
            </div>
        </div>
    );
}