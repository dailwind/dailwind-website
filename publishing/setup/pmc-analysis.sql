-- Exact token-based analysis over owner-published PMC documents.
create table if not exists dailwind_private.analysis_documents(
 document_id uuid primary key references dailwind_private.documents(id) on delete cascade,
 keys text[] not null, surface text[] not null, tokens integer not null,
 source_hash text not null, indexed_at timestamptz not null default now()
);
create table if not exists dailwind_private.analysis_terms(
 document_id uuid not null references dailwind_private.documents(id) on delete cascade,
 word text not null, frequency integer not null check(frequency>0)
);
create index if not exists dw_analysis_terms_doc on dailwind_private.analysis_terms(document_id);
create table if not exists dailwind_private.analysis_cache(cache_key text primary key,result jsonb not null,created_at timestamptz not null default now());
alter table dailwind_private.analysis_documents enable row level security;
alter table dailwind_private.analysis_terms enable row level security;
alter table dailwind_private.analysis_cache enable row level security;
revoke all on dailwind_private.analysis_documents,dailwind_private.analysis_terms,dailwind_private.analysis_cache from public,anon,authenticated;

create or replace function dailwind_private.index_pmc_document(p_id uuid) returns jsonb language plpgsql security definer set search_path='' set statement_timeout='25s' as $$
declare source text; surfaces text[]; folded text[]; expected integer; signature text;
begin
 select source_bytes into expected from dailwind_private.documents where id=p_id and ready for update;
 if not found then raise exception 'Complete the source import first.';end if;
 -- The import worker prepends exactly 160 Unicode characters to every later passage.
 select string_agg(case when part=0 then body else substring(body from 161) end,'' order by part) into source from dailwind_private.passages where document_id=p_id;
 if source is null or octet_length(source) not in (expected,expected-3) then raise exception 'Source reconstruction needs review. No partial analysis index was published.';end if;
 signature:=md5(source);
 if exists(select 1 from dailwind_private.analysis_documents where document_id=p_id and source_hash=signature) then return jsonb_build_object('state','unchanged');end if;
 select coalesce(array_agg(m[1] order by ord),'{}'),coalesce(array_agg(lower(normalize(m[1],NFC)) order by ord),'{}') into surfaces,folded
 from regexp_matches(source,'([[:alnum:]]+(?:[''’-][[:alnum:]]+)*)','g') with ordinality as x(m,ord);
 if cardinality(folded)=0 then raise exception 'No word tokens found.';end if;
 insert into dailwind_private.analysis_documents(document_id,keys,surface,tokens,source_hash) values(p_id,folded,surfaces,cardinality(folded),signature)
 on conflict(document_id) do update set keys=excluded.keys,surface=excluded.surface,tokens=excluded.tokens,source_hash=excluded.source_hash,indexed_at=now();
 delete from dailwind_private.analysis_terms where document_id=p_id;
 insert into dailwind_private.analysis_terms select p_id,word,count(*) from unnest(folded) as t(word) group by word;
 delete from dailwind_private.analysis_cache;
 return jsonb_build_object('state','indexed','tokens',cardinality(folded));
end;$$;
revoke all on function dailwind_private.index_pmc_document(uuid) from public,anon,authenticated;
create or replace function dailwind_private.index_completed_pmc() returns trigger language plpgsql security definer set search_path='' as $$
begin if new.ready and (not old.ready) then perform dailwind_private.index_pmc_document(new.id);end if;return new;end;$$;
revoke all on function dailwind_private.index_completed_pmc() from public,anon,authenticated;
create trigger dw_pmc_index_after_finish after update of ready on dailwind_private.documents for each row execute function dailwind_private.index_completed_pmc();

create or replace function dailwind_private.pmc_positions(p_tokens text[],p_query text[]) returns integer[] language plpgsql immutable set search_path='' as $$
declare at integer; result integer[]:='{}'; n integer:=cardinality(p_query); expanded text[]:=p_tokens||'{}'::text[];
begin if n=0 then return result;end if;foreach at in array coalesce(array_positions(expanded,p_query[1]),'{}') loop if expanded[at:at+n-1]=p_query then result:=array_append(result,at);end if;end loop;return result;end;$$;
revoke all on function dailwind_private.pmc_positions(text[],text[]) from public,anon,authenticated;

