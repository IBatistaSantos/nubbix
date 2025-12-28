import { AttachmentType } from "../vo/AttachmentType";

export interface Attachment {
  url: string;
  type: AttachmentType;
  filename?: string;
  mimeType?: string;
}
