import { describe, it, expect } from "bun:test";
import { AccountType, AccountTypeValue } from "../vo/AccountType";

describe("AccountType", () => {
  describe("transactional", () => {
    it("should create a transactional account type", () => {
      const accountType = AccountType.transactional();

      expect(accountType.value).toBe(AccountTypeValue.TRANSACTIONAL);
      expect(accountType.isTransactional()).toBe(true);
      expect(accountType.isRecurring()).toBe(false);
    });
  });

  describe("recurring", () => {
    it("should create a recurring account type", () => {
      const accountType = AccountType.recurring();

      expect(accountType.value).toBe(AccountTypeValue.RECURRING);
      expect(accountType.isRecurring()).toBe(true);
      expect(accountType.isTransactional()).toBe(false);
    });
  });

  describe("fromValue", () => {
    it("should create account type from TRANSACTIONAL value", () => {
      const accountType = AccountType.fromValue(
        AccountTypeValue.TRANSACTIONAL
      );

      expect(accountType.value).toBe(AccountTypeValue.TRANSACTIONAL);
      expect(accountType.isTransactional()).toBe(true);
    });

    it("should create account type from RECURRING value", () => {
      const accountType = AccountType.fromValue(AccountTypeValue.RECURRING);

      expect(accountType.value).toBe(AccountTypeValue.RECURRING);
      expect(accountType.isRecurring()).toBe(true);
    });
  });

  describe("isEqualTo", () => {
    it("should return true for equal account types", () => {
      const accountType1 = AccountType.transactional();
      const accountType2 = AccountType.transactional();

      expect(accountType1.isEqualTo(accountType2)).toBe(true);
    });

    it("should return false for different account types", () => {
      const accountType1 = AccountType.transactional();
      const accountType2 = AccountType.recurring();

      expect(accountType1.isEqualTo(accountType2)).toBe(false);
    });
  });

  describe("isTransactional", () => {
    it("should return true for transactional account type", () => {
      const accountType = AccountType.transactional();

      expect(accountType.isTransactional()).toBe(true);
    });

    it("should return false for recurring account type", () => {
      const accountType = AccountType.recurring();

      expect(accountType.isTransactional()).toBe(false);
    });
  });

  describe("isRecurring", () => {
    it("should return true for recurring account type", () => {
      const accountType = AccountType.recurring();

      expect(accountType.isRecurring()).toBe(true);
    });

    it("should return false for transactional account type", () => {
      const accountType = AccountType.transactional();

      expect(accountType.isRecurring()).toBe(false);
    });
  });
});