create or replace function dailwind_private.pmc_neighbours(p_tokens text[],p_query text[],p_window integer) returns table(word text,is_left boolean) language plpgsql immutable set search_path='' as $$
declare expanded text[]:=p_tokens||'{}'::text[]; at integer;j integer;n integer:=cardinality(p_query);
begin foreach at in array dailwind_private.pmc_positions(expanded,p_query) loop for j in greatest(1,at-p_window)..least(cardinality(expanded),at+n-1+p_window) loop if j<at or j>=at+n then word:=expanded[j];is_left:=j<at;return next;end if;end loop;end loop;end;$$;
revoke all on function dailwind_private.pmc_neighbours(text[],text[],integer) from public,anon,authenticated;

create or replace function dailwind_private.pmc_analysis(p_mode text,p_query text default '',p_document uuid default null,p_genre text default '',p_window integer default 5,p_n integer default 3,p_min integer default 2,p_hide_common boolean default true) returns jsonb
language plpgsql security definer set search_path='' set statement_timeout='10s' as $$
declare ids uuid[]; total bigint; types bigint; docs jsonb; rows jsonb; version text; cachekey text; cached jsonb; q text[]; node_count bigint:=0; method text; result jsonb; target_total bigint; reference_total bigint;
 stopwords text[]:=array['a','an','the','and','or','but','if','of','to','in','on','at','for','from','by','with','as','is','are','was','were','be','been','being','it','its','this','that','these','those','he','she','they','we','you','i','his','her','their','our','not','no','can','may','will','would','could','should','has','have','had','do','does','did'];
