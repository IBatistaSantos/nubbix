import { Context, Next } from "hono";
import { HonoJwtService } from "../../../modules/identity/infrastructure/services/HonoJwtService";
import { UnauthorizedError } from "../../../shared/errors";

const AUTH_CONTEXT_KEY = "auth";

export interface AuthContext {
  userId: string;
  email: string;
  accountId: string;
  role: string;
}

declare module "hono" {
  interface ContextVariableMap {
    [AUTH_CONTEXT_KEY]: AuthContext;
  }
}

let jwtService: HonoJwtService | null = null;

function getJwtService(): HonoJwtService {
  if (!jwtService) {
    jwtService = new HonoJwtService();
  }
  return jwtService;
}

export function authMiddleware() {
  return async (c: Context, next: Next) => {
    const authHeader = c.req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("Missing or invalid authorization header");
    }

    const token = authHeader.substring(7);

    try {
      const jwtService = getJwtService();
      const payload = await jwtService.verify(token);

      const authContext: AuthContext = {
        userId: payload.userId,
        email: payload.email,
        accountId: payload.accountId,
        role: payload.role,
      };

      c.set(AUTH_CONTEXT_KEY, authContext);
      await next();
    } catch (error) {
      throw new UnauthorizedError(
        error instanceof Error ? error.message : "Invalid or expired token"
      );
    }
  };
}

export function getAuthContext(c: Context): AuthContext {
  const authContext = c.get(AUTH_CONTEXT_KEY);
  if (!authContext) {
    throw new UnauthorizedError("User not authenticated");
  }
  return authContext;
}
