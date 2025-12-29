import { Input } from "@nubbix/ui/input";
import { Mail } from "lucide-react";
import { UseFormRegisterReturn } from "react-hook-form";
import { FormField } from "./FormField";

interface EmailFieldProps {
  id: string;
  label: string;
  error?: string;
  register: UseFormRegisterReturn<string>;
  placeholder?: string;
  autoComplete?: string;
}

export function EmailField({
  id,
  label,
  error,
  register,
  placeholder = "nome@empresa.com",
  autoComplete = "email",
}: EmailFieldProps) {
  return (
    <FormField label={label} id={id} error={error}>
      <div className="relative">
        <Input
          id={id}
          type="email"
          placeholder={placeholder}
          className="pl-11 pr-4 h-11 sm:h-12 border-border bg-white text-text-primary placeholder:text-text-muted focus:border-border-focus focus:ring-border-focus/20 transition-all text-base sm:text-sm"
          autoComplete={autoComplete}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${id}-error` : undefined}
          {...register}
        />
        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
          <Mail className="h-5 w-5" />
        </span>
      </div>
    </FormField>
  );
}