begin
 if p_mode is null or p_mode not in ('overview','words','cloud','concordance','collocations','ngrams','distribution','keywords') or p_query is null or char_length(p_query)>80 or p_genre is null or char_length(p_genre)>80 or p_window is null or p_window not in(3,5,10) or p_n is null or p_n not between 2 and 5 or p_min is null or p_min not between 1 and 100 or p_hide_common is null then raise exception 'Choose valid analysis settings.';end if;
 perform dailwind_private.public_preview_budget();
 -- Keywords compare a selected target against the rest of the published scope.
 select array_agg(d.id order by d.id),coalesce(sum(a.tokens),0),coalesce(jsonb_agg(jsonb_build_object('id',d.id,'title',d.title,'genre',d.genre,'tokens',a.tokens) order by d.title),'[]'),md5(string_agg(d.id::text||a.source_hash||a.indexed_at::text,',' order by d.id)) into ids,total,docs,version
 from dailwind_private.documents d join dailwind_private.analysis_documents a on a.document_id=d.id where d.ready and d.public_preview and (p_document is null or p_mode='keywords' or d.id=p_document) and (p_genre='' or d.genre=p_genre);
 if exists(select 1 from dailwind_private.documents d where d.ready and d.public_preview and (p_document is null or p_mode='keywords' or d.id=p_document) and (p_genre='' or d.genre=p_genre) and not exists(select 1 from dailwind_private.analysis_documents a where a.document_id=d.id)) then raise exception 'The collection analysis index is being prepared. Please try again shortly.';end if;
 if ids is null or total=0 then return jsonb_build_object('mode',p_mode,'tokens',0,'types',0,'documents','[]'::jsonb,'rows','[]'::jsonb,'matches',0,'method','No published indexed texts match this selection.');end if;
 select count(distinct word) into types from dailwind_private.analysis_terms where document_id=any(ids);
 if p_mode in ('concordance','collocations','distribution') then
 if char_length(btrim(p_query))<1 or p_query !~ '^[[:alnum:]][[:alnum:] ''’-]*$' then raise exception 'Enter one to four literal words.';end if;
 select array_agg(lower(normalize(m[1],NFC)) order by ord) into q from regexp_matches(p_query,'([[:alnum:]]+(?:[''’-][[:alnum:]]+)*)','g') with ordinality as x(m,ord);
 if coalesce(cardinality(q),0) not between 1 and 4 then raise exception 'Enter one to four literal words.';end if;
 select coalesce(sum(cardinality(dailwind_private.pmc_positions(a.keys,q))),0) into node_count from dailwind_private.analysis_documents a where a.document_id=any(ids);
 if p_mode='collocations' and node_count>50000 then raise exception 'This query has too many context windows. Select one source or a more specific phrase.';end if;
 end if;
 if p_mode in ('overview','words','cloud') then
 select coalesce(jsonb_agg(row_to_json(r)),'[]') into rows from (
 select word,sum(frequency)::bigint as frequency,count(*) as documents,round(sum(frequency)::numeric/total*1000000,2) as per_million
 from dailwind_private.analysis_terms where document_id=any(ids) and (not p_hide_common or word<>all(stopwords)) group by word having sum(frequency)>=p_min order by sum(frequency) desc,word limit 100)r;
 method:='Exact case-insensitive Unicode word-token frequencies across every selected published text. Common-word hiding changes display only; totals retain all tokens. Rates are per million selected tokens.';
 elsif p_mode='ngrams' then
 cachekey:=version||':n'||p_n;
 select c.result into cached from dailwind_private.analysis_cache c where c.cache_key=cachekey;
 if cached is null then
 with grams as(
 select array_to_string((array[u.a,u.b,u.c,u.d,u.e])[1:p_n],' ') as gram
 from dailwind_private.analysis_documents a
 cross join lateral unnest(a.keys,a.keys[2:],a.keys[3:],a.keys[4:],a.keys[5:]) as u(a,b,c,d,e)
 where a.document_id=any(ids) and case p_n when 2 then u.b when 3 then u.c when 4 then u.d else u.e end is not null)
 select coalesce(jsonb_agg(row_to_json(r)),'[]') into cached from (select gram as word,count(*)::bigint as frequency,round(count(*)::numeric/total*1000000,2) as per_million from grams group by gram order by count(*) desc,gram limit 100)r;
 insert into dailwind_private.analysis_cache(cache_key,result) values(cachekey,cached) on conflict(cache_key) do update set result=excluded.result,created_at=now();
 end if;
 select coalesce(jsonb_agg(x),'[]') into rows from jsonb_array_elements(cached)x where (x->>'frequency')::bigint>=p_min;
 method:='Exact contiguous '||p_n||'-token sequences across every selected text, never across document boundaries. Sequences may cross punctuation or sentence boundaries. Top 100 by frequency; counts include overlaps. Rates use selected tokens.';
 elsif p_mode='concordance' then
 with hits as (select a.document_id,a.surface,a.tokens,at from dailwind_private.analysis_documents a cross join lateral unnest(dailwind_private.pmc_positions(a.keys,q)) as h(at) where a.document_id=any(ids) order by a.document_id,at limit 30)
 select coalesce(jsonb_agg(row_to_json(r)),'[]') into rows from(select d.title,h.at as position,h.tokens,right(array_to_string(h.surface[greatest(1,h.at-p_window):h.at-1],' '),240) as left_context,array_to_string(h.surface[h.at:h.at+cardinality(q)-1],' ') as matched,left(array_to_string(h.surface[h.at+cardinality(q):h.at+cardinality(q)+p_window-1],' '),240) as right_context from hits h join dailwind_private.documents d on d.id=h.document_id)r;
 method:='Exact case-insensitive token/phrase matches. First 30 concordance lines, ±'||p_window||' tokens (up to 240 characters per side). Context preserves token spelling, with punctuation omitted. No full-text view or pagination.';
 elsif p_mode='distribution' then
 select coalesce(jsonb_agg(row_to_json(r)),'[]') into rows from(select d.title,a.tokens,cardinality(dailwind_private.pmc_positions(a.keys,q)) as frequency,round(cardinality(dailwind_private.pmc_positions(a.keys,q))::numeric/a.tokens*1000000,2) as per_million from dailwind_private.analysis_documents a join dailwind_private.documents d on d.id=a.document_id where a.document_id=any(ids) order by d.title)r;
 method:='All query occurrences in every selected source, including zero-match sources. Rates are per million source tokens; compare them when source lengths differ.';
 elsif p_mode='collocations' then
 with neighbours as(select n.word,n.is_left from dailwind_private.analysis_documents a cross join lateral dailwind_private.pmc_neighbours(a.keys,q,p_window)n where a.document_id=any(ids)),
 counts as(select word,count(*)::bigint as frequency,count(*) filter(where is_left)::bigint as left_count,count(*) filter(where not is_left)::bigint as right_count from neighbours where not p_hide_common or word<>all(stopwords) group by word having count(*)>=p_min),
 corpus as(select word,sum(frequency)::bigint as corpus_frequency from dailwind_private.analysis_terms where document_id=any(ids) group by word)
 select coalesce(jsonb_agg(row_to_json(r)),'[]') into rows from(select c.*,f.corpus_frequency,round((14+ln(2.0*c.frequency/(node_count+f.corpus_frequency))/ln(2))::numeric,3) as logdice from counts c join corpus f using(word) order by c.frequency desc,c.word limit 100)r;
 method:='All neighbouring token occurrences within ±'||p_window||' tokens of every query match. Query tokens are excluded. Overlapping windows may count a token more than once. logDice = 14 + log2(2 × window co-occurrences / (node frequency + collocate corpus frequency)); this window-based score is not grammatical association or significance.';
 elsif p_mode='keywords' then
 if p_document is null or not(p_document=any(ids)) or cardinality(ids)<2 then raise exception 'Choose one source to compare against the other published texts.';end if;
 select tokens into target_total from dailwind_private.analysis_documents where document_id=p_document;reference_total:=total-target_total;
 with counts as(select word,coalesce(sum(frequency) filter(where document_id=p_document),0)::numeric as a,coalesce(sum(frequency) filter(where document_id<>p_document),0)::numeric as b from dailwind_private.analysis_terms where document_id=any(ids) and (not p_hide_common or word<>all(stopwords)) group by word),
 expected as(select *, (a+b)*target_total/total as ea,(a+b)*reference_total/total as eb from counts where a>=p_min and a/target_total>b/reference_total)
 select coalesce(jsonb_agg(row_to_json(r)),'[]') into rows from(select word,a::bigint as frequency,b::bigint as reference_frequency,round(a/target_total*1000000,2) as per_million,
 round(2*(case when a>0 then a*ln(a/ea) else 0 end+case when b>0 then b*ln(b/eb) else 0 end+case when target_total-a>0 then (target_total-a)*ln((target_total-a)/(target_total-ea)) else 0 end+case when reference_total-b>0 then (reference_total-b)*ln((reference_total-b)/(reference_total-eb)) else 0 end),3) as log_likelihood
 from expected where ea<target_total and eb<reference_total order by log_likelihood desc,word limit 100)r;
 method:='Positive keyness: selected source versus all other published texts in the genre selection. Two-by-two log-likelihood (G²), uncorrected for multiple comparisons. This is an internal comparison, not evidence of uniqueness against general English or a medical diagnosis.';
 end if;
 result:=jsonb_build_object('mode',p_mode,'tokens',total,'types',types,'documents',docs,'rows',coalesce(rows,'[]'),'matches',node_count,'method',method,'target_tokens',target_total,'reference_tokens',reference_total);
 return result;
end;$$;
revoke all on function dailwind_private.pmc_analysis(text,text,uuid,text,integer,integer,integer,boolean) from public,anon,authenticated;
grant execute on function dailwind_private.pmc_analysis(text,text,uuid,text,integer,integer,integer,boolean) to anon,authenticated;
create or replace function public.dw_pmc_analyze(p_mode text,p_query text default '',p_document uuid default null,p_genre text default '',p_window integer default 5,p_n integer default 3,p_min integer default 2,p_hide_common boolean default true) returns jsonb language sql security invoker set search_path='' set statement_timeout='10s' as $$select dailwind_private.pmc_analysis(p_mode,p_query,p_document,p_genre,p_window,p_n,p_min,p_hide_common);$$;
revoke all on function public.dw_pmc_analyze(text,text,uuid,text,integer,integer,integer,boolean) from public,anon,authenticated;
grant execute on function public.dw_pmc_analyze(text,text,uuid,text,integer,integer,integer,boolean) to anon,authenticated;
notify pgrst,'reload schema';
