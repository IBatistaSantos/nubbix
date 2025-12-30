"use client";

import { Button } from "@nubbix/ui/button";
import { Plus } from "lucide-react";
import { EventsSummaryCards } from "./_components/EventsSummaryCards";
import { EventCard } from "./_components/EventCard";
import { CreateEventCard } from "./_components/CreateEventCard";
import { useEventsQuery } from "../../../src/modules/events/presentation/queries/eventQueries";
import { Skeleton } from "@nubbix/ui/skeleton";
import { Card } from "@nubbix/ui/card";
import Link from "next/link";

export default function EventsPage() {
  const { data: events = [], isLoading, error } = useEventsQuery();

  return (
    <div className="flex-grow pt-24 px-6 pb-12">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Eventos</h1>
            <p className="text-slate-500 mt-2 text-lg">
              Gerencie, acompanhe e evolua seus eventos corporativos em um único lugar.
            </p>
          </div>
          <Link href="/events/new">
            <Button className="bg-brand-primary hover:bg-brand-primary-hover text-white px-5 py-3 rounded-lg font-medium flex items-center gap-2 shadow-lg shadow-brand-primary/20 hover:shadow-brand-primary/40 transition-all active:scale-95">
              <Plus className="size-5" />
              Criar Evento
            </Button>
          </Link>
        </div>

        {/* Summary Cards */}
        <EventsSummaryCards />

        {/* Events Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="p-6">
                <Skeleton className="h-64 w-full" />
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card className="p-12 text-center bg-white border border-slate-100">
            <p className="text-slate-600 font-medium">Erro ao carregar eventos. Tente novamente.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
            <CreateEventCard />
          </div>
        )}
      </div>
    </div>
  );
}
