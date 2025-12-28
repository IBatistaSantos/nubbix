import { z } from "zod";
import {
  ChannelValue,
  TemplateContextValue,
  LanguageValue,
  AttachmentTypeValue,
} from "../../domain/vo";

const attachmentSchema = z.object({
  url: z.string().min(1, "Attachment URL is required"),
  type: z.enum(["image", "file"], {
    errorMap: () => ({ message: "Attachment type must be 'image' or 'file'" }),
  }),
  filename: z.string().optional(),
  mimeType: z.string().optional(),
});

export interface CreateTemplateInput {
  channel: ChannelValue;
  subject?: string;
  body: string;
  context: TemplateContextValue;
  language: LanguageValue;
  accountId?: string | null;
  isDefault?: boolean;
  attachments?: Array<{
    url: string;
    type: AttachmentTypeValue;
    filename?: string;
    mimeType?: string;
  }>;
}

export interface CreateTemplateOutput {
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

export const createTemplateSchema = z
  .object({
    channel: z.enum(["email", "whatsapp"], {
      errorMap: () => ({ message: "Channel must be 'email' or 'whatsapp'" }),
    }),
    subject: z.string().optional(),
    body: z.string().min(1, "Body is required"),
    context: z.enum(["account.welcome", "participant.registration", "forgot.password"], {
      errorMap: () => ({
        message:
          "Context must be one of: account.welcome, participant.registration, forgot.password",
      }),
    }),
    language: z.enum(["pt-BR", "en-US", "es-ES"], {
      errorMap: () => ({ message: "Language must be one of: pt-BR, en-US, es-ES" }),
    }),
    accountId: z.string().uuid("Invalid account ID format").nullable().optional(),
    isDefault: z.boolean().optional(),
    attachments: z.array(attachmentSchema).optional(),
  })
  .refine(
    (data) => {
      if (data.channel === "email" && (!data.subject || data.subject.trim().length === 0)) {
        return false;
      }
      return true;
    },
    {
      message: "Subject is required for email channel",
      path: ["subject"],
    }
  );
