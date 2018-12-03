INSERT INTO public.sessions(
	session_id, user_id, expires, created_at, updated_at)
	VALUES 
	-- Unit testing sessions - do not delete or edit!
	('adminUserSession', 'a9c466e2-652f-4f4e-a7e0-b82d1768ad21', '2027-02-08 20:37:46+08', now(), now()),
  ('standardUserSession', 'f846ebd0-04c3-4a30-ae43-f06467b951c4', '2027-02-08 20:37:46+08', now(), now()),
  ('otherUserSession', '4', '2027-02-08 20:37:46+08', now(), now());
