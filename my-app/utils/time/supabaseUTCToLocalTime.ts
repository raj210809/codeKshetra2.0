import { format, toZonedTime } from "date-fns-tz";

export default function supabaseUTCToLocalTime(dateParam: string) {
    const date = new Date(dateParam);
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const zonedDate = toZonedTime(date, userTimeZone);
    const formattedDate = format(zonedDate, 'MMM dd, yyyy', { timeZone: userTimeZone });
    return formattedDate;
}