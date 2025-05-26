import { useStreamForecast } from '@/hooks/useStreamForecast'
import React, { useMemo } from 'react'
import { StreamForecastChart } from './StreamForecastChart'



interface StreamForecastProps {
  streamId: number
  chain_id: number
  title: string
  description: string
  chartColor: string
}

const StreamForecast: React.FC<StreamForecastProps> = ({
  streamId,
  chain_id,
  title,
  description,
  chartColor,
}) => {
  const forecastData = useStreamForecast(streamId, chain_id)

  const trendPercentage = useMemo(() => {
    if (forecastData.length < 2) return 0
    const firstValue = forecastData[0].value
    const lastValue = forecastData[forecastData.length - 1].value
    return Number(((lastValue - firstValue) / firstValue * 100).toFixed(2))
  }, [forecastData])

  const dateRange = useMemo(() => {
    if (forecastData.length < 2) return ''
    const startDate = new Date(forecastData[0].date).toLocaleString('en-US', { timeZone: 'UTC', dateStyle: 'short', timeStyle: 'short' }) + ' UTC'
    const endDate = new Date(forecastData[forecastData.length - 1].date).toLocaleString('en-US', { timeZone: 'UTC', dateStyle: 'short', timeStyle: 'short' }) + ' UTC'
    return `${startDate} - ${endDate}`
  }, [forecastData])

  if (forecastData.length === 0) {
    return <div>Loading forecast data...</div>
  }

  return (
    <StreamForecastChart
      chartData={forecastData}
      title={title}
      description={description}
      trendPercentage={trendPercentage}
      dateRange={dateRange}
      chartColor={chartColor}
    />
  )
}

export default StreamForecast