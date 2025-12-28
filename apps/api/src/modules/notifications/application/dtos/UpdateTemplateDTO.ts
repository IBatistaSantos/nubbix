import { z } from "zod";

const attachmentSchema = z.object({
  url: z.string().min(1, "Attachment URL is required"),
  type: z.enum(["image", "file"], {
    errorMap: () => ({ message: "Attachment type must be 'image' or 'file'" }),
  }),
  filename: z.string().optional(),
  mimeType: z.string().optional(),
});

export interface UpdateTemplateInput {
  templateId: string;
  subject?: string;
  body?: string;
  attachments?: Array<{
    url: string;
    type: string;
    filename?: string;
    mimeType?: string;
  }>;
}

export interface UpdateTemplateOutput {
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
  updatedAt: Date;
}

export const updateTemplateSchema = z.object({
  templateId: z.string().uuid("Invalid template ID format"),
  subject: z.string().min(1, "Subject cannot be empty").optional(),
  body: z.string().min(1, "Body is required").optional(),
  attachments: z.array(attachmentSchema).optional(),
});
