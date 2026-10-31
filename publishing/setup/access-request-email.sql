-- Server-side approval notifications. No credential belongs in this file.
create table dailwind_private.access_mail_outbox (
 user_id uuid not null references auth.users(id) on delete cascade,
 tool text not null check(tool in ('mat','pmc')),
 id uuid not null default gen_random_uuid(),
 requested_at timestamptz not null default now(),
 delivery text not null default 'queued' check(delivery in ('queued','sending','sent','failed')),
 attempts integer not null default 0 check(attempts between 0 and 3),
 lease_at timestamptz, sent_at timestamptz,
 primary key(user_id,tool),unique(id)
);
alter table dailwind_private.access_mail_outbox enable row level security;
revoke all on dailwind_private.access_mail_outbox from public,anon,authenticated;
create function dailwind_private.queue_access_mail() returns trigger language plpgsql security definer set search_path='' as $$
begin
 if new.state='pending' then
  insert into dailwind_private.access_mail_outbox(user_id,tool,requested_at) values(new.user_id,new.tool,new.updated_at)
  on conflict(user_id,tool) do update set id=gen_random_uuid(),requested_at=excluded.requested_at,delivery='queued',attempts=0,lease_at=null,sent_at=null;
 end if;
 return new;
end;$$;
revoke all on function dailwind_private.queue_access_mail() from public,anon,authenticated;
create trigger queue_access_mail after insert or update on dailwind_private.requests for each row execute function dailwind_private.queue_access_mail();
create function public.dw_claim_access_mail(p_user uuid,p_tool text) returns jsonb language plpgsql security definer set search_path='' as $$
declare m dailwind_private.access_mail_outbox%rowtype; payload jsonb;
begin
 select * into m from dailwind_private.access_mail_outbox where user_id=p_user and tool=p_tool for update;
 if not found or m.delivery='sent' or m.attempts>=3 or (m.delivery='sending' and m.lease_at>now()-interval '2 minutes') then return null;end if;
 select jsonb_build_object('id',m.id,'tool',r.tool,'email',u.email,'full_name',p.full_name,'institute',p.institute,'note',r.note,'to_email',(select ou.email from dailwind_private.operators o join auth.users ou on ou.id=o.user_id where ou.email_confirmed_at is not null order by o.user_id limit 1)) into payload from dailwind_private.requests r join auth.users u on u.id=r.user_id join public.pmc_profiles p on p.id=u.id where r.user_id=p_user and r.tool=p_tool and r.state='pending' and u.email_confirmed_at is not null and not coalesce(u.is_anonymous,false);
 if payload is null or payload->>'to_email' is null then return null;end if;
 update dailwind_private.access_mail_outbox set delivery='sending',attempts=attempts+1,lease_at=now() where id=m.id;
 return payload;
end;$$;
create function public.dw_finish_access_mail(p_id uuid,p_sent boolean) returns void language sql security definer set search_path='' as $$
 update dailwind_private.access_mail_outbox set delivery=case when p_sent then 'sent' else 'failed' end,sent_at=case when p_sent then now() else null end,lease_at=null where id=p_id and delivery='sending';
$$;
revoke all on function public.dw_claim_access_mail(uuid,text),public.dw_finish_access_mail(uuid,boolean) from public,anon,authenticated;
grant execute on function public.dw_claim_access_mail(uuid,text),public.dw_finish_access_mail(uuid,boolean) to service_role;
create function dailwind_private.dw_admin_mail_status() returns jsonb language plpgsql security definer set search_path='' as $$
begin
 perform dailwind_private.verified();if not dailwind_private.is_operator() then raise exception 'Operator approval required.' using errcode='42501';end if;
 return (select jsonb_build_object('queued',count(*) filter(where delivery in ('queued','sending')),'failed',count(*) filter(where delivery='failed'),'sent',count(*) filter(where delivery='sent')) from dailwind_private.access_mail_outbox);
end;$$;
create function public.dw_admin_mail_status() returns jsonb language sql security invoker set search_path='' as $$select dailwind_private.dw_admin_mail_status();$$;
revoke all on function public.dw_admin_mail_status(),dailwind_private.dw_admin_mail_status() from public,anon;
grant execute on function public.dw_admin_mail_status(),dailwind_private.dw_admin_mail_status() to authenticated;
