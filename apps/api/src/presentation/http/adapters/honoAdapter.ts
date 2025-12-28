import { Context } from "hono";

export async function extractBody<T = unknown>(c: Context): Promise<T> {
  return await c.req.json();
}

export function extractQuery<T = Record<string, string>>(c: Context): T {
  return c.req.query() as T;
}

export function extractParams<T = Record<string, string>>(c: Context): T {
  return c.req.param() as T;
}

export function jsonResponse<T>(c: Context, data: T, status: number = 200): Response {
  return c.json(data, status as any);
}

export function errorResponse(
  c: Context,
  message: string | string[],
  status: number = 500,
  errors?: Array<{ path?: string; message: string; code?: string }>
): Response {
  const errorName = getErrorName(status);
  const mainMessage = normalizeMessage(message);

  if (errors && errors.length > 0) {
    const formattedErrors = formatValidationErrors(errors);
    return c.json(
      {
        statusCode: status,
        message: mainMessage,
        error: errorName,
        errors: formattedErrors,
      },
      status as any
    );
  }

  return c.json(
    {
      statusCode: status,
      message: mainMessage,
      error: errorName,
    },
    status as any
  );
}

function normalizeMessage(message: string | string[]): string {
  if (Array.isArray(message)) {
    return message[0] || message.join(", ") || "Validation failed";
  }
  return message;
}

function formatValidationErrors(errors: Array<{ path?: string; message: string; code?: string }>) {
  const errorsByProperty = groupErrorsByProperty(errors);
  return Object.entries(errorsByProperty).map(([property, propertyErrors]) => ({
    property,
    constraints: buildConstraints(propertyErrors),
  }));
}

function groupErrorsByProperty(
  errors: Array<{ path?: string; message: string; code?: string }>
): Record<string, Array<{ message: string; code?: string }>> {
  const grouped: Record<string, Array<{ message: string; code?: string }>> = {};

  for (const err of errors) {
    const property = err.path || "unknown";
    if (!grouped[property]) {
      grouped[property] = [];
    }
    grouped[property].push({ message: err.message, code: err.code });
  }

  return grouped;
}

function buildConstraints(
  propertyErrors: Array<{ message: string; code?: string }>
): Record<string, string> {
  const constraints: Record<string, string> = {};
  for (const err of propertyErrors) {
    const key = err.code || "error";
    constraints[key] = err.message;
  }
  return constraints;
}

function getErrorName(statusCode: number): string {
  switch (statusCode) {
    case 400:
      return "Bad Request";
    case 401:
      return "Unauthorized";
    case 403:
      return "Forbidden";
    case 404:
      return "Not Found";
    case 409:
      return "Conflict";
    case 422:
      return "Unprocessable Entity";
    case 500:
      return "Internal Server Error";
    default:
      return "Error";
  }
}
