"use client";

import { Input } from "@nubbix/ui/input";
import { Label } from "@nubbix/ui/label";
import { AlertCircle } from "lucide-react";
import { cn } from "@nubbix/ui/lib/utils";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { CreateEventFormInput } from "../../../../src/modules/events/application/dtos/CreateEventDTO";

interface EventBasicInfoFormProps {
  register: UseFormRegister<CreateEventFormInput>;
  errors: FieldErrors<CreateEventFormInput>;
}

export function EventBasicInfoForm({ register, errors }: EventBasicInfoFormProps) {
  return (
    <div className="space-y-5">
      <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
        Informações Básicas
      </h3>

      <div className="space-y-2.5">
        <Label htmlFor="name" className="text-slate-700 font-medium">
          Nome do Evento <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          placeholder="Ex: Summit Corporativo 2025"
          {...register("name")}
          className={cn("h-11", errors.name && "border-red-500")}
          maxLength={255}
        />
        {errors.name && (
          <p className="text-sm text-red-600 flex items-center gap-1.5 mt-2">
            <AlertCircle className="h-3 w-3" />
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-2.5">
        <Label htmlFor="description" className="text-slate-700 font-medium">
          Descrição <span className="text-slate-500 text-xs font-normal">(opcional)</span>
        </Label>
        <textarea
          id="description"
          placeholder="Descreva brevemente o objetivo do evento"
          {...register("description")}
          rows={4}
          className="flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none"
        />
      </div>
    </div>
  );
}
