"use client";

import { useEffect, useState } from "react";

export default function HitsPerSecond() {
    const [hitsLastFiveSeconds, setHitsLastFiveSeconds] = useState(0);
    const [hits, setHits] = useState(0);
    const [milliseconds, setMilliseconds] = useState(0);
    const [started, setStarted] = useState(false);
    const [max, setMax] = useState(0);

    const seconds = milliseconds / 1000;
    const lastFiveSeconds = Math.round((seconds % 5.0) * 10) / 10;
    const safeSeconds = seconds == 0 ? 1 : seconds;
    const safeLastFiveSeconds = lastFiveSeconds == 0 ? 1 : lastFiveSeconds;

    const hps = Math.round(hits * 100 / safeSeconds) / 100;
    const hpsLastFiveSeconds = Math.round(hitsLastFiveSeconds * 100 / safeLastFiveSeconds) / 100;

    function handleTimeChange() {
        setMilliseconds((ms) => ms + 100);
    }

    function handleKeyPress(event: KeyboardEvent) {
        if (event.key === " ") {
            if (!started) {
                setStarted(true);
            }

            setHits((count) => count + 1);
            setHitsLastFiveSeconds((count) => count + 1);
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

    useEffect(() => {
        if (lastFiveSeconds === 0) {
            setHitsLastFiveSeconds(0);
        }
    }, [seconds]);

    return (
        <div
            className="flex flex-col"
        >
            <p>
                Total - hits: {hits}
            </p>
            <p>
                Total - time: {seconds}
            </p>
            <p>
                Total - HPS: {hps}
            </p>
            <p>
                Total - Peak HPS: {max}
            </p>
            <p>
                Last 5 seconds - Hits: {hitsLastFiveSeconds}
            </p>
            <p>
                Last 5 seconds - HPS: {hpsLastFiveSeconds}
            </p>
            <button
                onClick={() => {
                    window.location.reload();
                }}
            >
                Reset
            </button>
        </div>
    );
}