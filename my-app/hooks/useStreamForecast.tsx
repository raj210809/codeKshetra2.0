import { useState, useEffect } from 'react';
import { useReadContract } from 'wagmi';
import { contracts, ValidChainId } from '@/utils/contracts/contracts';
import { formatEther } from 'viem';
import { StreamData } from '@/types/types';
import { abi } from '@/abi/SablierLinear';

interface ForecastDataPoint {
  date: string;
  value: number;  // Changed from 'amount' to 'value'
}

export const useStreamForecast = (streamId: number, chain_id: number) => {
  const [forecastData, setForecastData] = useState<ForecastDataPoint[]>([]);

  const { data: streamData } = useReadContract({
    address: contracts[chain_id as ValidChainId].sablierLinearV2LockUpAddress,
    abi: abi,
    functionName: 'getStream',
    args: [streamId],
    chainId: chain_id
  });

  useEffect(() => {
    if (streamData) {
      const typedStreamData = streamData as StreamData;
      const startTime = Number(typedStreamData.startTime);
      const endTime = Number(typedStreamData.endTime);
      const totalAmount = Number(formatEther(typedStreamData.amounts.deposited));

      const durationInSeconds = endTime - startTime;
      const amountPerSecond = totalAmount / durationInSeconds;

      const forecast: ForecastDataPoint[] = [];
      const numberOfPoints = 30; // Adjust this to change the granularity of the forecast

      for (let i = 0; i <= numberOfPoints; i++) {
        const currentTime = startTime + (i / numberOfPoints) * durationInSeconds;
        const currentAmount = amountPerSecond * (currentTime - startTime);

        forecast.push({
          date: new Date(currentTime * 1000).toISOString().replace('T', ' ').slice(0, 19) + ' UTC', // Format as YYYY-MM-DD HH:mm:ss UTC
          value: Number(currentAmount.toFixed(2))  // Changed from 'amount' to 'value'
        });
      }

      setForecastData(forecast);
    }
  }, [streamData]);

  return forecastData;
};