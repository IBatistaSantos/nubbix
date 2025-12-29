import Link from "next/link";

interface AuthLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function AuthLink({ href, children, className = "" }: AuthLinkProps) {
  return (
    <Link
      href={href}
      className={`text-sm font-medium text-brand-primary hover:text-brand-primary-hover transition-colors ${className}`}
    >
      {children}
    </Link>
  );
}
