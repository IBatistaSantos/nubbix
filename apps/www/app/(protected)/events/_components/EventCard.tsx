"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter } from "@nubbix/ui/card";
import { Badge } from "@nubbix/ui/badge";
import { Button } from "@nubbix/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@nubbix/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@nubbix/ui/dropdown-menu";
import {
  Calendar,
  MapPin,
  Globe,
  Ticket,
  CheckCircle,
  MoreHorizontal,
  ArrowRight,
  BarChart3,
  Trash2,
  Copy,
} from "lucide-react";
import { type Event } from "../../../../src/modules/events/presentation/queries/eventQueries";
import { useDeleteEventController } from "../../../../src/modules/events/presentation/controllers";
import Link from "next/link";

function formatDateRange(dates: Event["dates"]): string {
  if (dates.length === 0) return "Sem data definida";

  const sortedDates = [...dates]
    .map((d) => new Date(`${d.date}T${d.startTime}`))
    .sort((a, b) => a.getTime() - b.getTime());

  const firstDate = sortedDates[0];
  const lastDate = sortedDates[sortedDates.length - 1];

  const months = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];

  const formatDate = (date: Date) => {
    return `${date.getDate()} ${months[date.getMonth()]}`;
  };

  if (sortedDates.length === 1) {
    return formatDate(firstDate);
  }

  if (
    firstDate.getMonth() === lastDate.getMonth() &&
    firstDate.getFullYear() === lastDate.getFullYear()
  ) {
    return `${firstDate.getDate()} - ${lastDate.getDate()} ${months[firstDate.getMonth()]}, ${firstDate.getFullYear()}`;
  }

  return `${formatDate(firstDate)} - ${formatDate(lastDate)}, ${firstDate.getFullYear()}`;
}

function getEventStatus(event: Event): {
  label: string;
  variant: "default" | "secondary" | "destructive" | "outline";
  className: string;
} {
  const now = new Date();

  const allFinished = event.dates.length > 0 && event.dates.every((date) => date.finished);

  const hasActiveDates = event.dates.some((date) => {
    const startDate = new Date(`${date.date}T${date.startTime}`);
    const endDate = new Date(`${date.date}T${date.endTime}`);
    return startDate <= now && endDate >= now && !date.finished;
  });

  const allFuture =
    event.dates.length > 0 &&
    event.dates.every((date) => {
      const startDate = new Date(`${date.date}T${date.startTime}`);
      return startDate > now && !date.finished;
    });

  if (allFinished) {
    return {
      label: "Finalizado",
      variant: "secondary",
      className: "bg-gray-100 text-gray-700 border-gray-200",
    };
  }

  if (hasActiveDates) {
    return {
      label: "Ativo",
      variant: "default",
      className: "bg-green-50 text-green-700 border-green-200",
    };
  }

  if (allFuture) {
    return {
      label: "Agendado",
      variant: "default",
      className: "bg-blue-50 text-blue-700 border-blue-200",
    };
  }

  return {
    label: "Agendado",
    variant: "default",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  };
}

function getEventTypeLabel(type: Event["type"]): string {
  const labels: Record<Event["type"], string> = {
    digital: "Digital",
    hybrid: "Híbrido",
    "in-person": "Presencial",
  };
  return labels[type] || type;
}

function getLocationInfo(event: Event): {
  icon: typeof Calendar;
  text: string;
} {
  if (event.type === "digital") {
    return {
      icon: Globe,
      text: "Plataforma Nubbix",
    };
  }

  if (event.type === "hybrid") {
    if (event.address) {
      return {
        icon: MapPin,
        text: `${event.address.city}, ${event.address.state}`,
      };
    }
    return {
      icon: Globe,
      text: "Híbrido",
    };
  }

  if (event.address) {
    return {
      icon: MapPin,
      text: `${event.address.city}, ${event.address.state}`,
    };
  }

  return {
    icon: MapPin,
    text: "Local a definir",
  };
}

