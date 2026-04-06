
create type public.app_role as enum ('admin', 'ngo', 'volunteer', 'public');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role app_role not null default 'public',
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, role)
  values (
    new.id,
    new.email,
    coalesce((new.raw_user_meta_data->>'role')::app_role, 'public')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
