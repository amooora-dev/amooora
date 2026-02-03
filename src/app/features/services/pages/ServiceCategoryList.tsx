import { Star, MapPin } from 'lucide-react';
import { ImageWithFallback } from '../../../shared/components';
import { Header } from '../../../shared/components';
import { BottomNav } from '../../../shared/components';

const servicesData = {
  terapia: {
    title: 'Terapia',
    professionals: [
      {
        id: '1',
        name: 'Dra. Marina Silva',
        specialty: 'Psicóloga - Terapia LGBTQIA+',
        description: 'Especializada em atendimento à comunidade sáfica, questões de identidade e relacionamentos.',
        location: 'São Paulo, SP',
        rating: 4.8,
        reviews: 89,
        price: '$$$$',
        imageUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwc3ljaG9sb2dpc3QlMjB3b21lbnxlbnwxfHx8fDE3Njc4MzQzNTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
        verified: true,
      },
      {
        id: '2',
        name: 'Dra. Paula Mendes',
        specialty: 'Psicanalista',
        description: 'Atendimento afirmativo com foco em autoestima e desenvolvimento pessoal.',
        location: 'Rio de Janeiro, RJ',
        rating: 4.9,
        reviews: 124,
        price: '$$$$',
        imageUrl: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxwc3ljaG9sb2dpc3QlMjB3b21lbnxlbnwxfHx8fDE3Njc4MzQzNTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
        verified: true,
      },
      {
        id: '3',
        name: 'Dra. Camila Rodrigues',
        specialty: 'Psicóloga Clínica',
        description: 'Terapia online e presencial para ansiedade, depressão e questões relacionais.',
        location: 'Belo Horizonte, MG',
        rating: 4.7,
        reviews: 67,
        price: '$$$',
        imageUrl: 'https://images.unsplash.com/photo-1551836022-4c4c79ecde51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGVyYXB5JTIwb2ZmaWNlJTIwcm9vbXxlbnwxfHx8fDE3Njc4MzQzNTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
        verified: false,
      },
      {
        id: '4',
        name: 'Dra. Beatriz Santos',
        specialty: 'Psicóloga - Terapia de Casal',
        description: 'Especialista em relacionamentos lésbicos e terapia de casal afirmativa.',
        location: 'Porto Alegre, RS',
        rating: 5.0,
        reviews: 156,
        price: '$$$$',
        imageUrl: 'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Vuc2VsaW5nJTIwc2Vzc2lvbnxlbnwxfHx8fDE3Njc4MzQzNTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
        verified: true,
      },
    ],
  },
  advocacia: {
    title: 'Advocacia',
    professionals: [
      {
        id: '1',
        name: 'Dra. Juliana Ferreira',
        specialty: 'Advogada - Direitos LGBTQIA+',
        description: 'Especializada em direito de família, retificação de registro e direitos civis.',
        location: 'São Paulo, SP',
        rating: 4.9,
        reviews: 142,
        price: '$$$$',
        imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        verified: true,
      },
      {
        id: '2',
        name: 'Dra. Amanda Costa',
        specialty: 'Advogada - Direito Trabalhista',
        description: 'Defesa contra discriminação no trabalho e direitos trabalhistas LGBTQIA+.',
        location: 'Brasília, DF',
        rating: 4.8,
        reviews: 98,
        price: '$$$',
        imageUrl: 'https://images.unsplash.com/photo-1590650153855-d9e808231d41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxsYXd5ZXIlMjB3b21lbnxlbnwxfHx8fDE3Njc5MDIzOTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
        verified: true,
      },
      {
        id: '3',
        name: 'Dra. Roberta Almeida',
        specialty: 'Advogada - Direito de Família',
        description: 'União estável, adoção homoafetiva e planejamento familiar.',
        location: 'Rio de Janeiro, RJ',
        rating: 5.0,
        reviews: 203,
        price: '$$$$',
        imageUrl: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxsYXd5ZXIlMjB3b21lbnxlbnwxfHx8fDE3Njc5MDIzOTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
        verified: true,
      },
      {
        id: '4',
        name: 'Dra. Patrícia Oliveira',
        specialty: 'Advogada - Direito Civil',
        description: 'Consultoria jurídica, contratos e direitos civis para a comunidade.',
        location: 'Curitiba, PR',
        rating: 4.7,
        reviews: 76,
        price: '$$$',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxsYXd5ZXIlMjB3b21lbnxlbnwxfHx8fDE3Njc5MDIzOTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
        verified: false,
      },
    ],
  },
  saude: {
    title: 'Saúde',
    professionals: [
      {
        id: '1',
        name: 'Dra. Fernanda Lima',
        specialty: 'Ginecologista',
        description: 'Atendimento ginecológico afirmativo e acolhedor para todas as identidades.',
        location: 'São Paulo, SP',
        rating: 4.9,
        reviews: 187,
        price: '$$$$',
        imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N0b3IlMjB3b21lbnxlbnwxfHx8fDE3Njc5MDIzOTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
        verified: true,
      },
      {
        id: '2',
        name: 'Dra. Carla Mendes',
        specialty: 'Endocrinologista',
        description: 'Especialista em hormonização e saúde hormonal LGBTQIA+.',
        location: 'Rio de Janeiro, RJ',
        rating: 5.0,
        reviews: 234,
        price: '$$$$',
        imageUrl: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxkb2N0b3IlMjB3b21lbnxlbnwxfHx8fDE3Njc5MDIzOTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
        verified: true,
      },
      {
        id: '3',
        name: 'Dra. Isabela Rocha',
        specialty: 'Nutricionista',
        description: 'Nutrição integrativa com abordagem não-gordofóbica e inclusiva.',
        location: 'Belo Horizonte, MG',
        rating: 4.8,
        reviews: 112,
        price: '$$$',
        imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxudXRyaXRpb25pc3QlMjB3b21lbnxlbnwxfHx8fDE3Njc5MDIzOTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
        verified: true,
      },
      {
        id: '4',
        name: 'Dra. Sofia Martins',
        specialty: 'Fisioterapeuta',
        description: 'Fisioterapia pélvica e tratamentos para saúde íntima feminina.',
        location: 'Florianópolis, SC',
        rating: 4.7,
        reviews: 89,
        price: '$$$$',
        imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaHlzaW90aGVyYXBpc3QlMjB3b21lbnxlbnwxfHx8fDE3Njc5MDIzOTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
        verified: false,
      },
    ],
  },
  carreira: {
    title: 'Carreira',
    professionals: [
      {
        id: '1',
        name: 'Ana Carolina Vieira',
        specialty: 'Mentora de Carreira',
        description: 'Mentoria profissional para mulheres LGBTQIA+ em transição de carreira.',
        location: 'São Paulo, SP',
        rating: 4.9,
        reviews: 156,
        price: '$$$',
        imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHdvbWVufGVufDF8fHx8MTc2NzkwMjM5MHww&ixlib=rb-4.1.0&q=80&w=1080',
        verified: true,
      },
      {
        id: '2',
        name: 'Mariana Castro',
        specialty: 'Coach Executiva',
        description: 'Coaching para liderança feminina e desenvolvimento de carreira.',
        location: 'São Paulo, SP',
        rating: 5.0,
        reviews: 198,
        price: '$$$$',
        imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxidXNpbmVzcyUyMHdvbWVufGVufDF8fHx8MTc2NzkwMjM5MHww&ixlib=rb-4.1.0&q=80&w=1080',
        verified: true,
      },
      {
        id: '3',
        name: 'Letícia Gomes',
        specialty: 'Consultora de RH',
        description: 'Consultoria em diversidade, inclusão e desenvolvimento organizacional.',
        location: 'Rio de Janeiro, RJ',
        rating: 4.8,
        reviews: 134,
        price: '$$$$',
        imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxidXNpbmVzcyUyMHdvbWVufGVufDF8fHx8MTc2NzkwMjM5MHww&ixlib=rb-4.1.0&q=80&w=1080',
        verified: true,
      },
      {
        id: '4',
        name: 'Gabriela Souza',
        specialty: 'Orientadora Vocacional',
        description: 'Orientação profissional e planejamento de carreira para jovens LGBTQIA+.',
        location: 'Brasília, DF',
        rating: 4.7,
        reviews: 92,
        price: '$$',
        imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxidXNpbmVzcyUyMHdvbWVufGVufDF8fHx8MTc2NzkwMjM5MHww&ixlib=rb-4.1.0&q=80&w=1080',
        verified: false,
      },
    ],
  },
};

