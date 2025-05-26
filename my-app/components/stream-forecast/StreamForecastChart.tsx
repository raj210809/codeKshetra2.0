import React from 'react'
import { Area, AreaChart, CartesianGrid, XAxis, ResponsiveContainer } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface ChartDataPoint {
  date: string;
  value: number;
}

interface StreamForecastProps {
  chartData: ChartDataPoint[];
  title: string;
  description: string;
  trendPercentage: number;
  dateRange: string;
  chartColor: string;
}

const chartConfig: ChartConfig = {
  value: {
    label: "Value",
    color: "hsl(var(--chart-1))",
  },
}

export function StreamForecastChart({
  chartData,
  title,
  description,
  trendPercentage,
  dateRange,
  chartColor
}: StreamForecastProps) {
  return (
    <Card className=" flex flex-col">
      <CardHeader className="flex-shrink-0">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription className="text-sm">
              {dateRange}
            </CardDescription>
          </div>
          <div className="text-sm text-right">
        
            {/* <div className="text-muted-foreground">{dateRange}</div> */}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <ChartContainer config={chartConfig} className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 10,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={1}
                tick={false}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Area
                dataKey="value"
                type="monotone"
                fill={chartColor}
                fillOpacity={0.4}
                stroke={chartColor}
                strokeWidth={2}
                strokeDasharray="3 3"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}