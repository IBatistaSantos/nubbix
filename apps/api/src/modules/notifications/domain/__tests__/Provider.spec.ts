import { describe, it, expect } from "bun:test";
import { Provider, ProviderValue } from "../vo/Provider";

describe("Provider", () => {
  describe("twilio", () => {
    it("should create a twilio provider", () => {
      const provider = Provider.twilio();

      expect(provider.value).toBe(ProviderValue.TWILIO);
      expect(provider.isTwilio()).toBe(true);
      expect(provider.isSendgrid()).toBe(false);
      expect(provider.isCustom()).toBe(false);
    });
  });

  describe("sendgrid", () => {
    it("should create a sendgrid provider", () => {
      const provider = Provider.sendgrid();

      expect(provider.value).toBe(ProviderValue.SENDGRID);
      expect(provider.isSendgrid()).toBe(true);
      expect(provider.isTwilio()).toBe(false);
      expect(provider.isCustom()).toBe(false);
    });
  });

  describe("custom", () => {
    it("should create a custom provider", () => {
      const provider = Provider.custom();

      expect(provider.value).toBe(ProviderValue.CUSTOM);
      expect(provider.isCustom()).toBe(true);
      expect(provider.isTwilio()).toBe(false);
      expect(provider.isSendgrid()).toBe(false);
    });
  });

  describe("fromValue", () => {
    it("should create provider from TWILIO value", () => {
      const provider = Provider.fromValue(ProviderValue.TWILIO);

      expect(provider.value).toBe(ProviderValue.TWILIO);
      expect(provider.isTwilio()).toBe(true);
    });

    it("should create provider from SENDGRID value", () => {
      const provider = Provider.fromValue(ProviderValue.SENDGRID);

      expect(provider.value).toBe(ProviderValue.SENDGRID);
      expect(provider.isSendgrid()).toBe(true);
    });

    it("should create provider from CUSTOM value", () => {
      const provider = Provider.fromValue(ProviderValue.CUSTOM);

      expect(provider.value).toBe(ProviderValue.CUSTOM);
      expect(provider.isCustom()).toBe(true);
    });
  });

  describe("isEqualTo", () => {
    it("should return true for equal providers", () => {
      const provider1 = Provider.twilio();
      const provider2 = Provider.twilio();

      expect(provider1.isEqualTo(provider2)).toBe(true);
    });

    it("should return false for different providers", () => {
      const provider1 = Provider.twilio();
      const provider2 = Provider.sendgrid();

      expect(provider1.isEqualTo(provider2)).toBe(false);
    });
  });

  describe("isTwilio", () => {
    it("should return true for twilio provider", () => {
      const provider = Provider.twilio();

      expect(provider.isTwilio()).toBe(true);
    });

    it("should return false for other providers", () => {
      const provider = Provider.sendgrid();

      expect(provider.isTwilio()).toBe(false);
    });
  });

  describe("isSendgrid", () => {
    it("should return true for sendgrid provider", () => {
      const provider = Provider.sendgrid();

      expect(provider.isSendgrid()).toBe(true);
    });

    it("should return false for other providers", () => {
      const provider = Provider.twilio();

      expect(provider.isSendgrid()).toBe(false);
    });
  });

  describe("isCustom", () => {
    it("should return true for custom provider", () => {
      const provider = Provider.custom();

      expect(provider.isCustom()).toBe(true);
    });

    it("should return false for other providers", () => {
      const provider = Provider.twilio();

      expect(provider.isCustom()).toBe(false);
    });
  });
});
