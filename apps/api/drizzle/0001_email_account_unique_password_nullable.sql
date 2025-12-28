ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "users_email_unique";--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_account_id_unique" ON "users"("email", "account_id");--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL;

