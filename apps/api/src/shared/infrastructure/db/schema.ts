import { pgTable, text, timestamp, pgEnum, varchar } from "drizzle-orm/pg-core";

export const accountTypeEnum = pgEnum("account_type", ["TRANSACTIONAL", "RECURRING"]);

export const roleEnum = pgEnum("role", ["USER", "ADMIN", "SUPER_ADMIN"]);

export const statusEnum = pgEnum("status", ["active", "inactive"]);

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

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  avatar: text("avatar"),
  accountId: text("account_id").notNull(),
  role: roleEnum("role").notNull(),
  resetPasswordToken: text("reset_password_token"),
  resetPasswordTokenExpiresAt: timestamp("reset_password_token_expires_at"),
  status: statusEnum("status").notNull().default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  deletedAt: timestamp("deleted_at"),
});
