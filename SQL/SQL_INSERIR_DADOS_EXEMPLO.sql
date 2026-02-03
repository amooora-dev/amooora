-- =====================================================
-- INSERIR DADOS DE EXEMPLO - COMUNIDADE LGBT
-- Execute este SQL no Supabase Dashboard → SQL Editor
-- =====================================================

-- =====================================================
-- 1. LOCAIS (PLACES) - 3 EXEMPLOS
-- =====================================================

-- Local 1: Bar LGBT-friendly em São Paulo
INSERT INTO public.places (
  name,
  description,
  image,
  address,
  category,
  latitude,
  longitude,
  is_safe,
  rating,
  review_count
) VALUES (
  'Bar Aconchego LGBTQIA+',
  'Bar acolhedor e seguro no centro de São Paulo. Espaço dedicado à comunidade LGBTQIA+ com música ao vivo, drag shows e eventos temáticos. Ambiente seguro e respeitoso para todas as pessoas. Happy hour especial todas as quartas-feiras.',
  'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=600&fit=crop',
  'Rua Augusta, 1234 - Consolação, São Paulo - SP',
  'Bar',
  -23.5505,
  -46.6333,
  true,
  4.8,
  42
);

-- Local 2: Café Seguro em São Paulo
INSERT INTO public.places (
  name,
  description,
  image,
  address,
  category,
  latitude,
  longitude,
  is_safe,
  rating,
  review_count
) VALUES (
  'Café Diversidade',
  'Café inclusivo e seguro no coração da Vila Madalena. Oferece espaço de trabalho, encontros da comunidade e eventos culturais. Cardápio variado com opções veganas e vegetarianas. Ambiente trans-friendly e acolhedor.',
  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=600&fit=crop',
  'Rua Harmonia, 567 - Vila Madalena, São Paulo - SP',
  'Café',
  -23.5489,
  -46.6908,
  true,
  4.9,
  38
);

-- Local 3: Espaço Cultural LGBT+
INSERT INTO public.places (
  name,
  description,
  image,
  address,
  category,
  latitude,
  longitude,
  is_safe,
  rating,
  review_count
) VALUES (
  'Casa de Cultura Queer',
  'Centro cultural dedicado à arte e cultura LGBTQIA+. Oferece exposições, oficinas, palestras e encontros da comunidade. Espaço seguro para artistas e público LGBTQIA+. Biblioteca com acervo especializado.',
  'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&h=600&fit=crop',
  'Av. Paulista, 1578 - Bela Vista, São Paulo - SP',
  'Espaço Cultural',
  -23.5615,
  -46.6562,
  true,
  4.7,
  25
);

-- =====================================================
-- 2. SERVIÇOS (SERVICES) - 3 EXEMPLOS
-- =====================================================

-- Serviço 1: Terapia para LGBTQIA+
INSERT INTO public.services (
  name,
  description,
  image,
  price,
  category,
  category_slug,
  provider,
  rating,
  review_count,
  is_active
) VALUES (
  'Terapia LGBTQIA+ Afirmativa',
  'Atendimento psicológico especializado para pessoas LGBTQIA+. Psicóloga formada com experiência em questões de identidade de gênero, orientação sexual e saúde mental da comunidade. Consultas presenciais e online. Aceita planos de saúde.',
  'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop',
  150.00,
  'Terapia',
  'terapia',
  'Dra. Maria Silva - CRP 06/123456',
  4.9,
  28,
  true
);

-- Serviço 2: Advocacia LGBT+
INSERT INTO public.services (
  name,
  description,
  image,
  price,
  category,
  category_slug,
  provider,
  rating,
  review_count,
  is_active
) VALUES (
  'Advocacia Especializada em Direitos LGBTQIA+',
  'Assessoria jurídica completa para questões relacionadas à comunidade LGBTQIA+: retificação de nome e gênero, união estável, casamento, adoção, discriminação, direitos trabalhistas e muito mais. Atendimento humanizado e acolhedor.',
  'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=600&fit=crop',
  300.00,
  'Advocacia',
  'advocacia',
  'Advogado João Santos - OAB/SP 234567',
  5.0,
  15,
  true
);

