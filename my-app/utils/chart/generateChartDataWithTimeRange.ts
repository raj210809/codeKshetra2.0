 interface ChartDataPoint {
    date: Date;
    value: number;
  }
  
export function generateChartDataWithTimeRange(
  totalHours: number,
  cliffHour: number,
  totalAmount: number,
  startTime: number,
  endTime: number
): ChartDataPoint[] {
  const data: ChartDataPoint[] = [];
  const baseValue = 0;
  const cliffValue = (cliffHour / totalHours) * totalAmount;
  const maxValue = totalAmount;
  
  const startDate = new Date(startTime * 1000);
  const endDate = new Date(endTime * 1000);

  const hourlyIncrement = (endDate.getTime() - startDate.getTime()) / (totalHours * 60 * 60 * 1000);

  for (let i = 0; i <= totalHours; i++) {
    const currentDate = new Date(startDate.getTime() + i * hourlyIncrement * 60 * 60 * 1000);
    if (i < cliffHour) {
      data.push({ date: currentDate, value: baseValue });
    } else if (i === cliffHour) {
      data.push({ date: currentDate, value: baseValue });
      data.push({ date: currentDate, value: cliffValue });
    } else {
      const remainingHours = totalHours - cliffHour;
      const valueIncrement = (maxValue - cliffValue) / remainingHours;
      data.push({ date: currentDate, value: cliffValue + (i - cliffHour) * valueIncrement });
    }
  }

  return data;
}