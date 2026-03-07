DO $$ BEGIN
 CREATE TYPE "public"."user_status" AS ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "creators" ADD COLUMN IF NOT EXISTS "status" "user_status" DEFAULT 'ACTIVE' NOT NULL;

