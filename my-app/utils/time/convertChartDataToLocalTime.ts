import { parseISO, format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

interface ChartDataItem {
  date: string;
  expectedAmount: number;
  invoicesSent: number;
}

export function convertChartDataToLocalTime(data: ChartDataItem[]): ChartDataItem[] {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return data.map(item => ({
    ...item,
    date: format(toZonedTime(parseISO(item.date), userTimeZone), 'yyyy-MM-dd')
  }));
}