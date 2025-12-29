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

    const output = await tester.run(input);

    const user = await QueryHelpers.findByEmailAndAccountId(
      users,
      users.email,
      users.accountId,
      input.responsibleEmail,
      output.accountId
    );
    TestAssertions.expectEntityExists(user);
    TestAssertions.expectProperty(user!, "email", email);
    TestAssertions.expectProperty(user!, "role", "SUPER_ADMIN");
    expect(user!.password).toBeNull();
    expect(user!.resetPasswordToken).not.toBeNull();
    expect(user!.resetPasswordTokenExpiresAt).not.toBeNull();
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

  it("should allow same email in different accounts", async () => {
    const tester = createAccountTester();
    const sharedEmail = "shared@example.com";

    const firstInput = createAccountInput({ 
      responsibleEmail: sharedEmail,
      slug: "first-account-slug",
    });
    const firstOutput = await tester.run(firstInput);

    const secondInput = createAccountInput({
      responsibleEmail: sharedEmail,
      slug: "second-account-slug",
    });
    const secondOutput = await tester.run(secondInput);

    expect(firstOutput).toHaveProperty("accountId");
    expect(secondOutput).toHaveProperty("accountId");
    expect(firstOutput.accountId).not.toBe(secondOutput.accountId);

    const firstUser = (await QueryHelpers.findByEmailAndAccountId(
      users,
      users.email,
      users.accountId,
      sharedEmail,
      firstOutput.accountId
    )) as typeof users.$inferSelect | null;
    const secondUser = (await QueryHelpers.findByEmailAndAccountId(
      users,
      users.email,
      users.accountId,
      sharedEmail,
      secondOutput.accountId
    )) as typeof users.$inferSelect | null;

    TestAssertions.expectEntityExists(firstUser);
    TestAssertions.expectEntityExists(secondUser);
    expect(firstUser!.accountId).not.toBe(secondUser!.accountId);
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

    const user = (await QueryHelpers.findByEmailAndAccountId(
      users,
      users.email,
      users.accountId,
      responsibleEmail,
      account!.id
    )) as typeof users.$inferSelect | null;
    TestAssertions.expectEntityExists(user);
    TestAssertions.expectProperty(user!, "email", QueryHelpers.normalizeEmail(responsibleEmail));
    const accountId = account!.id;
    TestAssertions.expectProperty(user!, "accountId", accountId);
    expect(user!.password).toBeNull();
    expect(user!.resetPasswordToken).not.toBeNull();
    expect(user!.resetPasswordTokenExpiresAt).not.toBeNull();
    const expiryDate = new Date(user!.resetPasswordTokenExpiresAt!);
    const now = new Date();
    expect(expiryDate.getTime()).toBeGreaterThan(now.getTime());
  });

  it("should ensure atomicity - if account creation fails, transaction should rollback", async () => {
    const tester = createAccountTester();

    const firstInput = createAccountInput();
    const firstOutput = await tester.run(firstInput);

    const duplicateSlugInput = createAccountInput({ slug: firstInput.slug });
    await expect(tester.run(duplicateSlugInput)).rejects.toThrow();

    const db = tester.getDatabase();
    const accountsList = await db.select().from(accounts);
    const accountsWithSlug = accountsList.filter((a) => a.slug === firstInput.slug);
    expect(accountsWithSlug).toHaveLength(1);
  });
});
