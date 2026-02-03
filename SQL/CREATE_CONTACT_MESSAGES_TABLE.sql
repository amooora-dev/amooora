-- Tabela para armazenar mensagens do "Fale Conosco"
-- Permite que usuários enviem mensagens, denúncias, sugestões, etc.

-- Criar tabela contact_messages
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  content_type TEXT NOT NULL CHECK (content_type IN ('DENUNCIA', 'SUGESTAO', 'DUVIDA', 'ELOGIO', 'OUTRO')),
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'read', 'replied', 'resolved')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar índice para buscar por status
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_content_type ON contact_messages(content_type);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_user_id ON contact_messages(user_id);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_contact_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at
DROP TRIGGER IF EXISTS trigger_update_contact_messages_updated_at ON contact_messages;
CREATE TRIGGER trigger_update_contact_messages_updated_at
  BEFORE UPDATE ON contact_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_contact_messages_updated_at();

-- RLS Policies

-- Permitir que qualquer usuário (autenticado ou não) insira mensagens
DROP POLICY IF EXISTS "Anyone can insert contact messages" ON contact_messages;
CREATE POLICY "Anyone can insert contact messages"
  ON contact_messages
  FOR INSERT
  WITH CHECK (true);

-- Usuários podem ver apenas suas próprias mensagens
DROP POLICY IF EXISTS "Users can view their own messages" ON contact_messages;
CREATE POLICY "Users can view their own messages"
  ON contact_messages
  FOR SELECT
  USING (
    auth.uid() = user_id OR
    user_id IS NULL -- Mensagens de usuários não logados não podem ser vistas por outros usuários
  );

-- Apenas admins podem ver todas as mensagens
-- (Isso será feito através de uma função RPC ou policy específica para admins)

-- Permitir que admins vejam todas as mensagens
DROP POLICY IF EXISTS "Admins can view all messages" ON contact_messages;
CREATE POLICY "Admins can view all messages"
  ON contact_messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Permitir que admins atualizem mensagens (mudar status, adicionar notas)
DROP POLICY IF EXISTS "Admins can update messages" ON contact_messages;
CREATE POLICY "Admins can update messages"
  ON contact_messages
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Habilitar RLS
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Comentários
COMMENT ON TABLE contact_messages IS 'Armazena mensagens enviadas através do formulário "Fale Conosco"';
COMMENT ON COLUMN contact_messages.content_type IS 'Tipo de conteúdo: DENUNCIA, SUGESTAO, DUVIDA, ELOGIO, OUTRO';
COMMENT ON COLUMN contact_messages.status IS 'Status da mensagem: pending, read, replied, resolved';
COMMENT ON COLUMN contact_messages.user_id IS 'ID do usuário (null se não estiver logado)';
