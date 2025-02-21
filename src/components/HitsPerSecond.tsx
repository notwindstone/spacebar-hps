"use client";


import { useEffect, useState } from "react";

export default function HitsPerSecond() {
    const [hits, setHits] = useState(0);
    const [milliseconds, setMilliseconds] = useState(0);
    const [started, setStarted] = useState(false);
    const [max, setMax] = useState(0);

    const seconds = milliseconds / 1000;
    const safeSeconds = seconds == 0 ? 1 : seconds;
    const hps = Math.round(hits * 100 / safeSeconds) / 100;

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
        if (milliseconds <= 1000) {
            return;
        }

        setMax(
            (currentMax) =>
                Math.max(
                    Math.round(currentMax * 100), Math.round(hps * 100)
                ) / 100
        );
    }, [hits]);

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
                Total hits: {hits}
            </p>
            <p>
                Total time: {seconds}
            </p>
            <p>
                Total HPS: {hps}
            </p>
            <p>
                Peak HPS: {max}
            </p>
        </div>
    );
}