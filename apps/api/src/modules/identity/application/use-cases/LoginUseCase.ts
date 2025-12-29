import { BaseUseCase, createZodValidator, Email } from "@nubbix/domain";
import { UserRepository } from "../../domain";
import { LoginInput, LoginOutput, loginSchema } from "../dtos/LoginDTO";
import { PasswordHasher } from "../../../accounts/application/services/PasswordHasher";
import { JwtService } from "../services/JwtService";
import { InvalidCredentialsException } from "../../domain/exceptions/InvalidCredentialsException";
import { AccountRepository, Slug } from "../../../accounts/domain";
import { NotFoundError } from "../../../../shared/errors";

export class LoginUseCase extends BaseUseCase<LoginInput, LoginOutput> {
  constructor(
    private userRepository: UserRepository,
    private passwordHasher: PasswordHasher,
    private jwtService: JwtService,
    private accountRepository: AccountRepository
  ) {
    super();
  }

  protected getInputValidator(): ReturnType<typeof createZodValidator<LoginInput>> {
    // @ts-expect-error - Zod schema type inference
    return createZodValidator(loginSchema);
  }

  protected async execute(input: LoginInput): Promise<LoginOutput> {
    const accountSlug = Slug.create(input.accountSlug);
    const account = await this.accountRepository.findBySlug(accountSlug);

    if (!account) {
      throw new NotFoundError("Account not found");
    }

    const email = Email.create(input.email);
    const accountId = account.id;
    const user = await this.userRepository.findByEmailAndAccountId(email, accountId);

    if (!user) {
      throw new InvalidCredentialsException();
    }

    if (!user.password) {
      throw new InvalidCredentialsException();
    }

    const isPasswordValid = await this.passwordHasher.verify(input.password, user.password);

    if (!isPasswordValid) {
      throw new InvalidCredentialsException();
    }

    const accessToken = await this.jwtService.sign({
      userId: user.id.value,
      email: user.email.value,
      accountId: user.accountId,
      role: user.role.value,
    });

    return {
      accessToken,
      user: user.toOutput(),
    };
  }
}
