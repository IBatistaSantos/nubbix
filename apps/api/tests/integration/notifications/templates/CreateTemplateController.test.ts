import { describe, it, expect } from "bun:test";
import { setupIntegrationTests } from "../../setup";
import { templates } from "../../../../src/shared/infrastructure/db/schema";
import { eq, isNull, and } from "drizzle-orm";
import { createTemplateTester, createTemplateInput } from "./helpers";
import { TestAssertions } from "../../core/assertions";
import { faker } from "@faker-js/faker";

describe("CreateTemplateController Integration", () => {
  setupIntegrationTests();

  it("should create template successfully and return 201", async () => {
    const tester = createTemplateTester();
    const input = createTemplateInput();
    const { channel, body, context, language } = input;

    const output = await tester.run(input);

    expect(output).toHaveProperty("id");
    expect(output.channel).toBe(channel);
    expect(output.body).toBe(body);
    expect(output.context).toBe(context);
    expect(output.language).toBe(language);

    const db = tester.getDatabase();
    const result = await db
      .select()
      .from(templates)
      .where(and(eq(templates.id, output.id), isNull(templates.deletedAt)))
      .limit(1);
    const template = result[0];
    TestAssertions.expectEntityExists(template);
    TestAssertions.expectProperty(template!, "channel", channel);
    TestAssertions.expectProperty(template!, "body", body);
  });

  it("should return validation error for invalid input", async () => {
    const tester = createTemplateTester();
    const input = createTemplateInput({
      body: "",
      channel: "invalid" as any,
    });

    await expect(tester.run(input)).rejects.toThrow();
  });

  it("should return conflict error for duplicate template", async () => {
    const tester = createTemplateTester();
    const uniqueContext = faker.helpers.arrayElement([
      "account.welcome",
      "participant.registration",
      "forgot.password",
    ]) as "account.welcome" | "participant.registration" | "forgot.password";
    const uniqueLanguage = faker.helpers.arrayElement(["pt-BR", "en-US", "es-ES"]) as
      | "pt-BR"
      | "en-US"
      | "es-ES";
    const input = createTemplateInput({
      context: uniqueContext,
      language: uniqueLanguage,
      accountId: null,
      isDefault: true,
    });

    await tester.run(input);

    const duplicateInput = createTemplateInput({
      context: uniqueContext,
      language: uniqueLanguage,
      accountId: null,
      isDefault: true,
    });
    await expect(tester.run(duplicateInput)).rejects.toThrow();
  });

  it("should create template with attachments", async () => {
    const tester = createTemplateTester();
    const attachmentUrl = faker.internet.url();
    const attachmentFilename = faker.system.fileName({ extensionCount: 1 });
    const attachmentMimeType = faker.system.mimeType();
    const attachmentType = faker.helpers.arrayElement(["image", "file"]) as "image" | "file";
    const input = createTemplateInput({
      context: faker.helpers.arrayElement([
        "account.welcome",
        "participant.registration",
        "forgot.password",
      ]) as "account.welcome" | "participant.registration" | "forgot.password",
      language: faker.helpers.arrayElement(["pt-BR", "en-US", "es-ES"]) as
        | "pt-BR"
        | "en-US"
        | "es-ES",
      attachments: [
        {
          url: attachmentUrl,
          type: attachmentType,
          filename: attachmentFilename,
          mimeType: attachmentMimeType,
        },
      ],
    });

    const output = await tester.run(input);

    expect(output.attachments).toBeDefined();
    expect(output.attachments?.length).toBe(1);
    expect(output.attachments?.[0].url).toBe(attachmentUrl);
    expect(output.attachments?.[0].filename).toBe(attachmentFilename);
    expect(output.attachments?.[0].mimeType).toBe(attachmentMimeType);
  });
});
