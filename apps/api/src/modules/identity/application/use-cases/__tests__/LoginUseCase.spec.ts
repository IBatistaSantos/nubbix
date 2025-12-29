import { describe, it, expect, beforeEach, mock } from "bun:test";
import { faker } from "@faker-js/faker";
import { LoginUseCase } from "../LoginUseCase";
import { InMemoryUserRepository } from "../../../infrastructure/repositories/InMemoryUserRepository";
import { User, RoleValue } from "../../../domain";
import { PasswordHasher } from "../../../../accounts/application/services/PasswordHasher";
import { JwtService } from "../../../application/services/JwtService";
import { BadRequestError } from "../../../../../shared/errors";
import { Account } from "../../../../accounts/domain";
import { InMemoryAccountRepository } from "../../../../accounts/infrastructure/repositories/InMemoryAccountRepository";

describe("LoginUseCase", () => {
  let useCase: LoginUseCase;
  let userRepository: InMemoryUserRepository;
  let accountRepository: InMemoryAccountRepository;
  let passwordHasher: PasswordHasher;
  let jwtService: JwtService;
  let passwordHasherMock: ReturnType<typeof mock>;
  let jwtServiceMock: ReturnType<typeof mock>;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    accountRepository = new InMemoryAccountRepository();
    passwordHasherMock = mock(async (password: string, _hash: string) => {
      return password === "correctPassword";
    });
    passwordHasher = {
      hash: mock(() => Promise.resolve("hashed")),
      verify: passwordHasherMock,
    } as any;

    jwtServiceMock = mock(async (_payload: any) => {
      return "mock-jwt-token";
    });
    jwtService = {
      sign: jwtServiceMock,
      verify: mock(() => Promise.resolve({} as any)),
    } as any;

    useCase = new LoginUseCase(userRepository, passwordHasher, jwtService, accountRepository);
  });

  it("should login successfully with valid credentials", async () => {
    const email = faker.internet.email().toLowerCase();
    const password = "correctPassword";
    const hashedPassword = await Bun.password.hash(password);

    const account = Account.asFaker();
    await accountRepository.save(account);

    const user = User.asFaker({
      email,
      password: hashedPassword,
      role: RoleValue.USER,
      accountId: account.id.value,
    });
    await userRepository.save(user);

    const input = {
      email,
      password,
      accountSlug: account.slug.value,
    };

    const output = await useCase.run(input);

    expect(output).toHaveProperty("accessToken");
    expect(output).toHaveProperty("user");
    expect(output.user.email).toBe(email.toLowerCase());
    expect(output.user.id).toBe(user.id.value);
    expect(passwordHasherMock).toHaveBeenCalledTimes(1);
    expect(jwtServiceMock).toHaveBeenCalledTimes(1);
  });

  it("should throw InvalidCredentialsException when user does not exist", async () => {
    const account = Account.asFaker();
    await accountRepository.save(account);

    const input = {
      email: faker.internet.email(),
      password: faker.internet.password(),
      accountSlug: account.slug.value,
    };

    await expect(useCase.run(input)).rejects.toThrow(BadRequestError);
  });

  it("should throw InvalidCredentialsException when password is not set", async () => {
    const email = faker.internet.email();
    const account = Account.asFaker();
    await accountRepository.save(account);

    const user = User.asFaker({
      email,
      password: null,
      role: RoleValue.USER,
      accountId: account.id.value,
    });
    await userRepository.save(user);

    const input = {
      email,
      password: faker.internet.password(),
      accountSlug: account.slug.value,
    };

    await expect(useCase.run(input)).rejects.toThrow(BadRequestError);
  });

  it("should throw InvalidCredentialsException when password is incorrect", async () => {
    const email = faker.internet.email();
    const password = "correctPassword";
    const hashedPassword = await Bun.password.hash(password);
    const account = Account.asFaker();
    await accountRepository.save(account);

    const user = User.asFaker({
      email,
      password: hashedPassword,
      role: RoleValue.USER,
      accountId: account.id.value,
    });
    await userRepository.save(user);

    const input = {
      email,
      password: "wrongPassword",
      accountSlug: account.slug.value,
    };

    await expect(useCase.run(input)).rejects.toThrow(BadRequestError);
  });

  it("should return user data without password", async () => {
    const email = faker.internet.email().toLowerCase();
    const password = "correctPassword";
    const hashedPassword = await Bun.password.hash(password);
    const name = faker.person.fullName();
    const avatar = faker.image.avatar();
    const account = Account.asFaker();
    await accountRepository.save(account);

    const user = User.asFaker({
      email,
      password: hashedPassword,
      name,
      avatar,
      role: RoleValue.ADMIN,
      accountId: account.id.value,
    });
    await userRepository.save(user);

    const input = {
      email,
      password,
      accountSlug: account.slug.value,
    };

    const output = await useCase.run(input);

    expect(output.user).not.toHaveProperty("password");
    expect(output.user.name).toBe(name);
    expect(output.user.email).toBe(email.toLowerCase());
    expect(output.user.avatar).toBe(avatar);
    expect(output.user.role).toBe(RoleValue.ADMIN);
  });

  it("should throw NotFoundError when account does not exist", async () => {
    const input = {
      email: faker.internet.email(),
      password: faker.internet.password(),
      accountSlug: "non-existent-account",
    };

    await expect(useCase.run(input)).rejects.toThrow("Account not found");
  });

  it("should throw InvalidCredentialsException when user belongs to different account", async () => {
    const email = faker.internet.email();
    const password = "correctPassword";
    const hashedPassword = await Bun.password.hash(password);
    const account1 = Account.asFaker();
    const account2 = Account.asFaker();
    await accountRepository.save(account1);
    await accountRepository.save(account2);

    const user = User.asFaker({
      email,
      password: hashedPassword,
      role: RoleValue.USER,
      accountId: account1.id.value,
    });
    await userRepository.save(user);

    const input = {
      email,
      password,
      accountSlug: account2.slug.value,
    };

    await expect(useCase.run(input)).rejects.toThrow(BadRequestError);
  });
});
