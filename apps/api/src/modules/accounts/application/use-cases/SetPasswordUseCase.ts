import { BaseUseCase, createZodValidator, TransactionManager } from "@nubbix/domain";
import { UserRepository } from "../../../identity/domain";
import { SetPasswordInput, SetPasswordOutput, setPasswordSchema } from "../dtos/SetPasswordDTO";
import { PasswordHasher } from "../services/PasswordHasher";
import { NotFoundError } from "../../../../shared/errors";
import { InvalidResetTokenException } from "../../../identity/domain/exceptions/InvalidResetTokenException";

export class SetPasswordUseCase extends BaseUseCase<SetPasswordInput, SetPasswordOutput> {
  constructor(
    private userRepository: UserRepository,
    private passwordHasher: PasswordHasher,
    private transactionManager: TransactionManager
  ) {
    super();
  }

  protected getInputValidator(): ReturnType<typeof createZodValidator<SetPasswordInput>> {
    // @ts-expect-error - Zod schema type inference
    return createZodValidator(setPasswordSchema);
  }

  protected async execute(input: SetPasswordInput): Promise<SetPasswordOutput> {
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
