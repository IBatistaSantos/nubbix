import type { HttpRequest } from "../../../src/shared/presentation/http/interfaces/HttpRequest";

export class TestRequestBuilder {
  private body: Record<string, any> = {};
  private query: Record<string, any> = {};
  private params: Record<string, any> = {};
  private headers: Record<string, any> = {};

  withBody(body: Record<string, any>): this {
    this.body = { ...this.body, ...body };
    return this;
  }

  withQuery(query: Record<string, any>): this {
    this.query = { ...this.query, ...query };
    return this;
  }

  withParams(params: Record<string, any>): this {
    this.params = { ...this.params, ...params };
    return this;
  }

  withHeaders(headers: Record<string, any>): this {
    this.headers = { ...this.headers, ...headers };
    return this;
  }

  build(): HttpRequest {
    return {
      body: this.body,
      query: this.query,
      params: this.params,
      headers: this.headers,
    };
  }
}
