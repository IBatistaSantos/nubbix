import { BaseUseCase, ID, InputValidator } from "@nubbix/domain";
import { UserRepository } from "../../domain";
import { GetCurrentUserOutput } from "../dtos/GetCurrentUserDTO";
import { NotFoundError } from "../../../../shared/errors";

export class GetCurrentUserUseCase extends BaseUseCase<string, GetCurrentUserOutput> {
  constructor(private userRepository: UserRepository) {
    super();
  }

  protected getInputValidator(): InputValidator<string> {
    return {
      validate(input: unknown): string {
        if (typeof input !== "string") {
          throw new Error("Input must be a string");
        }
        return input;
      },
    };
  }

  protected async execute(userId: string): Promise<GetCurrentUserOutput> {
    const user = await this.userRepository.findById(ID.create(userId));

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return user.toOutput();
  }
}
