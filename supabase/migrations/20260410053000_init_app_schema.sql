create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  username text,
  email text,
  avatar_url text,
  calorie_goal integer not null default 2000 check (calorie_goal > 0),
  weight_goal double precision not null default 70 check (weight_goal > 0),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.meals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  meal text not null check (meal in ('Breakfast', 'Lunch', 'Snacks', 'Dinner', 'Shake')),
  calories integer not null check (calories >= 0),
  time text not null,
  date date not null default current_date,
  protein integer check (protein is null or protein >= 0),
  carbs integer check (carbs is null or carbs >= 0),
  fats integer check (fats is null or fats >= 0),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.saved_recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  summary text not null,
  meal_type text not null,
  servings integer not null check (servings > 0),
  prep_time_minutes integer not null default 0 check (prep_time_minutes >= 0),
  cook_time_minutes integer not null default 0 check (cook_time_minutes >= 0),
  ingredients jsonb not null default '[]'::jsonb,
  steps jsonb not null default '[]'::jsonb,
  estimated_nutrition jsonb not null default '{}'::jsonb,
  tips jsonb not null default '[]'::jsonb,
  source_prompt text not null,
  source_ingredients jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists meals_user_id_date_idx
  on public.meals (user_id, date desc, created_at desc);

create index if not exists saved_recipes_user_id_created_at_idx
  on public.saved_recipes (user_id, created_at desc);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, avatar_url)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      new.raw_user_meta_data ->> 'display_name'
    ),
    new.email,
    coalesce(
      new.raw_user_meta_data ->> 'avatar_url',
      new.raw_user_meta_data ->> 'picture'
    )
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_trigger
    where tgname = 'on_auth_user_created'
  ) then
    create trigger on_auth_user_created
      after insert on auth.users
      for each row execute procedure public.handle_new_user();
  end if;
end
$$;

alter table public.profiles enable row level security;
alter table public.meals enable row level security;
alter table public.saved_recipes enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles' and policyname = 'Users can view their own profile'
  ) then
    create policy "Users can view their own profile"
      on public.profiles
      for select
      using (auth.uid() = id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles' and policyname = 'Users can insert their own profile'
  ) then
    create policy "Users can insert their own profile"
      on public.profiles
      for insert
      with check (auth.uid() = id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles' and policyname = 'Users can update their own profile'
  ) then
    create policy "Users can update their own profile"
      on public.profiles
      for update
      using (auth.uid() = id)
      with check (auth.uid() = id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles' and policyname = 'Users can delete their own profile'
  ) then
    create policy "Users can delete their own profile"
      on public.profiles
      for delete
      using (auth.uid() = id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'meals' and policyname = 'Users can view their own meals'
  ) then
    create policy "Users can view their own meals"
      on public.meals
      for select
      using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'meals' and policyname = 'Users can insert their own meals'
  ) then
    create policy "Users can insert their own meals"
      on public.meals
      for insert
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'meals' and policyname = 'Users can update their own meals'
  ) then
    create policy "Users can update their own meals"
      on public.meals
      for update
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'meals' and policyname = 'Users can delete their own meals'
  ) then
    create policy "Users can delete their own meals"
      on public.meals
      for delete
      using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'saved_recipes' and policyname = 'Users can view their own saved recipes'
  ) then
    create policy "Users can view their own saved recipes"
      on public.saved_recipes
      for select
      using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'saved_recipes' and policyname = 'Users can insert their own saved recipes'
  ) then
    create policy "Users can insert their own saved recipes"
      on public.saved_recipes
      for insert
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'saved_recipes' and policyname = 'Users can update their own saved recipes'
  ) then
    create policy "Users can update their own saved recipes"
      on public.saved_recipes
      for update
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'saved_recipes' and policyname = 'Users can delete their own saved recipes'
  ) then
    create policy "Users can delete their own saved recipes"
      on public.saved_recipes
      for delete
      using (auth.uid() = user_id);
  end if;
end
$$;

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'Avatar images are publicly readable'
  ) then
    create policy "Avatar images are publicly readable"
      on storage.objects
      for select
      using (bucket_id = 'avatars');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'Users can upload their own avatars'
  ) then
    create policy "Users can upload their own avatars"
      on storage.objects
      for insert
      with check (
        bucket_id = 'avatars'
        and auth.uid()::text = (storage.foldername(name))[1]
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'Users can update their own avatars'
  ) then
    create policy "Users can update their own avatars"
      on storage.objects
      for update
      using (
        bucket_id = 'avatars'
        and auth.uid()::text = (storage.foldername(name))[1]
      )
      with check (
        bucket_id = 'avatars'
        and auth.uid()::text = (storage.foldername(name))[1]
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'Users can delete their own avatars'
  ) then
    create policy "Users can delete their own avatars"
      on storage.objects
      for delete
      using (
        bucket_id = 'avatars'
        and auth.uid()::text = (storage.foldername(name))[1]
      );
  end if;
end
$$;
