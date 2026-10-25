begin;

create extension if not exists pgtap with schema extensions;
select extensions.plan(12);

select extensions.has_table(
  'public',
  'profiles',
  'the profile table exists'
);
select extensions.col_is_pk(
  'public',
  'profiles',
  'id',
  'the auth user id is the profile primary key'
);
select extensions.ok(
  (
    select relrowsecurity
    from pg_catalog.pg_class
    where oid = 'public.profiles'::regclass
  ),
  'row level security is enabled'
);
select extensions.has_policy(
  'public',
  'profiles',
  'profiles_read_public_or_own',
  'public and owner profile visibility has a policy'
);

insert into auth.users (id, email)
values
  ('10000000-0000-4000-8000-000000000001', 'profile-owner@example.test'),
  ('10000000-0000-4000-8000-000000000002', 'public-creator@example.test');

update public.profiles
set display_name = 'Public creator',
    is_public = true
where id = '10000000-0000-4000-8000-000000000002';

set local role anon;
select extensions.is(
  (select count(*)::integer from public.profiles),
  1,
  'anonymous users can only see public profiles'
);
select extensions.is(
  (select display_name from public.profiles limit 1),
  'Public creator',
  'anonymous users cannot see a private profile'
);

reset role;
set local role authenticated;
select pg_catalog.set_config(
  'request.jwt.claim.sub',
  '10000000-0000-4000-8000-000000000001',
  true
);

select extensions.is(
  (select count(*)::integer from public.profiles),
  2,
  'an authenticated user can see public profiles and their own private profile'
);
select extensions.is(
  (
    with changed as (
      update public.profiles
      set display_name = 'Profile owner'
      where id = '10000000-0000-4000-8000-000000000001'
      returning 1
    )
    select count(*)::integer from changed
  ),
  1,
  'an authenticated user can update their own profile'
);
select extensions.throws_ok(
  $$
    update public.profiles
    set headline = pg_catalog.repeat('x', 121)
    where id = '10000000-0000-4000-8000-000000000001'
  $$,
  '23514',
  null,
  'profile headline length is validated by the database'
);
select extensions.ok(
  not pg_catalog.has_column_privilege(
    'authenticated',
    'public.profiles',
    'created_at',
    'UPDATE'
  ),
  'users cannot change system-managed creation timestamps'
);
select extensions.is(
  (
    with changed as (
      update public.profiles
      set display_name = 'Unauthorized edit'
      where id = '10000000-0000-4000-8000-000000000002'
      returning 1
    )
    select count(*)::integer from changed
  ),
  0,
  'an authenticated user cannot update another profile'
);
select extensions.throws_ok(
  $$
    insert into public.profiles (id, display_name)
    values ('10000000-0000-4000-8000-000000000002', 'Impersonated profile')
  $$,
  '42501',
  null,
  'an authenticated user cannot create a profile for another user'
);

select * from extensions.finish();
rollback;
