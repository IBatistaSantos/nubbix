"use client";

import { Label } from "@nubbix/ui/label";
import { AlertCircle, Monitor, Users, MapPin } from "lucide-react";
import { cn } from "@nubbix/ui/lib/utils";
import type { Control, FieldErrors } from "react-hook-form";
import { Controller } from "react-hook-form";
import type { CreateEventFormInput } from "../../../../src/modules/events/application/dtos/CreateEventDTO";

interface EventTypeSelectorProps {
  control: Control<CreateEventFormInput>;
  errors: FieldErrors<CreateEventFormInput>;
}

export function EventTypeSelector({ control, errors }: EventTypeSelectorProps) {
  return (
    <div className="space-y-5">
      <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
        Tipo do Evento
      </h3>

      <div className="space-y-2.5">
        <Label className="text-slate-700 font-medium">
          Tipo <span className="text-red-500">*</span>
        </Label>

        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Digital Card */}
              <button
                type="button"
                onClick={() => field.onChange("digital")}
                className={cn(
                  "relative group flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-md",
                  field.value === "digital"
                    ? "border-blue-500 bg-blue-50 shadow-sm"
                    : "border-slate-200 bg-white hover:border-slate-300",
                  errors.type && field.value !== "digital" && "border-red-200"
                )}
              >
                {field.value === "digital" && (
                  <div className="absolute top-3 right-3 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}

                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors",
                    field.value === "digital"
                      ? "bg-blue-100"
                      : "bg-slate-100 group-hover:bg-slate-200"
                  )}
                >
                  <Monitor
                    className={cn(
                      "w-6 h-6 transition-colors",
                      field.value === "digital" ? "text-blue-600" : "text-slate-600"
                    )}
                  />
                </div>

                <span
                  className={cn(
                    "font-semibold text-base mb-1 transition-colors",
                    field.value === "digital" ? "text-blue-900" : "text-slate-900"
                  )}
                >
                  Digital
                </span>

                <span className="text-xs text-slate-500 text-center leading-relaxed">
                  100% online
                </span>
              </button>

              {/* Hybrid Card */}
              <button
                type="button"
                onClick={() => field.onChange("hybrid")}
                className={cn(
                  "relative group flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-md",
                  field.value === "hybrid"
                    ? "border-purple-500 bg-purple-50 shadow-sm"
                    : "border-slate-200 bg-white hover:border-slate-300",
                  errors.type && field.value !== "hybrid" && "border-red-200"
                )}
              >
                {field.value === "hybrid" && (
                  <div className="absolute top-3 right-3 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}

                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors",
                    field.value === "hybrid"
                      ? "bg-purple-100"
                      : "bg-slate-100 group-hover:bg-slate-200"
                  )}
                >
                  <Users
                    className={cn(
                      "w-6 h-6 transition-colors",
                      field.value === "hybrid" ? "text-purple-600" : "text-slate-600"
                    )}
                  />
                </div>

                <span
                  className={cn(
                    "font-semibold text-base mb-1 transition-colors",
                    field.value === "hybrid" ? "text-purple-900" : "text-slate-900"
                  )}
                >
                  Híbrido
                </span>

                <span className="text-xs text-slate-500 text-center leading-relaxed">
                  Online + presencial
                </span>
              </button>

              {/* In-Person Card */}
              <button
                type="button"
                onClick={() => field.onChange("in-person")}
                className={cn(
                  "relative group flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-md",
                  field.value === "in-person"
                    ? "border-green-500 bg-green-50 shadow-sm"
                    : "border-slate-200 bg-white hover:border-slate-300",
                  errors.type && field.value !== "in-person" && "border-red-200"
                )}
              >
                {field.value === "in-person" && (
                  <div className="absolute top-3 right-3 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}

                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors",
                    field.value === "in-person"
                      ? "bg-green-100"
                      : "bg-slate-100 group-hover:bg-slate-200"
                  )}
                >
                  <MapPin
                    className={cn(
                      "w-6 h-6 transition-colors",
                      field.value === "in-person" ? "text-green-600" : "text-slate-600"
                    )}
                  />
                </div>

                <span
                  className={cn(
                    "font-semibold text-base mb-1 transition-colors",
                    field.value === "in-person" ? "text-green-900" : "text-slate-900"
                  )}
                >
                  Presencial
                </span>

                <span className="text-xs text-slate-500 text-center leading-relaxed">
                  Local físico
                </span>
              </button>
            </div>
          )}
        />

        {errors.type && (
          <p className="text-sm text-red-600 flex items-center gap-1.5 mt-2">
            <AlertCircle className="h-3 w-3" />
            {errors.type.message}
          </p>
        )}
      </div>
    </div>
  );
}
