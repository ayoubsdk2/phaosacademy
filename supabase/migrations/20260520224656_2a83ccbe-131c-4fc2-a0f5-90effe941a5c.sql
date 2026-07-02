create or replace function public.normalize_academy_progress_row()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  _module record;
  _correct integer;
  _possible integer;
  _old_correct integer;
  _old_possible integer;
  _new_valid boolean := false;
  _old_valid boolean := false;
begin
  select module_id, day_id, module_index, module_type, score_total
  into _module
  from public.academy_module_catalog
  where module_id = new.module_id
    and is_active
  limit 1;

  if found then
    new.day_id := _module.day_id;
  end if;

  if new.status = 'completed' then
    new.completed_at := coalesce(new.completed_at, now());

    if found and _module.module_type in ('coach-chat', 'quiz', 'review') and coalesce(_module.score_total, 0) > 0 then
      -- Preserve previous score on UPDATE if new payload omitted it.
      if new.score is null and tg_op = 'UPDATE' and old.score is not null then
        new.score := old.score;
      end if;

      -- Validate the new score shape. NEVER fabricate a perfect score for
      -- missing/zero values - that's how nonsense answers turned into 10/10s.
      if new.score is not null and new.score > 0 then
        _correct := floor(new.score / 1000);
        _possible := new.score % 1000;
        _new_valid := (_possible = _module.score_total) and (_correct between 0 and _possible);
        if not _new_valid then
          -- Malformed payload: drop it instead of inflating.
          new.score := null;
        end if;
      else
        new.score := null;
      end if;

      -- Highest-wins on UPDATE, ignoring null comparisons.
      if tg_op = 'UPDATE' and old.score is not null and old.score > 0 then
        _old_correct := floor(old.score / 1000);
        _old_possible := old.score % 1000;
        _old_valid := (_old_possible = _module.score_total) and (_old_correct between 0 and _old_possible);
        if _old_valid then
          if new.score is null then
            new.score := old.score;
          else
            _correct := floor(new.score / 1000);
            _possible := new.score % 1000;
            if _old_correct > _correct then
              new.score := old.score;
            end if;
          end if;
        end if;
      end if;
    elsif tg_op = 'UPDATE' and new.score is null and old.score is not null then
      new.score := old.score;
    end if;
  elsif tg_op = 'UPDATE' and new.score is null and old.score is not null then
    new.score := old.score;
  end if;

  return new;
end;
$function$;