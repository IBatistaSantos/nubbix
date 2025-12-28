export const ChannelValue = {
  EMAIL: "email",
  WHATSAPP: "whatsapp",
} as const;

export type ChannelValue = (typeof ChannelValue)[keyof typeof ChannelValue];

export class Channel {
  private _value: ChannelValue;

  private constructor(value: ChannelValue) {
    this._value = value;
  }

  get value() {
    return this._value;
  }

  static email() {
    return new Channel(ChannelValue.EMAIL);
  }

  static whatsapp() {
    return new Channel(ChannelValue.WHATSAPP);
  }

  static fromValue(value: ChannelValue) {
    return new Channel(value);
  }

  isEqualTo(channel: Channel) {
    return this._value === channel.value;
  }

  isEmail() {
    return this._value === ChannelValue.EMAIL;
  }

  isWhatsapp() {
    return this._value === ChannelValue.WHATSAPP;
  }
}
