alter table public.profiles
  add column if not exists expo_push_token text;

alter table public.profiles
  add column if not exists push_notifications_enabled boolean not null default false;

alter table public.profiles
  add column if not exists meal_reminders_enabled boolean not null default false;
