export const AttachmentTypeValue = {
  IMAGE: "image",
  FILE: "file",
} as const;

export type AttachmentTypeValue = (typeof AttachmentTypeValue)[keyof typeof AttachmentTypeValue];

export class AttachmentType {
  private _value: AttachmentTypeValue;

  private constructor(value: AttachmentTypeValue) {
    this._value = value;
  }

  get value() {
    return this._value;
  }

  static image() {
    return new AttachmentType(AttachmentTypeValue.IMAGE);
  }

  static file() {
    return new AttachmentType(AttachmentTypeValue.FILE);
  }

  static fromValue(value: AttachmentTypeValue) {
    return new AttachmentType(value);
  }

  isEqualTo(type: AttachmentType) {
    return this._value === type.value;
  }

  isImage() {
    return this._value === AttachmentTypeValue.IMAGE;
  }

  isFile() {
    return this._value === AttachmentTypeValue.FILE;
  }
}
