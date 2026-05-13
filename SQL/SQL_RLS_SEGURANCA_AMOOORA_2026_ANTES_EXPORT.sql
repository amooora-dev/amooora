-- =============================================================================
-- ANTES de rodar SQL_RLS_SEGURANCA_AMOOORA_2026.sql — exportar estado atual
-- =============================================================================
-- 1) Execute esta query no SQL Editor.
-- 2) Copie o resultado completo (ou "Download CSV") e guarde num sítio seguro.
-- 3) Opcional: no Table Editor, para tabelas críticas, export também dados se
--    precisar de outro tipo de rollback.
--
-- Isto NÃO gera automaticamente script de rollback; serve de documentação
-- para saber que políticas existiam antes (policyname, qual, with_check).
-- =============================================================================

SELECT
  schemaname,
  tablename,
  policyname,
  cmd,
  roles,
  qual::text AS using_expr,
  with_check::text AS with_check_expr
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN (
    'places',
    'events',
    'services',
    'communities',
    'profiles',
    'reviews',
    'contact_messages'
  )
ORDER BY tablename, policyname;