-- Serviço 3: Beleza Inclusiva
INSERT INTO public.services (
  name,
  description,
  image,
  price,
  category,
  category_slug,
  provider,
  rating,
  review_count,
  is_active
) VALUES (
  'Salão de Beleza Inclusivo',
  'Salão de beleza LGBTQIA+ friendly. Oferecemos cortes de cabelo, coloração, tratamento capilar, maquiagem e cuidados pessoais. Espaço seguro e respeitoso para todas as pessoas, independente de identidade de gênero ou expressão.',
  'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&h=600&fit=crop',
  80.00,
  'Beleza',
  'beleza',
  'Salão Beleza Diversa - Equipe especializada',
  4.8,
  45,
  true
);

-- =====================================================
-- 3. EVENTOS (EVENTS) - 3 EXEMPLOS
-- =====================================================

-- Evento 1: Festival LGBT+ (data futura)
INSERT INTO public.events (
  name,
  description,
  image,
  date,
  location,
  category,
  price,
  participants_count,
  rating,
  review_count,
  is_active
) VALUES (
  'Pride Fest 2025 - Festival LGBTQIA+',
  'Grande festival da comunidade LGBTQIA+ com shows, palestras, stands informativos, feira de artesanato e muito mais. Evento gratuito e aberto a toda a família. Convidados especiais e atrações culturais. Venha celebrar o orgulho e a diversidade!',
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
  '2025-06-28T14:00:00-03:00', -- 28 de junho de 2025, 14h
  'Parque Ibirapuera - Av. Pedro Álvares Cabral - São Paulo, SP',
  'Música',
  0.00, -- Gratuito
  0,
  0,
  0,
  true
);

-- Evento 2: Workshop de Direitos LGBT+ (data futura)
INSERT INTO public.events (
  name,
  description,
  image,
  date,
  location,
  category,
  price,
  participants_count,
  rating,
  review_count,
  is_active
) VALUES (
  'Workshop: Conhecendo Seus Direitos LGBTQIA+',
  'Workshop educativo sobre direitos da comunidade LGBTQIA+. Abordaremos temas como retificação de nome e gênero, casamento, adoção, direitos trabalhistas, enfrentamento à discriminação e muito mais. Com advogados especializados e espaço para perguntas.',
  'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop',
  '2025-03-15T19:00:00-03:00', -- 15 de março de 2025, 19h
  'Casa de Cultura Queer - Av. Paulista, 1578 - São Paulo, SP',
  'Educação',
  0.00, -- Gratuito
  0,
  0,
  0,
  true
);

-- Evento 3: Sarau LGBTQIA+ (data futura)
INSERT INTO public.events (
  name,
  description,
  image,
  date,
  location,
  category,
  price,
  participants_count,
  rating,
  review_count,
  is_active
) VALUES (
  'Sarau Queer - Noite de Poesia e Arte',
  'Sarau mensal da comunidade LGBTQIA+ com poesia, música, performance e arte. Espaço para artistas exporem seus trabalhos e público se expressar. Microfone aberto e ambiente acolhedor. Traga suas criações e venha compartilhar!',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop',
  '2025-02-20T20:00:00-03:00', -- 20 de fevereiro de 2025, 20h
  'Café Diversidade - Rua Harmonia, 567 - Vila Madalena, São Paulo - SP',
  'Arte',
  10.00, -- R$ 10,00
  0,
  0,
  0,
  true
);

-- =====================================================
-- VERIFICAR DADOS INSERIDOS
-- =====================================================

-- Verificar locais inseridos
SELECT 
  'Locais inseridos' as tipo,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE is_safe = true) as seguros
FROM public.places;

-- Verificar serviços inseridos
SELECT 
  'Serviços inseridos' as tipo,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE is_active = true) as ativos
FROM public.services;

-- Verificar eventos inseridos
SELECT 
  'Eventos inseridos' as tipo,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE is_active = true) as ativos,
  COUNT(*) FILTER (WHERE date >= CURRENT_DATE) as futuros
FROM public.events;

-- Listar todos os dados inseridos
SELECT 'LOCAIS' as tabela, name, category, address FROM public.places ORDER BY created_at DESC LIMIT 3
UNION ALL
SELECT 'SERVIÇOS' as tabela, name, category, provider FROM public.services ORDER BY created_at DESC LIMIT 3
UNION ALL
SELECT 'EVENTOS' as tabela, name, category, location FROM public.events ORDER BY created_at DESC LIMIT 3;
