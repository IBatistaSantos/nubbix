import { useMemo } from "react";
import { FetchHttpClient } from "./FetchHttpClient";
import type { HttpClient } from "./HttpClient";

export function useHttpClient(): HttpClient {
  return useMemo(() => new FetchHttpClient(), []);
}
