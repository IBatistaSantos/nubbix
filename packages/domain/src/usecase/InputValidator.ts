export interface InputValidator<TInput> {
  validate(input: unknown): TInput;
}
