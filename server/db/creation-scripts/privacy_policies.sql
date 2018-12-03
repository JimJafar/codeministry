create table privacy_policies
(
  privacy_policy_id serial primary key,
  version_notes text not null,
  content text not null,
  uploaded_by varchar(36) not null,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
);

alter table privacy_policies owner to cm_site_user;

create function before_update_on_privacy_policies() returns trigger
  language plpgsql
as $$
begin
  raise exception 'Privacy policies may not be updated';
end
$$;

alter function before_update_on_privacy_policies() owner to cm_site_user;

create trigger before_update_on_privacy_policies
  before update
  on privacy_policies
  for each row
execute procedure before_update_on_privacy_policies();
