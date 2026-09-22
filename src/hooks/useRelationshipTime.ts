import { useEffect, useState } from 'react';
import type { TimeTogether } from '../types/memory';

function calculateTime(startDateIso: string): TimeTogether {
  const start = new Date(startDateIso).getTime();
  const now = Date.now();
  const difference = Math.max(0, now - start);

  const seconds = Math.floor((difference / 1000) % 60);
  const minutes = Math.floor((difference / (1000 * 60)) % 60);
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));

  return {
    days,
    hours,
    minutes,
    seconds,
    totalDays: days,
  };
}

export function useRelationshipTime(startDateIso: string): TimeTogether {
  const [timeTogether, setTimeTogether] = useState<TimeTogether>(() => calculateTime(startDateIso));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeTogether(calculateTime(startDateIso));
    }, 1000);

    return () => clearInterval(interval);
  }, [startDateIso]);

  return timeTogether;
}
