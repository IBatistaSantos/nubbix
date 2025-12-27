import { describe, it, expect } from "bun:test";
import { Role, RoleValue } from "../vo/Role";

describe("Role", () => {
  describe("user", () => {
    it("should create a user role", () => {
      const role = Role.user();

      expect(role.value).toBe(RoleValue.USER);
      expect(role.isUser()).toBe(true);
      expect(role.isAdmin()).toBe(false);
      expect(role.isSuperAdmin()).toBe(false);
    });
  });

  describe("admin", () => {
    it("should create an admin role", () => {
      const role = Role.admin();

      expect(role.value).toBe(RoleValue.ADMIN);
      expect(role.isAdmin()).toBe(true);
      expect(role.isUser()).toBe(false);
      expect(role.isSuperAdmin()).toBe(false);
    });
  });

  describe("superAdmin", () => {
    it("should create a super admin role", () => {
      const role = Role.superAdmin();

      expect(role.value).toBe(RoleValue.SUPER_ADMIN);
      expect(role.isSuperAdmin()).toBe(true);
      expect(role.isUser()).toBe(false);
      expect(role.isAdmin()).toBe(false);
    });
  });

  describe("fromValue", () => {
    it("should create role from USER value", () => {
      const role = Role.fromValue(RoleValue.USER);

      expect(role.value).toBe(RoleValue.USER);
      expect(role.isUser()).toBe(true);
    });

    it("should create role from ADMIN value", () => {
      const role = Role.fromValue(RoleValue.ADMIN);

      expect(role.value).toBe(RoleValue.ADMIN);
      expect(role.isAdmin()).toBe(true);
    });

    it("should create role from SUPER_ADMIN value", () => {
      const role = Role.fromValue(RoleValue.SUPER_ADMIN);

      expect(role.value).toBe(RoleValue.SUPER_ADMIN);
      expect(role.isSuperAdmin()).toBe(true);
    });
  });

  describe("isEqualTo", () => {
    it("should return true for equal roles", () => {
      const role1 = Role.user();
      const role2 = Role.user();

      expect(role1.isEqualTo(role2)).toBe(true);
    });

    it("should return false for different roles", () => {
      const role1 = Role.user();
      const role2 = Role.admin();

      expect(role1.isEqualTo(role2)).toBe(false);
    });
  });

  describe("isUser", () => {
    it("should return true for user role", () => {
      const role = Role.user();

      expect(role.isUser()).toBe(true);
    });

    it("should return false for admin role", () => {
      const role = Role.admin();

      expect(role.isUser()).toBe(false);
    });
  });

  describe("isAdmin", () => {
    it("should return true for admin role", () => {
      const role = Role.admin();

      expect(role.isAdmin()).toBe(true);
    });

    it("should return false for user role", () => {
      const role = Role.user();

      expect(role.isAdmin()).toBe(false);
    });
  });

  describe("isSuperAdmin", () => {
    it("should return true for super admin role", () => {
      const role = Role.superAdmin();

      expect(role.isSuperAdmin()).toBe(true);
    });

    it("should return false for user role", () => {
      const role = Role.user();

      expect(role.isSuperAdmin()).toBe(false);
    });
  });
});
