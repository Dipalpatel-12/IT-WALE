"use client";
import { useEffect, useState } from "react";
import { ref, onDisconnect, onValue, set, serverTimestamp, push, onChildAdded, onChildRemoved } from "firebase/database";
import { rtdb } from "@/app/lib/firebase";

export default function OnlineUsers() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const myConnectionRef = push(ref(rtdb, "status"));
        const connectedRef = ref(rtdb, ".info/connected");

        const unsubConnected = onValue(connectedRef, (snap) => {
            if (snap.val() === true) {
                onDisconnect(myConnectionRef).remove();
                set(myConnectionRef, { online: true, since: serverTimestamp() });
            }
        });

        const statusRef = ref(rtdb, "status");
        const countSet = new Set<string>();

        const unsubAdded = onChildAdded(statusRef, (snap) => {
            countSet.add(snap.key!);
            setCount(countSet.size);
        });

        const unsubRemoved = onChildRemoved(statusRef, (snap) => {
            countSet.delete(snap.key!);
            setCount(countSet.size);
        });

        return () => {
            unsubConnected();
            unsubAdded();
            unsubRemoved();
        };
    }, []);

    return (
        <div className="fixed top-0 sm:top-0 md:top-0 left-1/2 -translate-x-1/2 z-30">
            <div
                className="flex items-center gap-2 "
                style={{
                    // background: "linear-gradient(180deg, rgba(38, 22, 16, 0.9), rgba(20, 11, 8, 0.92))",
                    // backdropFilter: "blur(10px)",
                    // border: "1px solid rgba(34, 197, 94, 0.35)",
                    // boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
                }}
            >
                <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-green-500" />
                </span>
                <span
                    className="text-[11px] sm:text-[13px]"
                    style={{ fontFamily: "'Work Sans', sans-serif", color: "#ffffff" }}
                >
                    {count} between the tasks
                </span>
            </div>
        </div>
    );
}