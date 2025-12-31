"use client";

import { Button } from "@nubbix/ui/button";
import { Input } from "@nubbix/ui/input";
import { Label } from "@nubbix/ui/label";
import { Plus, X, AlertCircle } from "lucide-react";
import { cn } from "@nubbix/ui/lib/utils";
import { isPastDate } from "../../../../src/modules/events/presentation/utils/eventValidationUtils";
import type { FieldErrors, UseFieldArrayReturn, UseFormRegister } from "react-hook-form";
import type { CreateEventFormInput } from "../../../../src/modules/events/application/dtos/CreateEventDTO";

interface EventDatesManagerProps {
  dateFields: UseFieldArrayReturn<CreateEventFormInput, "dates">["fields"];
  register: UseFormRegister<CreateEventFormInput>;
  errors: FieldErrors<CreateEventFormInput>;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: "date" | "startTime" | "endTime", value: string) => void;
}

export function EventDatesManager({
  dateFields,
  register,
  errors,
  onAdd,
  onRemove,
  onUpdate,
}: EventDatesManagerProps) {
  return (
    <div className="space-y-5">
      <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
        Datas do Evento
      </h3>

      <div className="space-y-4">
        {dateFields.map((field, index) => {
          const dateError = errors.dates?.[index];
          const dateValue = field.date || "";
          const isPast = isPastDate(dateValue);

          return (
            <div
              key={field.id}
              className="border border-slate-200 rounded-lg p-5 space-y-4 bg-slate-50"
            >
              <div className="flex items-center justify-between">
                <Label className="text-slate-700 font-medium">Data</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(index)}
                  className="h-7 w-7 p-0 hover:bg-slate-200"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <Input
                type="date"
                {...register(`dates.${index}.date`)}
                onChange={(e) => onUpdate(index, "date", e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className={cn("h-11", (isPast || dateError) && "border-red-500")}
              />

              {isPast && (
                <p className="text-xs text-red-600 flex items-center gap-1.5">
                  <AlertCircle className="h-3 w-3" />
                  Datas do evento não podem ser anteriores ao dia atual
                </p>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2.5">
                  <Label className="text-sm text-slate-600 font-medium">
                    Hora inicial <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="time"
                    {...register(`dates.${index}.startTime`)}
                    onChange={(e) => onUpdate(index, "startTime", e.target.value)}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2.5">
                  <Label className="text-sm text-slate-600 font-medium">
                    Hora final <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="time"
                    {...register(`dates.${index}.endTime`)}
                    onChange={(e) => onUpdate(index, "endTime", e.target.value)}
                    className="h-11"
                  />
                </div>
              </div>
            </div>
          );
        })}

        <Button
          type="button"
          variant="outline"
          onClick={onAdd}
          className="w-full gap-2 bg-transparent h-11"
        >
          <Plus className="h-4 w-4" />
          Adicionar Data
        </Button>

        {errors.dates && typeof errors.dates === "object" && "message" in errors.dates && (
          <p className="text-sm text-red-600 flex items-center gap-1.5">
            <AlertCircle className="h-3 w-3" />
            {errors.dates.message}
          </p>
        )}
      </div>
    </div>
  );
}
