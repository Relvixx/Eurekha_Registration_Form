"use client";

import { useEffect, useState } from 'react';

interface CountdownTimerProps {
  deadline: string;
}

export default function CountdownTimer({ deadline }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    const target = new Date(deadline).getTime();

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        // If time is up, refresh the page to trigger the server component's closed state
        window.location.reload();
        return null;
      }

      return {
        hours: Math.floor((difference / (1000 * 60 * 60))),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [deadline]);

  if (!timeLeft) return null; // Avoid hydration mismatch and loading state

  return (
    <div className="flex flex-col items-center justify-center p-4 mb-6 bg-[#FF1744]/10 border border-[#FF1744]/20 rounded-2xl mx-auto w-full max-w-lg shadow-lg shadow-[#FF1744]/5 animate-in fade-in zoom-in duration-500">
      <div className="text-[#FF1744] text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF1744] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF1744]"></span>
        </span>
        Registrations Closing In
      </div>
      
      <div className="flex items-center gap-4 text-white font-mono text-3xl font-bold">
        <div className="flex flex-col items-center w-16">
          <span className="bg-[#121212] border border-white/10 rounded-lg w-full text-center py-2 shadow-inner">
            {timeLeft.hours.toString().padStart(2, '0')}
          </span>
          <span className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider font-sans">Hours</span>
        </div>
        <span className="text-gray-600 pb-5">:</span>
        <div className="flex flex-col items-center w-16">
          <span className="bg-[#121212] border border-white/10 rounded-lg w-full text-center py-2 shadow-inner">
            {timeLeft.minutes.toString().padStart(2, '0')}
          </span>
          <span className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider font-sans">Mins</span>
        </div>
        <span className="text-gray-600 pb-5">:</span>
        <div className="flex flex-col items-center w-16">
          <span className="bg-[#121212] border border-white/10 rounded-lg w-full text-center py-2 text-[#FF1744] shadow-inner">
            {timeLeft.seconds.toString().padStart(2, '0')}
          </span>
          <span className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider font-sans">Secs</span>
        </div>
      </div>
    </div>
  );
}
