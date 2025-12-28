import { Resend } from "resend";
import { NotificationProvider } from "../../domain/services/NotificationProvider";
import { Notification } from "../../domain/Notification";

export class ResendNotificationProvider implements NotificationProvider {
  private resend: Resend;
  private apiKey: string = process.env.RESEND_API_KEY || "";

  constructor() {
    if (!this.apiKey) {
      throw new Error("RESEND_API_KEY is not set");
    }
    this.resend = new Resend(this.apiKey);
  }

  async send(notification: Notification): Promise<string> {
    if (!notification.channel.isEmail()) {
      throw new Error("Resend provider only supports email channel");
    }

    if (!notification.to.email) {
      throw new Error("Recipient email is required");
    }

    if (!notification.from.email) {
      throw new Error("Sender email is required");
    }

    const subject = (notification.variables as any).__renderedSubject || "";
    const body = (notification.variables as any).__renderedBody || "";

    if (!subject || !body) {
      throw new Error("Rendered subject and body are required");
    }

    try {
      const result = await this.resend.emails.send({
        from: `${notification.from.name} <${notification.from.email}>`,
        to: notification.to.email,
        subject,
        html: body,
      });

      if (result.error) {
        throw new Error(`Resend API error: ${result.error.message}`);
      }

      if (!result.data?.id) {
        throw new Error("Resend API did not return message ID");
      }

      return result.data.id;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Failed to send email via Resend: ${String(error)}`);
    }
  }
}
