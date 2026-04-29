alter table public.profiles
  add column protein_goal integer check (protein_goal > 0),
  add column carbs_goal integer check (carbs_goal > 0),
  add column fats_goal integer check (fats_goal > 0);
