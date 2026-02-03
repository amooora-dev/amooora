import { useState, useEffect } from 'react';
import { Send, ChevronDown, Globe } from 'lucide-react';
import { ImageWithFallback } from '../../../shared/components';

export interface Community {
  id: string;
  name: string;
  avatar?: string;
}

interface CreatePostFormProps {
  communities: Community[];
  userAvatar?: string;
  defaultCommunityId?: string;
  onSubmit: (content: string, communityId: string) => Promise<void>;
}

export function CreatePostForm({ communities, userAvatar, defaultCommunityId, onSubmit }: CreatePostFormProps) {
  const [content, setContent] = useState('');
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(
    defaultCommunityId ? communities.find(c => c.id === defaultCommunityId) || null : null
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Atualizar comunidade selecionada quando defaultCommunityId mudar
  useEffect(() => {
    if (defaultCommunityId && communities.length > 0) {
      const community = communities.find(c => c.id === defaultCommunityId);
      if (community) {
        setSelectedCommunity(community);
      }
    }
  }, [defaultCommunityId, communities]);

  const handleSubmit = async () => {
    if (!content.trim() || !selectedCommunity) return;

    setIsSubmitting(true);
    try {
      await onSubmit(content, selectedCommunity.id);
      setContent('');
      setSelectedCommunity(null);
    } catch (error) {
      console.error('Erro ao criar post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-5 mb-6">
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-border/50">
        {/* Avatar e campo de texto */}
        <div className="flex items-start gap-3 mb-3">
          <ImageWithFallback
            src={userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHx1c2VyJTIwYXZhdGFyfGVufDF8fHx8MTcwMTY1NzYwMHww&ixlib=rb-4.1.0&q=80&w=1080'}
            alt="Seu avatar"
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          />
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escreve seu post aqui"
              className="w-full px-0 py-2 bg-transparent border-0 focus:outline-none text-sm resize-none min-h-[60px] placeholder:text-muted-foreground"
              rows={2}
            />
          </div>
        </div>

        {/* Linha separadora */}
        <div className="border-t border-gray-200 mb-3"></div>

        {/* Seletor de comunidade e botão publicar */}
        <div className="flex items-center gap-3">
          {communities.length > 1 ? (
            <div className="relative flex-1">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full px-3 py-2 bg-transparent border-0 focus:outline-none text-sm text-foreground flex items-center gap-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Globe className="w-4 h-4 text-muted-foreground" />
                <span className={selectedCommunity ? 'text-foreground' : 'text-muted-foreground'}>
                  {selectedCommunity ? selectedCommunity.name : 'Escolher comunidade'}
                </span>
                <ChevronDown className={`w-4 h-4 text-muted-foreground ml-auto transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

            {/* Dropdown de comunidades */}
            {isDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsDropdownOpen(false)}
                />
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-border/50 z-20 max-h-60 overflow-y-auto">
                  {communities.map((community) => (
                    <button
                      key={community.id}
                      onClick={() => {
                        setSelectedCommunity(community);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-muted transition-colors text-left"
                    >
                      {community.avatar && (
                        <ImageWithFallback
                          src={community.avatar}
                          alt={community.name}
                          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                        />
                      )}
                      <span className="text-sm font-medium text-foreground">{community.name}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
            </div>
          ) : selectedCommunity ? (
            <div className="flex-1 flex items-center gap-2 px-3 py-2">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-foreground">{selectedCommunity.name}</span>
            </div>
          ) : null}

          <button
            onClick={handleSubmit}
            disabled={!content.trim() || !selectedCommunity || isSubmitting}
            className="px-6 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Publicar
          </button>
        </div>
      </div>
    </div>
  );
}
