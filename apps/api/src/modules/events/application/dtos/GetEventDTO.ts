export interface GetEventOutput {
  id: string;
  accountId: string;
  name: string;
  description: string;
  type: string;
  url: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string | null;
    country: string;
  } | null;
  maxCapacity: number | null;
  ticketSales: {
    enabled: boolean;
    status: string;
  };
  tags: string[];
  dates: Array<{
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    finished: boolean;
    finishedAt: string | null;
  }>;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
