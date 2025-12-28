import { describe, it, expect } from "bun:test";
import { setupIntegrationTests } from "../../setup";
import { templates } from "../../../../src/shared/infrastructure/db/schema";
import { createTemplateTester, createTemplateInput } from "./helpers";
import { createUpdateTemplateTester } from "./helpers";
import { TestAssertions } from "../../core/assertions";
import { eq, isNull, and } from "drizzle-orm";
import { faker } from "@faker-js/faker";

describe("UpdateTemplateController Integration", () => {
  setupIntegrationTests();

  it("should update template successfully", async () => {
    const createTester = createTemplateTester();
    const uniqueAccountId = faker.string.uuid();
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
      accountId: uniqueAccountId,
      context: uniqueContext,
      language: uniqueLanguage,
      isDefault: false,
    });
    const created = await createTester.run(input);

    const updateTester = createUpdateTemplateTester();
    const newSubject = faker.lorem.sentence();
    const newBody = faker.lorem.paragraph();

    const updateInput = {
      templateId: created.id,
      subject: newSubject,
      body: newBody,
    };

    const output = await updateTester.run(updateInput);

    expect(output.id).toBe(created.id);
    expect(output.subject).toBe(newSubject);
    expect(output.body).toBe(newBody);

    const db = updateTester.getDatabase();
    const result = await db
      .select()
      .from(templates)
      .where(and(eq(templates.id, created.id), isNull(templates.deletedAt)))
      .limit(1);
    const template = result[0];
    TestAssertions.expectProperty(template!, "subject", newSubject);
    TestAssertions.expectProperty(template!, "body", newBody);
  });

  it("should return not found error for non-existent template", async () => {
    const updateTester = createUpdateTemplateTester();
    const updateInput = {
      templateId: faker.string.uuid(),
      subject: faker.lorem.sentence(),
    };

    await expect(updateTester.run(updateInput)).rejects.toThrow();
  });
});
