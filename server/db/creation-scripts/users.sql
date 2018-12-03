create table users
(
  user_id varchar(36) not null
    constraint users_pkey
      primary key,
  email text not null,
  mobile_number text,
  office_number text,
  password text not null,
  activated boolean default false not null,
  activation_code varchar(36) not null,
  disabled boolean default false not null,
  name text not null,
  is_admin boolean default false not null,
  two_factor_secret text,
  two_factor_enabled boolean default false not null,
  two_factor_login boolean default false not null,
  personalise_third_party_ads boolean default true,
  receive_third_party_offers boolean default true,
  receive_code_ministry_update_emails boolean default true,
  privacy_policy_agreed_version integer
    constraint users_privacy_policy_agreed_version_fkey
      references privacy_policies
      on delete restrict,
  privacy_policy_agreed_version_history jsonb default '[]'::jsonb not null,
  terms_of_use_agreed_version integer
    constraint users_terms_of_use_agreed_version_fkey
      references terms_of_use
      on delete restrict,
  terms_of_use_agreed_version_history jsonb default '[]'::jsonb not null,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
);

alter table users owner to cm_site_user;

create unique index users_email_index
  on users (email);

create index users_name_index
  on users (name);
