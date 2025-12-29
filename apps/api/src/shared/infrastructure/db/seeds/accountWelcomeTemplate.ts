import { ID, Status } from "@nubbix/domain/index";
import { db } from "../client";
import { templates } from "../schema";
import { eq, and, isNull } from "drizzle-orm";
import { Channel } from "../../../../modules/notifications/domain";

const LOGO_URL = "https://s3.us-east-1.amazonaws.com/files.evnts.com.br/uploads/logo.svg";

const emailTemplate = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bem-vindo ao Nubbix</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td align="center" style="padding: 40px 30px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px 12px 0 0;">
              <img src="${LOGO_URL}" alt="Nubbix Logo" style="width: 60px; height: 60px; display: block; margin: 0 auto;">
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h1 style="margin: 0 0 20px; font-size: 28px; font-weight: 700; color: #1a1a1a; line-height: 1.3;">
                Olá, {{name}}! 👋
              </h1>
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
                Bem-vindo ao Nubbix! Estamos muito felizes em tê-lo conosco.
              </p>
              <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
                Para começar a usar sua conta, precisamos que você defina uma senha. Clique no botão abaixo para configurar sua senha de acesso:
              </p>
              
              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 0 0 30px;">
                <tr>
                  <td align="center" style="padding: 0;">
                    <a href="{{url}}" style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4); transition: transform 0.2s;">
                      Definir minha senha
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.6; color: #6a6a6a;">
                Ou copie e cole este link no seu navegador:
              </p>
              <p style="margin: 0 0 30px; font-size: 14px; line-height: 1.6; color: #667eea; word-break: break-all;">
                {{url}}
              </p>
              
              <div style="border-top: 1px solid #e5e5e5; padding-top: 30px; margin-top: 30px;">
                <p style="margin: 0 0 10px; font-size: 14px; line-height: 1.6; color: #6a6a6a;">
                  <strong>Importante:</strong> Este link expira em 24 horas por motivos de segurança.
                </p>
                <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #6a6a6a;">
                  Se você não solicitou esta conta, pode ignorar este email com segurança.
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px; background-color: #f9f9f9; border-radius: 0 0 12px 12px; border-top: 1px solid #e5e5e5;">
              <p style="margin: 0 0 10px; font-size: 14px; line-height: 1.6; color: #6a6a6a; text-align: center;">
                Equipe Nubbix
              </p>
              <p style="margin: 0; font-size: 12px; line-height: 1.6; color: #9a9a9a; text-align: center;">
                Este é um email automático, por favor não responda.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export async function seedAccountWelcomeTemplate(): Promise<void> {
  const existingTemplate = await db
    .select()
    .from(templates)
    .where(
      and(
        eq(templates.context, "account.welcome"),
        eq(templates.language, "pt-BR"),
        eq(templates.channel, "email"),
        isNull(templates.accountId),
        eq(templates.isDefault, true),
        isNull(templates.deletedAt)
      )
    )
    .limit(1);

  if (existingTemplate.length > 0) {
    // eslint-disable-next-line no-console
    console.log("Template account.welcome já existe, pulando seed.");
    return;
  }

  await db.insert(templates).values({
    id: ID.create().value,
    channel: Channel.email().value,
    subject: "Bem-vindo ao Nubbix, {{name}}!",
    body: emailTemplate,
    context: "account.welcome",
    language: "pt-BR",
    accountId: null,
    isDefault: true,
    status: Status.active().value,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  });

  // eslint-disable-next-line no-console
  console.log("Template account.welcome criado com sucesso!");
}
