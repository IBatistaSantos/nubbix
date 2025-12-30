import { ValidationError, ID } from "@nubbix/domain";
import { isBefore, startOfDay, parseISO } from "date-fns";

export interface EventDateProps {
  id?: string | ID;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  finished: boolean;
  finishedAt: string | null; // ISO string
}

export class EventDate {
  private readonly _id: ID;
  private _date: string;
  private _startTime: string;
  private _endTime: string;
  private _finished: boolean;
  private _finishedAt: string | null;

  private constructor(props: EventDateProps) {
    this._id = props.id instanceof ID ? props.id : ID.create(props.id);
    this._date = props.date;
    this._startTime = props.startTime;
    this._endTime = props.endTime;
    this._finished = props.finished;
    this._finishedAt = props.finishedAt;
  }

  static validateDates(dates: string[]): void {
    const today = startOfDay(new Date());
    const pastDates: string[] = [];

    for (const date of dates) {
      const eventDate = parseISO(date);
      const eventDateStartOfDay = startOfDay(eventDate);

      if (isBefore(eventDateStartOfDay, today)) {
        pastDates.push(date);
      }
    }

    if (pastDates.length > 0) {
      throw new ValidationError("Cannot create or update event dates in the past", [
        {
          path: "dates[].date",
          message: "Cannot create or update event dates in the past",
        },
      ]);
    }
  }

  static create(props: EventDateProps): EventDate {
    const errors: Array<{ path: string; message: string }> = [];

    // Validar formato de data (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!props.date || !dateRegex.test(props.date)) {
      errors.push({
        path: "dates[].date",
        message: "Date must be in YYYY-MM-DD format",
      });
    }

    // Validar formato de hora (HH:mm)
    const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
    if (!props.startTime || !timeRegex.test(props.startTime)) {
      errors.push({
        path: "dates[].startTime",
        message: "Start time must be in HH:mm format",
      });
    }

    if (!props.endTime || !timeRegex.test(props.endTime)) {
      errors.push({
        path: "dates[].endTime",
        message: "End time must be in HH:mm format",
      });
    }

    // Validar que startTime < endTime
    if (props.startTime && props.endTime) {
      const [startHours, startMinutes] = props.startTime.split(":").map(Number);
      const [endHours, endMinutes] = props.endTime.split(":").map(Number);
      const startTotal = startHours * 60 + startMinutes;
      const endTotal = endHours * 60 + endMinutes;

      if (startTotal >= endTotal) {
        errors.push({
          path: "dates[].startTime",
          message: "Start time must be less than end time",
        });
      }
    }

    // Validar consistência de finalização
    if (props.finished && !props.finishedAt) {
      errors.push({
        path: "dates[].finishedAt",
        message: "finishedAt is required when finished is true",
      });
    }

    if (!props.finished && props.finishedAt !== null) {
      errors.push({
        path: "dates[].finishedAt",
        message: "finishedAt must be null when finished is false",
      });
    }

    if (errors.length > 0) {
      throw new ValidationError("EventDate validation failed", errors);
    }

    return new EventDate(props);
  }

  get id() {
    return this._id;
  }

  get date() {
    return this._date;
  }

  get startTime() {
    return this._startTime;
  }

  get endTime() {
    return this._endTime;
  }

  get finished() {
    return this._finished;
  }

  get finishedAt() {
    return this._finishedAt;
  }

  isFinished(): boolean {
    return this._finished;
  }

  validate(): void {
    const errors: Array<{ path: string; message: string }> = [];

    // Validar formato de data (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!this._date || !dateRegex.test(this._date)) {
      errors.push({
        path: "dates[].date",
        message: "Date must be in YYYY-MM-DD format",
      });
    }

    // Validar formato de hora (HH:mm)
    const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
    if (!this._startTime || !timeRegex.test(this._startTime)) {
      errors.push({
        path: "dates[].startTime",
        message: "Start time must be in HH:mm format",
      });
    }

    if (!this._endTime || !timeRegex.test(this._endTime)) {
      errors.push({
        path: "dates[].endTime",
        message: "End time must be in HH:mm format",
      });
    }

    // Validar que startTime < endTime
    if (this._startTime && this._endTime) {
      const [startHours, startMinutes] = this._startTime.split(":").map(Number);
      const [endHours, endMinutes] = this._endTime.split(":").map(Number);
      const startTotal = startHours * 60 + startMinutes;
      const endTotal = endHours * 60 + endMinutes;

      if (startTotal >= endTotal) {
        errors.push({
          path: "dates[].startTime",
          message: "Start time must be less than end time",
        });
      }
    }

    // Validar consistência de finalização
    if (this._finished && !this._finishedAt) {
      errors.push({
        path: "dates[].finishedAt",
        message: "finishedAt is required when finished is true",
      });
    }

    if (!this._finished && this._finishedAt !== null) {
      errors.push({
        path: "dates[].finishedAt",
        message: "finishedAt must be null when finished is false",
      });
    }

    if (errors.length > 0) {
      throw new ValidationError("EventDate validation failed", errors);
    }
  }

  finish(): EventDate {
    if (this._finished) {
      throw new ValidationError("Cannot finish an already finished date", [
        {
          path: "dates[].finished",
          message: "Date is already finished",
        },
      ]);
    }

    return new EventDate({
      id: this._id,
      date: this._date,
      startTime: this._startTime,
      endTime: this._endTime,
      finished: true,
      finishedAt: new Date().toISOString(),
    });
  }

  equals(other: EventDate): boolean {
    return this._id.equals(other._id);
  }

  hasSameDateTime(other: EventDate): boolean {
    return (
      this._date === other._date &&
      this._startTime === other._startTime &&
      this._endTime === other._endTime
    );
  }

  toJSON() {
    return {
      id: this._id.value,
      date: this._date,
      startTime: this._startTime,
      endTime: this._endTime,
      finished: this._finished,
      finishedAt: this._finishedAt,
    };
  }
}
