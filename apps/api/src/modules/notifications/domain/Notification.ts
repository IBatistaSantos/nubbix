import { BaseEntity, BaseProps, ValidationError, ID } from "@nubbix/domain";
import { faker } from "@faker-js/faker";
import { Channel, NotificationStatus, Provider as ProviderVO } from "./vo";

interface NotificationRecipient {
  name: string;
  email?: string;
  phone?: string;
}

interface NotificationProps extends BaseProps {
  templateId: string;
  provider: ProviderVO;
  accountId: string;
  providerMessageId?: string | null;
  channel: Channel;
  to: NotificationRecipient;
  from: NotificationRecipient;
  variables: Record<string, string>;
  notificationStatus: NotificationStatus;
  sentAt?: Date | null;
  openedAt?: Date | null;
  clickedAt?: Date | null;
}

export class Notification extends BaseEntity {
  private _templateId: string;
  private _provider: ProviderVO;
  private _accountId: string;
  private _providerMessageId: string | null;
  private _channel: Channel;
  private _to: NotificationRecipient;
  private _from: NotificationRecipient;
  private _variables: Record<string, string>;
  private _notificationStatus: NotificationStatus;
  private _sentAt: Date | null;
  private _openedAt: Date | null;
  private _clickedAt: Date | null;

  constructor(props: NotificationProps) {
    super(props);
    this._templateId = props.templateId;
    this._provider = props.provider;
    this._accountId = props.accountId;
    this._providerMessageId = props.providerMessageId ?? null;
    this._channel = props.channel;
    this._to = props.to;
    this._from = props.from;
    this._variables = props.variables;
    this._notificationStatus = props.notificationStatus;
    this._sentAt = props.sentAt ?? null;
    this._openedAt = props.openedAt ?? null;
    this._clickedAt = props.clickedAt ?? null;
  }

  get templateId() {
    return this._templateId;
  }

  get provider() {
    return this._provider;
  }

  get accountId() {
    return this._accountId;
  }

  get providerMessageId() {
    return this._providerMessageId;
  }

  get channel() {
    return this._channel;
  }

  get to() {
    return this._to;
  }

  get from() {
    return this._from;
  }

  get variables() {
    return this._variables;
  }

  get notificationStatus() {
    return this._notificationStatus;
  }

  get sentAt() {
    return this._sentAt;
  }

  get openedAt() {
    return this._openedAt;
  }

  get clickedAt() {
    return this._clickedAt;
  }

  validate(): void {
    const errors: Array<{ path: string; message: string }> = [];

    if (!this._templateId || this._templateId.trim().length === 0) {
      errors.push({
        path: "templateId",
        message: "TemplateId is required",
      });
    }

    if (!this._provider) {
      errors.push({
        path: "provider",
        message: "Provider is required",
      });
    }

    if (!this._accountId || this._accountId.trim().length === 0) {
      errors.push({
        path: "accountId",
        message: "AccountId is required",
      });
    }

    if (!this._channel) {
      errors.push({
        path: "channel",
        message: "Channel is required",
      });
    }

    if (!this._notificationStatus) {
      errors.push({
        path: "notificationStatus",
        message: "NotificationStatus is required",
      });
    }

    if (!this._to?.name || this._to.name.trim().length === 0) {
      errors.push({
        path: "to.name",
        message: "Recipient name is required",
      });
    }

    if (this._channel?.isEmail()) {
      if (!this._to?.email || this._to.email.trim().length === 0) {
        errors.push({
          path: "to.email",
          message: "Recipient email is required for email channel",
        });
      }
    }

    if (this._channel?.isWhatsapp()) {
      if (!this._to?.phone || this._to.phone.trim().length === 0) {
        errors.push({
          path: "to.phone",
          message: "Recipient phone is required for whatsapp channel",
        });
      }
    }

    if (!this._from?.name || this._from.name.trim().length === 0) {
      errors.push({
        path: "from.name",
        message: "Sender name is required",
      });
    }

    if (this._channel?.isEmail()) {
      if (!this._from?.email || this._from.email.trim().length === 0) {
        errors.push({
          path: "from.email",
          message: "Sender email is required for email channel",
        });
      }
    }

    if (this._channel?.isWhatsapp()) {
      if (!this._from?.phone || this._from.phone.trim().length === 0) {
        errors.push({
          path: "from.phone",
          message: "Sender phone is required for whatsapp channel",
        });
      }
    }

    if (errors.length > 0) {
      throw new ValidationError("Notification validation failed", errors);
    }
  }

  markAsSent(providerMessageId: string) {
    this._notificationStatus = NotificationStatus.sent();
    this._providerMessageId = providerMessageId;
    this._sentAt = new Date();
    this._updatedAt = new Date();
  }

  markAsFailed() {
    this._notificationStatus = NotificationStatus.failed();
    this._updatedAt = new Date();
  }

  markAsOpened() {
    if (!this._openedAt) {
      this._openedAt = new Date();
      this._updatedAt = new Date();
    }
  }

  markAsClicked() {
    if (!this._clickedAt) {
      this._clickedAt = new Date();
      this._updatedAt = new Date();
    }
  }

  static asFaker(overrides?: Partial<NotificationProps>): Notification {
    const baseProps = this.generateBaseFakerProps();
    const channel = Channel.email();

    return new Notification({
      ...baseProps,
      templateId: ID.create().value,
      provider: ProviderVO.sendgrid(),
      accountId: ID.create().value,
      providerMessageId: null,
      channel,
      to: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
      },
      from: {
        name: faker.company.name(),
        email: faker.internet.email(),
      },
      variables: {},
      notificationStatus: NotificationStatus.pending(),
      sentAt: null,
      openedAt: null,
      clickedAt: null,
      ...overrides,
    });
  }

  toJSON() {
    return {
      ...super.toJSON(),
      templateId: this._templateId,
      provider: this._provider.value,
      accountId: this._accountId,
      providerMessageId: this._providerMessageId,
      channel: this._channel.value,
      to: this._to,
      from: this._from,
      variables: this._variables,
      notificationStatus: this._notificationStatus.value,
      sentAt: this._sentAt,
      openedAt: this._openedAt,
      clickedAt: this._clickedAt,
    };
  }
}
