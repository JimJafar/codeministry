-- NOTE: To encrypt a new user email: node -e 'console.log(require("./server/utils/cryptoUtils.js").encryptStringDeterministic("broker@test.com"))'
INSERT INTO public.users(
  user_id, email, password, activated, activation_code, disabled, first_name, last_name, nationality, country, is_admin, two_factor_secret, two_factor_enabled, created_at, updated_at)
VALUES
  -- Unit testing accounts (do not delete / edit!)
  -- disabled@test.com
  ('1', 'e2c8e95a54f605c9e70abede050bf449:87431271cb646116ee6dfbed3eee62d329e3b2417b4ed77ffe2349aadcb57184', '$2a$10$mkOOMUf4Rf9zYNSNLNwojO2TzVOlVDNApi7OVJTb7nK6S/WUTQSxy', true, 'c93f8bb1-c472-4608-9216-2a21e30779ac', true, 'Disabled', 'User', 'UK', 'SG', false, null, false, now(), now()),
  -- inactive@test.com
  ('2', 'a3e3713da42b223ed31d1dc33b7297f7:3a936a1643cb0f821b1245a52fb3a55c0990f695656d0f590dfca9312f317801', '$2a$10$mkOOMUf4Rf9zYNSNLNwojO2TzVOlVDNApi7OVJTb7nK6S/WUTQSxy', false, 'c93f8bb1-c472-4608-9216-2a21e30779ac', false, 'Inactive', 'User', 'UK', 'SG', false, null, false, now(), now()),
  -- loginTest@test.com
  ('3', '0012569c292947668d57fffbc230f407:f3e40b8e350e135b5998df6207179f4ee24144ecd3dc7ac42cc505b197290da2', '$2a$10$mkOOMUf4Rf9zYNSNLNwojO2TzVOlVDNApi7OVJTb7nK6S/WUTQSxy', true, '55cf7c2d-6e04-4585-b09f-7a680282a021', false, 'Login', 'User', 'UK', 'SG', false, null, false, now(), now()),
  -- other@test.com
  ('4', '301a5910b5aa8b912a92e0fc7caaf3fd:3bbb9c81f51777f822d23468f63520b8', '$2a$10$mkOOMUf4Rf9zYNSNLNwojO2TzVOlVDNApi7OVJTb7nK6S/WUTQSxy', true, '55cf7c2d-6e04-4585-b09f-7a680282a021', false, 'Other', 'User', 'UK', 'SG', false, null, false, now(), now());
