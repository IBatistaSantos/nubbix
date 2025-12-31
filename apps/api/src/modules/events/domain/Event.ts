import { BaseEntity, BaseProps, ValidationError, ID } from "@nubbix/domain";
import { faker } from "@faker-js/faker";
import { EventType, Address, TicketSales, EventDate, EventUrl, type EventDateProps } from "./vo";

interface EventProps extends BaseProps {
  accountId: string;
  name: string;
  description: string;
  type: EventType;
  url: string;
  address?: Address | null;
  maxCapacity?: number | null;
  ticketSales: TicketSales;
  tags?: string[];
  dates: EventDate[];
}

interface EventUpdateData {
  name?: string;
  description?: string;
  type?: EventType;
  address?: Address | null;
  maxCapacity?: number | null;
  ticketSales?: TicketSales;
  tags?: string[];
}

export class Event extends BaseEntity {
  private readonly _accountId: string;
  private _name: string;
  private _description: string;
  private _type: EventType;
  private _url: EventUrl;
  private _address: Address | null;
  private _maxCapacity: number | null;
  private _ticketSales: TicketSales;
  private _tags: string[];
  private _dates: EventDate[];

  constructor(props: EventProps) {
    super(props);
    this._accountId = props.accountId;
    this._name = props.name;
    this._description = props.description;
    this._type = props.type;
    this._url = EventUrl.create(props.url);
    this._address = props.address ?? null;
    this._maxCapacity = props.maxCapacity ?? null;
    this._ticketSales = props.ticketSales;
    this._tags = props.tags ?? [];
    this._dates = props.dates ?? [];
  }

  get accountId() {
    return this._accountId;
  }

  get name() {
    return this._name;
  }

  get description() {
    return this._description;
  }

  get type() {
    return this._type;
  }

  get url() {
    return this._url;
  }

  get address() {
    return this._address;
  }

  get maxCapacity() {
    return this._maxCapacity;
  }

  get ticketSales() {
    return this._ticketSales;
  }

  get tags() {
    return this._tags;
  }

  get dates() {
    return this._dates;
  }

  validate(): void {
    const errors: Array<{ path: string; message: string }> = [];

    // Validar accountId
    if (!this._accountId || this._accountId.trim().length === 0) {
      errors.push({
        path: "accountId",
        message: "AccountId is required",
      });
    }

    // Validar name
    if (!this._name || this._name.trim().length === 0) {
      errors.push({
        path: "name",
        message: "Name is required",
      });
    }

    if (this._name && this._name.length > 255) {
      errors.push({
        path: "name",
        message: "Name cannot exceed 255 characters",
      });
    }

    // Validar type
    if (!this._type) {
      errors.push({
        path: "type",
        message: "Type is required",
      });
    }

    // Validar maxCapacity
    if (this._maxCapacity !== null && this._maxCapacity !== undefined) {
      if (!Number.isInteger(this._maxCapacity) || this._maxCapacity <= 0) {
        errors.push({
          path: "maxCapacity",
          message: "Max capacity must be a positive integer",
        });
      }
    }

    // Validar tags
    if (this._tags && this._tags.length > 30) {
      errors.push({
        path: "tags",
        message: "Tags cannot exceed 30 items",
      });
    }

    // Remover duplicados de tags
    const uniqueTags = Array.from(new Set(this._tags));
    if (uniqueTags.length !== this._tags.length) {
      errors.push({
        path: "tags",
        message: "Tags cannot contain duplicates",
      });
    }

    // Validar dates
    if (!this._dates || this._dates.length === 0) {
      errors.push({
        path: "dates",
        message: "At least one date is required",
      });
    }

    // Validar duplicidade de (date, startTime, endTime)
    const dateTimeKeys = new Set<string>();
    for (const date of this._dates) {
      const key = `${date.date}-${date.startTime}-${date.endTime}`;
      if (dateTimeKeys.has(key)) {
        errors.push({
          path: "dates",
          message: "Cannot have duplicate date, startTime, and endTime combinations",
        });
        break;
      }
      dateTimeKeys.add(key);
    }

    // Validar cada date individualmente
    this._dates.forEach((date, index) => {
      try {
        date.validate();
      } catch (error) {
        if (error instanceof ValidationError) {
          error.details.forEach((err) => {
            errors.push({
              path: `dates[${index}].${err.path}`,
              message: err.message,
            });
          });
        }
      }
    });

    if (errors.length > 0) {
      throw new ValidationError("Event validation failed", errors);
    }
  }

