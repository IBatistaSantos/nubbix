"use client";

import { Input } from "@nubbix/ui/input";
import { Label } from "@nubbix/ui/label";
import { AlertCircle } from "lucide-react";
import { cn } from "@nubbix/ui/lib/utils";
import type { Control, FieldErrors } from "react-hook-form";
import { Controller } from "react-hook-form";
import type { CreateEventFormInput } from "../../../../src/modules/events/application/dtos/CreateEventDTO";

interface EventAddressFormProps {
  control: Control<CreateEventFormInput>;
  errors: FieldErrors<CreateEventFormInput>;
}

export function EventAddressForm({ control, errors }: EventAddressFormProps) {
  return (
    <div className="space-y-5">
      <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">Endereço</h3>

      <Controller
        name="address"
        control={control}
        render={({ field }) => (
          <div className="space-y-4 border border-slate-200 rounded-lg p-5 bg-slate-50">
            <div className="space-y-2.5">
              <Label htmlFor="address-street" className="text-slate-700 font-medium">
                Rua <span className="text-red-500">*</span>
              </Label>
              <Input
                id="address-street"
                placeholder="Ex: Rua das Flores, 123"
                value={field.value?.street || ""}
                onChange={(e) =>
                  field.onChange({
                    ...(field.value || { street: "", city: "", state: "", zip: "", country: "" }),
                    street: e.target.value,
                  })
                }
                className={cn("h-11", errors.address && "border-red-500")}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2.5">
                <Label htmlFor="address-city" className="text-slate-700 font-medium">
                  Cidade <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="address-city"
                  placeholder="Ex: São Paulo"
                  value={field.value?.city || ""}
                  onChange={(e) =>
                    field.onChange({
                      ...(field.value || { street: "", city: "", state: "", zip: "", country: "" }),
                      city: e.target.value,
                    })
                  }
                  className={cn("h-11", errors.address && "border-red-500")}
                />
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="address-state" className="text-slate-700 font-medium">
                  Estado <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="address-state"
                  placeholder="Ex: SP"
                  value={field.value?.state || ""}
                  onChange={(e) =>
                    field.onChange({
                      ...(field.value || { street: "", city: "", state: "", zip: "", country: "" }),
                      state: e.target.value,
                    })
                  }
                  className={cn("h-11", errors.address && "border-red-500")}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2.5">
                <Label htmlFor="address-zip" className="text-slate-700 font-medium">
                  CEP <span className="text-slate-500 text-xs font-normal">(opcional)</span>
                </Label>
                <Input
                  id="address-zip"
                  placeholder="Ex: 01234-567"
                  value={field.value?.zip || ""}
                  onChange={(e) =>
                    field.onChange({
                      ...(field.value || { street: "", city: "", state: "", zip: "", country: "" }),
                      zip: e.target.value,
                    })
                  }
                  className="h-11"
                />
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="address-country" className="text-slate-700 font-medium">
                  País <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="address-country"
                  placeholder="Ex: Brasil"
                  value={field.value?.country || ""}
                  onChange={(e) =>
                    field.onChange({
                      ...(field.value || { street: "", city: "", state: "", zip: "", country: "" }),
                      country: e.target.value,
                    })
                  }
                  className={cn("h-11", errors.address && "border-red-500")}
                />
              </div>
            </div>

            {errors.address && (
              <p className="text-sm text-red-600 flex items-center gap-1.5">
                <AlertCircle className="h-3 w-3" />
                {typeof errors.address === "object" && "message" in errors.address
                  ? errors.address.message
                  : "Endereço é obrigatório para eventos híbridos e presenciais"}
              </p>
            )}
          </div>
        )}
      />
    </div>
  );
}
