import { setAuthToken, clearAuthToken, getAuthToken } from "../actions/authActions";
import type { HttpClient, RequestOptions } from "./HttpClient";
import { ApiClientError } from "./ApiClientError";

const getBaseUrl = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  if (envUrl.startsWith("http://") || envUrl.startsWith("https://")) {
    return envUrl.replace(/\/+$/, "");
  }

  const protocol = process.env.NODE_ENV === "production" ? "https://" : "http://";
  const cleanUrl = envUrl.replace(/^\/+/, "").replace(/\/+$/, "");

  return `${protocol}${cleanUrl}`;
};

export class FetchHttpClient implements HttpClient {
  private token: string | null = null;

  async setAuthToken(token: string): Promise<void> {
    this.token = token;
    await setAuthToken(token);
  }

  async clearAuthToken(): Promise<void> {
    this.token = null;
    await clearAuthToken();
  }

  private async getAuthToken(): Promise<string | null> {
    if (this.token) {
      return this.token;
    }

    try {
      const token = await getAuthToken();
      if (token) {
        this.token = token;
        return token;
      }
    } catch {
      return null;
    }

    return null;
  }

  private async request<T>(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    options?: RequestOptions
  ): Promise<T> {
    const baseUrl = getBaseUrl();
    const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    const url = `${baseUrl}/v1${normalizedEndpoint}`;

    const token = await this.getAuthToken();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...options?.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const config: RequestInit = {
      method,
      headers,
      credentials: "include",
      signal: options?.signal,
    };

    if (options?.body && method !== "GET") {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);

      if (response.status === 401) {
        this.token = null;
      }

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
        if (error.status === 401) {
          this.token = null;
        }
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

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, "GET", options);
  }

  async post<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, "POST", options);
  }

  async put<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, "PUT", options);
  }

  async patch<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, "PATCH", options);
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, "DELETE", options);
  }
}
