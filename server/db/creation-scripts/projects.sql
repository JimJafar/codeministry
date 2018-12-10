create table projects
(
  project_id serial primary key,
  slug text,
  category text
    constraint projects_project_categories_fk
      references project_categories
      on delete restrict,
  code text,
  description text not null,
  message text,
  type smallint not null,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  callstack json,
  device_info json
);

alter table projects owner to cm_site_user;
