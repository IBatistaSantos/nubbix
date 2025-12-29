import { Button } from "@nubbix/ui/button";
import { ButtonHTMLAttributes } from "react";

interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  children: React.ReactNode;
}

export function AuthButton({ isLoading, children, className = "", ...props }: AuthButtonProps) {
  return (
    <Button
      type="submit"
      className={`w-full h-11 sm:h-12 flex justify-center items-center rounded-lg text-base font-semibold text-white bg-brand-primary hover:bg-brand-primary-hover focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 shadow-sm hover:shadow-md transition-all duration-200 touch-manipulation ${className}`}
      disabled={isLoading}
      {...props}
    >
      {children}
    </Button>
  );
}
