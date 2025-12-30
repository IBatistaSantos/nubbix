import { ApiClientError } from "../../../../shared/http/apiClient";

/**
 * Extrai uma mensagem de erro amigável ao usuário específica para autenticação
 */
export function getAuthErrorMessage(error: unknown): string | null {
  if (!error) return null;

  if (error instanceof ApiClientError) {
    if (error.status === 401) {
      return "E-mail ou senha incorretos. Verifique suas credenciais e tente novamente.";
    }
    if (error.status === 403) {
      return "Você não tem permissão para realizar esta ação.";
    }
    if (error.status === 404) {
      return "Conta não encontrada. Verifique o endereço e tente novamente.";
    }
    if (error.status === 400 && error.errors) {
      const firstError = Object.values(error.errors)[0]?.[0];
      if (firstError) return firstError;
    }
    if (error.status >= 500) {
      return "Erro no servidor. Tente novamente mais tarde.";
    }
    return error.message || "Erro ao processar sua solicitação. Tente novamente.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Ocorreu um erro inesperado. Tente novamente.";
}

/**
 * Extrai mensagens de erro de validação de um ApiClientError
 */
export function getAuthValidationErrors(error: unknown): Record<string, string[]> | null {
  if (error instanceof ApiClientError && error.errors) {
    return error.errors;
  }
  return null;
}
