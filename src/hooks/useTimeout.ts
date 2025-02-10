import { useState, useEffect, useCallback } from 'react';

export function useTimeout(initialSeconds: number = 60) {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const start = useCallback(() => {
    setSeconds(initialSeconds);
    setIsActive(true);
  }, [initialSeconds]);

  const stop = useCallback(() => {
    setIsActive(false);
    setSeconds(0);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((current) => {
          if (current <= 1) {
            setIsActive(false);
            return 0;
          }
          return current - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, seconds]);

  return {
    seconds,
    isActive,
    start,
    stop,
  };
} 