interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <div className="mb-8 sm:mb-10 md:mb-12">
      <h1 className="text-3xl sm:text-4xl font-semibold text-text-primary mb-2 sm:mb-3 leading-tight">
        {title}
      </h1>
      <p className="text-text-secondary text-sm sm:text-base leading-relaxed">{subtitle}</p>
    </div>
  );
}