  update(props: EventUpdateData): void {
    if (this.status.isInactive()) {
      throw new ValidationError("Cannot update inactive event", [
        {
          path: "status",
          message: "Cannot update inactive event",
        },
      ]);
    }

    if (props.name !== undefined) {
      this._name = props.name;
    }

    if (props.description !== undefined) {
      this._description = props.description;
    }

    if (props.type !== undefined) {
      this._type = props.type;
    }

    if (props.address !== undefined) {
      this._address = props.address;
    }

    if (props.maxCapacity !== undefined) {
      if (
        props.maxCapacity !== null &&
        (props.maxCapacity <= 0 || !Number.isInteger(props.maxCapacity))
      ) {
        throw new ValidationError("Max capacity must be a positive integer or null", [
          {
            path: "maxCapacity",
            message: "Max capacity must be a positive integer or null",
          },
        ]);
      }
      this._maxCapacity = props.maxCapacity;
    }

    if (props.ticketSales !== undefined) {
      this._ticketSales = props.ticketSales;
    }

    if (props.tags !== undefined) {
      // Remover duplicados
      const uniqueTags = Array.from(new Set(props.tags));
      if (uniqueTags.length > 30) {
        throw new ValidationError("Tags cannot exceed 30 items", [
          {
            path: "tags",
            message: "Tags cannot exceed 30 items",
          },
        ]);
      }
      this._tags = uniqueTags;
    }

    this._updatedAt = new Date();
    this.validate();
  }

  addDate(dateProps: EventDateProps): void {
    if (this.status.isInactive()) {
      throw new ValidationError("Cannot add date to inactive event", [
        {
          path: "status",
          message: "Cannot add date to inactive event",
        },
      ]);
    }

    EventDate.validateDates([dateProps.date]);

    const newDate = EventDate.create(dateProps);

    // Verificar duplicidade de (date, startTime, endTime)
    const duplicate = this._dates.find((date) => date.hasSameDateTime(newDate));

    if (duplicate) {
      throw new ValidationError("Cannot add duplicate date, startTime, and endTime combination", [
        {
          path: "dates",
          message: "Cannot add duplicate date, startTime, and endTime combination",
        },
      ]);
    }

    this._dates.push(newDate);
    this._updatedAt = new Date();
    this.validate();
  }

  updateDate(
    dateId: string | ID,
    updates: Partial<Omit<EventDateProps, "id" | "finished" | "finishedAt">>
  ): void {
    if (this.status.isInactive()) {
      throw new ValidationError("Cannot update date in inactive event", [
        {
          path: "status",
          message: "Cannot update date in inactive event",
        },
      ]);
    }

    const targetId = dateId instanceof ID ? dateId : ID.create(dateId);
    const dateIndex = this._dates.findIndex((date) => date.id.equals(targetId));
    if (dateIndex === -1) {
      throw new ValidationError("Date not found", [
        {
          path: "dates[].id",
          message: "Date not found",
        },
      ]);
    }

    const existingDate = this._dates[dateIndex];

    // Não permitir atualizar data finalizada
    if (existingDate.isFinished()) {
      throw new ValidationError("Cannot update finished date", [
        {
          path: "dates[].finished",
          message: "Cannot update finished date",
        },
      ]);
    }

    if (updates.date) {
      EventDate.validateDates([updates.date]);
    }

    // Criar nova data com as atualizações
    const updatedDate = EventDate.create({
      id: existingDate.id,
      date: updates.date ?? existingDate.date,
      startTime: updates.startTime ?? existingDate.startTime,
      endTime: updates.endTime ?? existingDate.endTime,
      finished: existingDate.finished,
      finishedAt: existingDate.finishedAt,
    });

    // Verificar duplicidade com outras datas (exceto a própria)
    const duplicate = this._dates.find(
      (date, index) => index !== dateIndex && date.hasSameDateTime(updatedDate)
    );

    if (duplicate) {
      throw new ValidationError(
        "Cannot update to duplicate date, startTime, and endTime combination",
        [
          {
            path: "dates",
            message: "Cannot update to duplicate date, startTime, and endTime combination",
          },
        ]
      );
    }

    this._dates[dateIndex] = updatedDate;
    this._updatedAt = new Date();
    this.validate();
  }

