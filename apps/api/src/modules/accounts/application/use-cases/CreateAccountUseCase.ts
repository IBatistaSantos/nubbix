import { BaseUseCase, createZodValidator, TransactionManager } from "@nubbix/domain";
import { Account, AccountRepository, AccountType, Slug } from "../../domain";
import { User, UserRepository, RoleValue } from "../../../identity/domain";
import {
  CreateAccountInput,
  CreateAccountOutput,
  createAccountSchema,
} from "../dtos/CreateAccountDTO";
import { randomBytes } from "crypto";
import { ConflictError } from "../../../../shared/errors";
import { SendNotificationUseCase } from "../../../notifications/application/use-cases/SendNotificationUseCase";
import { generateAccountUrl } from "../../../../shared/utils";

export class CreateAccountUseCase extends BaseUseCase<CreateAccountInput, CreateAccountOutput> {
  constructor(
    private accountRepository: AccountRepository,
    private userRepository: UserRepository,
    private transactionManager: TransactionManager,
    private sendNotificationUseCase: SendNotificationUseCase
  ) {
    super();
  }

  protected getInputValidator(): ReturnType<typeof createZodValidator<CreateAccountInput>> {
    // @ts-expect-error - Zod schema type inference
    return createZodValidator(createAccountSchema);
  }

  protected async execute(input: CreateAccountInput): Promise<CreateAccountOutput> {
    const slug = Slug.create(input.slug);

    const existingAccountBySlug = await this.accountRepository.findBySlug(slug);
    if (existingAccountBySlug) {
      throw new ConflictError("Account with this slug already exists");
    }

    const account = new Account({
      name: input.accountName,
      slug: input.slug,
      description: input.description ?? null,
      website: input.website && input.website.trim() !== "" ? input.website : null,
      logo: input.logo && input.logo.trim() !== "" ? input.logo : null,
      accountType: AccountType.fromValue(input.accountType),
    });

    account.validate();

    const token = randomBytes(32).toString("hex");
    const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000;

    return await this.transactionManager.runInTransaction(async (tx) => {
      const savedAccount = await this.accountRepository.save(account, tx);

      const user = new User({
        name: input.responsibleName,
        email: input.responsibleEmail,
        password: null,
        accountId: savedAccount.id.value,
        role: RoleValue.SUPER_ADMIN,
      });

      user.resetPassword(token, TOKEN_EXPIRY_MS);
      user.validate();

      await this.userRepository.save(user, tx);

      const onboardingUrl = generateAccountUrl(savedAccount.slug.value, "/onboarding", { token });

      await this.sendNotificationUseCase.run({
        context: "account.welcome",
        to: {
          name: input.responsibleName,
          email: input.responsibleEmail,
        },
        channel: "email",
        accountId: savedAccount.id.value,
        variables: {
          name: input.responsibleName,
          url: onboardingUrl,
        },
      });

      return {
        accountId: savedAccount.id.value,
        slug: savedAccount.slug.value,
      };
    });
  }
}
