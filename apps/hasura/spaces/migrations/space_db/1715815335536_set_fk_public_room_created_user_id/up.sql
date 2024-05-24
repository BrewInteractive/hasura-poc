alter table "public"."room"
  add constraint "room_created_user_id_fkey"
  foreign key ("created_user_id")
  references "public"."user"
  ("id") on update restrict on delete restrict;
