import { describe, it, expect } from "bun:test";
import { setupIntegrationTests } from "../setup";
import { users } from "../../../src/shared/infrastructure/db/schema";
import { eq } from "drizzle-orm";
import { createSetPasswordTester, createSetPasswordInput } from "./helpers";
import { QueryHelpers } from "../core/queryHelpers";
import { TestAssertions } from "../core/assertions";
import { createAccountTester, createAccountInput } from "./helpers";

describe("SetPasswordController Integration", () => {
  setupIntegrationTests();

  it("should return 200 when password is set successfully", async () => {
    // First create an account to get a user with a token
    const accountTester = createAccountTester();
    const accountInput = createAccountInput();
    const accountOutput = await accountTester.run(accountInput);

    const user = (await QueryHelpers.findByEmailAndAccountId(
      users,
      users.email,
      users.accountId,
      accountInput.responsibleEmail,
      accountOutput.accountId
    )) as typeof users.$inferSelect | null;
    TestAssertions.expectEntityExists(user);
    const token = user!.resetPasswordToken!;

    const tester = createSetPasswordTester();
    const input = createSetPasswordInput({
      token,
      password: "newPassword123",
    });

    const output = await tester.run(input);

    expect(output).toHaveProperty("userId");
    expect(output).toHaveProperty("email");
    expect(output.email).toBe(accountInput.responsibleEmail.toLowerCase());
  });

  it("should return error when token is invalid", async () => {
    const tester = createSetPasswordTester();
    const input = createSetPasswordInput({
      token: "invalid-token-123",
      password: "newPassword123",
    });

    await expect(tester.run(input)).rejects.toThrow();
  });

  it("should return error when token expired", async () => {
    // Create account
    const accountTester = createAccountTester();
    const accountInput = createAccountInput();
    const accountOutput = await accountTester.run(accountInput);

    // Get user and update token to be expired
    const user = (await QueryHelpers.findByEmailAndAccountId(
      users,
      users.email,
      users.accountId,
      accountInput.responsibleEmail,
      accountOutput.accountId
    )) as typeof users.$inferSelect | null;
    TestAssertions.expectEntityExists(user);
    const token = user!.resetPasswordToken!;

    // Update token to be expired
    const db = accountTester.getDatabase();
    await db
      .update(users)
      .set({
        resetPasswordTokenExpiresAt: new Date(Date.now() - 1000), // Expired 1 second ago
      })
      .where(eq(users.id, user!.id));

    const tester = createSetPasswordTester();
    const input = createSetPasswordInput({
      token,
      password: "newPassword123",
    });

    await expect(tester.run(input)).rejects.toThrow();
  });

  it("should return error when password is too short", async () => {
    const accountTester = createAccountTester();
    const accountInput = createAccountInput();
    const accountOutput = await accountTester.run(accountInput);

    const user = (await QueryHelpers.findByEmailAndAccountId(
      users,
      users.email,
      users.accountId,
      accountInput.responsibleEmail,
      accountOutput.accountId
    )) as typeof users.$inferSelect | null;
    TestAssertions.expectEntityExists(user);
    const token = user!.resetPasswordToken!;

    const tester = createSetPasswordTester();
    const input = createSetPasswordInput({
      token,
      password: "short",
    });

    await expect(tester.run(input)).rejects.toThrow();
  });

  it("should update password in database", async () => {
    const accountTester = createAccountTester();
    const accountInput = createAccountInput();
    const accountOutput = await accountTester.run(accountInput);

    const user = (await QueryHelpers.findByEmailAndAccountId(
      users,
      users.email,
      users.accountId,
      accountInput.responsibleEmail,
      accountOutput.accountId
    )) as typeof users.$inferSelect | null;
    TestAssertions.expectEntityExists(user);
    const token = user!.resetPasswordToken!;
    expect(user!.password).toBeNull();

    const tester = createSetPasswordTester();
    const input = createSetPasswordInput({
      token,
      password: "newPassword123",
    });

    await tester.run(input);

    const updatedUser = (await QueryHelpers.findByEmailAndAccountId(
      users,
      users.email,
      users.accountId,
      accountInput.responsibleEmail,
      accountOutput.accountId
    )) as typeof users.$inferSelect | null;
    TestAssertions.expectEntityExists(updatedUser);
    expect(updatedUser!.password).not.toBeNull();
    expect(updatedUser!.password).toContain("$2");
  });

  it("should clear reset_password_token after success", async () => {
    const accountTester = createAccountTester();
    const accountInput = createAccountInput();
    const accountOutput = await accountTester.run(accountInput);

    const user = (await QueryHelpers.findByEmailAndAccountId(
      users,
      users.email,
      users.accountId,
      accountInput.responsibleEmail,
      accountOutput.accountId
    )) as typeof users.$inferSelect | null;
    TestAssertions.expectEntityExists(user);
    const token = user!.resetPasswordToken!;
    expect(user!.resetPasswordToken).not.toBeNull();

    const tester = createSetPasswordTester();
    const input = createSetPasswordInput({
      token,
      password: "newPassword123",
    });

    await tester.run(input);

    const updatedUser = (await QueryHelpers.findByEmailAndAccountId(
      users,
      users.email,
      users.accountId,
      accountInput.responsibleEmail,
      accountOutput.accountId
    )) as typeof users.$inferSelect | null;
    TestAssertions.expectEntityExists(updatedUser);
    expect(updatedUser!.resetPasswordToken).toBeNull();
    expect(updatedUser!.resetPasswordTokenExpiresAt).toBeNull();
  });

  it("should validate input (token and password required)", async () => {
    const tester = createSetPasswordTester();

    await expect(
      tester.run({
        token: "",
        password: "newPassword123",
      } as any)
    ).rejects.toThrow();

    await expect(
      tester.run({
        token: "some-token",
        password: "",
      } as any)
    ).rejects.toThrow();
  });
});

