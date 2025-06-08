import { TIMEZONE } from "@/constants/timezone";
import { fromZonedTime, toZonedTime } from "date-fns-tz";

export const convertDateToTz = (date: Date): Date => {
    const convertedDate = toZonedTime(fromZonedTime(date, "UTC"), TIMEZONE);

    return convertedDate;
};
