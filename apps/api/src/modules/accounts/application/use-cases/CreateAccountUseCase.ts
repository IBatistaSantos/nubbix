import { BaseUseCase, createZodValidator, TransactionManager } from "@nubbix/domain";
import { Account, AccountRepository, AccountType, Slug } from "../../domain";
import { User, UserRepository, RoleValue } from "../../../identity/domain";
import {
  CreateAccountInput,
  CreateAccountOutput,
  createAccountSchema,
} from "../dtos/CreateAccountDTO";
import { generateRandomPassword } from "../../../../shared/utils";
import { PasswordHasher } from "../services/PasswordHasher";
import { ConflictError } from "../../../../shared/errors";

export class CreateAccountUseCase extends BaseUseCase<CreateAccountInput, CreateAccountOutput> {
  constructor(
    private accountRepository: AccountRepository,
    private userRepository: UserRepository,
    private passwordHasher: PasswordHasher,
    private transactionManager: TransactionManager
  ) {
    super();
  }

  protected getInputValidator(): ReturnType<typeof createZodValidator<CreateAccountInput>> {
    // @ts-ignore
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

    const randomPassword = generateRandomPassword();
    const hashedPassword = await this.passwordHasher.hash(randomPassword);

    return await this.transactionManager.runInTransaction(async (tx) => {
      const savedAccount = await this.accountRepository.save(account, tx);

      const user = new User({
        name: input.responsibleName,
        email: input.responsibleEmail,
        password: hashedPassword,
        accountId: savedAccount.id.value,
        role: RoleValue.SUPER_ADMIN,
      });

      user.validate();

      await this.userRepository.save(user, tx);

      return {
        accountId: savedAccount.id.value,
        slug: savedAccount.slug.value,
      };
    });
  }
}
