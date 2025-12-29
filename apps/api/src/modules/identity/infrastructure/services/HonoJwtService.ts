import { sign, verify } from "hono/jwt";
import { JwtService, JwtPayload } from "../../application/services/JwtService";

export class HonoJwtService implements JwtService {
  private readonly privateKey: string;
  private readonly publicKey: string;
  private readonly expiresIn: string;

  constructor() {
    const rawPrivateKey = process.env.JWT_PRIVATE_KEY || "";
    const rawPublicKey = process.env.JWT_PUBLIC_KEY || "";
    this.expiresIn = process.env.JWT_EXPIRES_IN || "7d";

    if (!rawPrivateKey || !rawPublicKey) {
      throw new Error("JWT_PRIVATE_KEY and JWT_PUBLIC_KEY environment variables are required");
    }

    this.privateKey = this.normalizeKey(rawPrivateKey);
    this.publicKey = this.normalizeKey(rawPublicKey);
  }

  private normalizeKey(key: string): string {
    let normalized = key.trim();

    if (normalized.startsWith('"') && normalized.endsWith('"')) {
      normalized = normalized.slice(1, -1);
    }

    if (normalized.startsWith("'") && normalized.endsWith("'")) {
      normalized = normalized.slice(1, -1);
    }

    normalized = normalized.replace(/\\n/g, "\n");

    normalized = normalized.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

    const lines = normalized
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (lines.length === 0) {
      throw new Error("Invalid key format: key is empty after normalization");
    }

    normalized = lines.join("\n");

    if (!normalized.endsWith("\n")) {
      normalized += "\n";
    }

    return normalized;
  }

  async sign(payload: Omit<JwtPayload, "iat" | "exp">): Promise<string> {
    try {
      const now = Math.floor(Date.now() / 1000);
      const expiresInSeconds = this.parseExpiresIn(this.expiresIn);

      const fullPayload = {
        ...payload,
        iat: now,
        exp: now + expiresInSeconds,
      } as JwtPayload;

      return await sign(fullPayload, this.privateKey, "RS256");
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("JWT signing error:", error);
      // eslint-disable-next-line no-console
      console.error("Private key preview (first 50 chars):", this.privateKey.substring(0, 50));
      // eslint-disable-next-line no-console
      console.error("Private key has newlines:", this.privateKey.includes("\n"));
      throw new Error(
        `Failed to sign JWT token: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  async verify(token: string): Promise<JwtPayload> {
    try {
      const payload = await verify(token, this.publicKey, "RS256");
      return payload as JwtPayload;
    } catch {
      throw new Error("Invalid or expired token");
    }
  }

  private parseExpiresIn(expiresIn: string): number {
    const unit = expiresIn.slice(-1);
    const value = parseInt(expiresIn.slice(0, -1), 10);

    switch (unit) {
      case "s":
        return value;
      case "m":
        return value * 60;
      case "h":
        return value * 60 * 60;
      case "d":
        return value * 24 * 60 * 60;
      default:
        return 7 * 24 * 60 * 60; // default 7 days
    }
  }
}
