CREATE TABLE "public"."chat" ("id" serial NOT NULL, "room_id" integer NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("room_id") REFERENCES "public"."room"("id") ON UPDATE restrict ON DELETE restrict, UNIQUE ("id"));