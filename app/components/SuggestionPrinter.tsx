"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/app/lib/firebase";


export default function SuggestionPrinter() {
    const tapBtnRef = useRef<HTMLButtonElement>(null);
    const tapLabelRef = useRef<HTMLDivElement>(null);
    const paperPeekRef = useRef<HTMLDivElement>(null);
    const paperMaskRef = useRef<HTMLDivElement>(null);
    const statusRef = useRef<HTMLDivElement>(null);

    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [emailError, setEmailError] = useState(false);
    const [messageError, setMessageError] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const naturalHeight = useRef(0);

    useEffect(() => {
        if (paperMaskRef.current) {
            gsap.set(paperMaskRef.current, { height: "auto" });
            naturalHeight.current = paperMaskRef.current.scrollHeight;
            gsap.set(paperMaskRef.current, { height: 0 });
        }
    }, []);

    const isValidEmail = (value: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

    const printOut = () => {
        if (isOpen) return;
        setIsOpen(true);

        gsap
            .timeline()
            .to(tapBtnRef.current, { scale: 0.9, duration: 0.08, ease: "power1.out" })
            .to(tapBtnRef.current, { scale: 1, duration: 0.15, ease: "back.out(3)" })
            .to(paperPeekRef.current, { opacity: 0, duration: 0.1 }, "<")
            .to(
                paperMaskRef.current,
                { height: naturalHeight.current, duration: 0.65, ease: "power3.out" },
                "-=0.05"
            )
            .to(
                [tapBtnRef.current, tapLabelRef.current],
                { opacity: 0, duration: 0.2, pointerEvents: "none" },
                "-=0.5"
            );
    };

    const retract = (onDone: () => void) => {
        gsap.to(paperMaskRef.current, {
            height: 0,
            duration: 0.5,
            ease: "power3.in",
            onComplete: onDone,
        });
    };

    const shakeInvalid = (selector: string, onDone?: () => void) => {
        gsap.to(selector, { borderColor: "#E05A5A", duration: 0.15 });
        setTimeout(() => {
            gsap.to(selector, { borderColor: "#E5E1D6", duration: 0.3 });
            onDone?.();
        }, 600);
    };

    const handleSubmit = async (e: React.MouseEvent) => {
        e.stopPropagation();

        const trimmedEmail = email.trim();
        const trimmedMessage = message.trim();

        const emailInvalid = !trimmedEmail || !isValidEmail(trimmedEmail);
        const messageInvalid = !trimmedMessage;

        if (emailInvalid || messageInvalid) {
            if (emailInvalid) {
                setEmailError(true);
                shakeInvalid(".suggestion-email", () => setEmailError(false));
            }
            if (messageInvalid) {
                setMessageError(true);
                shakeInvalid(".suggestion-textarea", () => setMessageError(false));
            }
            return;
        }

        try {
            setSubmitting(true);
            await addDoc(collection(db, "suggestions"), {
                email: trimmedEmail,
                suggestion: trimmedMessage,
                createdAt: serverTimestamp(),
            });

            retract(() => {
                setIsOpen(false);
                setEmail("");
                setMessage("");
                setSubmitting(false);

                gsap.to(paperPeekRef.current, { opacity: 1, duration: 0.2 });
                gsap.to([tapBtnRef.current, tapLabelRef.current], {
                    opacity: 1,
                    duration: 0.25,
                    pointerEvents: "auto",
                });
                gsap.fromTo(
                    tapBtnRef.current,
                    { scale: 1 },
                    { scale: 1.08, duration: 0.12, yoyo: true, repeat: 1, ease: "power1.inOut" }
                );

                gsap.fromTo(
                    statusRef.current,
                    { opacity: 0, y: 6 },
                    { opacity: 1, y: 0, duration: 0.3 }
                );
                gsap.to(statusRef.current, { opacity: 0, delay: 1.8, duration: 0.4 });
            });
        } catch (err) {
            console.error("Failed to save suggestion:", err);
            setSubmitting(false);
        }
    };

    return (
        <>

            <div className="flex flex-col items-center">


                <div
                    className="relative w-[300px] h-[340px] rounded-[26px] border overflow-hidden"
                    style={{
                        background: "linear-gradient(160deg, #2E2013, #1A1109)",
                        borderColor: "#d68c2f",
                        boxShadow:
                            "0 0 0 1px rgba(214,140,47,0.35), 0 0 40px rgba(214,140,47,0.35), 0 20px 45px rgba(0,0,0,0.6)",
                    }}
                >
                    {/*<div className="absolute top-[22px] left-[22px] w-[9px] h-[9px] rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />*/}
                    <div className="absolute top-[18px] left-8 items-center text-[18px] font-bold leading-tight text-[#d9c9b4]">
                        You Suggest, We Play.
                    </div>

                    {/* slot */}
                    <div className="absolute top-[62px] left-[18px] right-[18px] h-[9px] bg-[#0D0906] rounded-[5px] shadow-inner z-[9] border border-[#d68c2f]/40" />

                    {/* concave notches where the paper tucks in under the slot ends */}
                    <div className="absolute top-[62px] left-6 w-5 h-5 rounded-full z-[7]" style={{ background: "#2E2013" }} />
                    <div className="absolute top-[62px] right-6 w-5 h-5 rounded-full z-[7]" style={{ background: "#2E2013" }} />

                    {/* resting-state paper peek */}
                    <div
                        ref={paperPeekRef}
                        className="absolute top-[68px] left-[34px] right-[34px] h-4 bg-[#FDFCF8] z-[3] shadow-sm"
                        style={{
                            clipPath:
                                "polygon(8% 0%, 92% 0%, 100% 45%, 91% 100%, 82% 45%, 73% 100%, 64% 45%, 55% 100%, 46% 45%, 37% 100%, 28% 45%, 19% 100%, 10% 45%, 0% 100%)",
                        }}
                    />

                    {/* printed paper (grows out of the slot) */}
                    <div
                        ref={paperMaskRef}
                        className="absolute top-[71px] left-[34px] right-[34px] h-0 overflow-hidden z-[5]"
                        style={{ pointerEvents: isOpen ? "auto" : "none" }}
                    >
                        <div
                            className="w-full bg-[#FDFCF8] px-3.5 pt-5 pb-5 flex flex-col gap-2 shadow-lg"
                            style={{
                                clipPath:
                                    "polygon(6% 0%, 94% 0%, 100% 4%, 100% 97%, 93.75% 100%, 87.5% 97%, 81.25% 100%, 75% 97%, 68.75% 100%, 62.5% 97%, 56.25% 100%, 50% 97%, 43.75% 100%, 37.5% 97%, 31.25% 100%, 25% 97%, 18.75% 100%, 12.5% 97%, 6.25% 100%, 0% 97%, 0% 4%)",
                            }}
                        >
                            <p className="text-[12.5px] font-extrabold text-center text-[#1A1A1A] m-0">
                                GOT AN IDEA FOR IT WAALE?
                            </p>
                            <input
                                type="email"
                                placeholder="you@email.com"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (emailError) setEmailError(false);
                                }}
                                className={`suggestion-email text-[17px] px-2.5 py-2 rounded-[7px] border text-black outline-none focus:border-sky-400 ${
                                    emailError ? "border-[#E05A5A]" : "border-[#E5E1D6]"
                                }`}
                            />
                            <textarea
                                placeholder="Your Suggestion..."
                                value={message}
                                onChange={(e) => {
                                    setMessage(e.target.value);
                                    if (messageError) setMessageError(false);
                                }}
                                className={`suggestion-textarea text-[17px] px-2.5 py-2 text-black rounded-[7px] border outline-none resize-none min-h-[56px] focus:border-sky-400 ${
                                    messageError ? "border-[#E05A5A]" : "border-[#E5E1D6]"
                                }`}
                            />
                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="mt-0.5 bg-[#1A1109] text-[#f0a94e] rounded-[7px] py-1.5 text-[11.5px] font-bold tracking-wide disabled:opacity-50"
                            >
                                {submitting ? "SENDING..." : "SEND IT IN"}
                            </button>
                        </div>
                    </div>

                    {/* tap button */}
                    <button
                        ref={tapBtnRef}
                        onClick={printOut}
                        className="absolute top-[150px] left-1/2 -translate-x-1/2 w-[90px] h-[90px] rounded-full border-none cursor-pointer flex items-center justify-center z-[2]"
                        style={{
                            background: "radial-gradient(circle at 35% 30%, #f0a94e, #d68c2f 70%)",
                            boxShadow:
                                "0 10px 24px rgba(214,140,47,0.5), inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -6px 10px rgba(0,0,0,0.2)",
                        }}
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-[34px] h-[34px] opacity-90"
                        >
                            <path d="M9 11.5V6a2 2 0 1 1 4 0v5.5" />
                            <path d="M13 11.5V5a2 2 0 1 1 4 0v9" />
                            <path d="M17 11.5v-1a2 2 0 1 1 4 0v6a7 7 0 0 1-7 7h-2a7 7 0 0 1-6-3.4l-2.7-4.7a1.8 1.8 0 0 1 2.8-2.2L8 15" />
                        </svg>
                    </button>
                    <div
                        ref={tapLabelRef}
                        className="absolute top-[276px] w-full text-center text-[13px] font-extrabold tracking-wider z-[2]"
                        style={{ color: "#f0a94e" }}
                    >
                        TAP TO SUGGEST
                    </div>
                </div>

                <div
                    ref={statusRef}
                    className="mt-6 text-center text-[13px] tracking-wide opacity-0"
                    style={{ color: "#f0a94e" }}
                >
                    Thanks — got your suggestion! 🎧
                </div>
            </div>
        </>
    );
}