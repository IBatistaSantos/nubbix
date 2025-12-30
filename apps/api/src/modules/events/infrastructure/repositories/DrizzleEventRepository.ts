import { ID, Status, StatusValue, PaginationResult, PaginationParams, TransactionContext } from "@nubbix/domain";
import { eq, and, isNull, sql, desc } from "drizzle-orm";
import { BaseDrizzleRepository } from "../../../../shared/infrastructure/repositories/BaseDrizzleRepository";
import { events, eventDates } from "../../../../shared/infrastructure/db";
import { Event } from "../../domain/Event";
import { EventRepository } from "../../domain/repository/EventRepository";
import { EventFilters } from "../../domain/repository/EventFilters";
import { EventUrl } from "../../domain/vo/EventUrl";
import { EventType } from "../../domain/vo/EventType";
import { Address } from "../../domain/vo/Address";
import { TicketSales } from "../../domain/vo/TicketSales";
import { EventDate } from "../../domain/vo/EventDate";


type EventSchema = typeof events.$inferSelect;
type EventDateSchema = typeof eventDates.$inferSelect;

export class DrizzleEventRepository
  extends BaseDrizzleRepository<Event, EventSchema>
  implements EventRepository
{
  protected getTable() {
    return events;
  }

  protected toDomain(schema: EventSchema): Event {
    // Este método será sobrescrito para incluir as datas
    const status = schema.status === StatusValue.ACTIVE ? Status.active() : Status.inactive();

    return new Event({
      id: schema.id,
      accountId: schema.accountId,
      name: schema.name,
      description: schema.description ?? "",
      type: EventType.fromValue(schema.type as any),
      url: schema.url,
      address: schema.address ? Address.create(schema.address) : null,
      maxCapacity: schema.maxCapacity ?? null,
      ticketSales: schema.ticketSales ? TicketSales.create(schema.ticketSales as any) : TicketSales.disabled(),
      tags: schema.tags ?? [],
      dates: [], // Será preenchido pelo método que busca com datas
      status,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
      deletedAt: schema.deletedAt ?? null,
    });
  }

  protected toSchema(entity: Event): Partial<EventSchema> & { id: string } {
    return {
      id: entity.id.value,
      accountId: entity.accountId,
      name: entity.name,
      description: entity.description,
      type: entity.type.value as any,
      url: entity.url.value,
      address: entity.address?.toJSON() ?? null,
      maxCapacity: entity.maxCapacity ?? null,
      ticketSales: entity.ticketSales ? entity.ticketSales.toJSON() as any : null,
      tags: entity.tags,
      status: entity.status.value as any,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt ?? null,
    };
  }

  private toEventDateDomain(schema: EventDateSchema): EventDate {
    // Converter date para string YYYY-MM-DD
    // Drizzle retorna date como string no formato YYYY-MM-DD
    const dateStr = typeof schema.date === 'string' 
      ? schema.date
      : String(schema.date);
    
    // Converter time para string HH:mm
    // Drizzle retorna time como string no formato HH:mm:ss ou HH:mm
    let startTimeStr = String(schema.startTime);
    if (startTimeStr.includes(':')) {
      // Se for HH:mm:ss, pegar apenas HH:mm
      startTimeStr = startTimeStr.substring(0, 5);
    }
    
    let endTimeStr = String(schema.endTime);
    if (endTimeStr.includes(':')) {
      // Se for HH:mm:ss, pegar apenas HH:mm
      endTimeStr = endTimeStr.substring(0, 5);
    }

    const finishedAtStr = schema.finishedAt 
      ? String(schema.finishedAt)
      : null;

    return EventDate.create({
      id: schema.id,
      date: dateStr,
      startTime: startTimeStr,
      endTime: endTimeStr,
      finished: schema.finished,
      finishedAt: finishedAtStr,
    });
  }

  private toEventDateSchema(date: EventDate, eventId: string): Partial<EventDateSchema> & { id: string; eventId: string } {
    return {
      id: date.id.value,
      eventId,
      date: date.date,
      startTime: date.startTime,
      endTime: date.endTime,
      finished: date.finished,
      finishedAt: date.finishedAt ? new Date(date.finishedAt) : null,
    };
  }

  private async findEventDates(eventId: string, tx?: TransactionContext): Promise<EventDate[]> {
    const database = this.getDatabase(tx);
    const result = await database
      .select()
      .from(eventDates)
      .where(eq(eventDates.eventId, eventId));

    return result.map((date) => this.toEventDateDomain(date));
  }

  private async saveEventDates(eventId: string, dates: EventDate[], tx: TransactionContext): Promise<void> {
    const database = this.getDatabase(tx);
    
    if (dates.length === 0) {
      return;
    }

    const values = dates.map((date) => this.toEventDateSchema(date, eventId));
    await database.insert(eventDates).values(values as any);
  }

  private async deleteEventDates(eventId: string, tx: TransactionContext): Promise<void> {
    const database = this.getDatabase(tx);
    await database.delete(eventDates).where(eq(eventDates.eventId, eventId));
  }

  async save(entity: Event, tx?: TransactionContext): Promise<Event> {
    // Se já temos uma transação, usar ela; caso contrário, criar uma nova
    if (tx) {
      return await this.saveWithTransaction(entity, tx);
    }

    return await this.db.transaction(async (transaction) => {
      return await this.saveWithTransaction(entity, transaction as TransactionContext);
    });
  }

  private async saveWithTransaction(entity: Event, tx: TransactionContext): Promise<Event> {
    const table = this.getTable();
    const schema = this.toSchema(entity);
    const database = this.getDatabase(tx);

    const existing = await this.findById(entity.id, tx);

    if (existing) {
      // Update
      await database
        .update(table)
        .set({
          ...schema,
          updatedAt: new Date(),
        } as any)
        .where(eq((table as any).id, entity.id.value));

      // Deletar datas antigas e inserir novas
      await this.deleteEventDates(entity.id.value, tx);
      await this.saveEventDates(entity.id.value, entity.dates, tx);
    } else {
      // Insert
      await database.insert(table).values(schema as any);
      await this.saveEventDates(entity.id.value, entity.dates, tx);
    }

    return entity;
  }

  async findById(id: ID, tx?: TransactionContext): Promise<Event | null> {
    const event = await super.findById(id, tx);
    if (!event) {
      return null;
    }

    // Buscar datas relacionadas
    const dates = await this.findEventDates(id.value, tx);
    
    // Criar novo evento com as datas
    const status = event.status.isActive() ? Status.active() : Status.inactive();
    return new Event({
      id: event.id.value,
      accountId: event.accountId,
      name: event.name,
      description: event.description,
      type: event.type,
      url: event.url.value,
      address: event.address,
      maxCapacity: event.maxCapacity,
      ticketSales: event.ticketSales,
      tags: event.tags,
      dates,
      status,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
      deletedAt: event.deletedAt,
    });
  }

  async findByUrl(accountId: string, url: EventUrl): Promise<Event | null> {
    const result = await this.db
      .select()
      .from(events)
      .where(
        and(
          eq(events.accountId, accountId),
          eq(events.url, url.value),
          isNull(events.deletedAt)
        )
      )
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const eventSchema = result[0];
    const dates = await this.findEventDates(eventSchema.id);
    
    const status = eventSchema.status === StatusValue.ACTIVE ? Status.active() : Status.inactive();
    return new Event({
      id: eventSchema.id,
      accountId: eventSchema.accountId,
      name: eventSchema.name,
      description: eventSchema.description ?? "",
      type: EventType.fromValue(eventSchema.type as any),
      url: eventSchema.url,
      address: eventSchema.address ? Address.create(eventSchema.address) : null,
      maxCapacity: eventSchema.maxCapacity ?? null,
      ticketSales: eventSchema.ticketSales ? TicketSales.create(eventSchema.ticketSales as any) : TicketSales.disabled(),
      tags: eventSchema.tags ?? [],
      dates,
      status,
      createdAt: eventSchema.createdAt,
      updatedAt: eventSchema.updatedAt,
      deletedAt: eventSchema.deletedAt ?? null,
    });
  }

  async existsByUrl(accountId: string, url: EventUrl): Promise<boolean> {
    const result = await this.db
      .select()
      .from(events)
      .where(
        and(
          eq(events.accountId, accountId),
          eq(events.url, url.value),
          isNull(events.deletedAt)
        )
      )
      .limit(1);

    return result.length > 0;
  }

  async findByAccountId(accountId: string): Promise<Event[]> {
    const result = await this.db
      .select()
      .from(events)
      .where(and(eq(events.accountId, accountId), isNull(events.deletedAt)));

    const eventsWithDates = await Promise.all(
      result.map(async (eventSchema) => {
        const dates = await this.findEventDates(eventSchema.id);
        const status = eventSchema.status === StatusValue.ACTIVE ? Status.active() : Status.inactive();
        return new Event({
          id: eventSchema.id,
          accountId: eventSchema.accountId,
          name: eventSchema.name,
          description: eventSchema.description ?? "",
          type: EventType.fromValue(eventSchema.type as any),
          url: eventSchema.url,
          address: eventSchema.address ? Address.create(eventSchema.address) : null,
          maxCapacity: eventSchema.maxCapacity ?? null,
          ticketSales: eventSchema.ticketSales ? TicketSales.create(eventSchema.ticketSales as any) : TicketSales.disabled(),
          tags: eventSchema.tags ?? [],
          dates,
          status,
          createdAt: eventSchema.createdAt,
          updatedAt: eventSchema.updatedAt,
          deletedAt: eventSchema.deletedAt ?? null,
        });
      })
    );

    return eventsWithDates;
  }

  async findMany(
    accountId: string,
    filters: EventFilters,
    pagination: PaginationParams,
    tx?: TransactionContext
  ): Promise<PaginationResult<Event>> {
    const database = this.getDatabase(tx);
    
    // Construir condições de filtro
    const conditions = [eq(events.accountId, accountId), isNull(events.deletedAt)];

    if (filters.tags && filters.tags.length > 0) {
      // Filtrar por tags usando JSONB contains
      conditions.push(
        sql`${events.tags} @> ${JSON.stringify(filters.tags)}::jsonb`
      );
    }

    if (filters.type) {
      conditions.push(eq(events.type, filters.type));
    }

    if (filters.ticketSalesEnabled !== undefined) {
      conditions.push(
        sql`${events.ticketSales}->>'enabled' = ${filters.ticketSalesEnabled.toString()}`
      );
    }

    if (filters.ticketSalesStatus) {
      conditions.push(
        sql`${events.ticketSales}->>'status' = ${filters.ticketSalesStatus}`
      );
    }

    const whereClause = and(...conditions);

    // Contar total
    const countResult = await database
      .select({ count: sql<number>`count(*)` })
      .from(events)
      .where(whereClause);

    const total = Number(countResult[0]?.count || 0);

    // Buscar eventos paginados
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;
    const offset = (page - 1) * limit;

    const result = await database
      .select()
      .from(events)
      .where(whereClause)
      .orderBy(desc(events.createdAt))
      .limit(limit)
      .offset(offset);

    // Buscar datas para cada evento
    const eventsWithDates = await Promise.all(
      result.map(async (eventSchema) => {
        const dates = await this.findEventDates(eventSchema.id, tx);
        const status = eventSchema.status === StatusValue.ACTIVE ? Status.active() : Status.inactive();
        return new Event({
          id: eventSchema.id,
          accountId: eventSchema.accountId,
          name: eventSchema.name,
          description: eventSchema.description ?? "",
          type: EventType.fromValue(eventSchema.type as any),
          url: eventSchema.url,
          address: eventSchema.address ? Address.create(eventSchema.address) : null,
          maxCapacity: eventSchema.maxCapacity ?? null,
          ticketSales: eventSchema.ticketSales ? TicketSales.create(eventSchema.ticketSales as any) : TicketSales.disabled(),
          tags: eventSchema.tags ?? [],
          dates,
          status,
          createdAt: eventSchema.createdAt,
          updatedAt: eventSchema.updatedAt,
          deletedAt: eventSchema.deletedAt ?? null,
        });
      })
    );

    const totalPages = Math.ceil(total / limit);

    return {
      data: eventsWithDates,
      total,
      page,
      limit,
      totalPages,
    };
  }
}

