"use client";

import HPSTest from "@/components/HPSTest/HPSTest";
import { useTimer } from "react-use-precision-timer";
import { useState } from "react";

export default function TestTimer() {
    const timer = useTimer({ delay: 100 }, handleTimeChange);

    const [milliseconds, setMilliseconds] = useState(0);

    function handleTimeChange() {
        setMilliseconds((ms) => ms + 100);
    }

    return (
        <HPSTest
            milliseconds={milliseconds}
            startTimer={timer.start}
        />
    );
}