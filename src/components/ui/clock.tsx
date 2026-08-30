"use client";

import { useEffect, useState } from "react";
import { Lora } from "next/font/google";

const lora = Lora({ subsets: ["latin"] });

const TIME_ZONE = "Europe/London";

function format(time: Date) {
  const clock = time
    .toLocaleTimeString("en-GB", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      timeZone: TIME_ZONE,
    })
    .toUpperCase();

  const zone = time
    .toLocaleTimeString("en-GB", { timeZone: TIME_ZONE, timeZoneName: "short" })
    .split(" ")
    .pop();

  return `${clock} ${zone}`;
}

/**
 * My local time, ticking on the minute boundary rather than every 60s from
 * mount — otherwise the displayed minute lags by however long the page took
 * to load.
 */
export function Clock() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());

    let interval: ReturnType<typeof setInterval>;
    const msUntilNextMinute = (60 - new Date().getSeconds()) * 1000;

    const timeout = setTimeout(() => {
      setTime(new Date());
      interval = setInterval(() => setTime(new Date()), 60_000);
    }, msUntilNextMinute);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  // Rendered empty on the server: the clock is client-local by definition, so
  // any server-rendered value would be wrong and cause a hydration mismatch.
  return (
    <p className={`text-xl ${lora.className}`} suppressHydrationWarning>
      {time ? format(time) : ""}
    </p>
  );
}
