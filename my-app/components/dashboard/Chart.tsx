"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { useAccount } from 'wagmi'

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
import { InvoiceChartSkeleton } from "./InvoiceChartSkeleton"
import supabaseUTCToLocalTime from "@/utils/time/supabaseUTCToLocalTime"
import { useToast } from "../ui/use-toast"
import { convertChartDataToLocalTime } from "@/utils/time/convertChartDataToLocalTime"

export const description = "Summary"

const chartConfig = {
  views: {
    label: "Amount",
  },
  expectedAmount: {
    label: "Expected Amount",
    color: "hsl(168, 100%, 46%)",
  },
  invoicesSent: {
    label: "Invoices sent",
    color: "hsl(238, 84%, 50%)",
  },
} satisfies ChartConfig

export function InvoiceChart() {
  const [activeChart, setActiveChart] = React.useState<keyof typeof chartConfig>("expectedAmount")
  const [chartData, setChartData] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const { address } = useAccount()

  const {toast} = useToast();


  React.useEffect(() => {
    const fetchData = async () => {
      if (!address) return
      
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/invoice-chart-data?user_address=${address}`)
        if (!response.ok) throw new Error('Failed to fetch data')
        const data = await response.json()
        const localTimeData = convertChartDataToLocalTime(data)
        console.log('----DATA FOR CHART---')
        console.log(localTimeData)
        setChartData(localTimeData)
      } catch (err: any) {
        setError('Error fetching chart data')
        toast({
          title: 'Error fetching chart data',
          description: err.message as string,
          variant: 'destructive'
        })
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [address])

  const total = React.useMemo(
    () => ({
      expectedAmount: chartData.reduce((acc, curr) => acc + curr.expectedAmount, 0),
      invoicesSent: chartData.reduce((acc, curr) => acc + curr.invoicesSent, 0),
    }),
    [chartData]
  )

  if (loading) return <InvoiceChartSkeleton />
  if (error) return <div>Error: {error}</div>

  return (
    <Card className="my-4 mb-8">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Summary</CardTitle>
          <CardDescription>
          <span className="text-muted-foreground text-xs opacity-50 ">Based on invoices sent due date</span>
          </CardDescription>
        </div>
        <div className="flex">
          {["expectedAmount"].map((key) => {
            const chart = key as keyof typeof chartConfig
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  ${total[key as keyof typeof total].toLocaleString()} 
                </span>
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                return supabaseUTCToLocalTime(value);
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="amount"
                  labelFormatter={(value) => {
                    return supabaseUTCToLocalTime(value)
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}