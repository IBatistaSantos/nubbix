/**
 * Extrai o accountSlug do pathname da URL
 * Exemplos:
 * - /accounts/groups/login -> groups
 * - /accounts/my-company -> my-company
 * - / -> null
 */
export function getAccountSlug(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  const pathname = window.location.pathname;
  const match = pathname.match(/^\/accounts\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
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
