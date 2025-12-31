import { isBefore, startOfDay, parseISO } from "date-fns";

export function normalizeUrl(value: string): string {
  if (!value) return "";

  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "") // Remove caracteres inválidos (espaços, pontos, etc)
    .replace(/[-_]+/g, "-") // Normaliza sequências de hífens/underscores para um único hífen
    .replace(/^[-_]+|[-_]+$/g, ""); // Remove hífens/underscores no início e fim
}

export function validateUrl(value: string): string {
  if (!value) return "";

  const validPattern = /^[a-zA-Z0-9_-]+$/;
  if (!validPattern.test(value)) {
    return "Use apenas letras, números, hífen e underscore";
  }

  return "";
}

export function isPastDate(dateString: string): boolean {
  if (!dateString) return false;

  const selectedDate = startOfDay(parseISO(dateString));
  const today = startOfDay(new Date());

  return isBefore(selectedDate, today);
}

export function generateDateId(): string {
  return Math.random().toString(36).substr(2, 9);
}
