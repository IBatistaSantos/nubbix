import { describe, it, expect, beforeEach } from "bun:test";
import { faker } from "@faker-js/faker";
import { SendNotificationUseCase } from "../SendNotificationUseCase";
import { InMemoryTemplateRepository } from "../../../infrastructure/repositories/InMemoryTemplateRepository";
import { InMemoryNotificationRepository } from "../../../infrastructure/repositories/InMemoryNotificationRepository";
import { Template } from "../../../domain";
import { TemplateContext, Language, Channel } from "../../../domain/vo";
import { NotificationProvider } from "../../../domain/services/NotificationProvider";
import { Notification } from "../../../domain/Notification";
import { NotFoundError } from "../../../../../shared/errors";

class MockNotificationProvider implements NotificationProvider {
  private shouldFail = false;
  private messageId = faker.string.uuid();

  setShouldFail(value: boolean) {
    this.shouldFail = value;
  }

  setMessageId(id: string) {
    this.messageId = id;
  }

  async send(_notification: Notification): Promise<string> {
    if (this.shouldFail) {
      throw new Error("Provider failed to send notification");
    }
    return this.messageId;
  }
}

describe("SendNotificationUseCase", () => {
  let useCase: SendNotificationUseCase;
  let templateRepository: InMemoryTemplateRepository;
  let notificationRepository: InMemoryNotificationRepository;
  let notificationProvider: MockNotificationProvider;

  beforeEach(() => {
    templateRepository = new InMemoryTemplateRepository();
    notificationRepository = new InMemoryNotificationRepository();
    notificationProvider = new MockNotificationProvider();
    useCase = new SendNotificationUseCase(
      templateRepository,
      notificationRepository,
      notificationProvider
    );
  });

  it("should send notification successfully", async () => {
    const template = Template.asFaker({
      context: TemplateContext.accountWelcome(),
      language: Language.ptBR(),
      channel: Channel.email(),
      subject: "Welcome {{user.name}}",
      body: "Hello {{user.name}}, your code is {{code}}",
    });
    await templateRepository.save(template);

    const input = {
      context: "account.welcome" as const,
      to: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
      },
      channel: "email" as const,
      variables: {
        user: {
          name: "John Doe",
        },
        code: "ABC123",
      },
    };

    const output = await useCase.run(input);

    expect(output).toHaveProperty("id");
    expect(output.channel).toBe("email");
    expect(output.provider).toBe("resend");
    expect(output.notificationStatus).toBe("sent");
    expect(output.providerMessageId).toBe(notificationProvider["messageId"]);
    expect(output.to.name).toBe(input.to.name);
    expect(output.to.email).toBe(input.to.email);
  });

  it("should render template variables correctly", async () => {
    const template = Template.asFaker({
      context: TemplateContext.accountWelcome(),
      language: Language.ptBR(),
      channel: Channel.email(),
      subject: "Ticket: {{ticket.name}}",
      body: "Your ticket {{ticket.name}} has status {{ticket.status}}",
    });
    await templateRepository.save(template);

    const input = {
      context: "account.welcome" as const,
      to: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
      },
      channel: "email" as const,
      variables: {
        ticket: {
          name: "TICKET-123",
          status: "open",
        },
      },
    };

    const output = await useCase.run(input);

    expect(output).toBeDefined();
    expect(output.notificationStatus).toBe("sent");
  });

  it("should throw NotFoundError when template is not found", async () => {
    const input = {
      context: "account.welcome" as const,
      to: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
      },
      channel: "email" as const,
      variables: {},
    };

    await expect(useCase.run(input)).rejects.toThrow(NotFoundError);
  });

  it("should throw error when provider fails", async () => {
    notificationProvider.setShouldFail(true);

    const template = Template.asFaker({
      context: TemplateContext.accountWelcome(),
      language: Language.ptBR(),
      channel: Channel.email(),
    });
    await templateRepository.save(template);

    const input = {
      context: "account.welcome" as const,
      to: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
      },
      channel: "email" as const,
      variables: {},
    };

    await expect(useCase.run(input)).rejects.toThrow("Provider failed to send notification");
  });

  it("should use default language (pt-BR) when not provided", async () => {
    const template = Template.asFaker({
      context: TemplateContext.accountWelcome(),
      language: Language.ptBR(),
      channel: Channel.email(),
    });
    await templateRepository.save(template);

    const input = {
      context: "account.welcome" as const,
      to: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
      },
      channel: "email" as const,
      variables: {},
    };

    const output = await useCase.run(input);

    expect(output).toBeDefined();
    expect(output.notificationStatus).toBe("sent");
  });

  it("should use account-specific template when accountId is provided", async () => {
    const accountId = faker.string.uuid();
    const accountTemplate = Template.asFaker({
      context: TemplateContext.accountWelcome(),
      language: Language.ptBR(),
      channel: Channel.email(),
      accountId,
    });
    await templateRepository.save(accountTemplate);

    const input = {
      context: "account.welcome" as const,
      to: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
      },
      channel: "email" as const,
      accountId,
      variables: {},
    };

    const output = await useCase.run(input);

    expect(output).toBeDefined();
    expect(output.notificationStatus).toBe("sent");
  });

  it("should fallback to default template when account template is not found", async () => {
    const defaultTemplate = Template.asFaker({
      context: TemplateContext.accountWelcome(),
      language: Language.ptBR(),
      channel: Channel.email(),
      accountId: null,
    });
    await templateRepository.save(defaultTemplate);

    const input = {
      context: "account.welcome" as const,
      to: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
      },
      channel: "email" as const,
      accountId: faker.string.uuid(),
      variables: {},
    };

    const output = await useCase.run(input);

    expect(output).toBeDefined();
    expect(output.notificationStatus).toBe("sent");
  });

  it("should throw NotFoundError when template with channel is not found", async () => {
    // Criar template com channel whatsapp
    const whatsappTemplate = Template.asFaker({
      context: TemplateContext.accountWelcome(),
      language: Language.ptBR(),
      channel: Channel.whatsapp(),
    });
    await templateRepository.save(whatsappTemplate);

    // Tentar buscar template com channel email (que não existe)
    const input = {
      context: "account.welcome" as const,
      to: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
      },
      channel: "email" as const,
      variables: {},
    };

    await expect(useCase.run(input)).rejects.toThrow(NotFoundError);
  });

  it("should mark notification as failed when provider throws error", async () => {
    notificationProvider.setShouldFail(true);

    const template = Template.asFaker({
      context: TemplateContext.accountWelcome(),
      language: Language.ptBR(),
      channel: Channel.email(),
    });
    await templateRepository.save(template);

    const input = {
      context: "account.welcome" as const,
      to: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
      },
      channel: "email" as const,
      variables: {},
    };

    await expect(useCase.run(input)).rejects.toThrow();

    // Verificar que a notificação foi salva com status failed
    const allNotifications = Array.from(
      (notificationRepository as any).notifications.values()
    ) as Notification[];
    const failedNotification = allNotifications.find((n) => n.notificationStatus.isFailed());
    expect(failedNotification).toBeDefined();
  });
});
