import { ApiClientError } from "../../../../shared/http/apiClient";

export function getEventErrorMessage(error: unknown): string | null {
  if (!error) return null;

  if (error instanceof ApiClientError) {
    if (error.status === 409) {
      return "Esta URL já está em uso. Por favor, escolha uma URL diferente para o seu evento.";
    }
    if (error.status === 400) {
      return "Os dados fornecidos não são válidos. Verifique os campos e tente novamente.";
    }
    if (error.status === 401 || error.status === 403) {
      return "Você não tem permissão para criar eventos. Entre em contato com o administrador.";
    }
    if (error.status >= 500) {
      return "Ocorreu um erro no servidor. Tente novamente em alguns instantes.";
    }
    return error.message || "Erro ao processar sua solicitação. Tente novamente.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Ocorreu um erro inesperado. Tente novamente.";
}

export function getEventValidationErrors(error: unknown): Record<string, string[]> | null {
  if (error instanceof ApiClientError && error.errors) {
    return error.errors;
  }
  return null;
}

export function getFieldDisplayName(field: string): string {
  const fieldNames: Record<string, string> = {
    name: "Nome do evento",
    type: "Tipo do evento",
    url: "URL do evento",
    dates: "Datas do evento",
    address: "Endereço",
    street: "Rua",
    city: "Cidade",
    state: "Estado",
    country: "País",
    zip: "CEP",
    maxCapacity: "Capacidade máxima",
    tags: "Tags",
    ticketSales: "Vendas de ingressos",
  };
  return fieldNames[field] || field;
}

export function mapBackendErrorsToFormErrors(
  errors: Record<string, string[]>
): Record<string, string> {
  const formErrors: Record<string, string> = {};

  Object.entries(errors).forEach(([key, messages]) => {
    if (messages && messages.length > 0) {
      formErrors[key] = messages[0];
    }
  });

  return formErrors;
}
