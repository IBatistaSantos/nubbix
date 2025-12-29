import { EventTypeValue } from "../vo/EventType";
import { TicketSalesStatusValue } from "../vo/TicketSales";

export interface EventFilters {
  tags?: string[];
  type?: EventTypeValue;
  ticketSalesEnabled?: boolean;
  ticketSalesStatus?: TicketSalesStatusValue;
}
