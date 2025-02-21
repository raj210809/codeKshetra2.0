import useCountUp from '@/hooks/useCountUp';
import React from 'react';
import { Progress } from "@/components/ui/progress";

interface TokenDisplayProps {
  maxValue: number;
  duration: number; // in milliseconds
  tokenSymbol: string;
}

const DisplayCountUp: React.FC<TokenDisplayProps> = ({ maxValue, duration, tokenSymbol }) => {
  const currentValue = useCountUp(0, maxValue, duration);
  
  const amountWithdrawn = maxValue * 0.3; // Mock value

  const streamedPercentage = (currentValue / maxValue) * 100;
  const withdrawnPercentage = (amountWithdrawn / maxValue) * 100;

  // Format the number with exactly 8 decimal places
  const formattedNumber = currentValue.toFixed(8);

  // Split the number into integer and decimal parts
  const [integerPart, decimalPart] = formattedNumber.split('.');

  // Function to render the integer part with grayed out leading zeros
  const renderIntegerPart = () => {
    const paddedInteger = integerPart.padStart(3, '0');
    return paddedInteger.split('').map((digit, index) => (
      <span key={index} className={
        index < paddedInteger.length - integerPart.length
          ? "text-gray-400"
          : "text-gray-800"
      }>
        {digit}
      </span>
    ));
  };


  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center space-y-8 p-8 rounded-2xl
                    transition-all duration-300 ease-out
                    transform-gpu blur-[1px] group-hover:blur-[0.5px] group-hover:scale-100 mb-20">
      {/* Big beautiful number */}
      <div className="text-5xl md:text-6xl lg:text-5xl xl:text-7xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-gray-600 to-zinc-600">
        {renderIntegerPart()}.
        <span className="text-4xl">{decimalPart}</span>
      </div>
      
      {/* Label */}
     
    </div>
  );
};

export default DisplayCountUp;