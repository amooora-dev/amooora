import { ArrowLeft, Info } from 'lucide-react';
import { Header } from '../shared/components';
import { BottomNav } from '../shared/components';
import { useAdmin } from '../shared/hooks';
import { ImageWithFallback } from '../shared/components';

// INSTRUÇÕES: Para usar as imagens locais:
// 1. Adicione os 3 arquivos na pasta src/assets:
//    - sobre-amooora-1.png (seção "Por nós e para nós")
//    - sobre-amooora-2.png (seção "Mi brejo, su brejo")
//    - sobre-amooora-3.png (seção "Um mundo inteiro")
// 2. Descomente as 3 linhas de import abaixo
// 3. Remova ou comente as 3 linhas de const com URLs temporárias

// Imports das imagens locais
import sobreAmooora1 from '@/assets/sobre-amooora-1.png';
import sobreAmooora2 from '@/assets/sobre-amooora-2.png';
import sobreAmooora3 from '@/assets/sobre-amooora-3.png';

interface SobreAmoooraProps {
  onNavigate: (page: string) => void;
  onBack?: () => void;
}

export function SobreAmooora({ onNavigate, onBack }: SobreAmoooraProps) {
  const { isAdmin } = useAdmin();

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
        {/* Header fixo */}
        <Header onNavigate={onNavigate} showBackButton onBack={onBack || (() => onNavigate('home'))} isAdmin={isAdmin} />

        {/* Conteúdo scrollável - padding-top para compensar header fixo */}
        <div className="flex-1 overflow-y-auto pb-24 pt-24">
          {/* Seção: Manifesto */}
          <section className="px-5 py-6">
            <div className="text-xs uppercase text-muted-foreground mb-2 tracking-wider">
              UM SONHO, UM IDEAL
            </div>
            <h1 className="text-3xl font-bold text-primary mb-6">Manifesto</h1>
            
            <div className="space-y-4 text-foreground leading-relaxed">
              <p className="text-base">
                Nós somos Amooora.
              </p>
              <p className="text-base">
                Nascemos da urgência e do desejo de construir um mundo onde a comunidade sáfica — mulheres lésbicas, bissexuais, pansexuais, pessoas trans e não binárias que se relacionam com outras identidades femininas — possa se sentir livre, segura e pertencente.
              </p>
              <p className="text-base">
                Somos uma plataforma feita por nós e para nós. Um espaço onde existências plurais não apenas cabem, mas são celebradas, validadas e conectadas.
              </p>
              <p className="text-base">
                Mais do que uma plataforma online, somos uma resposta a um vazio histórico de visibilidade, cuidado e recursos para a comunidade sáfica.
              </p>
              <p className="text-base">
                Somos um lugar onde você pode ser quem é, sem medo, sem julgamento, com acolhimento. Onde pessoas se encontram para existir com coragem, afeto e em seu potencial completo.
              </p>
            </div>
          </section>

          {/* Seção: Por nós e para nós */}
          <section className="px-5 py-6 bg-gradient-to-br from-primary/5 to-secondary/5">
            <h2 className="text-2xl font-bold text-primary mb-4">Por nós e para nós</h2>
            
            <div className="space-y-4 text-foreground leading-relaxed mb-6">
              <p className="text-base">
                Somos a plataforma referência para a comunidade sáfica. Chegamos para somar, criar e espalhar conteúdo, informação e serviços com a nossa cara — feitos por nós, para nós, do jeitinho que a nossa comunidade merece.
              </p>
            </div>

            {/* Imagem decorativa */}
            <div className="relative h-64 rounded-2xl overflow-hidden mb-6">
              <ImageWithFallback
                src={sobreAmooora1}
                alt="Comunidade sáfica"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
            </div>
          </section>

          {/* Seção: Mi brejo, su brejo */}
          <section className="px-5 py-6">
            <div className="text-xs uppercase text-muted-foreground mb-2 tracking-wider">
              UM APLICATIVO SÁFICO
            </div>
            <h2 className="text-2xl font-bold text-primary mb-4">Mi brejo, su brejo</h2>
            
            <div className="space-y-4 text-foreground leading-relaxed">
              <p className="text-base">
                A gente quer se encontrar, trocar e se reconhecer. Criamos um espaço seguro, afetuoso e com a nossa cara para reunir toda a comunidade sáfica.
              </p>
              <p className="text-base">
                Mais do que visibilidade, a gente quer construir conexões. Trocas reais. Entretenimento, informação útil, apoio psicológico, saúde íntima, orientação jurídica, e muito mais.
              </p>
              <p className="text-base">
                As conexões aqui vão além do virtual! O virtual é a porta de entrada, mas incentivamos as conexões no mundo real. Ou seja, o olho no olho, o toque na pele e a conversa ao pé de uma mesa sem hora para acabar!
              </p>
              <p className="text-base">
                Porque existem muitos brejos, e sempre vai ter um com a sua cara.
              </p>
            </div>

            {/* Imagem decorativa */}
            <div className="relative h-64 rounded-2xl overflow-hidden mt-6">
              <ImageWithFallback
                src={sobreAmooora2}
                alt="Conexões reais"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
            </div>
          </section>

          {/* Seção: Um mundo inteiro */}
          <section className="px-5 py-6 bg-gradient-to-br from-secondary/5 to-accent/5">
            <h2 className="text-2xl font-bold text-primary mb-4">Um mundo inteiro de acolhimento e liberdade</h2>
            
            <div className="space-y-4 text-foreground leading-relaxed">
              <p className="text-base">
                A Amooora é mais que uma plataforma — é um movimento. Um espaço onde cada pessoa da comunidade sáfica pode encontrar seu lugar, sua voz e sua tribo.
              </p>
              <p className="text-base">
                Aqui, você encontra locais seguros, eventos incríveis, serviços especializados e uma comunidade que te acolhe como você é.
              </p>
            </div>

            {/* Imagem decorativa */}
            <div className="relative h-64 rounded-2xl overflow-hidden mt-6">
              <ImageWithFallback
                src={sobreAmooora3}
                alt="Comunidade Amooora"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
            </div>
          </section>

          {/* Footer */}
          <div className="px-5 py-8 text-center">
            <p className="text-sm text-muted-foreground mb-2">amooora.com.br</p>
            <p className="text-xs text-muted-foreground">Feito com 💜 pela comunidade sáfica</p>
          </div>
        </div>

        {/* Navegação inferior fixa */}
        <BottomNav activeItem="home" onItemClick={onNavigate} />
      </div>
    </div>
  );
}
