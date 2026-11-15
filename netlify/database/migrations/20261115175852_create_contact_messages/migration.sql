CREATE TABLE "messages" (
	"id" serial PRIMARY KEY,
	"name" varchar(100) NOT NULL,
	"email" varchar(254) NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
