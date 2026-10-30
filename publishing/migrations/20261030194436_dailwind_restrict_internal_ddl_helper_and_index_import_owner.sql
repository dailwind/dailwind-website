-- Already applied to the managed project; recorded here for audit/recovery.
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
create index if not exists dw_documents_created_by on dailwind_private.documents(created_by);
