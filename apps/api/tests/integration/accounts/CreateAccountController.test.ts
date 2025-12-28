import { describe, it, expect } from "bun:test";
import { setupIntegrationTests } from "../setup";
import { accounts, users } from "../../../src/shared/infrastructure/db/schema";
import { eq } from "drizzle-orm";
import { createAccountTester, createAccountInput } from "./helpers";
import { QueryHelpers } from "../core/queryHelpers";
import { TestAssertions } from "../core/assertions";

describe("CreateAccountController Integration", () => {
  setupIntegrationTests();

  it("should create account successfully and return 201", async () => {
    const tester = createAccountTester();
    const input = createAccountInput();
    const { slug, accountName } = input;

    const output = await tester.run(input);

    expect(output).toHaveProperty("accountId");
    expect(output.slug).toBe(slug);

    const account = await QueryHelpers.findBySlug(accounts, accounts.slug, slug);
    TestAssertions.expectEntityExists(account);
    TestAssertions.expectProperty(account!, "name", accountName);
    TestAssertions.expectProperty(account!, "slug", slug);
  });

  it("should create user with SUPER_ADMIN role when account is created", async () => {
    const tester = createAccountTester();
    const input = createAccountInput();
    const email = QueryHelpers.normalizeEmail(input.responsibleEmail);

    await tester.run(input);

    const user = await QueryHelpers.findByEmail(users, users.email, input.responsibleEmail);
    TestAssertions.expectEntityExists(user);
    TestAssertions.expectProperty(user!, "email", email);
    TestAssertions.expectProperty(user!, "role", "SUPER_ADMIN");
  });

  it("should return validation error for invalid input", async () => {
    const tester = createAccountTester();
    const input = createAccountInput({
      accountName: "",
      slug: "",
      responsibleEmail: "invalid-email",
    });

    await expect(tester.run(input)).rejects.toThrow();
  });

  it("should return conflict error for duplicate slug", async () => {
    const tester = createAccountTester();
    const input = createAccountInput();
    const { slug } = input;

    await tester.run(input);

    const duplicateInput = createAccountInput({ slug });
    await expect(tester.run(duplicateInput)).rejects.toThrow();
  });

  it("should rollback transaction when user creation fails", async () => {
    const tester = createAccountTester();

    const existingEmail = "existing@example.com";
    const firstInput = createAccountInput({ responsibleEmail: existingEmail });
    await tester.run(firstInput);

    const secondInput = createAccountInput({
      responsibleEmail: existingEmail,
      slug: "different-slug",
    });

    await expect(tester.run(secondInput)).rejects.toThrow();

    const account = await QueryHelpers.findBySlug(accounts, accounts.slug, secondInput.slug);
    expect(account).toBeNull();
  });

  it("should commit transaction when both account and user are created successfully", async () => {
    const tester = createAccountTester();
    const input = createAccountInput();
    const { slug, accountName, responsibleEmail } = input;

    const output = await tester.run(input);

    expect(output).toHaveProperty("accountId");
    expect(output.slug).toBe(slug);

    const account = (await QueryHelpers.findBySlug(accounts, accounts.slug, slug)) as
      | typeof accounts.$inferSelect
      | null;
    TestAssertions.expectEntityExists(account);
    TestAssertions.expectProperty(account!, "name", accountName);
    TestAssertions.expectProperty(account!, "slug", slug);

    const user = await QueryHelpers.findByEmail(users, users.email, responsibleEmail);
    TestAssertions.expectEntityExists(user);
    TestAssertions.expectProperty(user!, "email", QueryHelpers.normalizeEmail(responsibleEmail));
    const accountId = account!.id;
    TestAssertions.expectProperty(user!, "accountId", accountId);
  });

  it("should ensure atomicity - if user creation fails, account should not be persisted", async () => {
    const tester = createAccountTester();
    const db = tester.getDatabase();

    const existingEmail = "duplicate@example.com";
    const firstInput = createAccountInput({ responsibleEmail: existingEmail });
    await tester.run(firstInput);

    const uniqueSlug = "unique-slug-for-rollback-test";
    const secondInput = createAccountInput({
      responsibleEmail: existingEmail,
      slug: uniqueSlug,
    });

    await expect(tester.run(secondInput)).rejects.toThrow();

    const account = await QueryHelpers.findBySlug(accounts, accounts.slug, uniqueSlug);
    expect(account).toBeNull();

    const firstAccount = await QueryHelpers.findByEmail(users, users.email, existingEmail);
    TestAssertions.expectEntityExists(firstAccount);
  });
});
