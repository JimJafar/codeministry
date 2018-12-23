create table logs
(
  log_id serial primary key,
  identifier varchar(36),
  code text,
  description text not null,
  message text,
  type smallint not null,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  callstack json,
  device_info json
);

alter table logs owner to cm_site_user;
