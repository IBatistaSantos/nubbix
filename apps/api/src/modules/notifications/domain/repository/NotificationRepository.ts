import { Repository } from "@nubbix/domain";
import { Notification } from "../Notification";

export interface NotificationRepository extends Repository<Notification> {
  findByAccountId(accountId: string): Promise<Notification[]>;
  findByTemplateId(templateId: string): Promise<Notification[]>;
  findByProviderMessageId(providerMessageId: string): Promise<Notification | null>;
}
