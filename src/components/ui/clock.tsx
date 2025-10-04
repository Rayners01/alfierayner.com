'use client';

import { Lora } from 'next/font/google';
import { useEffect, useState, useRef } from 'react';

const lora = Lora({
  subsets: ['latin']
})

export default function Clock() {
  const [time, setTime] = useState(() => new Date());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const tick = () => setTime(new Date());

    tick();

    const now = new Date();
    const delay = (60 - now.getSeconds()) * 1000;

    timeoutRef.current = setTimeout(() => {
      tick();
      intervalRef.current = setInterval(tick, 60_000);
    }, delay);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const formattedTime = time.toLocaleTimeString('en-GB', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    timeZone: 'Europe/London',
  }).toUpperCase();

  const tzName = time.toLocaleTimeString('en-GB', {
    timeZone: 'Europe/London',
    timeZoneName: 'short',
  }).split(' ').pop(); 

  return (
    <p className={`text-xl ${lora.className}`}>
      {formattedTime} {tzName}
    </p>
  );
}
