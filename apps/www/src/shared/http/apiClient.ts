type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: Record<string, string>;
  body?: unknown;
  signal?: AbortSignal;
};

type ApiError = {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
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
  if (typeof window === "undefined") {
    // Server-side: usar variável de ambiente ou default
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  }
  // Client-side: usar variável de ambiente
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
};

export async function apiClient<T = unknown>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/v1${endpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const config: RequestInit = {
    method: options.method || "GET",
    headers,
    credentials: "include", // Importante: envia cookies automaticamente
    signal: options.signal,
  };

  if (options.body && options.method !== "GET") {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);

    // Se não houver conteúdo, retornar vazio
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
