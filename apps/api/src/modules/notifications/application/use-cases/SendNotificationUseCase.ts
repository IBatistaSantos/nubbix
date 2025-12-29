import { BaseUseCase, createZodValidator, ID } from "@nubbix/domain";
import { TemplateRepository, NotificationRepository } from "../../domain";
import { TemplateContext, Language, Channel, Provider, NotificationStatus } from "../../domain/vo";
import {
  SendNotificationInput,
  SendNotificationOutput,
  sendNotificationSchema,
} from "../dtos/SendNotificationDTO";
import { NotFoundError } from "../../../../shared/errors";
import { Notification } from "../../domain/Notification";
import { NotificationProvider } from "../../domain/services/NotificationProvider";

export class SendNotificationUseCase extends BaseUseCase<
  SendNotificationInput,
  SendNotificationOutput
> {
  constructor(
    private templateRepository: TemplateRepository,
    private notificationRepository: NotificationRepository,
    private notificationProvider: NotificationProvider
  ) {
    super();
  }

  protected getInputValidator(): ReturnType<typeof createZodValidator<SendNotificationInput>> {
    // @ts-ignore
    return createZodValidator(sendNotificationSchema);
  }

  protected async execute(input: SendNotificationInput): Promise<SendNotificationOutput> {
    const context = TemplateContext.fromValue(input.context as any);
    const language = input.language ? Language.fromValue(input.language as any) : Language.ptBR();
    const channel = Channel.fromValue(input.channel as any);

    let template = null;

    if (input.accountId) {
      template = await this.templateRepository.findByContextLanguageAndChannel(
        context,
        language,
        channel,
        input.accountId
      );
    }

    if (!template) {
      template = await this.templateRepository.findDefaultByContextLanguageAndChannel(
        context,
        language,
        channel
      );
    }

    if (!template) {
      throw new NotFoundError(
        `Template not found for context: ${input.context}, language: ${language.value}, channel: ${channel.value}`
      );
    }

    const rendered = template.render(input.variables);

    const from = {
      name: "Nubbix",
      email: channel.isEmail() ? process.env.NOTIFICATION_FROM_EMAIL : undefined,
      phone: channel.isWhatsapp() ? undefined : undefined,
    };

    const accountId = input.accountId || "system";

    const notification = new Notification({
      id: ID.create().value,
      templateId: template.id.value,
      provider: Provider.resend(),
      accountId,
      providerMessageId: null,
      channel,
      to: {
        name: input.to.name,
        email: input.to.email,
        phone: input.to.phone,
      },
      from,
      variables: {
        ...input.variables,
        __renderedSubject: rendered.subject,
        __renderedBody: rendered.body,
      },
      notificationStatus: NotificationStatus.pending(),
      sentAt: null,
      openedAt: null,
      clickedAt: null,
    });

    notification.validate();

    try {
      const providerMessageId = await this.notificationProvider.send(notification);
      notification.markAsSent(providerMessageId);
    } catch (error) {
      notification.markAsFailed();
      await this.notificationRepository.save(notification);
      throw error;
    }

    await this.notificationRepository.save(notification);

    return notification.toJSON();
  }
}
