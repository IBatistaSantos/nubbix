export function generateAccountUrl(
  accountSlug: string,
  path: string,
  queryParams?: Record<string, string>
): string {
  const baseDomain = process.env.BASE_DOMAIN || "localhost:3000";
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const accountPath = `/accounts/${accountSlug}${normalizedPath}`;

  let queryString = "";
  if (queryParams && Object.keys(queryParams).length > 0) {
    const params = new URLSearchParams(queryParams);
    queryString = `?${params.toString()}`;
  }

  return `${protocol}://${baseDomain}${accountPath}${queryString}`;
}
