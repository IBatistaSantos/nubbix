import { EventDate } from "../../domain/vo/EventDate";

export function sortEventDates(dates: EventDate[]): EventDate[] {
  const activeDates: EventDate[] = [];
  const finishedDates: EventDate[] = [];

  for (const date of dates) {
    if (date.isFinished()) {
      finishedDates.push(date);
    } else {
      activeDates.push(date);
    }
  }

  const compareDates = (a: EventDate, b: EventDate): number => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA.getTime() - dateB.getTime();
  };

  activeDates.sort(compareDates);
  finishedDates.sort(compareDates);

  return [...activeDates, ...finishedDates];
}
