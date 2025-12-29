import { BaseUseCase, createZodValidator, Email, TransactionManager } from "@nubbix/domain";
import { UserRepository } from "../../domain";
import {
  ForgotPasswordInput,
  ForgotPasswordOutput,
  forgotPasswordSchema,
} from "../dtos/ForgotPasswordDTO";
import { randomBytes } from "crypto";
import { SendNotificationUseCase } from "../../../notifications/application/use-cases/SendNotificationUseCase";

const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

export class ForgotPasswordUseCase extends BaseUseCase<ForgotPasswordInput, ForgotPasswordOutput> {
  constructor(
    private userRepository: UserRepository,
    private transactionManager: TransactionManager,
    private sendNotificationUseCase: SendNotificationUseCase
  ) {
    super();
  }

  protected getInputValidator(): ReturnType<typeof createZodValidator<ForgotPasswordInput>> {
    // @ts-expect-error - Zod schema type inference
    return createZodValidator(forgotPasswordSchema);
  }

  protected async execute(input: ForgotPasswordInput): Promise<ForgotPasswordOutput> {
    const email = Email.create(input.email);
    const user = await this.userRepository.findByEmail(email);

    // Always return success for security reasons (prevent user enumeration)
    if (!user) {
      return {
        message: "If the email exists, a password reset link has been sent",
      };
    }

    const token = randomBytes(32).toString("hex");

    await this.transactionManager.runInTransaction(async (tx) => {
      user.resetPassword(token, TOKEN_EXPIRY_MS);
      await this.userRepository.save(user, tx);

      const frontendUrl = process.env.FRONTEND_URL;
      const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

      await this.sendNotificationUseCase.run({
        context: "forgot.password",
        to: {
          name: user.name,
          email: user.email.value,
        },
        channel: "email",
        accountId: user.accountId,
        variables: {
          name: user.name,
          url: resetUrl,
        },
      });
    });

    return {
      message: "If the email exists, a password reset link has been sent",
    };
  }
}
