import { PasswordHasher } from "../../application/services/PasswordHasher";

export class BunPasswordHasher implements PasswordHasher {
  async hash(password: string): Promise<string> {
    return Bun.password.hash(password, {
      algorithm: "bcrypt",
      cost: 10,
    });
  }

  async verify(password: string, hash: string): Promise<boolean> {
    return Bun.password.verify(password, hash);
  }
}
