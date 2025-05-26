import React, { useEffect, useMemo } from 'react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { timeToCancelationPeriod } from '@/constants/timeToCancelationPeriod';

interface ChartDataPoint {
  date: Date;
  value: number;
}

interface StreamForecastProps {
  title: string;
  description: string;
  totalAmount: number;
  chartColor: string;
  duration: number;
  startTime: number;
  endTime: number;
  isRejected: boolean;
}

function generateChartDataWithTimeRange(totalHours: number, cliffHour: number, totalAmount: number, startTime: number, endTime: number): ChartDataPoint[] {
  const data: ChartDataPoint[] = []
  const baseValue = 0
  const cliffValue = (cliffHour / totalHours) * totalAmount
  const maxValue = totalAmount
  
  const startDate = new Date(startTime * 1000)
  const endDate = new Date(endTime * 1000)

  const hourlyIncrement = (endDate.getTime() - startDate.getTime()) / (totalHours * 60 * 60 * 1000)

  for (let i = 0; i <= totalHours; i++) {
    const currentDate = new Date(startDate.getTime() + i * hourlyIncrement * 60 * 60 * 1000)
    if (i < cliffHour) {
      data.push({ date: currentDate, value: baseValue })
    } else if (i === cliffHour) {
      data.push({ date: currentDate, value: baseValue })
      data.push({ date: currentDate, value: cliffValue })
    } else {
      const remainingHours = totalHours - cliffHour
      const valueIncrement = (maxValue - cliffValue) / remainingHours
      data.push({ date: currentDate, value: cliffValue + (i - cliffHour) * valueIncrement })
    }
  }

  return data
}

export default function StreamForecastWithCliff({
  title,
  description,
  totalAmount,
  chartColor,
  duration,
  startTime,
  endTime,
  isRejected,
}: StreamForecastProps) {
  const totalHours = useMemo(() => (duration + timeToCancelationPeriod[duration]) * 24, [duration]);
  const cliffHour = useMemo(() => timeToCancelationPeriod[duration] * 24, [duration]);

  const chartData = useMemo(() => 
    generateChartDataWithTimeRange(totalHours, cliffHour, totalAmount, startTime, endTime),
    [totalHours, cliffHour, totalAmount, startTime, endTime]
  );

  const formatXAxis = (tickItem: number) => {
    const date = new Date(tickItem);
    return date.toLocaleString('en-US', { month: 'short', day: 'numeric' });
  }

  const formatYAxis = (tickItem: number) => {
    return Math.round(tickItem).toString();
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const currentTime = new Date();
      const labelDate = new Date(label);
      const isClosestToCurrent = Math.abs(labelDate.getTime() - currentTime.getTime()) < 0.5 * 60 * 60 * 1000;
  
      return (
        <div className="bg-primary-foreground p-2 border border-gray-300 rounded shadow">
          <p className="label">{`Date: ${labelDate.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`}</p>
          <p className="value">{`Tokens: ${Math.round(payload[0].value)}`}</p>
          {isClosestToCurrent && (
            <p className="current-time font-semibold text-green-500">
              Current time: {currentTime.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    console.log("StreamForecastWithCliff props:", {title, description, totalAmount, chartColor, duration, startTime, endTime});
    console.log("Generated chart data:", chartData);
  }, [title, description, totalAmount, chartColor, duration, startTime, endTime, chartData]);

  if (chartData.length === 0) {
    return <div>No data available for the chart.</div>;
  }

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex-shrink-0 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <CardTitle className="text-lg sm:text-xl">{title}</CardTitle>
            <CardDescription className="text-sm">
              {isRejected ? "This gig has been rejected" : description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col p-2 sm:p-4">
        {isRejected ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            No forecast available for rejected gigs
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300} minHeight={300}>
            <AreaChart
              data={chartData}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 0,
              }}
            >
              <XAxis 
                dataKey="date" 
                tickFormatter={formatXAxis}
                type="number"
                domain={['dataMin', 'dataMax']}
                scale="time"
                ticks={chartData
                  .filter((_, index) => index % 6 === 0)
                  .map(point => point.date.getTime())}
              />
              <YAxis tickFormatter={formatYAxis} domain={[0, totalAmount]} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="stepAfter" dataKey="value" stroke={chartColor} fill={chartColor} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}