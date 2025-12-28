import { describe, it, expect } from "bun:test";
import { setupIntegrationTests } from "../../setup";
import { createTemplateTester, createTemplateInput } from "./helpers";
import { createGetTemplateTester } from "./helpers";
import { faker } from "@faker-js/faker";

describe("GetTemplateController Integration", () => {
  setupIntegrationTests();

  it("should get template successfully", async () => {
    const createTester = createTemplateTester();
    const input = createTemplateInput();
    const created = await createTester.run(input);

    const getTester = createGetTemplateTester();
    const output = await getTester.run(created.id);

    expect(output.id).toBe(created.id);
    expect(output.channel).toBe(input.channel);
    expect(output.body).toBe(input.body);
    expect(output.context).toBe(input.context);
    expect(output.language).toBe(input.language);
  });

  it("should return not found error for non-existent template", async () => {
    const getTester = createGetTemplateTester();
    const nonExistentId = faker.string.uuid();

    await expect(getTester.run(nonExistentId)).rejects.toThrow();
  });
});
