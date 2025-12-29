interface ErrorMessageProps {
  message: string;
  className?: string;
}

export function ErrorMessage({ message, className = "" }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div
      className={`mb-5 sm:mb-6 p-3 sm:p-4 rounded-lg bg-error-bg border border-error-border text-error text-sm ${className}`}
      role="alert"
    >
      {message}
    </div>
  );
}
