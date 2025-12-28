export const LanguageValue = {
  PT_BR: "pt-BR",
  EN_US: "en-US",
  ES_ES: "es-ES",
} as const;

export type LanguageValue = (typeof LanguageValue)[keyof typeof LanguageValue];

export class Language {
  private _value: LanguageValue;

  private constructor(value: LanguageValue) {
    this._value = value;
  }

  get value() {
    return this._value;
  }

  static ptBR() {
    return new Language(LanguageValue.PT_BR);
  }

  static enUS() {
    return new Language(LanguageValue.EN_US);
  }

  static esES() {
    return new Language(LanguageValue.ES_ES);
  }

  static fromValue(value: LanguageValue) {
    return new Language(value);
  }

  isEqualTo(language: Language) {
    return this._value === language.value;
  }

  isPtBR() {
    return this._value === LanguageValue.PT_BR;
  }

  isEnUS() {
    return this._value === LanguageValue.EN_US;
  }

  isEsES() {
    return this._value === LanguageValue.ES_ES;
  }
}
