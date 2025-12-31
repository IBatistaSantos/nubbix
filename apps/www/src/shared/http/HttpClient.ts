export interface RequestOptions {
  headers?: Record<string, string>;
  body?: unknown;
  signal?: AbortSignal;
}

export interface HttpClient {
  get<T>(endpoint: string, options?: RequestOptions): Promise<T>;
  post<T>(endpoint: string, options?: RequestOptions): Promise<T>;
  put<T>(endpoint: string, options?: RequestOptions): Promise<T>;
  patch<T>(endpoint: string, options?: RequestOptions): Promise<T>;
  delete<T>(endpoint: string, options?: RequestOptions): Promise<T>;
  setAuthToken(token: string): Promise<void>;
  clearAuthToken(): Promise<void>;
}
