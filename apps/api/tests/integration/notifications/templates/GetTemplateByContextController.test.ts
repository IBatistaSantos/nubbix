import { describe, it, expect } from "bun:test";
import { setupIntegrationTests } from "../../setup";
import { createTemplateTester, createTemplateInput } from "./helpers";
import { createGetTemplateByContextTester } from "./helpers";
import { faker } from "@faker-js/faker";

describe("GetTemplateByContextController Integration", () => {
  setupIntegrationTests();

  it("should get template by accountId, context and language", async () => {
    const accountId = faker.string.uuid();
    const context = faker.helpers.arrayElement([
      "account.welcome",
      "participant.registration",
      "forgot.password",
    ]) as "account.welcome" | "participant.registration" | "forgot.password";
    const language = faker.helpers.arrayElement(["pt-BR", "en-US", "es-ES"]) as
      | "pt-BR"
      | "en-US"
      | "es-ES";
    const createTester = createTemplateTester();

    const template = await createTester.run(
      createTemplateInput({
        accountId,
        context,
        language,
      })
    );

    const getTester = createGetTemplateByContextTester();
    const output = await getTester.run({
      context,
      language,
      accountId,
    });

    expect(output.id).toBe(template.id);
    expect(output.accountId).toBe(accountId);
    expect(output.context).toBe(context);
    expect(output.language).toBe(language);
  });

  it("should fallback to default template when accountId template not found", async () => {
    const createTester = createTemplateTester();
    const uniqueContext = faker.helpers.arrayElement([
      "account.welcome",
      "participant.registration",
      "forgot.password",
    ]) as "account.welcome" | "participant.registration" | "forgot.password";
    const uniqueLanguage = faker.helpers.arrayElement(["pt-BR", "en-US", "es-ES"]) as
      | "pt-BR"
      | "en-US"
      | "es-ES";
    const nonExistentAccountId = faker.string.uuid();

    const defaultTemplate = await createTester.run(
      createTemplateInput({
        accountId: null,
        isDefault: true,
        context: uniqueContext,
        language: uniqueLanguage,
      })
    );

    const getTester = createGetTemplateByContextTester();
    const output = await getTester.run({
      context: uniqueContext,
      language: uniqueLanguage,
      accountId: nonExistentAccountId,
    });

    expect(output).not.toBeNull();
    expect(output.id).toBe(defaultTemplate.id);
    expect(output.accountId).toBeNull();
    expect(output.isDefault).toBe(true);
  });

  it("should prefer accountId template over default", async () => {
    const accountId = faker.string.uuid();
    const createTester = createTemplateTester();
    const uniqueContext = faker.helpers.arrayElement([
      "account.welcome",
      "participant.registration",
      "forgot.password",
    ]) as "account.welcome" | "participant.registration" | "forgot.password";
    const uniqueLanguage = faker.helpers.arrayElement(["pt-BR", "en-US", "es-ES"]) as
      | "pt-BR"
      | "en-US"
      | "es-ES";

    const accountTemplate = await createTester.run(
      createTemplateInput({
        accountId,
        context: uniqueContext,
        language: uniqueLanguage,
      })
    );

    await createTester.run(
      createTemplateInput({
        accountId: null,
        isDefault: true,
        context: uniqueContext,
        language: uniqueLanguage,
      })
    );

    const getTester = createGetTemplateByContextTester();
    const output = await getTester.run({
      context: uniqueContext,
      language: uniqueLanguage,
      accountId,
    });

    expect(output.id).toBe(accountTemplate.id);
    expect(output.accountId).toBe(accountId);
  });

  it("should get default template when accountId is not provided", async () => {
    const createTester = createTemplateTester();
    const uniqueContext = faker.helpers.arrayElement([
      "account.welcome",
      "participant.registration",
      "forgot.password",
    ]) as "account.welcome" | "participant.registration" | "forgot.password";
    const uniqueLanguage = faker.helpers.arrayElement(["pt-BR", "en-US", "es-ES"]) as
      | "pt-BR"
      | "en-US"
      | "es-ES";

    const defaultTemplate = await createTester.run(
      createTemplateInput({
        accountId: null,
        isDefault: true,
        context: uniqueContext,
        language: uniqueLanguage,
      })
    );

    const getTester = createGetTemplateByContextTester();
    const output = await getTester.run({
      context: uniqueContext,
      language: uniqueLanguage,
    });

    expect(output).not.toBeNull();
    expect(output.id).toBe(defaultTemplate.id);
    expect(output.isDefault).toBe(true);
  });

  it("should return not found error when no template found", async () => {
    const getTester = createGetTemplateByContextTester();
    const context = faker.helpers.arrayElement([
      "account.welcome",
      "participant.registration",
      "forgot.password",
    ]) as "account.welcome" | "participant.registration" | "forgot.password";
    const language = faker.helpers.arrayElement(["pt-BR", "en-US", "es-ES"]) as
      | "pt-BR"
      | "en-US"
      | "es-ES";

    await expect(
      getTester.run({
        context,
        language,
        accountId: faker.string.uuid(),
      })
    ).rejects.toThrow();
  });
});
