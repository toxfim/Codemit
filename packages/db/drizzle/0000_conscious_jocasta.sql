CREATE EXTENSION IF NOT EXISTS "pgcrypto";
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."business_profile_status" AS ENUM('ACTIVE', 'SUSPENDED', 'DELETED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."chat_role" AS ENUM('CLIENT', 'SYSTEM', 'MANAGER');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."client_status" AS ENUM('ACTIVE', 'INACTIVE');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."payment_resource" AS ENUM('SUBSCRIPTION', 'EXTRA_BOT', 'INSTAGRAM_BOT');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."payment_status" AS ENUM('IN_PROGRESS', 'COMPLETED', 'REJECTED', 'IN_REVIEW');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."payment_type" AS ENUM('INCOME', 'OUTCOME');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."subscription_plan" AS ENUM('FREE', 'PRO', 'BASIC');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."user_role" AS ENUM('MANAGER', 'EMPLOYEE');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE "chats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clientId" integer NOT NULL,
	"text" text NOT NULL,
	"role" "chat_role" DEFAULT 'CLIENT' NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "clients" (
	"id" serial PRIMARY KEY NOT NULL,
	"telegramId" integer NOT NULL,
	"firstName" varchar(50) NOT NULL,
	"lastName" varchar(50),
	"phone" varchar(20),
	"status" "client_status" DEFAULT 'ACTIVE' NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "creators" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"subscription_plan" "subscription_plan" DEFAULT 'FREE' NOT NULL,
	"phone" varchar(20) NOT NULL,
	"role" "user_role" DEFAULT 'EMPLOYEE' NOT NULL,
	"telegramId" varchar(255),
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profile" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creatorId" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"status" "business_profile_status" DEFAULT 'SUSPENDED' NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "locations" (
	"id" serial PRIMARY KEY NOT NULL,
	"businessId" uuid NOT NULL,
	"lat" double precision NOT NULL,
	"lng" double precision NOT NULL,
	"region" varchar(255) NOT NULL,
	"district" varchar(255) NOT NULL,
	"address" text
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" integer NOT NULL,
	"status" "payment_status" DEFAULT 'IN_PROGRESS' NOT NULL,
	"type" "payment_type" DEFAULT 'INCOME' NOT NULL,
	"resource" "payment_resource" DEFAULT 'EXTRA_BOT' NOT NULL,
	"completedAt" timestamp with time zone,
	"rejectedAt" timestamp with time zone,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "chats" ADD CONSTRAINT "chats_clientId_clients_id_fk" FOREIGN KEY ("clientId") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile" ADD CONSTRAINT "profile_creatorId_creators_id_fk" FOREIGN KEY ("creatorId") REFERENCES "public"."creators"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "locations" ADD CONSTRAINT "locations_businessId_profile_id_fk" FOREIGN KEY ("businessId") REFERENCES "public"."profile"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_userId_creators_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."creators"("id") ON DELETE no action ON UPDATE no action;
