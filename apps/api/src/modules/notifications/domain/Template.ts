import { BaseEntity, BaseProps, ValidationError } from "@nubbix/domain";
import { faker } from "@faker-js/faker";
import { Channel, TemplateContext, Language } from "./vo";
import { Attachment } from "./types/Attachment";

interface TemplateProps extends BaseProps {
  channel: Channel;
  subject: string;
  body: string;
  context: TemplateContext;
  attachments?: Attachment[];
  accountId?: string | null;
  language: Language;
  isDefault: boolean;
}

interface TemplateUpdateData {
  subject: string;
  body: string;
  attachments?: Attachment[];
}

export class Template extends BaseEntity {
  private _channel: Channel;
  private _subject: string;
  private _body: string;
  private _context: TemplateContext;
  private _attachments: Attachment[];
  private _accountId: string | null;
  private _language: Language;
  private _isDefault: boolean;

  constructor(props: TemplateProps) {
    super(props);
    this._channel = props.channel;
    this._subject = props.subject;
    this._body = props.body;
    this._context = props.context;
    this._attachments = props.attachments ?? [];
    this._accountId = props.accountId ?? null;
    this._language = props.language;
    this._isDefault = props.isDefault;

    if (this._accountId === null && !this._isDefault) {
      this._isDefault = true;
    }
  }

  get channel() {
    return this._channel;
  }

  get subject() {
    return this._subject;
  }

  get body() {
    return this._body;
  }

  get context() {
    return this._context;
  }

  get attachments() {
    return this._attachments;
  }

  get accountId() {
    return this._accountId;
  }

  get language() {
    return this._language;
  }

  get isDefault() {
    return this._isDefault;
  }

  isSystemDefault(): boolean {
    return this._accountId === null;
  }

  validate(): void {
    const errors: Array<{ path: string; message: string }> = [];

    if (!this._channel) {
      errors.push({
        path: "channel",
        message: "Channel is required",
      });
    }

    if (this._channel?.isEmail()) {
      if (!this._subject || this._subject.trim().length === 0) {
        errors.push({
          path: "subject",
          message: "Subject is required for email channel",
        });
      }
    }

    if (!this._body || this._body.trim().length === 0) {
      errors.push({
        path: "body",
        message: "Body is required",
      });
    }

    if (!this._context) {
      errors.push({
        path: "context",
        message: "Context is required",
      });
    }

    if (!this._language) {
      errors.push({
        path: "language",
        message: "Language is required",
      });
    }

    if (this._accountId === null && !this._isDefault) {
      errors.push({
        path: "isDefault",
        message: "System templates (accountId null) must be default",
      });
    }

    if (this._attachments && this._attachments.length > 0) {
      this._attachments.forEach((attachment, index) => {
        if (!attachment.url || attachment.url.trim().length === 0) {
          errors.push({
            path: `attachments[${index}].url`,
            message: "Attachment URL is required",
          });
        }
        if (!attachment.type) {
          errors.push({
            path: `attachments[${index}].type`,
            message: "Attachment type is required",
          });
        }
      });
    }

    if (errors.length > 0) {
      throw new ValidationError("Template validation failed", errors);
    }
  }

  update(props: Partial<TemplateUpdateData>) {
    if (props.subject !== undefined) this._subject = props.subject;
    if (props.body !== undefined) this._body = props.body;
    if (props.attachments !== undefined) this._attachments = props.attachments;
    this._updatedAt = new Date();
  }

  static asFaker(overrides?: Partial<TemplateProps>): Template {
    const baseProps = this.generateBaseFakerProps();
    const channel = Channel.email();

    return new Template({
      ...baseProps,
      channel,
      subject: faker.lorem.sentence(),
      body: faker.lorem.paragraph(),
      context: TemplateContext.accountWelcome(),
      attachments: [],
      accountId: null,
      language: Language.ptBR(),
      isDefault: true,
      ...overrides,
    });
  }

  toJSON() {
    return {
      ...super.toJSON(),
      channel: this._channel.value,
      subject: this._subject,
      body: this._body,
      context: this._context.value,
      attachments: this._attachments.map((att) => ({
        url: att.url,
        type: att.type.value,
        filename: att.filename,
        mimeType: att.mimeType,
      })),
      accountId: this._accountId,
      language: this._language.value,
      isDefault: this._isDefault,
    };
  }
}
