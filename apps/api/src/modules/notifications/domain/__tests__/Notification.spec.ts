import { describe, it, expect } from "bun:test";
import { faker } from "@faker-js/faker";
import { Notification } from "../Notification";
import {
  Channel,
  ChannelValue,
  Provider,
  ProviderValue,
  NotificationStatus,
  NotificationStatusValue,
} from "../vo";
import { ID, Status, StatusValue, ValidationError } from "@nubbix/domain";

describe("Notification", () => {
  describe("constructor", () => {
    it("should create a notification with default values", () => {
      const templateId = ID.create().value;
      const accountId = ID.create().value;
      const toEmail = faker.internet.email();
      const fromEmail = faker.internet.email();

      const notification = new Notification({
        templateId,
        provider: Provider.sendgrid(),
        accountId,
        channel: Channel.email(),
        to: {
          name: faker.person.fullName(),
          email: toEmail,
        },
        from: {
          name: faker.company.name(),
          email: fromEmail,
        },
        variables: {},
        notificationStatus: NotificationStatus.pending(),
      });

      expect(notification.id).toBeInstanceOf(ID);
      expect(notification.id.value).toBeDefined();
      expect(notification.templateId).toBe(templateId);
      expect(notification.provider).toBeInstanceOf(Provider);
      expect(notification.accountId).toBe(accountId);
      expect(notification.channel).toBeInstanceOf(Channel);
      expect(notification.notificationStatus).toBeInstanceOf(NotificationStatus);
      expect(notification.providerMessageId).toBeNull();
      expect(notification.sentAt).toBeNull();
      expect(notification.openedAt).toBeNull();
      expect(notification.clickedAt).toBeNull();
      expect(notification.status.isActive()).toBe(true);
    });

    it("should create a notification with all provided values", () => {
      const now = new Date();
      const id = ID.create(faker.string.uuid());
      const status = Status.active();
      const templateId = ID.create().value;
      const accountId = ID.create().value;
      const providerMessageId = faker.string.uuid();
      const sentAt = new Date();
      const toPhone = faker.phone.number();
      const fromPhone = faker.phone.number();

      const notification = new Notification({
        id: id.value,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
        status,
        templateId,
        provider: Provider.twilio(),
        accountId,
        providerMessageId,
        channel: Channel.whatsapp(),
        to: {
          name: faker.person.fullName(),
          phone: toPhone,
        },
        from: {
          name: faker.company.name(),
          phone: fromPhone,
        },
        variables: { name: "John", code: "123" },
        notificationStatus: NotificationStatus.sent(),
        sentAt,
        openedAt: null,
        clickedAt: null,
      });

      expect(notification.id.value).toBe(id.value);
      expect(notification.templateId).toBe(templateId);
      expect(notification.provider.isTwilio()).toBe(true);
      expect(notification.channel.isWhatsapp()).toBe(true);
      expect(notification.providerMessageId).toBe(providerMessageId);
      expect(notification.notificationStatus.isSent()).toBe(true);
      expect(notification.sentAt).toEqual(sentAt);
      expect(notification.variables.name).toBe("John");
    });
  });

  describe("getters", () => {
    it("should return correct templateId", () => {
      const templateId = ID.create().value;
      const notification = new Notification({
        templateId,
        provider: Provider.sendgrid(),
        accountId: ID.create().value,
        channel: Channel.email(),
        to: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
        },
        from: {
          name: faker.company.name(),
          email: faker.internet.email(),
        },
        variables: {},
        notificationStatus: NotificationStatus.pending(),
      });

      expect(notification.templateId).toBe(templateId);
    });

    it("should return correct provider", () => {
      const notification = new Notification({
        templateId: ID.create().value,
        provider: Provider.custom(),
        accountId: ID.create().value,
        channel: Channel.email(),
        to: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
        },
        from: {
          name: faker.company.name(),
          email: faker.internet.email(),
        },
        variables: {},
        notificationStatus: NotificationStatus.pending(),
      });

      expect(notification.provider.isCustom()).toBe(true);
    });

    it("should return correct variables", () => {
      const variables = { name: "John", code: "ABC123" };
      const notification = new Notification({
        templateId: ID.create().value,
        provider: Provider.sendgrid(),
        accountId: ID.create().value,
        channel: Channel.email(),
        to: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
        },
        from: {
          name: faker.company.name(),
          email: faker.internet.email(),
        },
        variables,
        notificationStatus: NotificationStatus.pending(),
      });

      expect(notification.variables).toEqual(variables);
    });
  });

  describe("markAsSent", () => {
    it("should mark notification as sent", () => {
      const notification = new Notification({
        templateId: ID.create().value,
        provider: Provider.sendgrid(),
        accountId: ID.create().value,
        channel: Channel.email(),
        to: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
        },
        from: {
          name: faker.company.name(),
          email: faker.internet.email(),
        },
        variables: {},
        notificationStatus: NotificationStatus.pending(),
      });

      const providerMessageId = faker.string.uuid();
      const initialUpdatedAt = notification.updatedAt;
      Bun.sleepSync(10);

      notification.markAsSent(providerMessageId);

      expect(notification.notificationStatus.isSent()).toBe(true);
      expect(notification.providerMessageId).toBe(providerMessageId);
      expect(notification.sentAt).toBeInstanceOf(Date);
      expect(notification.updatedAt.getTime()).toBeGreaterThan(initialUpdatedAt.getTime());
    });
  });

  describe("markAsFailed", () => {
    it("should mark notification as failed", () => {
      const notification = new Notification({
        templateId: ID.create().value,
        provider: Provider.sendgrid(),
        accountId: ID.create().value,
        channel: Channel.email(),
        to: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
        },
        from: {
          name: faker.company.name(),
          email: faker.internet.email(),
        },
        variables: {},
        notificationStatus: NotificationStatus.pending(),
      });

      const initialUpdatedAt = notification.updatedAt;
      Bun.sleepSync(10);

      notification.markAsFailed();

      expect(notification.notificationStatus.isFailed()).toBe(true);
      expect(notification.updatedAt.getTime()).toBeGreaterThan(initialUpdatedAt.getTime());
    });
  });

  describe("markAsOpened", () => {
    it("should mark notification as opened", () => {
      const notification = new Notification({
        templateId: ID.create().value,
        provider: Provider.sendgrid(),
        accountId: ID.create().value,
        channel: Channel.email(),
        to: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
        },
        from: {
          name: faker.company.name(),
          email: faker.internet.email(),
        },
        variables: {},
        notificationStatus: NotificationStatus.sent(),
        sentAt: new Date(),
      });

      expect(notification.openedAt).toBeNull();

      const initialUpdatedAt = notification.updatedAt;
      Bun.sleepSync(10);

      notification.markAsOpened();

      expect(notification.openedAt).toBeInstanceOf(Date);
      expect(notification.updatedAt.getTime()).toBeGreaterThan(initialUpdatedAt.getTime());
    });

    it("should not update openedAt if already set", () => {
      const openedAt = new Date();
      const notification = new Notification({
        templateId: ID.create().value,
        provider: Provider.sendgrid(),
        accountId: ID.create().value,
        channel: Channel.email(),
        to: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
        },
        from: {
          name: faker.company.name(),
          email: faker.internet.email(),
        },
        variables: {},
        notificationStatus: NotificationStatus.sent(),
        sentAt: new Date(),
        openedAt,
      });

      notification.markAsOpened();

      expect(notification.openedAt).toEqual(openedAt);
    });
  });

  describe("markAsClicked", () => {
    it("should mark notification as clicked", () => {
      const notification = new Notification({
        templateId: ID.create().value,
        provider: Provider.sendgrid(),
        accountId: ID.create().value,
        channel: Channel.email(),
        to: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
        },
        from: {
          name: faker.company.name(),
          email: faker.internet.email(),
        },
        variables: {},
        notificationStatus: NotificationStatus.sent(),
        sentAt: new Date(),
      });

      expect(notification.clickedAt).toBeNull();

      const initialUpdatedAt = notification.updatedAt;
      Bun.sleepSync(10);

      notification.markAsClicked();

      expect(notification.clickedAt).toBeInstanceOf(Date);
      expect(notification.updatedAt.getTime()).toBeGreaterThan(initialUpdatedAt.getTime());
    });

    it("should not update clickedAt if already set", () => {
      const clickedAt = new Date();
      const notification = new Notification({
        templateId: ID.create().value,
        provider: Provider.sendgrid(),
        accountId: ID.create().value,
        channel: Channel.email(),
        to: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
        },
        from: {
          name: faker.company.name(),
          email: faker.internet.email(),
        },
        variables: {},
        notificationStatus: NotificationStatus.sent(),
        sentAt: new Date(),
        clickedAt,
      });

      notification.markAsClicked();

      expect(notification.clickedAt).toEqual(clickedAt);
    });
  });

  describe("validate", () => {
    it("should pass validation for valid email notification", () => {
      const notification = new Notification({
        templateId: ID.create().value,
        provider: Provider.sendgrid(),
        accountId: ID.create().value,
        channel: Channel.email(),
        to: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
        },
        from: {
          name: faker.company.name(),
          email: faker.internet.email(),
        },
        variables: {},
        notificationStatus: NotificationStatus.pending(),
      });

      expect(() => notification.validate()).not.toThrow();
    });

    it("should pass validation for valid whatsapp notification", () => {
      const notification = new Notification({
        templateId: ID.create().value,
        provider: Provider.twilio(),
        accountId: ID.create().value,
        channel: Channel.whatsapp(),
        to: {
          name: faker.person.fullName(),
          phone: faker.phone.number(),
        },
        from: {
          name: faker.company.name(),
          phone: faker.phone.number(),
        },
        variables: {},
        notificationStatus: NotificationStatus.pending(),
      });

      expect(() => notification.validate()).not.toThrow();
    });

    it("should throw ValidationError when templateId is empty", () => {
      const notification = new Notification({
        templateId: "",
        provider: Provider.sendgrid(),
        accountId: ID.create().value,
        channel: Channel.email(),
        to: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
        },
        from: {
          name: faker.company.name(),
          email: faker.internet.email(),
        },
        variables: {},
        notificationStatus: NotificationStatus.pending(),
      });

      expect(() => notification.validate()).toThrow(ValidationError);
      try {
        notification.validate();
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).details[0].path).toBe("templateId");
      }
    });

    it("should throw ValidationError when accountId is empty", () => {
      const notification = new Notification({
        templateId: ID.create().value,
        provider: Provider.sendgrid(),
        accountId: "",
        channel: Channel.email(),
        to: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
        },
        from: {
          name: faker.company.name(),
          email: faker.internet.email(),
        },
        variables: {},
        notificationStatus: NotificationStatus.pending(),
      });

      expect(() => notification.validate()).toThrow(ValidationError);
    });

    it("should throw ValidationError when to.email is missing for email channel", () => {
      const notification = new Notification({
        templateId: ID.create().value,
        provider: Provider.sendgrid(),
        accountId: ID.create().value,
        channel: Channel.email(),
        to: {
          name: faker.person.fullName(),
        },
        from: {
          name: faker.company.name(),
          email: faker.internet.email(),
        },
        variables: {},
        notificationStatus: NotificationStatus.pending(),
      });

      expect(() => notification.validate()).toThrow(ValidationError);
      try {
        notification.validate();
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).details[0].path).toBe("to.email");
      }
    });

    it("should throw ValidationError when to.phone is missing for whatsapp channel", () => {
      const notification = new Notification({
        templateId: ID.create().value,
        provider: Provider.twilio(),
        accountId: ID.create().value,
        channel: Channel.whatsapp(),
        to: {
          name: faker.person.fullName(),
        },
        from: {
          name: faker.company.name(),
          phone: faker.phone.number(),
        },
        variables: {},
        notificationStatus: NotificationStatus.pending(),
      });

      expect(() => notification.validate()).toThrow(ValidationError);
      try {
        notification.validate();
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).details[0].path).toBe("to.phone");
      }
    });

    it("should throw ValidationError when from.email is missing for email channel", () => {
      const notification = new Notification({
        templateId: ID.create().value,
        provider: Provider.sendgrid(),
        accountId: ID.create().value,
        channel: Channel.email(),
        to: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
        },
        from: {
          name: faker.company.name(),
        },
        variables: {},
        notificationStatus: NotificationStatus.pending(),
      });

      expect(() => notification.validate()).toThrow(ValidationError);
      try {
        notification.validate();
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).details[0].path).toBe("from.email");
      }
    });

    it("should throw ValidationError when from.phone is missing for whatsapp channel", () => {
      const notification = new Notification({
        templateId: ID.create().value,
        provider: Provider.twilio(),
        accountId: ID.create().value,
        channel: Channel.whatsapp(),
        to: {
          name: faker.person.fullName(),
          phone: faker.phone.number(),
        },
        from: {
          name: faker.company.name(),
        },
        variables: {},
        notificationStatus: NotificationStatus.pending(),
      });

      expect(() => notification.validate()).toThrow(ValidationError);
      try {
        notification.validate();
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).details[0].path).toBe("from.phone");
      }
    });

    it("should throw ValidationError when to.name is missing", () => {
      const notification = new Notification({
        templateId: ID.create().value,
        provider: Provider.sendgrid(),
        accountId: ID.create().value,
        channel: Channel.email(),
        to: {
          name: "",
          email: faker.internet.email(),
        },
        from: {
          name: faker.company.name(),
          email: faker.internet.email(),
        },
        variables: {},
        notificationStatus: NotificationStatus.pending(),
      });

      expect(() => notification.validate()).toThrow(ValidationError);
    });
  });

  describe("toJSON", () => {
    it("should return a JSON representation with all fields", () => {
      const now = new Date();
      const id = ID.create(faker.string.uuid());
      const templateId = ID.create().value;
      const accountId = ID.create().value;
      const providerMessageId = faker.string.uuid();
      const sentAt = new Date();
      const toEmail = faker.internet.email();
      const fromEmail = faker.internet.email();
      const variables = { name: "John", code: "123" };

      const notification = new Notification({
        id: id.value,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
        templateId,
        provider: Provider.sendgrid(),
        accountId,
        providerMessageId,
        channel: Channel.email(),
        to: {
          name: faker.person.fullName(),
          email: toEmail,
        },
        from: {
          name: faker.company.name(),
          email: fromEmail,
        },
        variables,
        notificationStatus: NotificationStatus.sent(),
        sentAt,
        openedAt: null,
        clickedAt: null,
      });

      const json = notification.toJSON();

      expect(json).toEqual({
        id: id.value,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
        status: StatusValue.ACTIVE,
        templateId,
        provider: ProviderValue.SENDGRID,
        accountId,
        providerMessageId,
        channel: ChannelValue.EMAIL,
        to: {
          name: notification.to.name,
          email: toEmail,
        },
        from: {
          name: notification.from.name,
          email: fromEmail,
        },
        variables,
        notificationStatus: NotificationStatusValue.SENT,
        sentAt,
        openedAt: null,
        clickedAt: null,
      });
    });
  });

  describe("asFaker", () => {
    it("should create a notification with faker data", () => {
      const notification = Notification.asFaker();

      expect(notification).toBeInstanceOf(Notification);
      expect(notification.channel.isEmail()).toBe(true);
      expect(notification.provider.isSendgrid()).toBe(true);
      expect(notification.notificationStatus.isPending()).toBe(true);
      expect(notification.to.email).toBeDefined();
      expect(notification.from.email).toBeDefined();
    });

    it("should allow overriding faker data", () => {
      const customProvider = Provider.twilio();
      const customChannel = Channel.whatsapp();
      const notification = Notification.asFaker({
        provider: customProvider,
        channel: customChannel,
        to: {
          name: faker.person.fullName(),
          phone: faker.phone.number(),
        },
        from: {
          name: faker.company.name(),
          phone: faker.phone.number(),
        },
      });

      expect(notification.provider.isTwilio()).toBe(true);
      expect(notification.channel.isWhatsapp()).toBe(true);
      expect(notification.to.phone).toBeDefined();
      expect(notification.from.phone).toBeDefined();
    });
  });
});
