import { describe, it, expect, beforeEach, mock } from "bun:test";
import { faker } from "@faker-js/faker";
import { LoginUseCase } from "../LoginUseCase";
import { InMemoryUserRepository } from "../../../infrastructure/repositories/InMemoryUserRepository";
import { User, RoleValue } from "../../../domain";
import { PasswordHasher } from "../../../../accounts/application/services/PasswordHasher";
import { JwtService } from "../../../application/services/JwtService";
import { BadRequestError } from "../../../../../shared/errors";

describe("LoginUseCase", () => {
  let useCase: LoginUseCase;
  let userRepository: InMemoryUserRepository;
  let passwordHasher: PasswordHasher;
  let jwtService: JwtService;
  let passwordHasherMock: ReturnType<typeof mock>;
  let jwtServiceMock: ReturnType<typeof mock>;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    passwordHasherMock = mock(async (password: string, hash: string) => {
      return password === "correctPassword";
    });
    passwordHasher = {
      hash: mock(() => Promise.resolve("hashed")),
      verify: passwordHasherMock,
    } as any;

    jwtServiceMock = mock(async (payload: any) => {
      return "mock-jwt-token";
    });
    jwtService = {
      sign: jwtServiceMock,
      verify: mock(() => Promise.resolve({} as any)),
    } as any;

    useCase = new LoginUseCase(userRepository, passwordHasher, jwtService);
  });

  it("should login successfully with valid credentials", async () => {
    const email = faker.internet.email().toLowerCase();
    const password = "correctPassword";
    const hashedPassword = await Bun.password.hash(password);

    const user = User.asFaker({
      email,
      password: hashedPassword,
      role: RoleValue.USER,
    });
    await userRepository.save(user);

    const input = {
      email,
      password,
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
    const input = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    await expect(useCase.run(input)).rejects.toThrow(BadRequestError);
  });

  it("should throw InvalidCredentialsException when password is not set", async () => {
    const email = faker.internet.email();
    const user = User.asFaker({
      email,
      password: null,
      role: RoleValue.USER,
    });
    await userRepository.save(user);

    const input = {
      email,
      password: faker.internet.password(),
    };

    await expect(useCase.run(input)).rejects.toThrow(BadRequestError);
  });

  it("should throw InvalidCredentialsException when password is incorrect", async () => {
    const email = faker.internet.email();
    const password = "correctPassword";
    const hashedPassword = await Bun.password.hash(password);

    const user = User.asFaker({
      email,
      password: hashedPassword,
      role: RoleValue.USER,
    });
    await userRepository.save(user);

    const input = {
      email,
      password: "wrongPassword",
    };

    await expect(useCase.run(input)).rejects.toThrow(BadRequestError);
  });

  it("should return user data without password", async () => {
    const email = faker.internet.email().toLowerCase();
    const password = "correctPassword";
    const hashedPassword = await Bun.password.hash(password);
    const name = faker.person.fullName();
    const avatar = faker.image.avatar();

    const user = User.asFaker({
      email,
      password: hashedPassword,
      name,
      avatar,
      role: RoleValue.ADMIN,
    });
    await userRepository.save(user);

    const input = {
      email,
      password,
    };

    const output = await useCase.run(input);

    expect(output.user).not.toHaveProperty("password");
    expect(output.user.name).toBe(name);
    expect(output.user.email).toBe(email.toLowerCase());
    expect(output.user.avatar).toBe(avatar);
    expect(output.user.role).toBe(RoleValue.ADMIN);
  });
});
