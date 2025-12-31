"use client";

import { Input } from "@nubbix/ui/input";
import { Label } from "@nubbix/ui/label";
import { AlertCircle } from "lucide-react";
import { cn } from "@nubbix/ui/lib/utils";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { CreateEventFormInput } from "../../../../src/modules/events/application/dtos/CreateEventDTO";

interface EventUrlInputProps {
  register: UseFormRegister<CreateEventFormInput>;
  errors: FieldErrors<CreateEventFormInput>;
  urlError?: string;
}

export function EventUrlInput({ register, errors, urlError }: EventUrlInputProps) {
  return (
    <div className="space-y-5">
      <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
        URL do Evento
      </h3>

      <div className="space-y-2.5">
        <Label htmlFor="url" className="text-slate-700 font-medium">
          URL do Evento <span className="text-red-500">*</span>
        </Label>
        <div className="flex items-center gap-0 border rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-slate-400">
          <span className="bg-slate-100 px-4 py-3 text-sm text-slate-600 border-r whitespace-nowrap">
            https://eventos.suaempresa.com/
          </span>
          <Input
            id="url"
            placeholder="nome-do-evento"
            {...register("url")}
            className={cn(
              "border-0 focus-visible:ring-0 flex-1 h-11",
              (errors.url || urlError) && "border-red-500"
            )}
          />
        </div>
        <p className="text-xs text-slate-500 leading-relaxed mt-2">
          Use apenas letras, números, hífen e underscore.
          <br />
          Exemplo: summit-corporativo-2025
        </p>
        {(errors.url || urlError) && (
          <p className="text-sm text-red-600 flex items-center gap-1.5 mt-2">
            <AlertCircle className="h-3 w-3" />
            {errors.url?.message || urlError}
          </p>
        )}
      </div>
    </div>
  );
}
