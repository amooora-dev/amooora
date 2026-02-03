-- Criar tabela de comunidades
CREATE TABLE IF NOT EXISTS public.communities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image TEXT,
    icon VARCHAR(100),
    category VARCHAR(100),
    members_count INTEGER DEFAULT 0,
    posts_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de membros de comunidades (associação usuário-comunidade)
CREATE TABLE IF NOT EXISTS public.community_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    community_id UUID NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(community_id, user_id)
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_communities_category ON public.communities(category);
CREATE INDEX IF NOT EXISTS idx_communities_is_active ON public.communities(is_active);
CREATE INDEX IF NOT EXISTS idx_community_members_community_id ON public.community_members(community_id);
CREATE INDEX IF NOT EXISTS idx_community_members_user_id ON public.community_members(user_id);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para communities
-- Permitir leitura pública de comunidades ativas
CREATE POLICY "Allow public read on active communities" ON public.communities
    FOR SELECT
    USING (is_active = true);

-- Permitir inserção/atualização apenas para usuários autenticados (admin)
CREATE POLICY "Allow authenticated insert on communities" ON public.communities
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated update on communities" ON public.communities
    FOR UPDATE
    TO authenticated
    USING (auth.uid() IS NOT NULL);

-- Políticas RLS para community_members
-- Permitir leitura para usuários autenticados
CREATE POLICY "Allow authenticated read on community_members" ON public.community_members
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id OR auth.uid() IS NOT NULL);

-- Permitir inserção para usuários autenticados (associar-se a comunidades)
CREATE POLICY "Allow authenticated insert on community_members" ON public.community_members
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Permitir exclusão para usuários autenticados (sair de comunidades)
CREATE POLICY "Allow authenticated delete on community_members" ON public.community_members
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Funções RPC para incrementar/decrementar contadores
CREATE OR REPLACE FUNCTION increment_community_members(community_id_param UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.communities
    SET members_count = members_count + 1
    WHERE id = community_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrement_community_members(community_id_param UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.communities
    SET members_count = GREATEST(members_count - 1, 0)
    WHERE id = community_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_communities_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at
CREATE TRIGGER update_communities_updated_at_trigger
    BEFORE UPDATE ON public.communities
    FOR EACH ROW
    EXECUTE FUNCTION update_communities_updated_at();
