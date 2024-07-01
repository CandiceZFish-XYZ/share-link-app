CREATE TABLE IF NOT EXISTS "url_links" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"url" text NOT NULL,
	"code" integer NOT NULL,
	"user_id" varchar(36) NOT NULL
);
