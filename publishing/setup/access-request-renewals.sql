create or replace function public.dw_request_access(p_tool text,p_note text) returns jsonb language plpgsql security definer set search_path='' as $$
declare u uuid:=dailwind_private.verified(); saved_state text;
begin
 if p_tool not in ('mat','pmc') or p_tool is null or char_length(btrim(coalesce(p_note,''))) not between 5 and 1000 then raise exception 'Choose a toolkit and enter your research purpose (5–1,000 characters).';end if;
 if not exists(select 1 from public.pmc_profiles where id=u) then raise exception 'Save your account profile first.';end if;
 perform dailwind_private.use_budget('access_request',6);
 insert into dailwind_private.requests(user_id,tool,note) values(u,p_tool,p_note)
 on conflict(user_id,tool) do update set note=excluded.note,updated_at=now(),state=case when dailwind_private.can_use(p_tool) then 'approved' else 'pending' end
 returning state into saved_state;
 return jsonb_build_object('state',saved_state);
end;$$;
revoke all on function public.dw_request_access(text,text) from public,anon;
grant execute on function public.dw_request_access(text,text) to authenticated;
