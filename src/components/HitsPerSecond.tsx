"use client";

import { useEffect, useRef, useState } from "react";
import { useTimer } from "react-use-precision-timer";

export default function HitsPerSecond() {
    const timer = useTimer({ delay: 100 }, handleTimeChange);

    const hitsLastFiveSeconds = useRef(0);
    const hits = useRef(0);
    const max = useRef(1);

    const [milliseconds, setMilliseconds] = useState(0);
    const [started, setStarted] = useState(false);

    const seconds = milliseconds / 1000;
    const lastFiveSeconds = Math.round((seconds % 5.0) * 10) / 10;
    const safeSeconds = seconds == 0 ? 1 : seconds;
    const safeLastFiveSeconds = lastFiveSeconds == 0 ? 1 : lastFiveSeconds;

    const hps = Math.round(hits.current * 100 / safeSeconds) / 100;
    const hpsLastFiveSeconds = Math.round(hitsLastFiveSeconds.current * 100 / safeLastFiveSeconds) / 100;

    function handleTimeChange() {
        setMilliseconds((ms) => ms + 100);
    }

    function handleKeyPress(event: KeyboardEvent) {
        if (event.key === " ") {
            if (!started) {
                setStarted(true);
                timer.start();
            }

            hits.current++;
            hitsLastFiveSeconds.current++;
        }
    }

    useEffect(() => {
        if (milliseconds <= 1000) {
            return;
        }

        max.current = Math.max(Math.round(max.current * 100), Math.round(hps * 100)) / 100;
    }, [hits]);

    useEffect(() => {
        window.addEventListener("keyup", handleKeyPress);

        return () => {
            window.removeEventListener("keyup", handleKeyPress);
        };
    }, []);

    useEffect(() => {
        if (lastFiveSeconds === 0) {
            hitsLastFiveSeconds.current = 0;
        }
    }, [seconds]);

    return (
        <div
            className="flex flex-col"
        >
            <p>
                Total - hits: {hits.current}
            </p>
            <p>
                Total - time: {seconds}
            </p>
            <p>
                Total - HPS: {hps}
            </p>
            <p>
                Total - Peak HPS: {max.current}
            </p>
            <p>
                Last 5 seconds - Hits: {hitsLastFiveSeconds.current}
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