/**
 * Design System Examples - Exemplos Práticos
 * 
 * Exemplos de uso real dos componentes em páginas típicas do app
 */

import React, { useState } from 'react';
import { Container, Button, Card, Input, Textarea, EventDateTag, QuickActionButton, InterestButton, AttendedButton, Grid2, VerticalList } from '../components/ui';
import { Badge } from '../components/Badge';
import { MapPin, Star, Users, Calendar } from 'lucide-react';

// =====================================================
// EXEMPLO 1: Card de Evento com Interações
// =====================================================
export function EventCardExample() {
  const [hasInterest, setHasInterest] = useState(false);
  const [hasAttended, setHasAttended] = useState(false);

  const handleInterestToggle = () => {
    setHasInterest(!hasInterest);
    if (!hasInterest) setHasAttended(false); // Mutuamente exclusivo
  };

  const handleAttendedToggle = () => {
    setHasAttended(!hasAttended);
    if (!hasAttended) setHasInterest(false); // Mutuamente exclusivo
  };

  return (
    <Card hover>
      {/* Imagem */}
      <div className="w-full h-40 bg-gradient-to-br from-primary to-secondary rounded-xl mb-3 flex items-center justify-center">
        <Calendar className="w-12 h-12 text-white" />
      </div>

      {/* Tags */}
      <div className="flex items-center gap-2 mb-2">
        <EventDateTag date="15 Jan" />
        <Badge variant="primary">Presencial</Badge>
      </div>

      {/* Título e Descrição */}
      <h3 className="font-semibold text-base mb-1">Sarau Sáfico na Casa da Cultura</h3>
      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
        Um encontro para celebrar a arte e a cultura sáfica com poesia, música e muito mais!
      </p>

      {/* Info */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
        <div className="flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          <span>Centro, SP</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          <span>42 pessoas</span>
        </div>
      </div>

      {/* Botões de Interação */}
      <div className="flex gap-2">
        <InterestButton active={hasInterest} onClick={handleInterestToggle} />
        <AttendedButton active={hasAttended} onClick={handleAttendedToggle} />
      </div>
    </Card>
  );
}

// =====================================================
// EXEMPLO 2: Card de Local com Badge "Seguro"
// =====================================================
export function PlaceCardExample() {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <Card hover clickable>
      {/* Imagem */}
      <div className="w-full h-32 bg-gradient-to-br from-accent to-primary rounded-xl mb-3 flex items-center justify-center relative">
        <MapPin className="w-10 h-10 text-white" />
        
        {/* Botão Favorito */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
          className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md"
        >
          <Star className={`w-4 h-4 ${isFavorite ? 'fill-accent text-accent' : 'text-gray-400'}`} />
        </button>
      </div>

      {/* Badge */}
      <Badge variant="primary">Seguro</Badge>

      {/* Info */}
      <h3 className="font-semibold text-sm mt-2 mb-1">Café da Vila</h3>
      <p className="text-xs text-muted-foreground mb-2">
        Café acolhedor e seguro
      </p>

      {/* Rating */}
      <div className="flex items-center gap-1">
        <Star className="w-3 h-3 fill-accent text-accent" />
        <span className="text-xs font-medium">4.8</span>
        <span className="text-xs text-muted-foreground">(127)</span>
      </div>
    </Card>
  );
}

// =====================================================
// EXEMPLO 3: Formulário de Cadastro
// =====================================================
export function FormExample() {
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    local: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    if (!formData.titulo) newErrors.titulo = 'Título é obrigatório';
    if (!formData.descricao) newErrors.descricao = 'Descrição é obrigatória';
    if (!formData.local) newErrors.local = 'Local é obrigatório';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    alert('Formulário enviado com sucesso!');
  };

  return (
    <Card variant="large">
      <h2 className="text-xl font-semibold text-primary mb-4">Cadastrar Evento</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Título do Evento"
          placeholder="Ex: Sarau Sáfico"
          value={formData.titulo}
          onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
          error={errors.titulo}
        />

        <Textarea
          label="Descrição"
          placeholder="Descreva o evento..."
          value={formData.descricao}
          onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
          error={errors.descricao}
          rows={5}
        />

        <Input
          label="Local"
          placeholder="Digite o endereço"
          value={formData.local}
          onChange={(e) => setFormData({ ...formData, local: e.target.value })}
          error={errors.local}
          helperText="Endereço completo do evento"
        />

        <div className="flex gap-2 pt-2">
          <Button variant="outline" type="button" fullWidth>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" fullWidth>
            Cadastrar
          </Button>
        </div>
      </form>
    </Card>
  );
}

