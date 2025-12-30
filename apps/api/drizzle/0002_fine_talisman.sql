CREATE TYPE "public"."event_type" AS ENUM('digital', 'hybrid', 'in-person');--> statement-breakpoint
CREATE TYPE "public"."ticket_sales_status" AS ENUM('open', 'closed');--> statement-breakpoint
CREATE TABLE "event_dates" (
	"id" text PRIMARY KEY NOT NULL,
	"event_id" text NOT NULL,
	"date" date NOT NULL,
	"start_time" time NOT NULL,
	"end_time" time NOT NULL,
	"finished" boolean DEFAULT false NOT NULL,
	"finished_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"type" "event_type" NOT NULL,
	"url" varchar(255) NOT NULL,
	"address" jsonb,
	"max_capacity" integer,
	"ticket_sales" jsonb NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"status" "status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE INDEX "event_dates_event_id_idx" ON "event_dates" USING btree ("event_id");--> statement-breakpoint
CREATE UNIQUE INDEX "events_account_id_url_unique" ON "events" USING btree ("account_id","url");