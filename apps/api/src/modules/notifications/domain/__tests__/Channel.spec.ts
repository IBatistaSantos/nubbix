import { describe, it, expect } from "bun:test";
import { Channel, ChannelValue } from "../vo/Channel";

describe("Channel", () => {
  describe("email", () => {
    it("should create an email channel", () => {
      const channel = Channel.email();

      expect(channel.value).toBe(ChannelValue.EMAIL);
      expect(channel.isEmail()).toBe(true);
      expect(channel.isWhatsapp()).toBe(false);
    });
  });

  describe("whatsapp", () => {
    it("should create a whatsapp channel", () => {
      const channel = Channel.whatsapp();

      expect(channel.value).toBe(ChannelValue.WHATSAPP);
      expect(channel.isWhatsapp()).toBe(true);
      expect(channel.isEmail()).toBe(false);
    });
  });

  describe("fromValue", () => {
    it("should create channel from EMAIL value", () => {
      const channel = Channel.fromValue(ChannelValue.EMAIL);

      expect(channel.value).toBe(ChannelValue.EMAIL);
      expect(channel.isEmail()).toBe(true);
    });

    it("should create channel from WHATSAPP value", () => {
      const channel = Channel.fromValue(ChannelValue.WHATSAPP);

      expect(channel.value).toBe(ChannelValue.WHATSAPP);
      expect(channel.isWhatsapp()).toBe(true);
    });
  });

  describe("isEqualTo", () => {
    it("should return true for equal channels", () => {
      const channel1 = Channel.email();
      const channel2 = Channel.email();

      expect(channel1.isEqualTo(channel2)).toBe(true);
    });

    it("should return false for different channels", () => {
      const channel1 = Channel.email();
      const channel2 = Channel.whatsapp();

      expect(channel1.isEqualTo(channel2)).toBe(false);
    });
  });

  describe("isEmail", () => {
    it("should return true for email channel", () => {
      const channel = Channel.email();

      expect(channel.isEmail()).toBe(true);
    });

    it("should return false for whatsapp channel", () => {
      const channel = Channel.whatsapp();

      expect(channel.isEmail()).toBe(false);
    });
  });

  describe("isWhatsapp", () => {
    it("should return true for whatsapp channel", () => {
      const channel = Channel.whatsapp();

      expect(channel.isWhatsapp()).toBe(true);
    });

    it("should return false for email channel", () => {
      const channel = Channel.email();

      expect(channel.isWhatsapp()).toBe(false);
    });
  });
});
