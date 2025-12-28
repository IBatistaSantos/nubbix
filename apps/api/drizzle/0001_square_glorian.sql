CREATE TYPE "public"."channel" AS ENUM('email', 'whatsapp');--> statement-breakpoint
CREATE TYPE "public"."language" AS ENUM('pt-BR', 'en-US', 'es-ES');--> statement-breakpoint
CREATE TYPE "public"."template_context" AS ENUM('account.welcome', 'participant.registration', 'forgot.password');--> statement-breakpoint
CREATE TABLE "templates" (
	"id" text PRIMARY KEY NOT NULL,
	"channel" "channel" NOT NULL,
	"subject" text,
	"body" text NOT NULL,
	"context" "template_context" NOT NULL,
	"language" "language" NOT NULL,
	"account_id" text,
	"is_default" boolean DEFAULT false NOT NULL,
	"attachments" jsonb,
	"status" "status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_email_unique";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_account_id_unique" ON "users" USING btree ("email","account_id");