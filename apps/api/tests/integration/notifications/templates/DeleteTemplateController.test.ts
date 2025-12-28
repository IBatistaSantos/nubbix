import { describe, it, expect } from "bun:test";
import { setupIntegrationTests } from "../../setup";
import { templates } from "../../../../src/shared/infrastructure/db/schema";
import { createTemplateTester, createTemplateInput } from "./helpers";
import { createDeleteTemplateTester } from "./helpers";
import { eq, and } from "drizzle-orm";
import { faker } from "@faker-js/faker";

describe("DeleteTemplateController Integration", () => {
  setupIntegrationTests();

  it("should delete template successfully", async () => {
    const createTester = createTemplateTester();
    const input = createTemplateInput();
    const created = await createTester.run(input);

    const deleteTester = createDeleteTemplateTester();
    await deleteTester.run(created.id);

    const db = deleteTester.getDatabase();
    const result = await db.select().from(templates).where(eq(templates.id, created.id)).limit(1);
    const template = result[0];
    expect(template?.deletedAt).not.toBeNull();
  });

  it("should return not found error for non-existent template", async () => {
    const deleteTester = createDeleteTemplateTester();
    const nonExistentId = faker.string.uuid();

    await expect(deleteTester.run(nonExistentId)).rejects.toThrow();
  });
});
