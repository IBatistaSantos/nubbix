export const TicketSalesStatusValue = {
  OPEN: "open",
  CLOSED: "closed",
} as const;

export type TicketSalesStatusValue =
  (typeof TicketSalesStatusValue)[keyof typeof TicketSalesStatusValue];

export interface TicketSalesProps {
  enabled: boolean;
  status: TicketSalesStatusValue;
}

export class TicketSales {
  private _enabled: boolean;
  private _status: TicketSalesStatusValue;

  private constructor(props: TicketSalesProps) {
    this._enabled = props.enabled;
    this._status = props.status;
  }

  static create(props: TicketSalesProps): TicketSales {
    return new TicketSales(props);
  }

  static disabled(): TicketSales {
    return new TicketSales({
      enabled: false,
      status: TicketSalesStatusValue.CLOSED,
    });
  }

  static enabled(status: TicketSalesStatusValue = TicketSalesStatusValue.OPEN): TicketSales {
    return new TicketSales({
      enabled: true,
      status,
    });
  }

  get enabled() {
    return this._enabled;
  }

  get status() {
    return this._status;
  }

  isOpen(): boolean {
    return this._enabled && this._status === TicketSalesStatusValue.OPEN;
  }

  isClosed(): boolean {
    return !this._enabled || this._status === TicketSalesStatusValue.CLOSED;
  }

  toJSON() {
    return {
      enabled: this._enabled,
      status: this._status,
    };
  }
}