  removeDate(dateId: string | ID): void {
    if (this.status.isInactive()) {
      throw new ValidationError("Cannot remove date from inactive event", [
        {
          path: "status",
          message: "Cannot remove date from inactive event",
        },
      ]);
    }

    const targetId = dateId instanceof ID ? dateId : ID.create(dateId);
    const dateIndex = this._dates.findIndex((date) => date.id.equals(targetId));
    if (dateIndex === -1) {
      throw new ValidationError("Date not found", [
        {
          path: "dates[].id",
          message: "Date not found",
        },
      ]);
    }

    const date = this._dates[dateIndex];

    // Não permitir remover data finalizada
    if (date.isFinished()) {
      throw new ValidationError("Cannot remove finished date", [
        {
          path: "dates[].finished",
          message: "Cannot remove finished date",
        },
      ]);
    }

    // Não permitir remover se for a última data
    if (this._dates.length === 1) {
      throw new ValidationError("Cannot remove the last date", [
        {
          path: "dates",
          message: "Event must have at least one date",
        },
      ]);
    }

    this._dates.splice(dateIndex, 1);
    this._updatedAt = new Date();
    this.validate();
  }

  finishDate(dateId: string | ID): void {
    if (this.status.isInactive()) {
      throw new ValidationError("Cannot finish date in inactive event", [
        {
          path: "status",
          message: "Cannot finish date in inactive event",
        },
      ]);
    }

    const targetId = dateId instanceof ID ? dateId : ID.create(dateId);
    const dateIndex = this._dates.findIndex((date) => date.id.equals(targetId));
    if (dateIndex === -1) {
      throw new ValidationError("Date not found", [
        {
          path: "dates[].id",
          message: "Date not found",
        },
      ]);
    }

    const existingDate = this._dates[dateIndex];

    if (existingDate.isFinished()) {
      throw new ValidationError("Date is already finished", [
        {
          path: "dates[].finished",
          message: "Date is already finished",
        },
      ]);
    }

    this._dates[dateIndex] = existingDate.finish();
    this._updatedAt = new Date();
  }

  canSellTickets(): boolean {
    return this.status.isActive() && this._ticketSales.enabled && this._ticketSales.isOpen();
  }

  hasUnlimitedCapacity(): boolean {
    return this._maxCapacity === null || this._maxCapacity === undefined;
  }

  static asFaker(overrides?: Partial<EventProps>): Event {
    const baseProps = this.generateBaseFakerProps();
    const eventName = faker.company.catchPhrase();
    const eventUrl = faker.helpers.slugify(eventName).toLowerCase();

    return new Event({
      ...baseProps,
      accountId: ID.create().value,
      name: eventName,
      description: faker.lorem.paragraph(),
      type: EventType.digital(),
      url: eventUrl,
      address: null,
      maxCapacity: faker.number.int({ min: 10, max: 1000 }),
      ticketSales: TicketSales.enabled(),
      tags: faker.helpers.arrayElements(
        ["tech", "business", "networking", "education", "workshop"],
        { min: 0, max: 5 }
      ),
      dates: [
        EventDate.create({
          id: ID.create(),
          date: faker.date.future().toISOString().split("T")[0],
          startTime: "10:00",
          endTime: "12:00",
          finished: false,
          finishedAt: null,
        }),
      ],
      ...overrides,
    });
  }

  toJSON() {
    return {
      ...super.toJSON(),
      accountId: this._accountId,
      name: this._name,
      description: this._description,
      type: this._type.value,
      url: this._url.value,
      address: this._address?.toJSON() ?? null,
      maxCapacity: this._maxCapacity,
      ticketSales: this._ticketSales.toJSON(),
      tags: this._tags,
      dates: this._dates.map((date) => date.toJSON()),
    };
  }
}
