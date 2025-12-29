import { describe, it, expect, beforeEach } from "bun:test";
import { faker } from "@faker-js/faker";
import { BunPasswordHasher } from "../BunPasswordHasher";

describe("BunPasswordHasher", () => {
  let passwordHasher: BunPasswordHasher;

  beforeEach(() => {
    passwordHasher = new BunPasswordHasher();
  });

  it("should hash a password", async () => {
    const password = faker.internet.password();
    const hash = await passwordHasher.hash(password);

    expect(hash).toBeDefined();
    expect(typeof hash).toBe("string");
    expect(hash.length).toBeGreaterThan(0);
    expect(hash).not.toBe(password);
  });

  it("should verify a correct password", async () => {
    const password = faker.internet.password();
    const hash = await passwordHasher.hash(password);

    const isValid = await passwordHasher.verify(password, hash);

    expect(isValid).toBe(true);
  });

  it("should reject an incorrect password", async () => {
    const password = faker.internet.password();
    const wrongPassword = faker.internet.password();
    const hash = await passwordHasher.hash(password);

    const isValid = await passwordHasher.verify(wrongPassword, hash);

    expect(isValid).toBe(false);
  });

  it("should produce different hashes for the same password", async () => {
    const password = faker.internet.password();
    const hash1 = await passwordHasher.hash(password);
    const hash2 = await passwordHasher.hash(password);

    // Hashes should be different due to salt
    expect(hash1).not.toBe(hash2);

    // But both should verify correctly
    const isValid1 = await passwordHasher.verify(password, hash1);
    const isValid2 = await passwordHasher.verify(password, hash2);

    expect(isValid1).toBe(true);
    expect(isValid2).toBe(true);
  });

  it("should handle minimum length password", async () => {
    const password = "12345678"; // Minimum 8 characters
    const hash = await passwordHasher.hash(password);

    const isValid = await passwordHasher.verify(password, hash);

    expect(isValid).toBe(true);
  });

  it("should handle special characters in password", async () => {
    const password = "P@ssw0rd!@#$%^&*()";
    const hash = await passwordHasher.hash(password);

    const isValid = await passwordHasher.verify(password, hash);

    expect(isValid).toBe(true);
  });
});

