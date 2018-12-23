create table users
(
  user_id varchar(36) not null
    constraint users_pkey
      primary key,
  activated boolean default false not null,
  activation_code varchar(36) not null,
  business_address_line1 text,
  business_address_line2 text,
  business_city text,
  business_postal_code text,
  business_state text,
  company text,
  country text,
  disabled boolean default false not null,
  dob date,
  email text not null,
  facebook text,
  first_name text not null,
  gender text,
  industry text,
  instagram text,
  is_admin boolean default false not null,
  job_title text,
  last_name text not null,
  linkedin text,
  nationality text,
  password text not null,
  personal_id_number text,
  personalise_third_party_ads boolean default true,
  phone text,
  privacy_policy_agreed_version integer
    constraint users_privacy_policy_agreed_version_fkey
      references privacy_policies
      on delete restrict,
  privacy_policy_agreed_version_history jsonb default '[]'::jsonb not null,
  profile_image text,
  receive_code_ministry_update_emails boolean default true,
  receive_third_party_offers boolean default true,
  residential_address_line1 text,
  residential_address_line2 text,
  residential_city text,
  residential_postal_code text,
  residential_state text,
  terms_of_use_agreed_version integer
    constraint users_terms_of_use_agreed_version_fkey
      references terms_of_use
      on delete restrict,
  terms_of_use_agreed_version_history jsonb default '[]'::jsonb not null,
  two_factor_enabled boolean default false not null,
  two_factor_login boolean default false not null,
  two_factor_secret text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
);

alter table users owner to cm_site_user;

create unique index users_email_index
  on users (email);
