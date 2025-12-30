import { Input } from "@nubbix/ui/input";
import { Label } from "@nubbix/ui/label";
import { UseFormRegisterReturn } from "react-hook-form";
import { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  id: string;
  error?: string;
  children: ReactNode;
  required?: boolean;
}

export function FormField({ label, id, error, children, required }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label className="block text-sm font-medium text-text-label mb-1.5 sm:mb-2" htmlFor={id}>
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </Label>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-sm text-error mt-1.5" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

interface InputWithIconProps {
  id: string;
  type?: string;
  placeholder?: string;
  icon: ReactNode;
  rightIcon?: ReactNode;
  error?: string;
  register: UseFormRegisterReturn<string>;
  className?: string;
  autoComplete?: string;
}

export function InputWithIcon({
  id,
  type = "text",
  placeholder,
  icon,
  rightIcon,
  error,
  register,
  className = "",
  autoComplete,
}: InputWithIconProps) {
  return (
    <div className="relative">
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        className={`pl-11 ${rightIcon ? "pr-11" : "pr-4"} h-11 sm:h-12 border-border bg-white text-text-primary placeholder:text-text-muted focus:border-border-focus focus:ring-border-focus/20 transition-all text-base sm:text-sm ${className}`}
        autoComplete={autoComplete}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${id}-error` : undefined}
        {...register}
      />
      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
        {icon}
      </span>
      {rightIcon && (
        <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center">{rightIcon}</span>
      )}
    </div>
  );
}
