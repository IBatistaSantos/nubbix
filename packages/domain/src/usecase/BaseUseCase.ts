import { InputValidator } from "./InputValidator";

export abstract class BaseUseCase<TInput, TOutput> {
  protected abstract getInputValidator(): InputValidator<TInput>;
  protected abstract execute(input: TInput): Promise<TOutput>;

  async run(input: unknown): Promise<TOutput> {
    const validator = this.getInputValidator();
    const validatedInput = validator.validate(input);
    return this.execute(validatedInput);
  }
}
