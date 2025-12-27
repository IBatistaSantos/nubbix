import { PasswordHasher } from "../../application/services/PasswordHasher";

export class BunPasswordHasher implements PasswordHasher {
  async hash(password: string): Promise<string> {
    return Bun.password.hash(password, {
      algorithm: "bcrypt",
      cost: 10,
    });
  }
}

