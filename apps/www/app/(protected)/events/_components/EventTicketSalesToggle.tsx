"use client";

import { Label } from "@nubbix/ui/label";
import { Controller } from "react-hook-form";
import type { CreateEventFormInput } from "../../../../src/modules/events/application/dtos/CreateEventDTO";
import type { Control } from "react-hook-form";

interface EventTicketSalesToggleProps {
  control: Control<CreateEventFormInput>;
}

export function EventTicketSalesToggle({ control }: EventTicketSalesToggleProps) {
  return (
    <div className="space-y-5">
      <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
        Vendas de Ingressos
      </h3>

      <div className="space-y-4">
        <Controller
          name="ticketSales.enabled"
          control={control}
          render={({ field }) => (
            <div className="flex items-center justify-between border border-slate-200 rounded-lg p-5 bg-slate-50">
              <div className="space-y-1">
                <Label htmlFor="ticket-sales" className="text-slate-700 font-medium">
                  Ativar venda de ingressos
                </Label>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Habilite para vender ingressos para este evento
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="ticket-sales"
                  checked={field.value}
                  onChange={field.onChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slate-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
              </label>
            </div>
          )}
        />
      </div>
    </div>
  );
}
