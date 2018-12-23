-- NOTE: To encrypt a new user email: node -e 'console.log(require("./server/utils/cryptoUtils.js").encryptStringDeterministic("broker@test.com"))'
INSERT INTO public.users(
  user_id, email, password, activated, activation_code, disabled, first_name, last_name, nationality, country, is_admin, two_factor_secret, two_factor_enabled, created_at, updated_at)
VALUES
  -- admin@test.com
  ('a9c466e2-652f-4f4e-a7e0-b82d1768ad21', '250ced68e31c9eaec4cb43cf937ebcdf:3b2dbadc8f6dedb120db084f8d04cc20', '$2a$10$mkOOMUf4Rf9zYNSNLNwojO2TzVOlVDNApi7OVJTb7nK6S/WUTQSxy', true, '14cf8f2d-a634-4dcf-85f4-b7f2c5b6f06d', false, 'Test', 'Admin', 'UK', 'SG', true, null, false, now(), now()),
  -- user@test.com
  ('f846ebd0-04c3-4a30-ae43-f06467b951c4', '514756b5cd10ed5fa31a29de6196bfe1:4a8858afddaed0c5bf1f442fb3025035', '$2a$10$mkOOMUf4Rf9zYNSNLNwojO2TzVOlVDNApi7OVJTb7nK6S/WUTQSxy', true, '14cf8f2d-a634-4dcf-85f4-b7f2c5b6f06d', false, 'Test', 'User', 'UK', 'SG', false, null, false, now(), now());
