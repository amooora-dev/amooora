# 🗺️ Guia da Página de Mapa - Amooora

**Data:** Janeiro de 2025  
**Status:** ✅ Implementado e Funcional

---

## 📋 Visão Geral

A página de Mapa permite visualizar todos os **locais** e **eventos** do Amooora em um mapa interativo do Google Maps, com pins clicáveis que mostram informações e permitem navegar para os detalhes.

---

## 🎯 Funcionalidades

### ✅ O que a página faz:

1. **Carrega Locais e Eventos**
   - Busca todos os locais do Supabase
   - Busca todos os eventos do Supabase
   - Filtra apenas itens com localização disponível

2. **Geocoding Automático**
   - Converte endereços de eventos em coordenadas (latitude/longitude)
   - Usa cache para evitar requisições repetidas
   - Processa em background com delay para evitar rate limiting

3. **Mapa Interativo**
   - Mostra todos os locais e eventos como pins no mapa
   - Cálculo automático do centro do mapa baseado nos locais
   - InfoWindow ao clicar nos pins
   - Navegação para detalhes ao clicar

4. **Filtros**
   - **Todos**: Mostra locais e eventos
   - **Locais**: Mostra apenas locais
   - **Eventos**: Mostra apenas eventos

5. **Lista de Locais**
   - Lista todos os locais/eventos abaixo do mapa
   - Cards clicáveis que navegam para detalhes
   - Ícones diferentes para locais (MapPin) e eventos (Calendar)

---

## 🚀 Como Acessar

### Opção 1: Menu Hambúrguer
1. Clique no menu hambúrguer (☰) no header
2. Selecione "Mapa"

### Opção 2: Navegação Programática
```typescript
onNavigate('mapa');
```

---

## 📊 Estrutura de Dados

### Locais (Places)
- ✅ **latitude** e **longitude**: Usados diretamente se disponíveis
- ✅ **address**: Usado para geocoding se não houver coordenadas
- ✅ **category**: Exibida no InfoWindow e nos cards

### Eventos (Events)
- ✅ **location**: Endereço usado para geocoding
- ⚠️ **latitude/longitude**: Não existem no tipo Event (será adicionado via geocoding)
- ✅ **category**: Exibida no InfoWindow e nos cards

---

## 🔧 Componentes Utilizados

### 1. `InteractiveMap`
- Componente principal do mapa
- Usa `@react-google-maps/api`
- Suporta múltiplos pins
- InfoWindow interativo

### 2. `geocoding.ts`
- Serviço para converter endereços em coordenadas
- Cache automático
- Tratamento de erros
- Rate limiting (delay entre requisições)

---

## ⚙️ Como Funciona

### Fluxo de Dados

```
1. Página carrega
   ↓
2. usePlaces() busca locais do Supabase
   ↓
3. useEvents() busca eventos do Supabase
   ↓
4. useEffect detecta eventos sem coordenadas
   ↓
5. geocodeAddress() converte endereços em coordenadas
   ↓
6. Coordenadas são salvas em cache (geocodingCache)
   ↓
7. mapPlaces e mapEvents são preparados
   ↓
8. allLocations combina locais e eventos
   ↓
9. InteractiveMap renderiza o mapa com todos os pins
```

### Geocoding

```typescript
// Exemplo de como funciona:
const event = { location: "Rua das Flores, 123, São Paulo" };
const result = await geocodeAddress(event.location);
// result = { lat: -23.5505, lng: -46.6333, formattedAddress: "..." }
```

**Cache:**
- Endereços geocodificados são salvos em `geocodingCache`
- Evita requisições repetidas para o mesmo endereço
- Melhora performance e reduz custos da API

---

## 🎨 Interface do Usuário

### Header
- Botão voltar (←)
- Título "Mapa"
- Contador de locais encontrados

### Filtros
- Botões: "Todos", "Locais", "Eventos"
- Cores: Primary quando ativo, branco quando inativo
- Ícones: MapPin para locais, Calendar para eventos

