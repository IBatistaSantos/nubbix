"use client";

import { Button } from "@nubbix/ui/button";
import { Input } from "@nubbix/ui/input";
import { Label } from "@nubbix/ui/label";
import { Plus, X, AlertCircle } from "lucide-react";
import { cn } from "@nubbix/ui/lib/utils";
import { isPastDate } from "../../../../src/modules/events/presentation/utils/eventValidationUtils";
import type { FieldErrors, UseFormRegister, FieldValues, Path } from "react-hook-form";
import type { EventDateForm } from "../../../../src/modules/events/application/dtos/DuplicateEventDTO";

type FormWithDates<T extends FieldValues> = T & {
  dates: Array<EventDateForm>;
};

type DatesError =
  | { message?: string }
  | Array<{
      date?: { message?: string };
      startTime?: { message?: string };
      endTime?: { message?: string };
    }>
  | undefined;

interface EventDatesManagerProps<T extends FieldValues> {
  dateFields: Array<EventDateForm>;
  register: UseFormRegister<FormWithDates<T>>;
  errors: FieldErrors<FormWithDates<T>>;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: "date" | "startTime" | "endTime", value: string) => void;
}

function isDatesError(error: unknown): error is DatesError {
  return (
    error === undefined ||
    (typeof error === "object" && error !== null && ("message" in error || Array.isArray(error)))
  );
}

export function EventDatesManager<T extends FieldValues>({
  dateFields,
  register,
  errors,
  onAdd,
  onRemove,
  onUpdate,
}: EventDatesManagerProps<T>) {
  const datesError: DatesError = isDatesError(errors.dates) ? errors.dates : undefined;
  const datesArrayError = Array.isArray(datesError) ? datesError : undefined;

  return (
    <div className="space-y-5">
      <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
        Datas do Evento
      </h3>

      <div className="space-y-4">
        {dateFields.map((field, index) => {
          const dateError = datesArrayError?.[index];
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
                {...register(`dates.${index}.date` as Path<FormWithDates<T>>)}
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
                    {...register(`dates.${index}.startTime` as Path<FormWithDates<T>>)}
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
                    {...register(`dates.${index}.endTime` as Path<FormWithDates<T>>)}
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

        {datesError &&
          typeof datesError === "object" &&
          "message" in datesError &&
          datesError.message && (
            <p className="text-sm text-red-600 flex items-center gap-1.5">
              <AlertCircle className="h-3 w-3" />
              {String(datesError.message)}
            </p>
          )}
      </div>
    </div>
  );
}
