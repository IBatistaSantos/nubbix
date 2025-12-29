import { SendNotificationUseCase } from "../../application/use-cases/SendNotificationUseCase";
import { DrizzleTemplateRepository } from "../repositories/DrizzleTemplateRepository";
import { InMemoryNotificationRepository } from "../repositories/InMemoryNotificationRepository";
import { ResendNotificationProvider } from "../services/ResendNotificationProvider";

let templateRepository: DrizzleTemplateRepository | null = null;
let notificationRepository: InMemoryNotificationRepository | null = null;
let notificationProvider: ResendNotificationProvider | null = null;

export function createSendNotificationUseCase(): SendNotificationUseCase {
  if (!templateRepository) {
    templateRepository = new DrizzleTemplateRepository();
  }

  if (!notificationRepository) {
    notificationRepository = new InMemoryNotificationRepository();
  }

  if (!notificationProvider) {
    notificationProvider = new ResendNotificationProvider();
  }

  return new SendNotificationUseCase(
    templateRepository,
    notificationRepository,
    notificationProvider
  );
}
