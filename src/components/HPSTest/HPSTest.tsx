import { useEffect, useRef, useState } from "react";
import PeakHPSBar from "@/components/PeakHPSBar/PeakHPSBar";

export default function HPSTest({
    milliseconds,
    startTimer,
}: {
    milliseconds: number;
    startTimer: () => void;
}) {
    const [pressed, setPressed] = useState(false);
    const [timeBetweenClicks, setTimeBetweenClicks] = useState({
        previous: 0,
        current: 0,
    });

    const hitsLastFiveSeconds = useRef(0);
    const hits = useRef(0);
    const max = useRef(1);
    const lastFiveSecondsMax = useRef(1);
    const started = useRef(false);

    const seconds = milliseconds / 1000;
    const lastFiveSeconds = Math.round((seconds % 5.0) * 10) / 10;
    const betweenClicksSeconds = (timeBetweenClicks.current - timeBetweenClicks.previous) / 1000;
    const safeSeconds = seconds == 0 ? 1 : seconds;
    const safeLastFiveSeconds = lastFiveSeconds == 0 ? 1 : lastFiveSeconds;

    const hps = Math.round(hits.current * 100 / safeSeconds) / 100;
    const hpsLastFiveSeconds = Math.round(hitsLastFiveSeconds.current * 100 / safeLastFiveSeconds) / 100;
    const hpsBetweenClicks = Math.round(100 / betweenClicksSeconds) / 100;

    function handleKeyDown(event: KeyboardEvent) {
        if (event.key === " ") {
            setPressed(true);
        }
    }

    function handleKeyUp(event: KeyboardEvent) {
        if (event.key === " ") {
            if (!started.current) {
                started.current = true;

                startTimer();
            }

            hits.current++;
            hitsLastFiveSeconds.current++;

            setPressed(false);
        }
    }

    useEffect(() => {
        if (pressed) {
            return;
        }

        setTimeBetweenClicks((currentTime) => {
            return {
                previous: currentTime.current,
                current: Date.now(),
            };
        });

        if (milliseconds <= 1000) {
            return;
        }

        lastFiveSecondsMax.current = Math.max(Math.round(lastFiveSecondsMax.current * 100), Math.round(hpsLastFiveSeconds * 100)) / 100;
        max.current = Math.max(Math.round(max.current * 100), Math.round(hps * 100)) / 100;
    }, [pressed]);

    useEffect(() => {
        if (lastFiveSeconds === 0) {
            hitsLastFiveSeconds.current = 0;
            lastFiveSecondsMax.current = 0;
        }
    }, [seconds]);

    useEffect(() => {
        setTimeBetweenClicks({
            previous: Date.now(),
            current: Date.now(),
        });

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    return (
        <div
            className="flex flex-col"
        >
            <p>
                Total - Hits: {hits.current}
            </p>
            <p>
                Total - Time: {seconds}
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
            <p>
                Last 5 seconds - Peak HPS: {lastFiveSecondsMax.current}
            </p>
            <p>
                Between 2 clicks - HPS: {hpsBetweenClicks}
            </p>
            <p>
                Between 2 clicks - Time: {betweenClicksSeconds}
            </p>
            <PeakHPSBar
                current={hps}
                peak={max.current}
            />
            <PeakHPSBar
                current={hpsLastFiveSeconds}
                peak={lastFiveSecondsMax.current}
            />
            <button
                onClick={() => {
                    window.location.reload();
                }}
            >
                Reset
            </button>
            {
                pressed ? (
                    <div className="w-48 h-12 bg-white border-[1px] border-white rounded-md" />
                ) : (
                    <div className="w-48 h-12 bg-zinc-900 border-[1px] border-white rounded-md" />
                )
            }
        </div>
    );
}