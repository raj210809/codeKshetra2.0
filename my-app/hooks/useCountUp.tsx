import { useState, useEffect } from 'react';

const useCountUp = (start: number, end: number, duration: number) => {
  const [displayValue, setDisplayValue] = useState(start);

  useEffect(() => {
    const updateInterval = 100; // Update every 200ms
    const totalSteps = duration / updateInterval;
    const stepValue = (end - start) / totalSteps;

    let currentValue = start;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      currentValue += stepValue;

      if (step >= totalSteps) {
        clearInterval(timer);
        setDisplayValue(end);
      } else {
        // Round to 8 decimal places
        setDisplayValue(Math.round(currentValue * 100000000) / 100000000);
      }
    }, updateInterval);

    return () => clearInterval(timer);
  }, [start, end, duration]);

  return displayValue;
};

export default useCountUp;