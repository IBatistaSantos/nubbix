import Image from "next/image";

interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export function Logo({ size = 32, showText = true, className = "" }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Image
        src="/logo.svg"
        alt="Nubbix Logo"
        width={size}
        height={size}
        className="text-brand-primary"
      />
      {showText && (
        <span className="text-xl sm:text-2xl font-semibold text-text-primary tracking-tight">
          Nubbix
        </span>
      )}
    </div>
  );
}
