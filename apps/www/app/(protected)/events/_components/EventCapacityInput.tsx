"use client";

import { Input } from "@nubbix/ui/input";
import { Label } from "@nubbix/ui/label";
import { AlertCircle } from "lucide-react";
import { cn } from "@nubbix/ui/lib/utils";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { CreateEventFormInput } from "../../../../src/modules/events/application/dtos/CreateEventDTO";

interface EventCapacityInputProps {
  register: UseFormRegister<CreateEventFormInput>;
  errors: FieldErrors<CreateEventFormInput>;
}

export function EventCapacityInput({ register, errors }: EventCapacityInputProps) {
  return (
    <div className="space-y-5">
      <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
        Capacidade Máxima
      </h3>

      <div className="space-y-2.5">
        <Label htmlFor="maxCapacity" className="text-slate-700 font-medium">
          Capacidade Máxima <span className="text-slate-500 text-xs font-normal">(opcional)</span>
        </Label>
        <Input
          id="maxCapacity"
          type="number"
          placeholder="Ex: 500"
          {...register("maxCapacity", {
            valueAsNumber: true,
            setValueAs: (value: string) => {
              if (value === "" || value === null || value === undefined) {
                return undefined;
              }
              const num = Number(value);
              return isNaN(num) ? undefined : num;
            },
          })}
          min="1"
          className={cn("h-11", errors.maxCapacity && "border-red-500")}
        />
        <p className="text-xs text-slate-500 leading-relaxed mt-2">
          Deixe vazio caso não haja limite de participantes.
        </p>
        {errors.maxCapacity && (
          <p className="text-sm text-red-600 flex items-center gap-1.5 mt-2">
            <AlertCircle className="h-3 w-3" />
            {errors.maxCapacity.message}
          </p>
        )}
      </div>
    </div>
  );
}
