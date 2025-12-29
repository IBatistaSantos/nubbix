"use client";

import { Input } from "@nubbix/ui/input";
import { Lock, Eye, EyeOff } from "lucide-react";
import { UseFormRegisterReturn } from "react-hook-form";
import { useState } from "react";
import { FormField } from "./FormField";
import { PasswordStrengthIndicator } from "./PasswordStrengthIndicator";

interface PasswordStrengthFieldProps {
  id: string;
  label: string;
  error?: string;
  register: UseFormRegisterReturn<string>;
  placeholder?: string;
  autoComplete?: string;
  showStrengthIndicator?: boolean;
  watchValue?: string;
}

export function PasswordStrengthField({
  id,
  label,
  error,
  register,
  placeholder = "••••••••",
  autoComplete = "current-password",
  showStrengthIndicator = false,
  watchValue = "",
}: PasswordStrengthFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormField label={label} id={id} error={error}>
      <div className="space-y-3">
        <div className="relative">
          <Input
            id={id}
            type={showPassword ? "text" : "password"}
            placeholder={placeholder}
            className="pl-11 pr-11 h-11 sm:h-12 border-border bg-white text-text-primary placeholder:text-text-muted focus:border-border-focus focus:ring-border-focus/20 transition-all text-base sm:text-sm"
            autoComplete={autoComplete}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? `${id}-error` : undefined}
            {...register}
          />
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
            <Lock className="h-5 w-5" />
          </span>
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-text-muted hover:text-brand-primary transition-colors touch-manipulation"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Eye className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>

        {showStrengthIndicator && watchValue && <PasswordStrengthIndicator password={watchValue} />}
      </div>
    </FormField>
  );
}
