"use client";


import { useEffect, useState } from "react";

export default function HitsPerSecond() {
    const [hits, setHits] = useState(0);

    function handleKeyPress(event: KeyboardEvent) {
        if (event.key === " ") {
            setHits((count) => count + 1);
        }
    }

    useEffect(() => {
        window.addEventListener("keyup", handleKeyPress);

        return () => {
            window.removeEventListener("keyup", handleKeyPress);
        };
    }, []);

    return (
        <div
            className="text-white"
        >
            {hits}
        </div>
    );
}