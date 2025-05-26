import React, { useEffect, useState } from 'react';
import useCountUp from '@/hooks/useCountUp';
import { Progress } from "@/components/ui/progress";
import { formatEther } from 'viem';

interface TokenDisplayProps {
  maxValue: number;
  tokenSymbol: string;
  startTime: number;
  endTime: number;
  wasCanceled: boolean;
  refundedAmount: bigint;
  withdrawnAmount: number;
}

const TokenDisplay: React.FC<TokenDisplayProps> = ({ 
  maxValue, 
  tokenSymbol, 
  endTime, 
  startTime, 
  wasCanceled,
  refundedAmount,
  withdrawnAmount
}) => {
  const totalDuration = endTime - startTime;
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    if (wasCanceled) {
      // If canceled, calculate the final streamed amount using the refunded amount
      const refundedEther = Number(formatEther(refundedAmount));
      const finalStreamedAmount = maxValue - refundedEther;
      setCurrentValue(finalStreamedAmount);
    } else {
      // If not canceled, update currentValue periodically
      const interval = setInterval(() => {
        const elapsedTime = Math.max(Date.now() / 1000 - startTime, 0);
        const percentageElapsed = Math.min((elapsedTime / totalDuration) * 100, 100);
        setCurrentValue(maxValue * (percentageElapsed / 100));
      }, 1000); // Update every second

      return () => clearInterval(interval);
    }
  }, [wasCanceled, startTime, endTime, totalDuration, maxValue, refundedAmount]);

  const remainingDuration = wasCanceled ? 0 : Math.max(endTime - Date.now() / 1000, 0);
  
  // Use the hook with the calculated values
  // Correct usage: Always call the hook
  const countUpValue = useCountUp(currentValue, maxValue, remainingDuration * 1000);
  
  // Then use the result conditionally
  const displayValue = wasCanceled ? currentValue : countUpValue;
  const displayValueCanceled = currentValue;

  
  const streamedPercentage = (currentValue / maxValue) * 100;
  const withdrawnPercentage = (withdrawnAmount / maxValue) * 100;


  // Format the number with exactly 8 decimal places
  const formattedNumber = (wasCanceled ? displayValueCanceled : displayValue).toFixed(8);


  // Split the number into integer and decimal parts
  const [integerPart, decimalPart] = formattedNumber.split('.');

  // Function to render the integer part with grayed out leading zeros
  const renderIntegerPart = () => {
    const paddedInteger = integerPart.padStart(3, '0');
    return paddedInteger.split('').map((digit, index) => (
      <span key={index} className={
        index < paddedInteger.length - integerPart.length
          ? "text-gray-400 dark:text-gray-500"
          : "text-gray-800 dark:text-gray-200"
      }>
        {digit}
      </span>
    ));
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8 p-8 rounded-2xl shadow-lg
                    bg-gradient-to-br from-white via-gray-100 to-gray-100
                    dark:from-gray-800 dark:via-gray-900 dark:to-gray-900
                    border border-gray-200 dark:border-gray-700
                    transition-all duration-300 ease-in-out
                    hover:shadow-xl hover:scale-105">
      {/* Big beautiful number */}
      <div className="text-5xl lg:text-7xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-gray-600 to-zinc-600 dark:from-gray-300 dark:to-zinc-300">
        {renderIntegerPart()}.
        <span className="text-2xl lg:text-4xl">{decimalPart}</span>
      </div>
      
      <div className="w-full max-w-md space-y-6">
        {/* Amount Streamed Progress Bar */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Amount Streamed</span>
            <span className="text-sm font-bold text-yellow-600 dark:text-yellow-400">{streamedPercentage.toFixed(2)}%</span>
          </div>
          <Progress value={streamedPercentage} className="h-3 bg-yellow-100 dark:bg-yellow-900 rounded-full" 
                    indicatorClassName="bg-gradient-to-r from-yellow-400 to-yellow-600 dark:from-yellow-500 dark:to-yellow-700 rounded-full" />
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-right">
            {wasCanceled ? displayValueCanceled.toFixed(4) : displayValue.toFixed(4)} / {maxValue} {tokenSymbol}
          </div>
        </div>

        {/* Amount Withdrawn Progress Bar */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Amount Withdrawn</span>
            <span className="text-sm font-bold text-green-600 dark:text-green-400">{withdrawnPercentage.toFixed(2)}%</span>
          </div>
          <Progress value={withdrawnPercentage} className="h-3 bg-green-100 dark:bg-green-900 rounded-full" 
                    indicatorClassName="bg-gradient-to-r from-green-400 to-green-600 dark:from-green-500 dark:to-green-700 rounded-full" />
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-right">
            {withdrawnAmount.toFixed(4)} / {maxValue} {tokenSymbol}
          </div>
        </div>
      </div>

      {/* Label */}
      <div className="text-center text-gray-600 dark:text-gray-400 font-medium">
  
        {wasCanceled && (
          <div className="text-red-500 dark:text-red-400 mt-2">
            Stream Canceled
            <div className="text-sm">
              Refunded: {Number(formatEther(refundedAmount)).toFixed(4)} {tokenSymbol}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenDisplay;