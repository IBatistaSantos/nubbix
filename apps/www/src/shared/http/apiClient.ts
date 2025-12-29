type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: Record<string, string>;
  body?: unknown;
  signal?: AbortSignal;
};

export class ApiClientError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.errors = errors;
  }
}

const getBaseUrl = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  if (envUrl.startsWith("http://") || envUrl.startsWith("https://")) {
    return envUrl.replace(/\/+$/, "");
  }

  const protocol = process.env.NODE_ENV === "production" ? "https://" : "http://";
  const cleanUrl = envUrl.replace(/^\/+/, "").replace(/\/+$/, "");

  return `${protocol}${cleanUrl}`;
};

export async function apiClient<T = unknown>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const baseUrl = getBaseUrl();
  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}/v1${normalizedEndpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const config: RequestInit = {
    method: options.method || "GET",
    headers,
    credentials: "include",
    signal: options.signal,
  };

  if (options.body && options.method !== "GET") {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);

    const contentType = response.headers.get("content-type");
    const hasContent = contentType?.includes("application/json");

    let data: unknown = null;
    if (hasContent) {
      data = await response.json();
    }

    if (!response.ok) {
      const errorData = data as { message?: string; errors?: Record<string, string[]> };
      throw new ApiClientError(
        errorData.message || `HTTP error! status: ${response.status}`,
        response.status,
        errorData.errors
      );
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }

    if (error instanceof Error && error.name === "AbortError") {
      throw new ApiClientError("Request aborted", 0);
    }

    throw new ApiClientError(
      error instanceof Error ? error.message : "An unknown error occurred",
      0
    );
  }
}
