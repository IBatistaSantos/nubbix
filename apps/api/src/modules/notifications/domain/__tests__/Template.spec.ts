import { describe, it, expect } from "bun:test";
import { faker } from "@faker-js/faker";
import { Template } from "../Template";
import {
  Channel,
  ChannelValue,
  TemplateContext,
  TemplateContextValue,
  Language,
  LanguageValue,
  AttachmentType,
} from "../vo";
import { ID, Status, StatusValue, ValidationError } from "@nubbix/domain";

describe("Template", () => {
  describe("constructor", () => {
    it("should create a template with default values", () => {
      const template = new Template({
        channel: Channel.email(),
        subject: faker.lorem.sentence(),
        body: faker.lorem.paragraph(),
        context: TemplateContext.accountWelcome(),
        attachments: [],
        accountId: null,
        language: Language.ptBR(),
        isDefault: true,
      });

      expect(template.id).toBeInstanceOf(ID);
      expect(template.id.value).toBeDefined();
      expect(template.channel).toBeInstanceOf(Channel);
      expect(template.channel.isEmail()).toBe(true);
      expect(template.context).toBeInstanceOf(TemplateContext);
      expect(template.language).toBeInstanceOf(Language);
      expect(template.accountId).toBeNull();
      expect(template.isDefault).toBe(true);
      expect(template.isSystemDefault()).toBe(true);
      expect(template.status.isActive()).toBe(true);
    });

    it("should create a template with all provided values", () => {
      const now = new Date();
      const id = ID.create(faker.string.uuid());
      const status = Status.active();
      const accountId = ID.create().value;
      const subject = faker.lorem.sentence();
      const body = faker.lorem.paragraph();

      const template = new Template({
        id: id.value,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
        status,
        channel: Channel.whatsapp(),
        subject,
        body,
        context: TemplateContext.forgotPassword(),
        attachments: [],
        accountId,
        language: Language.enUS(),
        isDefault: false,
      });

      expect(template.id.value).toBe(id.value);
      expect(template.channel.isWhatsapp()).toBe(true);
      expect(template.subject).toBe(subject);
      expect(template.body).toBe(body);
      expect(template.context.isForgotPassword()).toBe(true);
      expect(template.accountId).toBe(accountId);
      expect(template.isDefault).toBe(false);
      expect(template.isSystemDefault()).toBe(false);
    });

    it("should automatically set isDefault to true when accountId is null", () => {
      const template = new Template({
        channel: Channel.email(),
        subject: faker.lorem.sentence(),
        body: faker.lorem.paragraph(),
        context: TemplateContext.accountWelcome(),
        accountId: null,
        language: Language.ptBR(),
        isDefault: false, // Should be overridden
      });

      expect(template.accountId).toBeNull();
      expect(template.isDefault).toBe(true);
      expect(template.isSystemDefault()).toBe(true);
    });
  });

  describe("getters", () => {
    it("should return correct channel", () => {
      const template = new Template({
        channel: Channel.email(),
        subject: faker.lorem.sentence(),
        body: faker.lorem.paragraph(),
        context: TemplateContext.accountWelcome(),
        language: Language.ptBR(),
        isDefault: true,
      });

      expect(template.channel.isEmail()).toBe(true);
    });

    it("should return correct subject", () => {
      const subject = faker.lorem.sentence();
      const template = new Template({
        channel: Channel.email(),
        subject,
        body: faker.lorem.paragraph(),
        context: TemplateContext.accountWelcome(),
        language: Language.ptBR(),
        isDefault: true,
      });

      expect(template.subject).toBe(subject);
    });

    it("should return correct body", () => {
      const body = faker.lorem.paragraph();
      const template = new Template({
        channel: Channel.email(),
        subject: faker.lorem.sentence(),
        body,
        context: TemplateContext.accountWelcome(),
        language: Language.ptBR(),
        isDefault: true,
      });

      expect(template.body).toBe(body);
    });

    it("should return correct attachments", () => {
      const attachments = [
        {
          url: faker.internet.url(),
          type: AttachmentType.image(),
          filename: "image.png",
          mimeType: "image/png",
        },
      ];

      const template = new Template({
        channel: Channel.email(),
        subject: faker.lorem.sentence(),
        body: faker.lorem.paragraph(),
        context: TemplateContext.accountWelcome(),
        attachments,
        language: Language.ptBR(),
        isDefault: true,
      });

      expect(template.attachments).toHaveLength(1);
      expect(template.attachments[0].url).toBe(attachments[0].url);
    });
  });

  describe("isSystemDefault", () => {
    it("should return true when accountId is null", () => {
      const template = new Template({
        channel: Channel.email(),
        subject: faker.lorem.sentence(),
        body: faker.lorem.paragraph(),
        context: TemplateContext.accountWelcome(),
        accountId: null,
        language: Language.ptBR(),
        isDefault: true,
      });

      expect(template.isSystemDefault()).toBe(true);
    });

    it("should return false when accountId is not null", () => {
      const template = new Template({
        channel: Channel.email(),
        subject: faker.lorem.sentence(),
        body: faker.lorem.paragraph(),
        context: TemplateContext.accountWelcome(),
        accountId: ID.create().value,
        language: Language.ptBR(),
        isDefault: false,
      });

      expect(template.isSystemDefault()).toBe(false);
    });
  });

  describe("update", () => {
    it("should update template subject", () => {
      const oldSubject = faker.lorem.sentence();
      const newSubject = faker.lorem.sentence();
      const template = new Template({
        channel: Channel.email(),
        subject: oldSubject,
        body: faker.lorem.paragraph(),
        context: TemplateContext.accountWelcome(),
        language: Language.ptBR(),
        isDefault: true,
      });

      const initialUpdatedAt = template.updatedAt;
      Bun.sleepSync(10);

      template.update({ subject: newSubject });

      expect(template.subject).toBe(newSubject);
      expect(template.updatedAt.getTime()).toBeGreaterThan(initialUpdatedAt.getTime());
    });

    it("should update template body", () => {
      const oldBody = faker.lorem.paragraph();
      const newBody = faker.lorem.paragraph();
      const template = new Template({
        channel: Channel.email(),
        subject: faker.lorem.sentence(),
        body: oldBody,
        context: TemplateContext.accountWelcome(),
        language: Language.ptBR(),
        isDefault: true,
      });

      template.update({ body: newBody });

      expect(template.body).toBe(newBody);
    });

    it("should update template attachments", () => {
      const oldAttachments = [
        {
          url: faker.internet.url(),
          type: AttachmentType.image(),
        },
      ];
      const newAttachments = [
        {
          url: faker.internet.url(),
          type: AttachmentType.file(),
          filename: "document.pdf",
        },
      ];

      const template = new Template({
        channel: Channel.email(),
        subject: faker.lorem.sentence(),
        body: faker.lorem.paragraph(),
        context: TemplateContext.accountWelcome(),
        attachments: oldAttachments,
        language: Language.ptBR(),
        isDefault: true,
      });

      template.update({ attachments: newAttachments });

      expect(template.attachments).toHaveLength(1);
      expect(template.attachments[0].type.isFile()).toBe(true);
    });
  });

  describe("validate", () => {
    it("should pass validation for valid template", () => {
      const template = new Template({
        channel: Channel.email(),
        subject: faker.lorem.sentence(),
        body: faker.lorem.paragraph(),
        context: TemplateContext.accountWelcome(),
        language: Language.ptBR(),
        isDefault: true,
      });

      expect(() => template.validate()).not.toThrow();
    });

    it("should throw ValidationError when channel is missing", () => {
      const template = new Template({
        channel: Channel.email(),
        subject: faker.lorem.sentence(),
        body: faker.lorem.paragraph(),
        context: TemplateContext.accountWelcome(),
        language: Language.ptBR(),
        isDefault: true,
      });

      (template as any)._channel = undefined;

      expect(() => template.validate()).toThrow(ValidationError);
      try {
        template.validate();
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).details[0].path).toBe("channel");
      }
    });

    it("should throw ValidationError when subject is empty for email channel", () => {
      const template = new Template({
        channel: Channel.email(),
        subject: "",
        body: faker.lorem.paragraph(),
        context: TemplateContext.accountWelcome(),
        language: Language.ptBR(),
        isDefault: true,
      });

      expect(() => template.validate()).toThrow(ValidationError);
      try {
        template.validate();
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).details[0].path).toBe("subject");
      }
    });

    it("should not require subject for whatsapp channel", () => {
      const template = new Template({
        channel: Channel.whatsapp(),
        subject: "",
        body: faker.lorem.paragraph(),
        context: TemplateContext.accountWelcome(),
        language: Language.ptBR(),
        isDefault: true,
      });

      expect(() => template.validate()).not.toThrow();
    });

    it("should throw ValidationError when body is empty", () => {
      const template = new Template({
        channel: Channel.email(),
        subject: faker.lorem.sentence(),
        body: "",
        context: TemplateContext.accountWelcome(),
        language: Language.ptBR(),
        isDefault: true,
      });

      expect(() => template.validate()).toThrow(ValidationError);
      try {
        template.validate();
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).details[0].path).toBe("body");
      }
    });

    it("should throw ValidationError when context is missing", () => {
      const template = new Template({
        channel: Channel.email(),
        subject: faker.lorem.sentence(),
        body: faker.lorem.paragraph(),
        context: TemplateContext.accountWelcome(),
        language: Language.ptBR(),
        isDefault: true,
      });

      (template as any)._context = undefined;

      expect(() => template.validate()).toThrow(ValidationError);
    });

    it("should throw ValidationError when language is missing", () => {
      const template = new Template({
        channel: Channel.email(),
        subject: faker.lorem.sentence(),
        body: faker.lorem.paragraph(),
        context: TemplateContext.accountWelcome(),
        language: Language.ptBR(),
        isDefault: true,
      });

      (template as any)._language = undefined;

      expect(() => template.validate()).toThrow(ValidationError);
    });

    it("should throw ValidationError when attachment has empty url", () => {
      const template = new Template({
        channel: Channel.email(),
        subject: faker.lorem.sentence(),
        body: faker.lorem.paragraph(),
        context: TemplateContext.accountWelcome(),
        attachments: [
          {
            url: "",
            type: AttachmentType.image(),
          },
        ],
        language: Language.ptBR(),
        isDefault: true,
      });

      expect(() => template.validate()).toThrow(ValidationError);
      try {
        template.validate();
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).details[0].path).toBe("attachments[0].url");
      }
    });
  });

  describe("toJSON", () => {
    it("should return a JSON representation with all fields", () => {
      const now = new Date();
      const id = ID.create(faker.string.uuid());
      const subject = faker.lorem.sentence();
      const body = faker.lorem.paragraph();
      const attachments = [
        {
          url: faker.internet.url(),
          type: AttachmentType.image(),
          filename: "image.png",
          mimeType: "image/png",
        },
      ];

      const template = new Template({
        id: id.value,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
        channel: Channel.email(),
        subject,
        body,
        context: TemplateContext.accountWelcome(),
        attachments,
        accountId: null,
        language: Language.ptBR(),
        isDefault: true,
      });

      const json = template.toJSON();

      expect(json).toEqual({
        id: id.value,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
        status: StatusValue.ACTIVE,
        channel: ChannelValue.EMAIL,
        subject,
        body,
        context: TemplateContextValue.ACCOUNT_WELCOME,
        attachments: [
          {
            url: attachments[0].url,
            type: "image",
            filename: "image.png",
            mimeType: "image/png",
          },
        ],
        accountId: null,
        language: LanguageValue.PT_BR,
        isDefault: true,
      });
    });
  });

  describe("asFaker", () => {
    it("should create a template with faker data", () => {
      const template = Template.asFaker();

      expect(template).toBeInstanceOf(Template);
      expect(template.channel.isEmail()).toBe(true);
      expect(template.subject).toBeDefined();
      expect(template.body).toBeDefined();
      expect(template.isSystemDefault()).toBe(true);
    });

    it("should allow overriding faker data", () => {
      const customContext = TemplateContext.forgotPassword();
      const template = Template.asFaker({
        context: customContext,
      });

      expect(template.context.isForgotPassword()).toBe(true);
    });
  });
});
