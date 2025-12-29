import { describe, it, expect, beforeEach } from "bun:test";
import { faker } from "@faker-js/faker";
import { GetCurrentUserUseCase } from "../GetCurrentUserUseCase";
import { InMemoryUserRepository } from "../../../infrastructure/repositories/InMemoryUserRepository";
import { User, RoleValue } from "../../../domain";
import { NotFoundError } from "../../../../../shared/errors";

describe("GetCurrentUserUseCase", () => {
  let useCase: GetCurrentUserUseCase;
  let userRepository: InMemoryUserRepository;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    useCase = new GetCurrentUserUseCase(userRepository);
  });

  it("should return user data successfully when user exists", async () => {
    const email = faker.internet.email().toLowerCase();
    const name = faker.person.fullName();
    const avatar = faker.image.avatar();
    const accountId = faker.string.uuid();

    const user = User.asFaker({
      email,
      name,
      avatar,
      role: RoleValue.USER,
      accountId,
    });
    await userRepository.save(user);

    const output = await useCase.run(user.id.value);

    expect(output).toBeDefined();
    expect(output.id).toBe(user.id.value);
    expect(output.name).toBe(name);
    expect(output.email).toBe(email);
    expect(output.accountId).toBe(accountId);
    expect(output.role).toBe(RoleValue.USER);
    expect(output.avatar).toBe(avatar);
  });

  it("should return user data without sensitive information", async () => {
    const user = User.asFaker({
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: RoleValue.ADMIN,
    });
    await userRepository.save(user);

    const output = await useCase.run(user.id.value);

    expect(output).not.toHaveProperty("password");
    expect(output).not.toHaveProperty("deletedAt");
    expect(output).not.toHaveProperty("resetPasswordToken");
    expect(output).not.toHaveProperty("resetPasswordTokenExpiresAt");
  });

  it("should throw NotFoundError when user does not exist", async () => {
    const nonExistentUserId = faker.string.uuid();

    await expect(useCase.run(nonExistentUserId)).rejects.toThrow(NotFoundError);
    await expect(useCase.run(nonExistentUserId)).rejects.toThrow("User not found");
  });

  it("should validate input and accept string", async () => {
    const user = User.asFaker();
    await userRepository.save(user);

    const output = await useCase.run(user.id.value);

    expect(output).toBeDefined();
    expect(output.id).toBe(user.id.value);
  });

  it("should throw error when input is not a string", async () => {
    await expect(useCase.run(123 as any)).rejects.toThrow("Input must be a string");
    await expect(useCase.run(null as any)).rejects.toThrow("Input must be a string");
    await expect(useCase.run(undefined as any)).rejects.toThrow("Input must be a string");
    await expect(useCase.run({} as any)).rejects.toThrow("Input must be a string");
    await expect(useCase.run([] as any)).rejects.toThrow("Input must be a string");
  });

  it("should return all user roles correctly", async () => {
    const roles = [RoleValue.USER, RoleValue.ADMIN];

    for (const role of roles) {
      const user = User.asFaker({ role });
      await userRepository.save(user);

      const output = await useCase.run(user.id.value);

      expect(output.role).toBe(role);
    }
  });

  it("should handle user with null avatar", async () => {
    const user = User.asFaker({
      avatar: undefined,
    });
    await userRepository.save(user);

    const output = await useCase.run(user.id.value);

    expect(output.avatar).toBeNull();
  });
});
