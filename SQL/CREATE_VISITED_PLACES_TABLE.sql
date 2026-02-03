-- Tabela para armazenar locais que o usuário já frequentou
-- Similar à funcionalidade "Fui!!" de eventos

-- Criar tabela visited_places
CREATE TABLE IF NOT EXISTS visited_places (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  place_id UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, place_id)
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_visited_places_user_id ON visited_places(user_id);
CREATE INDEX IF NOT EXISTS idx_visited_places_place_id ON visited_places(place_id);
CREATE INDEX IF NOT EXISTS idx_visited_places_created_at ON visited_places(created_at DESC);

-- RLS Policies

-- Permitir que usuários autenticados insiram suas próprias visitas
DROP POLICY IF EXISTS "Users can insert their own visits" ON visited_places;
CREATE POLICY "Users can insert their own visits"
  ON visited_places
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Usuários podem ver apenas suas próprias visitas
DROP POLICY IF EXISTS "Users can view their own visits" ON visited_places;
CREATE POLICY "Users can view their own visits"
  ON visited_places
  FOR SELECT
  USING (auth.uid() = user_id);

-- Usuários podem deletar apenas suas próprias visitas
DROP POLICY IF EXISTS "Users can delete their own visits" ON visited_places;
CREATE POLICY "Users can delete their own visits"
  ON visited_places
  FOR DELETE
  USING (auth.uid() = user_id);

-- Habilitar RLS
ALTER TABLE visited_places ENABLE ROW LEVEL SECURITY;

-- Comentários
COMMENT ON TABLE visited_places IS 'Armazena locais que o usuário já frequentou (marcou como "Já fui")';
COMMENT ON COLUMN visited_places.user_id IS 'ID do usuário que visitou o local';
COMMENT ON COLUMN visited_places.place_id IS 'ID do local visitado';
COMMENT ON COLUMN visited_places.created_at IS 'Data/hora em que o usuário marcou como visitado';
