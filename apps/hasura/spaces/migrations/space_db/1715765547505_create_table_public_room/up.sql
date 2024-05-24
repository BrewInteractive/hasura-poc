CREATE TABLE "public"."room" ("id" serial NOT NULL, "created_user_id" text NOT NULL, "deleted" timestamptz, PRIMARY KEY ("id") , UNIQUE ("id"));
