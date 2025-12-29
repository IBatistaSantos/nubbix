/**
 * Extrai o accountSlug do hostname/subdomínio
 * Suporta desenvolvimento (localhost) e produção (Vercel)
 *
 * Exemplos:
 * - account-slug.localhost:3000 -> account-slug
 * - account-slug.vercel.app -> account-slug
 * - localhost:3000 -> null (sem subdomínio)
 */
export function getAccountSlug(): string | null {
  if (typeof window === "undefined") {
    // Server-side: não temos acesso ao window
    // O accountSlug deve ser extraído do request no middleware
    return null;
  }

  const hostname = window.location.hostname;

  // Se for localhost, extrair o subdomínio antes do "localhost"
  if (hostname.includes("localhost")) {
    const parts = hostname.split(".");
    // Se tiver mais de uma parte antes de localhost, o primeiro é o slug
    // Ex: account-slug.localhost -> ['account-slug', 'localhost']
    if (parts.length > 1 && parts[0] !== "localhost") {
      return parts[0];
    }
    return null;
  }

  // Para produção (Vercel ou outros domínios)
  // Extrair o primeiro subdomínio
  const parts = hostname.split(".");

  // Se tiver pelo menos 3 partes (ex: account-slug.vercel.app)
  // ou 2 partes onde a primeira não é um TLD conhecido
  if (parts.length >= 2) {
    // Verificar se não é um TLD conhecido (com, org, net, etc)
    const commonTlds = ["com", "org", "net", "io", "app", "dev", "co"];
    const firstPart = parts[0];

    // Se a primeira parte não for um TLD conhecido e não for 'www', é o slug
    if (firstPart && firstPart !== "www" && !commonTlds.includes(firstPart.toLowerCase())) {
      return firstPart;
    }
  }

  return null;
}

/**
 * Valida se o accountSlug tem o formato correto
 * Formato: apenas letras, números, hífen e underscore
 */
export function isValidAccountSlug(slug: string | null): boolean {
  if (!slug || slug.trim().length === 0) {
    return false;
  }

  // Validar formato: apenas letras, números, hífen e underscore
  const slugRegex = /^[a-zA-Z0-9_-]+$/;
  return slugRegex.test(slug);
}
