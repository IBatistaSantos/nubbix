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
    return key.replace(/\\n/g, "\n");
  }

  async sign(payload: Omit<JwtPayload, "iat" | "exp">): Promise<string> {
    const now = Math.floor(Date.now() / 1000);
    const expiresInSeconds = this.parseExpiresIn(this.expiresIn);

    const fullPayload = {
      ...payload,
      iat: now,
      exp: now + expiresInSeconds,
    } as JwtPayload;

    return await sign(fullPayload, this.privateKey, "RS256");
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
