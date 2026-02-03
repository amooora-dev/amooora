-- SQL_ADICIONAR_AUTHOR_NAME_REVIEWS.sql
-- Adiciona campo author_name à tabela reviews para permitir reviews sem login

-- Verificar se a coluna já existe antes de adicionar
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'reviews' 
        AND column_name = 'author_name'
    ) THEN
        ALTER TABLE reviews 
        ADD COLUMN author_name TEXT;
        
        COMMENT ON COLUMN reviews.author_name IS 'Nome do autor para reviews anônimas (sem login)';
    END IF;
END $$;

-- Atualizar RLS para permitir INSERT público com author_name
-- (Se necessário, ajustar conforme suas políticas RLS)
-- DROP POLICY IF EXISTS "Public can insert reviews" ON reviews;
-- CREATE POLICY "Public can insert reviews" ON reviews
--     FOR INSERT
--     TO public
--     WITH CHECK (true);

-- Verificar se a alteração foi bem-sucedida
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'reviews'
AND column_name IN ('author_name', 'user_id')
ORDER BY column_name;
