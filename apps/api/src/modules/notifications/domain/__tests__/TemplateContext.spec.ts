import { describe, it, expect } from "bun:test";
import { TemplateContext, TemplateContextValue } from "../vo/TemplateContext";

describe("TemplateContext", () => {
  describe("accountWelcome", () => {
    it("should create an account welcome context", () => {
      const context = TemplateContext.accountWelcome();

      expect(context.value).toBe(TemplateContextValue.ACCOUNT_WELCOME);
      expect(context.isAccountWelcome()).toBe(true);
      expect(context.isParticipantRegistration()).toBe(false);
      expect(context.isForgotPassword()).toBe(false);
    });
  });

  describe("participantRegistration", () => {
    it("should create a participant registration context", () => {
      const context = TemplateContext.participantRegistration();

      expect(context.value).toBe(TemplateContextValue.PARTICIPANT_REGISTRATION);
      expect(context.isParticipantRegistration()).toBe(true);
      expect(context.isAccountWelcome()).toBe(false);
      expect(context.isForgotPassword()).toBe(false);
    });
  });

  describe("forgotPassword", () => {
    it("should create a forgot password context", () => {
      const context = TemplateContext.forgotPassword();

      expect(context.value).toBe(TemplateContextValue.FORGOT_PASSWORD);
      expect(context.isForgotPassword()).toBe(true);
      expect(context.isAccountWelcome()).toBe(false);
      expect(context.isParticipantRegistration()).toBe(false);
    });
  });

  describe("fromValue", () => {
    it("should create context from ACCOUNT_WELCOME value", () => {
      const context = TemplateContext.fromValue(TemplateContextValue.ACCOUNT_WELCOME);

      expect(context.value).toBe(TemplateContextValue.ACCOUNT_WELCOME);
      expect(context.isAccountWelcome()).toBe(true);
    });

    it("should create context from PARTICIPANT_REGISTRATION value", () => {
      const context = TemplateContext.fromValue(TemplateContextValue.PARTICIPANT_REGISTRATION);

      expect(context.value).toBe(TemplateContextValue.PARTICIPANT_REGISTRATION);
      expect(context.isParticipantRegistration()).toBe(true);
    });

    it("should create context from FORGOT_PASSWORD value", () => {
      const context = TemplateContext.fromValue(TemplateContextValue.FORGOT_PASSWORD);

      expect(context.value).toBe(TemplateContextValue.FORGOT_PASSWORD);
      expect(context.isForgotPassword()).toBe(true);
    });
  });

  describe("isEqualTo", () => {
    it("should return true for equal contexts", () => {
      const context1 = TemplateContext.accountWelcome();
      const context2 = TemplateContext.accountWelcome();

      expect(context1.isEqualTo(context2)).toBe(true);
    });

    it("should return false for different contexts", () => {
      const context1 = TemplateContext.accountWelcome();
      const context2 = TemplateContext.forgotPassword();

      expect(context1.isEqualTo(context2)).toBe(false);
    });
  });

  describe("isAccountWelcome", () => {
    it("should return true for account welcome context", () => {
      const context = TemplateContext.accountWelcome();

      expect(context.isAccountWelcome()).toBe(true);
    });

    it("should return false for other contexts", () => {
      const context = TemplateContext.forgotPassword();

      expect(context.isAccountWelcome()).toBe(false);
    });
  });

  describe("isParticipantRegistration", () => {
    it("should return true for participant registration context", () => {
      const context = TemplateContext.participantRegistration();

      expect(context.isParticipantRegistration()).toBe(true);
    });

    it("should return false for other contexts", () => {
      const context = TemplateContext.accountWelcome();

      expect(context.isParticipantRegistration()).toBe(false);
    });
  });

  describe("isForgotPassword", () => {
    it("should return true for forgot password context", () => {
      const context = TemplateContext.forgotPassword();

      expect(context.isForgotPassword()).toBe(true);
    });

    it("should return false for other contexts", () => {
      const context = TemplateContext.accountWelcome();

      expect(context.isForgotPassword()).toBe(false);
    });
  });
});
