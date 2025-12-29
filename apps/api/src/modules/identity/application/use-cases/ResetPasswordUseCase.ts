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

export class ResetPasswordUseCase extends BaseUseCase<ResetPasswordInput, ResetPasswordOutput> {
  constructor(
    private userRepository: UserRepository,
    private passwordHasher: PasswordHasher,
    private transactionManager: TransactionManager
  ) {
    super();
  }

  protected getInputValidator(): ReturnType<typeof createZodValidator<ResetPasswordInput>> {
    // @ts-expect-error - Zod schema type inference
    return createZodValidator(resetPasswordSchema);
  }

  protected async execute(input: ResetPasswordInput): Promise<ResetPasswordOutput> {
    const user = await this.userRepository.findByResetToken(input.token);

    if (!user) {
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
