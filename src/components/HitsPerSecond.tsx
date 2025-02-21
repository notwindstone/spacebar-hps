"use client";


import { useEffect, useState } from "react";

export default function HitsPerSecond() {
    const [hits, setHits] = useState(0);
    const [started, setStarted] = useState(false);
    const [milliseconds, setMilliseconds] = useState(0);

    function handleTimeChange() {
        setMilliseconds((ms) => ms + 100);
    }

    function handleKeyPress(event: KeyboardEvent) {
        if (event.key === " ") {
            if (!started) {
                setStarted(true);
            }

            setHits((count) => count + 1);
        }
    }

    useEffect(() => {
        if (started) {
            setInterval(handleTimeChange, 100);
        }
    }, [started]);

    useEffect(() => {
        window.addEventListener("keyup", handleKeyPress);

        return () => {
            window.removeEventListener("keyup", handleKeyPress);
        };
    }, []);

    return (
        <div
            className="flex flex-col"
        >
            <p>
                {hits}
            </p>
            <p>
                {milliseconds}
            </p>
        </div>
    );
}