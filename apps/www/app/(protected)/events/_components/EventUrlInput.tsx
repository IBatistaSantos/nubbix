"use client";

import { useCallback } from "react";
import { Input } from "@nubbix/ui/input";
import { Label } from "@nubbix/ui/label";
import { AlertCircle } from "lucide-react";
import { cn } from "@nubbix/ui/lib/utils";
import type { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form";
import type { CreateEventFormInput } from "../../../../src/modules/events/application/dtos/CreateEventDTO";
import { normalizeUrl } from "../../../../src/modules/events/presentation/utils/eventValidationUtils";

interface EventUrlInputProps {
  register: UseFormRegister<CreateEventFormInput>;
  errors: FieldErrors<CreateEventFormInput>;
  urlError?: string;
  setValue: UseFormSetValue<CreateEventFormInput>;
  watch: UseFormWatch<CreateEventFormInput>;
}

export function EventUrlInput({ register, errors, urlError, setValue, watch }: EventUrlInputProps) {
  const urlValue = watch("url");
  const { onChange, ...registerProps } = register("url");

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const normalizedValue = normalizeUrl(e.target.value);
      if (e.target.value !== normalizedValue) {
        setValue("url", normalizedValue, { shouldValidate: true });
      }
      onChange(e);
    },
    [setValue, onChange]
  );

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
            {...registerProps}
            onChange={handleChange}
            value={urlValue || ""}
            className={cn(
              "border-0 focus-visible:ring-0 flex-1 h-11",
              (errors.url || urlError) && "border-red-500"
            )}
          />
        </div>
        <p className="text-xs text-slate-500 leading-relaxed mt-2">
          A URL será formatada automaticamente. Caracteres inválidos serão removidos.
          <br />
          Exemplo: &quot;meu-evento-2025&quot;
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
