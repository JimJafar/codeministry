DO $$ DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT tablename FROM pg_tables WHERE tableowner = 'cm_site_user') LOOP
    EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
  END LOOP;
  for r in (select proname, proargtypes from pg_proc inner join pg_user usr ON (usr.usesysid = pg_proc.proowner) WHERE usr.usename = 'cm_site_user') LOOP
    EXECUTE 'DROP FUNCTION public.' || r.proname || '(' || oidvectortypes(r.proargtypes) || ');';
  END LOOP;
END $$;
