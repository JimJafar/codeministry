create table sessions
(
  session_id varchar(36) not null primary key,
  user_id varchar(36) not null
    constraint sessions_users_user_id_fk
      references users
      on delete cascade,
  expires timestamp with time zone not null,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
);

alter table sessions owner to cm_site_user;

create index sessions_user_id_index
  on sessions (user_id);