interface ServiceCategoryListProps {
  category: string;
  onNavigate: (page: string) => void;
  onBack?: () => void;
}

export function ServiceCategoryList({ category, onNavigate, onBack }: ServiceCategoryListProps) {
  const categoryData = servicesData[category as keyof typeof servicesData] || servicesData.terapia;

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
        {/* Header fixo */}
        <Header onNavigate={onNavigate} showBackButton onBack={onBack} />

        {/* Conteúdo scrollável */}
        <div className="flex-1 overflow-y-auto pb-24 pt-24">
          {/* Título da Categoria */}
          <div className="bg-gradient-to-br from-[#A84B8E] to-[#8B3A7A] px-5 py-6">
            <h1 className="text-2xl font-bold text-white text-center mb-2">
              {categoryData.title}
            </h1>
            <p className="text-white/90 text-sm text-center">
              Profissionais qualificadas da comunidade
            </p>
          </div>

          {/* Lista de Profissionais */}
          <div className="px-5 py-6 space-y-4">
            {categoryData.professionals.map((professional) => (
              <div
                key={professional.id}
                onClick={() => onNavigate('service-details')}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex gap-4 p-4">
                  {/* Foto do Profissional */}
                  <div className="relative flex-shrink-0">
                    <ImageWithFallback
                      src={professional.imageUrl}
                      alt={professional.name}
                      className="w-24 h-24 rounded-xl object-cover"
                    />
                    {professional.verified && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#932d6f] rounded-full flex items-center justify-center">
                        <svg
                          className="w-3.5 h-3.5 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Informações do Profissional */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 mb-1 truncate">
                      {professional.name}
                    </h3>
                    <p className="text-sm text-[#932d6f] font-medium mb-2">
                      {professional.specialty}
                    </p>
                    <p className="text-xs text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                      {professional.description}
                    </p>

                    {/* Rating e Localização */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-[#932d6f] text-[#932d6f]" />
                        <span className="text-xs font-bold text-gray-900">
                          {professional.rating}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({professional.reviews})
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-bold text-[#932d6f]">
                          {professional.price}
                        </span>
                      </div>
                    </div>

                    {/* Localização */}
                    <div className="flex items-center gap-1 mt-2">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {professional.location}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Botão de Ação */}
                <div className="px-4 pb-4">
                  <button className="w-full bg-gradient-to-r from-[#932d6f] to-[#FF6B7A] text-white py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg transition-shadow">
                    Ver Perfil
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* CTA para adicionar serviço */}
          <div className="px-5 pb-6">
            <div className="bg-[#fffbfa] border border-[#932d6f]/20 rounded-2xl p-4 text-center">
              <p className="text-sm text-gray-700 mb-3">
                Você é profissional de {categoryData.title}?
              </p>
              <button className="px-6 py-2 bg-white border-2 border-[#932d6f] text-[#932d6f] rounded-full font-semibold text-sm hover:bg-[#932d6f] hover:text-white transition-colors">
                Cadastre seu Serviço
              </button>
            </div>
          </div>
        </div>

        {/* Navegação inferior fixa */}
        <BottomNav activeItem="services" onItemClick={onNavigate} />
      </div>
    </div>
  );
}
