-- Public excerpt search; source text and owner actions remain private.
alter table dailwind_private.documents add column if not exists public_preview boolean not null default false;
create table if not exists dailwind_private.preview_limits (
 bucket text not null, hour timestamptz not null, used integer not null check(used>0), primary key(bucket,hour)
);
alter table dailwind_private.preview_limits enable row level security;
revoke all on dailwind_private.preview_limits from public,anon,authenticated;

create or replace function dailwind_private.public_preview_budget() returns void language plpgsql security definer set search_path='' as $$
declare h timestamptz:=date_trunc('hour',now()); headers jsonb; ip text; n integer;
begin
 headers:=coalesce(nullif(current_setting('request.headers',true),''),'{}')::jsonb;
 ip:=left(coalesce(nullif(split_part(headers->>'x-forwarded-for',',',1),''),headers->>'x-real-ip','unknown'),150);
 delete from dailwind_private.preview_limits where hour<h-interval '2 days';
 insert into dailwind_private.preview_limits as l values('global',h,1) on conflict(bucket,hour) do update set used=l.used+1 where l.used<1500 returning used into n;
 if n is null then raise exception 'The public preview is busy. Please try again later.' using errcode='P0001';end if;
 n:=null;
 insert into dailwind_private.preview_limits as l values('visitor:'||md5(ip),h,1) on conflict(bucket,hour) do update set used=l.used+1 where l.used<60 returning used into n;
 if n is null then raise exception 'Preview search limit reached. Please try again later or contact Dailwind for research access.' using errcode='P0001';end if;
end;$$;
revoke all on function dailwind_private.public_preview_budget() from public,anon,authenticated;

create or replace function dailwind_private.public_pmc_summary() returns jsonb language sql stable security definer set search_path='' as $$
 select jsonb_build_object('documents',count(*),'words',coalesce(sum(words),0),'source_bytes',coalesce(sum(source_bytes),0),'scope','Published PMC preview only') from dailwind_private.documents where ready and public_preview;
$$;
create or replace function dailwind_private.public_pmc_search(p_query text) returns jsonb language plpgsql security definer set search_path='' set statement_timeout='5s' as $$
declare q tsquery; result jsonb; hits bigint;
begin
 if p_query is null or char_length(btrim(p_query)) not between 3 and 80 or p_query !~ '^[[:alnum:]][[:alnum:] ''-]*$' or cardinality(regexp_split_to_array(btrim(p_query),'[[:space:]]+'))>4 then raise exception 'Enter one to four words (3–80 characters).';end if;
 q:=phraseto_tsquery('simple'::regconfig,btrim(p_query));
 if numnode(q)=0 then raise exception 'Enter a searchable word or phrase.';end if;
 perform dailwind_private.public_preview_budget();
 select count(*) into hits from dailwind_private.passages p join dailwind_private.documents d on d.id=p.document_id where d.ready and d.public_preview and p.search@@q;
 select coalesce(jsonb_agg(row_to_json(x)),'[]'::jsonb) into result from (
 select d.title,d.genre,p.part+1 as passage,left(ts_headline('simple'::regconfig,p.body,q,'StartSel=<<<,StopSel=>>>,MaxFragments=1,MaxWords=25,MinWords=10'),420) as excerpt
 from dailwind_private.passages p join dailwind_private.documents d on d.id=p.document_id where d.ready and d.public_preview and p.search@@q order by p.document_id,p.part limit 10)x;
 return jsonb_build_object('matching_passages',hits,'rows',result,'method','Literal token/phrase search of the published preview. Up to 10 short excerpts; no pagination or full-text download. Passage counts are not word-occurrence counts. Import overlap may repeat context.');
end;$$;
create or replace function dailwind_private.publish_pmc(p_document uuid,p_public boolean) returns void language plpgsql security definer set search_path='' as $$
begin
 perform dailwind_private.verified();if not dailwind_private.is_operator() then raise exception 'Operator approval required.' using errcode='42501';end if;
 if p_public is null then raise exception 'Choose a publication state.';end if;
 update dailwind_private.documents set public_preview=p_public where id=p_document and ready;
 if not found then raise exception 'Only completed imports can be published.';end if;
end;$$;

-- Exposed wrappers inherit the caller. Private helpers expose only bounded results.
grant usage on schema dailwind_private to anon,authenticated;
revoke all on function dailwind_private.public_pmc_summary(),dailwind_private.public_pmc_search(text),dailwind_private.publish_pmc(uuid,boolean) from public,anon,authenticated;
grant execute on function dailwind_private.public_pmc_summary(),dailwind_private.public_pmc_search(text) to anon,authenticated;
grant execute on function dailwind_private.publish_pmc(uuid,boolean) to authenticated;
create or replace function public.dw_pmc_public_summary() returns jsonb language sql security invoker set search_path='' as $$select dailwind_private.public_pmc_summary();$$;
create or replace function public.dw_pmc_public_search(p_query text) returns jsonb language sql security invoker set search_path='' set statement_timeout='5s' as $$select dailwind_private.public_pmc_search(p_query);$$;
create or replace function public.dw_pmc_publish(p_document uuid,p_public boolean) returns void language sql security invoker set search_path='' as $$select dailwind_private.publish_pmc(p_document,p_public);$$;
revoke all on function public.dw_pmc_public_summary(),public.dw_pmc_public_search(text),public.dw_pmc_publish(uuid,boolean) from public,anon,authenticated;
grant execute on function public.dw_pmc_public_summary(),public.dw_pmc_public_search(text) to anon,authenticated;
grant execute on function public.dw_pmc_publish(uuid,boolean) to authenticated;
create or replace function public.dw_admin_documents() returns jsonb language plpgsql security definer set search_path='' as $$
begin perform dailwind_private.verified();if not dailwind_private.is_operator() then raise exception 'Operator approval required.' using errcode='42501';end if;
return coalesce((select jsonb_agg(row_to_json(d)) from (select id,title,genre,source_bytes,ready,parts,words,public_preview,created_at from dailwind_private.documents order by created_at desc)d),'[]'::jsonb);end;$$;
-- Explicit owner instruction: publish limited excerpts from the existing completed sample.
update dailwind_private.documents set public_preview=true where ready;
notify pgrst,'reload schema';