function getTicketInfo(event: Event): {
  icon: typeof Ticket;
  text: string;
  tooltip?: string;
} | null {
  if (!event.ticketSales.enabled) {
    return {
      icon: Ticket,
      text: "Não iniciado",
    };
  }

  if (event.maxCapacity) {
    const sold = 0;
    const percentage = Math.round((sold / event.maxCapacity) * 100);
    return {
      icon: Ticket,
      text: `${percentage}% vendido`,
      tooltip: `${sold}/${event.maxCapacity} Ingressos`,
    };
  }

  return {
    icon: Ticket,
    text: "Vendas abertas",
  };
}

function getActionButton(event: Event): {
  label: string;
  icon: typeof ArrowRight;
  href: string;
} {
  const status = getEventStatus(event);

  if (status.label === "Finalizado") {
    return {
      label: "Ver Relatório",
      icon: BarChart3,
      href: `/events/${event.id}/report`,
    };
  }

  return {
    label: "Ver Detalhes",
    icon: ArrowRight,
    href: `/events/${event.id}`,
  };
}

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const status = getEventStatus(event);
  const locationInfo = getLocationInfo(event);
  const ticketInfo = getTicketInfo(event);
  const actionButton = getActionButton(event);
  const ActionIcon = actionButton.icon;

  const { deleteEvent, isLoading: isDeleting } = useDeleteEventController(() => {
    setIsDeleteDialogOpen(false);
  });

  const handleDeleteClick = () => {
    setDropdownOpen(false);
    requestAnimationFrame(() => {
      setIsDeleteDialogOpen(true);
    });
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteEvent(event.id, event.name);
    } catch {}
  };

  const handleDuplicateClick = () => {};

  return (
    <>
      <Card className="group rounded-xl bg-white border border-slate-100 hover:border-brand-primary/30 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col">
        <CardContent className="p-6 flex-grow relative">
          <div className="flex justify-between items-start mb-5">
            <div className="flex flex-col gap-1">
              <Badge
                className={`${status.className} w-fit px-2.5 py-0.5 rounded-full text-xs font-medium border`}
              >
                {status.label}
              </Badge>
              <h3 className="text-lg font-bold text-slate-900 mt-2 group-hover:text-brand-primary transition-colors">
                {event.name}
              </h3>
              <p className="text-sm text-slate-500">{getEventTypeLabel(event.type)}</p>
            </div>
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-slate-400 hover:text-slate-600"
                >
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-white">
                <DropdownMenuItem onSelect={handleDuplicateClick} className="cursor-pointer">
                  <Copy className="size-4 mr-2" />
                  Duplicar
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={handleDeleteClick}
                  className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                  <Trash2 className="size-4 mr-2" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <div className="w-8 flex justify-center text-slate-400">
                <Calendar className="size-4" />
              </div>
              <span className="font-medium">{formatDateRange(event.dates)}</span>
            </div>

            <div className="flex items-center gap-3 text-sm text-slate-600">
              <div className="w-8 flex justify-center text-slate-400">
                {locationInfo.icon === Globe ? (
                  <Globe className="size-4" />
                ) : (
                  <MapPin className="size-4" />
                )}
              </div>
              <span className="font-medium">{locationInfo.text}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {ticketInfo ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium cursor-help">
                      <ticketInfo.icon className="size-4" />
                      <span>{ticketInfo.text}</span>
                    </div>
                  </TooltipTrigger>
                  {ticketInfo.tooltip && (
                    <TooltipContent>
                      <p>{ticketInfo.tooltip}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <CheckCircle className="size-4" />
                <span>Concluído</span>
              </div>
            )}
          </div>

          <Link
            href={actionButton.href}
            className="text-sm font-semibold text-brand-primary hover:text-brand-primary-hover flex items-center gap-1 transition-colors"
          >
            {actionButton.label}{" "}
            <ActionIcon className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </CardFooter>
      </Card>

      {isDeleteDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-white/80 backdrop-blur-sm"
            onClick={() => setIsDeleteDialogOpen(false)}
            aria-hidden="true"
          />
          <div className="relative z-50 bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4 border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Excluir evento</h2>
            <p className="text-sm text-slate-600 mb-6">
              Tem certeza que deseja excluir o evento <strong>&quot;{event.name}&quot;</strong>?
              Esta ação não pode ser desfeita.
            </p>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2">
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
                className="sm:mt-0"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isDeleting ? "Excluindo..." : "Excluir"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
