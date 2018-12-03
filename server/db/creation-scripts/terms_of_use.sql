create table terms_of_use
(
  terms_of_use_id serial primary key,
  version_notes text not null,
  content text not null,
  uploaded_by varchar(36) not null,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
);

alter table terms_of_use owner to cm_site_user;

create function before_update_on_terms_of_use() returns trigger
  language plpgsql
as $$
begin
  raise exception 'Terms of use may not be updated';
end
$$;

alter function before_update_on_terms_of_use() owner to cm_site_user;

create trigger before_update_on_terms_of_use
  before update
  on terms_of_use
  for each row
execute procedure before_update_on_terms_of_use();
