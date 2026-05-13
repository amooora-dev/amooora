-- =====================================================
-- INSERÇÃO DE 10 EVENTOS LGBT+ — São Paulo | Mai–Jul 2026
-- Fonte: Documento "Eventos_LGBT_App_Amooora.docx"
-- Executar no Supabase SQL Editor
-- =====================================================
--
-- PASSO 1: Faça upload da imagem "eventos-lgbt-2026.png"
--          no bucket "events" do Supabase Storage.
--
-- PASSO 2: Copie a URL pública gerada e substitua o valor
--          de IMAGE_URL abaixo (ou use o UPDATE no final).
--
-- PASSO 3: Execute este script no Supabase SQL Editor.
-- =====================================================

-- 01. C6 Fest 2026
INSERT INTO events (name, description, date, end_time, location, category, price, image, is_active, participants_count, curation_status)
VALUES (
  'C6 Fest 2026',
  'Quatro dias de muita música, conexão e fervo no Parque Ibirapuera. O C6 Fest 2026 reúne artistas que a comunidade ama — The xx, Wolf Alice, Magdalena Bay, Lykke Li e muito mais. De 21 a 24 de maio, o Ibirapuera vira nosso ponto de encontro. Chega com suas amigas, descobre novos sons e aproveita cada momento com liberdade.',
  '2026-05-21T12:00:00-03:00',
  '2026-05-24T23:59:00-03:00',
  'Parque Ibirapuera - Av. Pedro Álvares Cabral, s/n — Vila Mariana, São Paulo, SP',
  'Música',
  NULL,
  'https://btavwaysfjpsuqxdfguw.supabase.co/storage/v1/object/public/events/eventos-lgbt-2026.png',
  true,
  0,
  'approved'
);

-- 02. 25ª Feira Cultural da Diversidade LGBT+
INSERT INTO events (name, description, date, location, category, price, image, is_active, participants_count, curation_status)
VALUES (
  '25ª Feira Cultural da Diversidade LGBT+',
  'A Feira Cultural da Diversidade LGBT+ chega na sua 25ª edição com muito empreendedorismo, arte e representatividade. No coração de São Paulo, o Vale do Anhangabaú recebe nossa comunidade para um dia inteiro de trocas, consumo consciente e celebração da diversidade. Entrada gratuita para todes.',
  '2026-06-04T10:00:00-03:00',
  'Vale do Anhangabaú - Centro Histórico, São Paulo, SP',
  'Cultura',
  0,
  'https://btavwaysfjpsuqxdfguw.supabase.co/storage/v1/object/public/events/eventos-lgbt-2026.png',
  true,
  0,
  'approved'
);

-- 03. POC CON 2026
INSERT INTO events (name, description, date, end_time, location, category, price, image, is_active, participants_count, curation_status)
VALUES (
  'POC CON 2026',
  'A POC CON é a maior feira LGBTQIA+ de quadrinhos e artes gráficas do Brasil — e a gente tá lá. Com mais de 220 artistas expositores, editoras, tatuadores, área de jogos, concurso de cosplay e uma programação rica de oficinas e bate-papos, são dois dias de muito conteúdo, arte e comunidade. Entrada gratuita para todes.',
  '2026-06-05T13:00:00-03:00',
  '2026-06-06T20:00:00-03:00',
  'Convention Hall 2 — Distrito Anhembi - Av. Olavo Fontoura, 1209 — Santana, São Paulo, SP',
  'Cultura',
  0,
  'https://btavwaysfjpsuqxdfguw.supabase.co/storage/v1/object/public/events/eventos-lgbt-2026.png',
  true,
  0,
  'approved'
);

-- 04. 24ª Caminhada de Mulheres Lésbicas e Bissexuais de SP
INSERT INTO events (name, description, date, location, category, price, image, is_active, participants_count, curation_status)
VALUES (
  '24ª Caminhada de Mulheres Lésbicas e Bissexuais de SP',
  'A Caminhada de Mulheres Lésbicas e Bissexuais de São Paulo reafirma a visibilidade e a resistência da comunidade sáfica nas ruas da cidade. Na véspera da Parada do Orgulho, é a nossa vez de ocupar o espaço com orgulho, afeto e luta. Partindo do MASP, a caminhada celebra quem somos e tudo que ainda vamos conquistar.',
  '2026-06-06T13:00:00-03:00',
  'MASP — Museu de Arte de São Paulo - Av. Paulista, 1578 — Bela Vista, São Paulo, SP',
  'Cultura',
  0,
  'https://btavwaysfjpsuqxdfguw.supabase.co/storage/v1/object/public/events/eventos-lgbt-2026.png',
  true,
  0,
  'approved'
);

-- 05. 30ª Parada do Orgulho LGBT+ de São Paulo
INSERT INTO events (name, description, date, location, category, price, image, is_active, participants_count, curation_status)
VALUES (
  '30ª Parada do Orgulho LGBT+ de São Paulo',
  'A maior Parada LGBT+ do mundo completa 30 anos na Avenida Paulista. Em 2026, o tema é ''A rua convoca, a urna confirma'' — e a gente responde presente. Uma data histórica de luta, visibilidade e celebração para toda a comunidade LGBTQIAPN+. Trinta anos de resistência nas ruas. Vem junto.',
  '2026-06-07T10:00:00-03:00',
  'Avenida Paulista - Bela Vista, São Paulo, SP',
  'Cultura',
  0,
  'https://btavwaysfjpsuqxdfguw.supabase.co/storage/v1/object/public/events/eventos-lgbt-2026.png',
  true,
  0,
  'approved'
);

