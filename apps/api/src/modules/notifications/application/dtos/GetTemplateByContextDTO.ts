import { z } from "zod";

export interface GetTemplateByContextInput {
  context: string;
  language: string;
  accountId?: string | null;
}

export interface GetTemplateByContextOutput {
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
}

export const getTemplateByContextSchema = z.object({
  context: z.enum(["account.welcome", "participant.registration", "forgot.password"], {
    errorMap: () => ({
      message: "Context must be one of: account.welcome, participant.registration, forgot.password",
    }),
  }),
  language: z.enum(["pt-BR", "en-US", "es-ES"], {
    errorMap: () => ({ message: "Language must be one of: pt-BR, en-US, es-ES" }),
  }),
  accountId: z.string().uuid("Invalid account ID format").nullable().optional(),
});
