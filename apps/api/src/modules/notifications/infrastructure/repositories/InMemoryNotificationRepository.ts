import { ID } from "@nubbix/domain";
import { Notification, NotificationRepository } from "../../domain";

export class InMemoryNotificationRepository implements NotificationRepository {
  private notifications: Map<string, Notification> = new Map();

  async findById(id: ID): Promise<Notification | null> {
    const notification = this.notifications.get(id.value);
    if (!notification || notification.deletedAt) {
      return null;
    }
    return notification;
  }

  async save(entity: Notification): Promise<Notification> {
    this.notifications.set(entity.id.value, entity);
    return entity;
  }

  async delete(id: ID): Promise<void> {
    const notification = this.notifications.get(id.value);
    if (notification) {
      (notification as any).deletedAt = new Date();
    }
  }

  async exists(id: ID): Promise<boolean> {
    const notification = this.notifications.get(id.value);
    return notification !== undefined && !notification.deletedAt;
  }

  async findByAccountId(accountId: string): Promise<Notification[]> {
    return Array.from(this.notifications.values()).filter(
      (notification) => notification.accountId === accountId && !notification.deletedAt
    );
  }

  async findByTemplateId(templateId: string): Promise<Notification[]> {
    return Array.from(this.notifications.values()).filter(
      (notification) => notification.templateId === templateId && !notification.deletedAt
    );
  }

  async findByProviderMessageId(providerMessageId: string): Promise<Notification | null> {
    const notification = Array.from(this.notifications.values()).find(
      (n) => n.providerMessageId === providerMessageId && !n.deletedAt
    );
    return notification || null;
  }
}
