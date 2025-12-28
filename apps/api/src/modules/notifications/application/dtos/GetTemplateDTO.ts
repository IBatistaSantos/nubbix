export interface GetTemplateOutput {
  id: string;
  channel: string;
  subject?: string;
  body: string;
  context: string;
  language: string;
  accountId?: string | null;
  isDefault: boolean;
  attachments?: Array<{
    url: string;
    type: string;
    filename?: string;
    mimeType?: string;
  }>;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}
