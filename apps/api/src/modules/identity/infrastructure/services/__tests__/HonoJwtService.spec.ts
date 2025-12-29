import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { HonoJwtService } from "../HonoJwtService";
import { generateKeyPairSync } from "crypto";

describe("HonoJwtService", () => {
  let privateKey: string;
  let publicKey: string;
  let originalPrivateKey: string | undefined;
  let originalPublicKey: string | undefined;
  let originalExpiresIn: string | undefined;

  beforeEach(() => {
    // Generate RSA key pair for testing
    const { privateKey: privKey, publicKey: pubKey } = generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: "spki",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
      },
    });

    privateKey = privKey;
    publicKey = pubKey;

    // Save original env vars
    originalPrivateKey = process.env.JWT_PRIVATE_KEY;
    originalPublicKey = process.env.JWT_PUBLIC_KEY;
    originalExpiresIn = process.env.JWT_EXPIRES_IN;

    // Set test env vars
    process.env.JWT_PRIVATE_KEY = privateKey;
    process.env.JWT_PUBLIC_KEY = publicKey;
    process.env.JWT_EXPIRES_IN = "1h";
  });

  afterEach(() => {
    // Restore original env vars
    if (originalPrivateKey !== undefined) {
      process.env.JWT_PRIVATE_KEY = originalPrivateKey;
    } else {
      delete process.env.JWT_PRIVATE_KEY;
    }

    if (originalPublicKey !== undefined) {
      process.env.JWT_PUBLIC_KEY = originalPublicKey;
    } else {
      delete process.env.JWT_PUBLIC_KEY;
    }

    if (originalExpiresIn !== undefined) {
      process.env.JWT_EXPIRES_IN = originalExpiresIn;
    } else {
      delete process.env.JWT_EXPIRES_IN;
    }
  });

  it("should sign a JWT token successfully", async () => {
    const jwtService = new HonoJwtService();
    const payload = {
      userId: "user-123",
      email: "test@example.com",
      accountId: "account-456",
      role: "USER",
    };

    const token = await jwtService.sign(payload);

    expect(token).toBeDefined();
    expect(typeof token).toBe("string");
    expect(token.split(".").length).toBe(3); // JWT has 3 parts
  });

  it("should verify a valid JWT token", async () => {
    const jwtService = new HonoJwtService();
    const payload = {
      userId: "user-123",
      email: "test@example.com",
      accountId: "account-456",
      role: "USER",
    };

    const token = await jwtService.sign(payload);
    const verified = await jwtService.verify(token);

    expect(verified.userId).toBe(payload.userId);
    expect(verified.email).toBe(payload.email);
    expect(verified.accountId).toBe(payload.accountId);
    expect(verified.role).toBe(payload.role);
    expect(verified.iat).toBeDefined();
    expect(verified.exp).toBeDefined();
  });

  it("should throw error when verifying invalid token", async () => {
    const jwtService = new HonoJwtService();
    const invalidToken = "invalid.token.here";

    await expect(jwtService.verify(invalidToken)).rejects.toThrow("Invalid or expired token");
  });

  it("should throw error when JWT keys are not set", () => {
    delete process.env.JWT_PRIVATE_KEY;
    delete process.env.JWT_PUBLIC_KEY;

    expect(() => new HonoJwtService()).toThrow(
      "JWT_PRIVATE_KEY and JWT_PUBLIC_KEY environment variables are required"
    );
  });

  it("should parse expires in correctly for different units", async () => {
    const payload = {
      userId: "user-123",
      email: "test@example.com",
      accountId: "account-456",
      role: "USER",
    };

    // Test with 1h (should expire in 3600 seconds)
    process.env.JWT_EXPIRES_IN = "1h";
    const jwtService1h = new HonoJwtService();
    const token1h = await jwtService1h.sign(payload);
    const verified1h = await jwtService1h.verify(token1h);
    const now = Math.floor(Date.now() / 1000);
    const expectedExp = now + 3600;
    expect(Math.abs((verified1h.exp || 0) - expectedExp)).toBeLessThan(5);

    // Test with 7d
    process.env.JWT_EXPIRES_IN = "7d";
    const jwtService7d = new HonoJwtService();
    const token7d = await jwtService7d.sign(payload);
    const verified7d = await jwtService7d.verify(token7d);
    const expectedExp7d = now + 7 * 24 * 60 * 60;
    expect(Math.abs((verified7d.exp || 0) - expectedExp7d)).toBeLessThan(5);
  });
});