### Mapa
- Altura: 500px
- Bordas arredondadas
- Controles de zoom do Google Maps
- Pins clicáveis

### Lista de Locais
- Cards com informações resumidas
- Ícone diferente para locais vs eventos
- Categoria exibida como badge
- Endereço truncado se muito longo

---

## 🔍 Estados da Página

### Loading
- Spinner animado
- Mensagem: "Carregando mapa..." ou "Carregando coordenadas..."
- Exibido durante:
  - Carregamento inicial de dados
  - Processo de geocoding

### Erro
- Card vermelho com mensagem de erro
- Mostra mensagem específica do erro
- Pode ser erro de carregamento ou geocoding

### Vazio
- Ícone de MapPin grande
- Mensagem explicativa
- Diferencia entre "nenhum local" e "nenhum evento"

### Sucesso
- Mapa interativo
- Lista de locais abaixo
- Filtros funcionais

---

## 🐛 Troubleshooting

### Problema: Mapa não carrega

**Possíveis causas:**
1. Chave da API não configurada
2. APIs não ativadas no Google Cloud Console
3. Restrições de HTTP referrers bloqueando

**Solução:**
- Verificar `VITE_GOOGLE_MAPS_API_KEY` no `.env`
- Verificar console do navegador para erros
- Verificar restrições no Google Cloud Console

### Problema: Pins não aparecem

**Possíveis causas:**
1. Locais/eventos não têm coordenadas ou endereço
2. Geocoding falhou
3. Filtro ativo escondendo todos os itens

**Solução:**
- Verificar se locais têm `latitude`/`longitude` ou `address`
- Verificar se eventos têm `location` preenchido
- Verificar console para erros de geocoding
- Tentar mudar o filtro

### Problema: Geocoding muito lento

**Causa:**
- Muitos eventos sem coordenadas
- Delay de 200ms entre requisições

**Solução:**
- Normal, é intencional para evitar rate limiting
- Considerar adicionar campos `latitude`/`longitude` na tabela `events`
- Fazer geocoding no cadastro de eventos

### Problema: "Chave da API não configurada"

**Solução:**
1. Verificar se `VITE_GOOGLE_MAPS_API_KEY` está no `.env`
2. Reiniciar servidor de desenvolvimento
3. Verificar se a chave está correta (sem espaços)

---

## 📈 Melhorias Futuras

### Curto Prazo
- [ ] Adicionar campos `latitude`/`longitude` na tabela `events`
- [ ] Fazer geocoding no cadastro de eventos
- [ ] Salvar coordenadas no banco após geocoding

### Médio Prazo
- [ ] Clustering de pins quando há muitos locais
- [ ] Busca por endereço no mapa
- [ ] Filtros por categoria no mapa
- [ ] Rotas e direções ("Como chegar")

### Longo Prazo
- [ ] Mapa de calor (heatmap)
- [ ] Filtros avançados (raio de distância, categoria, etc.)
- [ ] Modo offline com cache de tiles
- [ ] Integração com GPS do usuário

---

## 🔗 Arquivos Relacionados

- **Página:** `src/app/pages/Mapa.tsx`
- **Componente Mapa:** `src/app/components/InteractiveMap.tsx`
- **Serviço Geocoding:** `src/app/services/geocoding.ts`
- **Hooks:** `src/app/hooks/usePlaces.ts`, `src/app/hooks/useEvents.ts`
- **Rota:** `src/app/App.tsx` (case 'mapa')

---

## 📝 Exemplo de Uso

```typescript
// Navegar para a página de mapa
onNavigate('mapa');

// A página automaticamente:
// 1. Carrega locais e eventos
// 2. Faz geocoding de eventos sem coordenadas
// 3. Exibe tudo no mapa
// 4. Permite filtrar e navegar para detalhes
```

---

**Última Atualização:** Janeiro de 2025  
**Status:** ✅ Funcional e Pronto para Uso
