-- Atualizar imagem do evento Pride Fest 2025 com foto de bandeira LGBTQIA+
-- Foto: Bandeira do arco-íris sendo carregada por multidão em parada

UPDATE events
SET image = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80'
WHERE name ILIKE '%Pride Fest%' 
   OR name ILIKE '%Festival LGBTQIA%'
   OR (name ILIKE '%Pride%' AND name ILIKE '%2025%');

-- Verificar se a atualização foi feita
SELECT id, name, image 
FROM events 
WHERE name ILIKE '%Pride Fest%' 
   OR name ILIKE '%Festival LGBTQIA%'
   OR (name ILIKE '%Pride%' AND name ILIKE '%2025%');