// =====================================================
// EXEMPLO 4: Lista de Eventos com Ação Rápida
// =====================================================
export function EventListExample() {
  return (
    <div>
      {/* Header com ação rápida */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-primary">Próximos Eventos</h2>
        <QuickActionButton onClick={() => alert('Cadastrar evento')}>
          Cadastrar evento
        </QuickActionButton>
      </div>

      {/* Lista de eventos */}
      <VerticalList gap="3">
        <EventCardExample />
        <EventCardExample />
        <EventCardExample />
      </VerticalList>

      {/* Ver mais */}
      <div className="mt-4">
        <Button variant="outline" fullWidth>
          Ver todos os eventos
        </Button>
      </div>
    </div>
  );
}

// =====================================================
// EXEMPLO 5: Grid de Locais
// =====================================================
export function PlaceGridExample() {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-primary">Locais Seguros</h2>
        <QuickActionButton onClick={() => alert('Recomendar local')}>
          Recomendar Local
        </QuickActionButton>
      </div>

      {/* Grid 2 colunas */}
      <Grid2 gap="3">
        <PlaceCardExample />
        <PlaceCardExample />
        <PlaceCardExample />
        <PlaceCardExample />
      </Grid2>
    </div>
  );
}

// =====================================================
// EXEMPLO 6: Página Completa com Container
// =====================================================
export function CompletePageExample() {
  return (
    <Container>
      {/* Header */}
      <header className="bg-primary text-white p-5 sticky top-0 z-10">
        <h1 className="text-2xl font-bold">Exemplos Práticos</h1>
        <p className="text-sm opacity-90">Design System em ação</p>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-5 space-y-8">
        {/* Seção 1: Eventos */}
        <section>
          <EventListExample />
        </section>

        {/* Seção 2: Locais */}
        <section>
          <PlaceGridExample />
        </section>

        {/* Seção 3: Formulário */}
        <section>
          <FormExample />
        </section>

        {/* Variantes de Botões */}
        <section>
          <h2 className="text-xl font-semibold text-primary mb-4">Todos os Botões</h2>
          <Card>
            <VerticalList gap="2">
              <Button variant="primary" fullWidth>Primary</Button>
              <Button variant="secondary" fullWidth>Secondary</Button>
              <Button variant="accent" fullWidth>Accent</Button>
              <Button variant="tertiary" fullWidth>Tertiary</Button>
              <Button variant="outline" fullWidth>Outline</Button>
              <Button variant="destructive" fullWidth>Destructive</Button>
            </VerticalList>
          </Card>
        </section>

        {/* Badges */}
        <section>
          <h2 className="text-xl font-semibold text-primary mb-4">Badges</h2>
          <Card>
            <div className="flex flex-wrap gap-2">
              <Badge variant="primary">Seguro</Badge>
              <Badge variant="secondary">Destaque</Badge>
              <Badge variant="accent">Novo</Badge>
              <EventDateTag date="15 Jan" />
              <EventDateTag date="20 Dez" />
            </div>
          </Card>
        </section>
      </main>

      {/* Footer - simulando BottomNav */}
      <div className="h-20 bg-white border-t border-gray-100 flex items-center justify-center">
        <p className="text-xs text-muted-foreground">Bottom Navigation aqui</p>
      </div>
    </Container>
  );
}

export default CompletePageExample;
