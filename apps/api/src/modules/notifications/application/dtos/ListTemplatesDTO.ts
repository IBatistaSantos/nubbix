import { z } from "zod";

export interface ListTemplatesQuery {
  accountId: string;
  context?: string;
  language?: string;
  page?: number;
  limit?: number;
}

export interface ListTemplatesOutput {
  templates: Array<{
    id: string;
    channel: string;
    subject?: string;
    body: string;
    context: string;
    language: string;
    accountId?: string | null;
    isDefault: boolean;
    attachments?: Array<{
      url: string;
      type: string;
      filename?: string;
      mimeType?: string;
    }>;
    createdAt: Date;
    updatedAt: Date;
  }>;
  total: number;
  page: number;
  limit: number;
}

export const listTemplatesQuerySchema = z.object({
  accountId: z.string().uuid("Invalid account ID format"),
  context: z
    .enum(["account.welcome", "participant.registration", "forgot.password"], {
      errorMap: () => ({
        message:
          "Context must be one of: account.welcome, participant.registration, forgot.password",
      }),
    })
    .optional(),
  language: z
    .enum(["pt-BR", "en-US", "es-ES"], {
      errorMap: () => ({ message: "Language must be one of: pt-BR, en-US, es-ES" }),
    })
    .optional(),
  page: z.coerce.number().int().min(1).default(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
});
