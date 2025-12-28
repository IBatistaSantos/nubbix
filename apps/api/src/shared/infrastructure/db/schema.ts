import {
  pgTable,
  text,
  timestamp,
  pgEnum,
  varchar,
  uniqueIndex,
  jsonb,
  boolean,
} from "drizzle-orm/pg-core";

export const accountTypeEnum = pgEnum("account_type", ["TRANSACTIONAL", "RECURRING"]);

export const roleEnum = pgEnum("role", ["USER", "ADMIN", "SUPER_ADMIN"]);

export const statusEnum = pgEnum("status", ["active", "inactive"]);

export const channelEnum = pgEnum("channel", ["email", "whatsapp"]);

export const templateContextEnum = pgEnum("template_context", [
  "account.welcome",
  "participant.registration",
  "forgot.password",
]);

export const languageEnum = pgEnum("language", ["pt-BR", "en-US", "es-ES"]);

export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  website: text("website"),
  logo: text("logo"),
  accountType: accountTypeEnum("account_type").notNull(),
  status: statusEnum("status").notNull().default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    password: text("password"),
    avatar: text("avatar"),
    accountId: text("account_id").notNull(),
    role: roleEnum("role").notNull(),
    resetPasswordToken: text("reset_password_token"),
    resetPasswordTokenExpiresAt: timestamp("reset_password_token_expires_at"),
    status: statusEnum("status").notNull().default("active"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => ({
    emailAccountIdUnique: uniqueIndex("users_email_account_id_unique").on(
      table.email,
      table.accountId
    ),
  })
);

export const templates = pgTable("templates", {
  id: text("id").primaryKey(),
  channel: channelEnum("channel").notNull(),
  subject: text("subject"),
  body: text("body").notNull(),
  context: templateContextEnum("context").notNull(),
  language: languageEnum("language").notNull(),
  accountId: text("account_id"),
  isDefault: boolean("is_default").notNull().default(false),
  attachments: jsonb("attachments").$type<
    Array<{
      url: string;
      type: string;
      filename?: string;
      mimeType?: string;
    }>
  >(),
  status: statusEnum("status").notNull().default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  deletedAt: timestamp("deleted_at"),
});
