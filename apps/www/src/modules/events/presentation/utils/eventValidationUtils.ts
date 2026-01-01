import { isBefore, startOfDay, parseISO } from "date-fns";

export function normalizeUrl(value: string): string {
  if (!value) return "";

  const validCharsPattern = /[^a-z1234567890áàâãéèêíïóôõöúçñA-Z@\s\/_\-]/g;

  return value
    .replaceAll(" ", "-")
    .replaceAll("/", "-")
    .replaceAll("ç", "-")
    .replaceAll("@", "-")
    .replace(validCharsPattern, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
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
