import React, { useState, useEffect } from 'react';

interface CountUpProps {
  initialValue: number;
  maxValue: number;
  dueDate: Date;
}

const CountUp: React.FC<CountUpProps> = ({ initialValue, maxValue, dueDate }) => {
  const [currentValue, setCurrentValue] = useState(initialValue);

  useEffect(() => {
    const now = new Date();
    const timeDifference = dueDate.getTime() - now.getTime();
    
    // If due date has passed, set to max value
    if (timeDifference <= 0) {
      setCurrentValue(maxValue);
      return;
    }

    const totalIncrease = maxValue - initialValue;
    const incrementPerMs = totalIncrease / timeDifference;

    const timer = setInterval(() => {
      setCurrentValue((prevValue) => {
        const newValue = prevValue + incrementPerMs * 50; // Increase every 50ms for more noticeable change
        return newValue > maxValue ? maxValue : newValue;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [initialValue, maxValue, dueDate]);

  return (
    <div className="text-4xl font-bold">
      {currentValue} {/* Increased to 4 decimal places */}
    </div>
  );
};

export default CountUp;