-- 06. 12ª Feira Diversa
INSERT INTO events (name, description, date, location, category, price, image, is_active, participants_count, curation_status)
VALUES (
  '12ª Feira Diversa',
  'A Feira Diversa chega na sua 12ª edição com foco em empregabilidade, cultura e geração de renda para a comunidade LGBTQIA+. No Centro Cultural São Paulo, o evento reúne empresas, coletivos e pessoas da comunidade para trocas reais sobre trabalho, renda e pertencimento. Entrada gratuita — porque oportunidade é pra todes.',
  '2026-06-20T14:00:00-03:00',
  'Centro Cultural São Paulo — CCSP - Rua Vergueiro, 1000 — Liberdade, São Paulo, SP',
  'Cultura',
  0,
  'https://btavwaysfjpsuqxdfguw.supabase.co/storage/v1/object/public/events/eventos-lgbt-2026.png',
  true,
  0,
  'approved'
);

-- 07. Festival Território Queer — Cinema LGBTQIAPN+
INSERT INTO events (name, description, date, end_time, location, category, price, image, is_active, participants_count, curation_status)
VALUES (
  'Festival Território Queer — Cinema LGBTQIAPN+',
  'O Festival Território Queer toma conta do Centro Cultural São Paulo com 28 filmes em três semanas de programação gratuita. Da história do movimento queer ao cinema contemporâneo, são três eixos — Queer Love, Coisas que tirei do armário e Orgulho é Revolução. Uma imersão de cinema, memória e identidade feita pra nossa comunidade.',
  '2026-06-24T14:00:00-03:00',
  '2026-07-10T22:00:00-03:00',
  'Centro Cultural São Paulo — Sala Circuito Spcine Lima Barreto - Rua Vergueiro, 1000 — Liberdade, São Paulo, SP',
  'Cinema',
  0,
  'https://btavwaysfjpsuqxdfguw.supabase.co/storage/v1/object/public/events/eventos-lgbt-2026.png',
  true,
  0,
  'approved'
);

-- 08. 9ª Marcha Trans de São Paulo
INSERT INTO events (name, description, date, location, category, price, image, is_active, participants_count, curation_status)
VALUES (
  '9ª Marcha Trans de São Paulo',
  'A 9ª Marcha Trans de São Paulo reafirma a existência e a resistência de mulheres trans, travestis e pessoas não-binárias. Um ato político e afetivo pelas ruas de São Paulo, organizado por e para a comunidade trans. Acompanhe @paradasp para confirmar data e local.',
  '2026-06-15T12:00:00-03:00',
  'São Paulo, SP (local a confirmar — acompanhe @paradasp)',
  'Cultura',
  0,
  'https://btavwaysfjpsuqxdfguw.supabase.co/storage/v1/object/public/events/eventos-lgbt-2026.png',
  true,
  0,
  'approved'
);

-- 09. FANCHA — Festa para Mulheres Sáficas
INSERT INTO events (name, description, date, location, category, price, image, is_active, participants_count, curation_status)
VALUES (
  'FANCHA — Festa para Mulheres Sáficas',
  'A FANCHA é uma festa exclusiva para mulheres lésbicas e sáficas — cis e trans. Cada edição tem um estilo musical diferente, do funk ao rock, sempre com muito acolhimento, flash tattoos e a certeza de que aqui é só a gente. Acompanha @festafancha no Instagram para não perder a próxima data e garantir o seu ingresso.',
  '2026-06-28T22:00:00-03:00',
  'São Paulo, SP (local varia por edição — ver @festafancha)',
  'Festa',
  NULL,
  'https://btavwaysfjpsuqxdfguw.supabase.co/storage/v1/object/public/events/eventos-lgbt-2026.png',
  true,
  0,
  'approved'
);

-- 10. Velcro — Festa Sapatão Queer
INSERT INTO events (name, description, date, location, category, price, image, is_active, participants_count, curation_status)
VALUES (
  'Velcro — Festa Sapatão Queer',
  'A Velcro é a festa sapatão queer de São Paulo — desde 2019 criando espaço de empoderamento para lésbicas e bissexuais cis e trans na noite paulistana. Cada edição é uma nova oportunidade de celebrar quem você é com quem você ama. Acompanha no Sympla para garantir o ingresso e não perder a próxima data.',
  '2026-07-04T22:00:00-03:00',
  'São Paulo, SP (local varia por edição — ver Sympla)',
  'Festa',
  NULL,
  'https://btavwaysfjpsuqxdfguw.supabase.co/storage/v1/object/public/events/eventos-lgbt-2026.png',
  true,
  0,
  'approved'
);

-- =====================================================
-- ALTERNATIVA: Se os eventos já foram inseridos sem imagem,
-- use este UPDATE para aplicar a imagem em todos de uma vez.
-- Substitua a URL pelo link público do Supabase Storage.
-- =====================================================

-- UPDATE events
-- SET image = 'COLE_A_URL_DA_IMAGEM_AQUI'
-- WHERE date >= '2026-05-01'
--   AND name IN (
--     'C6 Fest 2026',
--     '25ª Feira Cultural da Diversidade LGBT+',
--     'POC CON 2026',
--     '24ª Caminhada de Mulheres Lésbicas e Bissexuais de SP',
--     '30ª Parada do Orgulho LGBT+ de São Paulo',
--     '12ª Feira Diversa',
--     'Festival Território Queer — Cinema LGBTQIAPN+',
--     '9ª Marcha Trans de São Paulo',
--     'FANCHA — Festa para Mulheres Sáficas',
--     'Velcro — Festa Sapatão Queer'
--   );

-- =====================================================
-- VERIFICAÇÃO
-- =====================================================
-- SELECT id, name, date, category, image
-- FROM events
-- WHERE date >= '2026-05-01'
-- ORDER BY date ASC;
