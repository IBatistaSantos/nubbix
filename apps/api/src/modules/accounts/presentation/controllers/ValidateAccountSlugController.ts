import { HttpHandler } from "../../../../shared/presentation/http/interfaces/HttpRequest";
import { createValidateAccountSlugUseCase } from "../../infrastructure/di/ValidateAccountSlugUseCaseFactory";
import { ValidateAccountSlugInput } from "../../application/use-cases/ValidateAccountSlugUseCase";

export const validateAccountSlugController: HttpHandler = async (request) => {
  const slug = request.query?.slug as string;

  if (!slug) {
    return {
      status: 400,
      data: { message: "Slug is required" },
    };
  }

  const input: ValidateAccountSlugInput = { slug };
  const useCase = createValidateAccountSlugUseCase();
  const output = await useCase.run(input);

  return {
    status: 200,
    data: output,
  };
};
