alter table public.meals
  add column if not exists recipe_title text,
  add column if not exists recipe_summary text,
  add column if not exists recipe_source_prompt text,
  add column if not exists recipe_servings integer;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'meals_recipe_servings_check'
  ) then
    alter table public.meals
      add constraint meals_recipe_servings_check
      check (recipe_servings is null or recipe_servings > 0);
  end if;
end
$$;
