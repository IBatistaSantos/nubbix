import { z } from "zod";

export interface SendNotificationInput {
  context: string;
  to: {
    name: string;
    email?: string;
    phone?: string;
  };
  channel: string;
  accountId?: string | null;
  variables: Record<string, any>;
  language?: string;
}

export interface SendNotificationOutput {
  id: string;
  templateId: string;
  provider: string;
  accountId: string;
  providerMessageId: string | null;
  channel: string;
  to: {
    name: string;
    email?: string;
    phone?: string;
  };
  from: {
    name: string;
    email?: string;
    phone?: string;
  };
  variables: Record<string, any>;
  notificationStatus: string;
  sentAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export const sendNotificationSchema = z
  .object({
    context: z.enum(["account.welcome", "participant.registration", "forgot.password"], {
      errorMap: () => ({
        message:
          "Context must be one of: account.welcome, participant.registration, forgot.password",
      }),
    }),
    to: z.object({
      name: z.string().min(1, "Recipient name is required"),
      email: z.string().email("Invalid email format").optional(),
      phone: z.string().optional(),
    }),
    channel: z.enum(["email", "whatsapp"], {
      errorMap: () => ({
        message: "Channel must be one of: email, whatsapp",
      }),
    }),
    accountId: z.string().uuid("Invalid account ID format").nullable().optional(),
    variables: z.record(z.any()).default({}),
    language: z
      .enum(["pt-BR", "en-US", "es-ES"], {
        errorMap: () => ({
          message: "Language must be one of: pt-BR, en-US, es-ES",
        }),
      })
      .optional(),
  })
  .refine(
    (data) => {
      if (data.channel === "email" && !data.to.email) {
        return false;
      }
      return true;
    },
    {
      message: "Recipient email is required for email channel",
      path: ["to", "email"],
    }
  )
  .refine(
    (data) => {
      if (data.channel === "whatsapp" && !data.to.phone) {
        return false;
      }
      return true;
    },
    {
      message: "Recipient phone is required for whatsapp channel",
      path: ["to", "phone"],
    }
  );
