import { describe, it, expect } from "bun:test";
import { Language, LanguageValue } from "../vo/Language";

describe("Language", () => {
  describe("ptBR", () => {
    it("should create a pt-BR language", () => {
      const language = Language.ptBR();

      expect(language.value).toBe(LanguageValue.PT_BR);
      expect(language.isPtBR()).toBe(true);
      expect(language.isEnUS()).toBe(false);
      expect(language.isEsES()).toBe(false);
    });
  });

  describe("enUS", () => {
    it("should create an en-US language", () => {
      const language = Language.enUS();

      expect(language.value).toBe(LanguageValue.EN_US);
      expect(language.isEnUS()).toBe(true);
      expect(language.isPtBR()).toBe(false);
      expect(language.isEsES()).toBe(false);
    });
  });

  describe("esES", () => {
    it("should create an es-ES language", () => {
      const language = Language.esES();

      expect(language.value).toBe(LanguageValue.ES_ES);
      expect(language.isEsES()).toBe(true);
      expect(language.isPtBR()).toBe(false);
      expect(language.isEnUS()).toBe(false);
    });
  });

  describe("fromValue", () => {
    it("should create language from PT_BR value", () => {
      const language = Language.fromValue(LanguageValue.PT_BR);

      expect(language.value).toBe(LanguageValue.PT_BR);
      expect(language.isPtBR()).toBe(true);
    });

    it("should create language from EN_US value", () => {
      const language = Language.fromValue(LanguageValue.EN_US);

      expect(language.value).toBe(LanguageValue.EN_US);
      expect(language.isEnUS()).toBe(true);
    });

    it("should create language from ES_ES value", () => {
      const language = Language.fromValue(LanguageValue.ES_ES);

      expect(language.value).toBe(LanguageValue.ES_ES);
      expect(language.isEsES()).toBe(true);
    });
  });

  describe("isEqualTo", () => {
    it("should return true for equal languages", () => {
      const language1 = Language.ptBR();
      const language2 = Language.ptBR();

      expect(language1.isEqualTo(language2)).toBe(true);
    });

    it("should return false for different languages", () => {
      const language1 = Language.ptBR();
      const language2 = Language.enUS();

      expect(language1.isEqualTo(language2)).toBe(false);
    });
  });

  describe("isPtBR", () => {
    it("should return true for pt-BR language", () => {
      const language = Language.ptBR();

      expect(language.isPtBR()).toBe(true);
    });

    it("should return false for other languages", () => {
      const language = Language.enUS();

      expect(language.isPtBR()).toBe(false);
    });
  });

  describe("isEnUS", () => {
    it("should return true for en-US language", () => {
      const language = Language.enUS();

      expect(language.isEnUS()).toBe(true);
    });

    it("should return false for other languages", () => {
      const language = Language.ptBR();

      expect(language.isEnUS()).toBe(false);
    });
  });

  describe("isEsES", () => {
    it("should return true for es-ES language", () => {
      const language = Language.esES();

      expect(language.isEsES()).toBe(true);
    });

    it("should return false for other languages", () => {
      const language = Language.ptBR();

      expect(language.isEsES()).toBe(false);
    });
  });
});
