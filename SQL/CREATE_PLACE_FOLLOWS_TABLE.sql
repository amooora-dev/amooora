-- Tabela para armazenar seguidores de locais
-- Permite que usuários sigam locais para receber atualizações

-- Criar tabela place_follows
CREATE TABLE IF NOT EXISTS place_follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  place_id UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, place_id)
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_place_follows_user_id ON place_follows(user_id);
CREATE INDEX IF NOT EXISTS idx_place_follows_place_id ON place_follows(place_id);
CREATE INDEX IF NOT EXISTS idx_place_follows_created_at ON place_follows(created_at DESC);

-- RLS Policies

-- Permitir que usuários autenticados sigam locais
DROP POLICY IF EXISTS "Users can follow places" ON place_follows;
CREATE POLICY "Users can follow places"
  ON place_follows
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Usuários podem ver seus próprios follows
DROP POLICY IF EXISTS "Users can view their own follows" ON place_follows;
CREATE POLICY "Users can view their own follows"
  ON place_follows
  FOR SELECT
  USING (auth.uid() = user_id);

-- Permitir que qualquer um veja a contagem de seguidores (para contador público)
-- Mas não os dados pessoais dos seguidores
DROP POLICY IF EXISTS "Anyone can view follow counts" ON place_follows;
CREATE POLICY "Anyone can view follow counts"
  ON place_follows
  FOR SELECT
  USING (true);

-- Usuários podem deixar de seguir (deletar seus próprios follows)
DROP POLICY IF EXISTS "Users can unfollow places" ON place_follows;
CREATE POLICY "Users can unfollow places"
  ON place_follows
  FOR DELETE
  USING (auth.uid() = user_id);

-- Habilitar RLS
ALTER TABLE place_follows ENABLE ROW LEVEL SECURITY;

-- Comentários
COMMENT ON TABLE place_follows IS 'Armazena seguidores de locais';
COMMENT ON COLUMN place_follows.user_id IS 'ID do usuário que está seguindo o local';
COMMENT ON COLUMN place_follows.place_id IS 'ID do local sendo seguido';
COMMENT ON COLUMN place_follows.created_at IS 'Data/hora em que o usuário começou a seguir o local';
