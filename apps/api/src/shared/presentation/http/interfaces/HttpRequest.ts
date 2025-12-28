export interface HttpRequest {
  body: unknown;
  query: Record<string, string>;
  params: Record<string, string>;
  headers: Record<string, string>;
}

export interface HttpResponse {
  status: number;
  data: unknown;
}

export type HttpHandler = (request: HttpRequest) => Promise<HttpResponse>;
