import { BaseUseCase, createZodValidator, TransactionManager } from "@nubbix/domain";
import { UserRepository } from "../../domain";
import {
  ResetPasswordInput,
  ResetPasswordOutput,
  resetPasswordSchema,
} from "../dtos/ResetPasswordDTO";
import { PasswordHasher } from "../../../accounts/application/services/PasswordHasher";
import { NotFoundError } from "../../../../shared/errors";
import { InvalidResetTokenException } from "../../domain/exceptions/InvalidResetTokenException";
import { AccountRepository, Slug } from "../../../accounts/domain";

export class ResetPasswordUseCase extends BaseUseCase<ResetPasswordInput, ResetPasswordOutput> {
  constructor(
    private userRepository: UserRepository,
    private passwordHasher: PasswordHasher,
    private transactionManager: TransactionManager,
    private accountRepository: AccountRepository
  ) {
    super();
  }

  protected getInputValidator(): ReturnType<typeof createZodValidator<ResetPasswordInput>> {
    // @ts-expect-error - Zod schema type inference
    return createZodValidator(resetPasswordSchema);
  }

  protected async execute(input: ResetPasswordInput): Promise<ResetPasswordOutput> {
    // Buscar Account pelo slug
    const accountSlug = Slug.create(input.accountSlug);
    const account = await this.accountRepository.findBySlug(accountSlug);

    if (!account) {
      throw new NotFoundError("Account not found");
    }

    const user = await this.userRepository.findByResetToken(input.token);

    if (!user) {
      throw new NotFoundError("Invalid or expired token");
    }

    // Validar que o usuário pertence à account correta
    if (user.accountId !== account.id.value) {
      throw new NotFoundError("Invalid or expired token");
    }

    try {
      user.validateResetToken(input.token);
    } catch (error) {
      if (error instanceof InvalidResetTokenException) {
        throw new NotFoundError("Invalid or expired token");
      }
      throw error;
    }

    const hashedPassword = await this.passwordHasher.hash(input.password);

    return await this.transactionManager.runInTransaction(async (tx) => {
      user.updatePassword(hashedPassword);
      await this.userRepository.save(user, tx);

      return {
        userId: user.id.value,
        email: user.email.value,
      };
    });
  }
}
