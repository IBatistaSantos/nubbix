"use client";

import { Card } from "@nubbix/ui/card";
import { useEventStatsQuery } from "../../../../src/modules/events/presentation/queries/eventStatsQueries";
import { Skeleton } from "@nubbix/ui/skeleton";
import { Package, CalendarCheck, CalendarClock, Tag } from "lucide-react";

export function EventsSummaryCards() {
  const { data: stats, isLoading } = useEventStatsQuery();

  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-6 bg-white border border-slate-100">
            <Skeleton className="h-20 w-full" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {/* Total de eventos */}
      <Card className="p-6 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200">
        <div className="flex justify-between items-start mb-4">
          <span className="text-slate-600 text-sm font-medium">Total de eventos</span>
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
            <Package className="size-5" />
          </div>
        </div>
        <div>
          <span className="text-3xl font-bold text-slate-900">{stats.totalEvents}</span>
          {stats.eventsThisMonth > 0 && (
            <span className="text-xs text-green-700 font-medium ml-2 bg-green-50 px-2 py-0.5 rounded-full">
              +{stats.eventsThisMonth} este mês
            </span>
          )}
        </div>
      </Card>

      {/* Eventos ativos */}
      <Card className="p-6 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200">
        <div className="flex justify-between items-start mb-4">
          <span className="text-slate-600 text-sm font-medium">Eventos ativos</span>
          <div className="p-2 bg-green-50 rounded-lg text-green-600">
            <CalendarCheck className="size-5" />
          </div>
        </div>
        <div>
          <span className="text-3xl font-bold text-slate-900">{stats.activeEvents}</span>
          <span className="text-xs text-slate-500 font-medium ml-2">Ocorrendo agora</span>
        </div>
      </Card>

      {/* Próximo evento */}
      <Card className="p-6 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200">
        <div className="flex justify-between items-start mb-4">
          <span className="text-slate-600 text-sm font-medium">Próximo evento</span>
          <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
            <CalendarClock className="size-5" />
          </div>
        </div>
        <div className="flex flex-col">
          {stats.nextEvent ? (
            <>
              <span className="text-lg font-bold text-slate-900 truncate">
                {stats.nextEvent.name}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Em {stats.nextEvent.daysUntil} {stats.nextEvent.daysUntil === 1 ? "dia" : "dias"} (
                {stats.nextEvent.date})
              </span>
            </>
          ) : (
            <>
              <span className="text-lg font-bold text-slate-400">Nenhum</span>
              <span className="text-xs text-slate-500 font-medium">Sem eventos agendados</span>
            </>
          )}
        </div>
      </Card>

      {/* Tipos de evento */}
      <Card className="p-6 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200">
        <div className="flex justify-between items-start mb-4">
          <span className="text-slate-600 text-sm font-medium">Tipos de evento</span>
          <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
            <Tag className="size-5" />
          </div>
        </div>
        <div>
          <span className="text-3xl font-bold text-slate-900">{stats.eventTypes}</span>
          <span className="text-xs text-slate-500 font-medium ml-2">Categorias ativas</span>
        </div>
      </Card>
    </div>
  );
}
