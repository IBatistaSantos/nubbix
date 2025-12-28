import { describe, it, expect } from "bun:test";
import { setupIntegrationTests } from "../../setup";
import { createTemplateTester, createTemplateInput } from "./helpers";
import { createListTemplatesTester } from "./helpers";
import { faker } from "@faker-js/faker";
import type { ListTemplatesOutput } from "../../../../src/modules/notifications/application/dtos/ListTemplatesDTO";

describe("ListTemplatesController Integration", () => {
  setupIntegrationTests();

  it("should list templates by accountId", async () => {
    const accountId = faker.string.uuid();
    const createTester = createTemplateTester();
    const contexts = ["account.welcome", "participant.registration", "forgot.password"] as const;

    const template1 = await createTester.run(
      createTemplateInput({
        accountId,
        context: faker.helpers.arrayElement(contexts),
        language: faker.helpers.arrayElement(["pt-BR", "en-US", "es-ES"]),
      })
    );
    const template2 = await createTester.run(
      createTemplateInput({
        accountId,
        context: faker.helpers.arrayElement(contexts),
        language: faker.helpers.arrayElement(["pt-BR", "en-US", "es-ES"]),
      })
    );
    await createTester.run(
      createTemplateInput({
        accountId: faker.string.uuid(),
        context: faker.helpers.arrayElement(contexts),
        language: faker.helpers.arrayElement(["pt-BR", "en-US", "es-ES"]),
      })
    );

    const listTester = createListTemplatesTester();
    const output = await listTester.run({ accountId });

    expect(output.templates.length).toBeGreaterThanOrEqual(2);
    expect(output.total).toBeGreaterThanOrEqual(2);
    expect(
      output.templates.some((t: ListTemplatesOutput["templates"][0]) => t.id === template1.id)
    ).toBe(true);
    expect(
      output.templates.some((t: ListTemplatesOutput["templates"][0]) => t.id === template2.id)
    ).toBe(true);
  });

  it("should filter by context", async () => {
    const accountId = faker.string.uuid();
    const createTester = createTemplateTester();
    const targetContext = faker.helpers.arrayElement([
      "account.welcome",
      "participant.registration",
      "forgot.password",
    ]) as "account.welcome" | "participant.registration" | "forgot.password";
    const otherContext = faker.helpers.arrayElement(
      ["account.welcome", "participant.registration", "forgot.password"].filter(
        (c) => c !== targetContext
      )
    ) as "account.welcome" | "participant.registration" | "forgot.password";

    const template1 = await createTester.run(
      createTemplateInput({
        accountId,
        context: targetContext,
        language: faker.helpers.arrayElement(["pt-BR", "en-US", "es-ES"]),
      })
    );
    await createTester.run(
      createTemplateInput({
        accountId,
        context: otherContext,
        language: faker.helpers.arrayElement(["pt-BR", "en-US", "es-ES"]),
      })
    );

    const listTester = createListTemplatesTester();
    const output = await listTester.run({
      accountId,
      context: targetContext,
    });

    expect(output.templates.length).toBeGreaterThanOrEqual(1);
    expect(
      output.templates.some((t: ListTemplatesOutput["templates"][0]) => t.id === template1.id)
    ).toBe(true);
    expect(
      output.templates.every(
        (t: ListTemplatesOutput["templates"][0]) => t.context === targetContext
      )
    ).toBe(true);
  });

  it("should paginate results", async () => {
    const accountId = faker.string.uuid();
    const createTester = createTemplateTester();
    const contexts = ["account.welcome", "participant.registration", "forgot.password"] as const;
    const languages = ["pt-BR", "en-US", "es-ES"] as const;

    for (let i = 0; i < 5; i++) {
      const context = contexts[i % contexts.length];
      const language = languages[Math.floor(i / contexts.length) % languages.length];
      await createTester.run(createTemplateInput({ accountId, context, language }));
    }

    const listTester = createListTemplatesTester();
    const output = await listTester.run({
      accountId,
      page: 1,
      limit: 2,
    });

    expect(output.templates.length).toBe(2);
    expect(output.total).toBeGreaterThanOrEqual(5);
    expect(output.page).toBe(1);
    expect(output.limit).toBe(2);
  });
});
