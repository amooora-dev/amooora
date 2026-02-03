import { useState } from 'react';
import { Heart, MessageCircle, Send, MoreVertical, Loader2 } from 'lucide-react';
import { Header } from '../shared/components';
import { ImageWithFallback } from '../shared/components';
import { Tag } from '../shared/components';
import { EmptyState } from '../shared/components';
import { useAdmin } from '../shared/hooks';
import { usePost } from '../hooks/useCommunityPosts';
import { usePostLikes } from '../hooks/usePostLikes';
import { usePostReplies } from '../hooks/usePostReplies';
import { PostReply } from '../shared/types';

interface PostDetailsProps {
  postId: string;
  onNavigate: (page: string) => void;
  onBack?: () => void;
}

// Função para calcular tempo relativo
const getTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Agora';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}min atrás`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h atrás`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d atrás`;
  return date.toLocaleDateString('pt-BR');
};

// Mapear categoria para cor
const categoryColors: Record<string, string> = {
  'Apoio': '#932d6f', // Primary
  'Dicas': '#dca0c8', // Secondary (rosa claro)
  'Eventos': '#c4532f', // Accent (laranja)
  'Geral': '#3a184f', // Tertiary (roxo escuro)
};

export function PostDetails({ postId, onNavigate, onBack }: PostDetailsProps) {
  const { isAdmin } = useAdmin();
  const { post, loading: postLoading, error: postError, refetch: refetchPost } = usePost(postId);
  const { isLiked, likesCount, toggleLike } = usePostLikes({
    postId,
    userId: undefined,
    authorName: undefined,
  });
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [authorName, setAuthorName] = useState('');

  const { replies, loading: repliesLoading, addReply, refetch: refetchReplies } = usePostReplies({
    postId,
    authorName: undefined, // Será passado quando criar o comentário
  });

  const handleLike = async () => {
    await toggleLike();
  };

  const handleSendComment = async () => {
    if (!newComment.trim()) return;

    // Se não tiver nome ainda, usar o primeiro texto como nome
    if (!authorName && newComment.trim()) {
      setAuthorName(newComment.trim());
      setNewComment('');
      return;
    }

    try {
      console.log('📝 Enviando comentário...');
      await addReply(newComment, undefined, authorName || undefined);
      console.log('✅ Comentário enviado com sucesso');
      setNewComment('');
      // Recarregar tanto o post quanto as replies para garantir sincronização
      await Promise.all([refetchPost(), refetchReplies()]);
      console.log('✅ Post e replies recarregados');
    } catch (error) {
      console.error('❌ Erro ao enviar comentário:', error);
    }
  };

  const handleSendReply = async (commentId: string) => {
    if (!replyText.trim()) return;

    try {
      console.log('📝 Enviando resposta ao comentário:', commentId);
      await addReply(replyText, commentId, authorName || undefined);
      console.log('✅ Resposta enviada com sucesso');
      setReplyText('');
      setReplyingTo(null);
      // Recarregar tanto o post quanto as replies para garantir sincronização
      await Promise.all([refetchPost(), refetchReplies()]);
      console.log('✅ Post e replies recarregados');
    } catch (error) {
      console.error('❌ Erro ao enviar resposta:', error);
    }
  };

  // Loading state
  if (postLoading) {
    return (
      <div className="min-h-screen bg-muted">
        <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
          <Header onNavigate={onNavigate} isAdmin={isAdmin} showBackButton onBack={onBack} />
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (postError || !post) {
    return (
      <div className="min-h-screen bg-muted">
        <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
          <Header onNavigate={onNavigate} isAdmin={isAdmin} showBackButton onBack={onBack} />
          <div className="flex-1 flex items-center justify-center px-4">
            <EmptyState
              icon={MessageCircle}
              title="Post não encontrado"
              description={postError?.message || 'Não foi possível carregar este post.'}
            />
          </div>
        </div>
      </div>
    );
  }

  const CommentItem = ({ comment, isReply = false }: { comment: PostReply; isReply?: boolean }) => (
    <div className={isReply ? 'ml-12 mt-3' : ''}>
      <div className="flex items-start gap-3">
        <ImageWithFallback
          src={comment.author.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHx1c2VyJTIwYXZhdGFyfGVufDF8fHx8MTcwMTY1NzYwMHww&ixlib=rb-4.1.0&q=80&w=1080'}
          alt={comment.author.name}
          className={`${isReply ? 'w-8 h-8' : 'w-10 h-10'} rounded-full object-cover flex-shrink-0`}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-medium text-sm text-foreground">{comment.author.name}</p>
            <p className="text-xs text-muted-foreground">{getTimeAgo(comment.createdAt)}</p>
          </div>
          <p className="text-sm text-foreground mb-2">{comment.content}</p>
          <div className="flex items-center gap-4">
            {/* Likes em comentários ainda não implementados */}
            {comment.likes !== undefined && comment.likes > 0 && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Heart className="w-4 h-4" />
                <span className="text-xs">{comment.likes}</span>
              </div>
            )}
            {!isReply && (
              <button
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors text-xs"
              >
                Responder
              </button>
            )}
          </div>
          {/* Campo de resposta */}
          {replyingTo === comment.id && !isReply && (
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Escreva uma resposta..."
                className="flex-1 px-3 py-2 text-sm bg-muted rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-primary/20"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSendReply(comment.id);
                  }
                }}
              />
              <button
                onClick={() => handleSendReply(comment.id)}
                className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Enviar
              </button>
            </div>
          )}
          {/* Respostas aninhadas */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3">
              {comment.replies.map((reply) => (
                <CommentItem key={reply.id} comment={reply} isReply={true} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
        {/* Header fixo */}
        <Header onNavigate={onNavigate} isAdmin={isAdmin} showBackButton onBack={onBack} />
        
        {/* Conteúdo scrollável */}
        <div className="flex-1 overflow-y-auto pb-32 pt-24">
          {/* Post Principal */}
          <div className="bg-white rounded-2xl mx-5 mt-6 p-4 shadow-sm border border-border/50">
            {/* Header: Avatar, nome e badge */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <ImageWithFallback
                  src={post.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHx1c2VyJTIwYXZhdGFyfGVufDF8fHx8MTcwMTY1NzYwMHww&ixlib=rb-4.1.0&q=80&w=1080'}
                  alt={post.author?.name || 'Usuário'}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-foreground">{post.author?.name || 'Usuário'}</p>
                  <p className="text-xs text-muted-foreground">{getTimeAgo(post.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Tag color={categoryColors[post.category] || '#932d6f'}>{post.category}</Tag>
                <button className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors">
                  <MoreVertical className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Título */}
            <h1 className="font-semibold text-lg text-primary mb-3">{post.title}</h1>

            {/* Descrição completa */}
            <p className="text-sm text-foreground mb-4 leading-relaxed">{post.content}</p>

            {/* Imagem do post, se houver */}
            {post.image && (
              <div className="mb-4 rounded-xl overflow-hidden">
                <ImageWithFallback
                  src={post.image}
                  alt={post.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}

            {/* Footer: Likes e respostas */}
            <div className="flex items-center gap-6 pt-4 border-t border-border">
              <button
                onClick={handleLike}
                className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors"
              >
                <Heart
                  className={`w-5 h-5 ${isLiked ? 'fill-accent text-accent' : ''}`}
                />
                <span className="text-sm font-medium">{likesCount}</span>
              </button>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm">{post.repliesCount} respostas</span>
              </div>
            </div>
          </div>

          {/* Lista de Comentários */}
          <div className="px-5 mt-6">
            <h2 className="font-semibold text-foreground mb-4">
              {replies.length} {replies.length === 1 ? 'resposta' : 'respostas'}
            </h2>
            
            {repliesLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              </div>
            ) : replies.length === 0 ? (
              <EmptyState
                icon={MessageCircle}
                title="Nenhum comentário ainda"
                description="Seja o primeiro a comentar!"
              />
            ) : (
              <div className="space-y-4">
                {replies.map((comment) => (
                  <CommentItem key={comment.id} comment={comment} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Campo de Comentário Fixo */}
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-border px-5 py-4">
          <div className="flex items-center gap-3">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NzgzNDM1MHww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Seu avatar"
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={authorName ? "Escreva um comentário..." : "Digite seu nome e depois o comentário"}
              className="flex-1 px-4 py-2 bg-muted rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && newComment.trim()) {
                  // Se não tiver nome e for a primeira vez, usar o comentário como nome
                  if (!authorName && newComment.trim()) {
                    setAuthorName(newComment.trim());
                    setNewComment('');
                  } else {
                    handleSendComment();
                  }
                }
              }}
            />
            <button
              onClick={handleSendComment}
              disabled={!newComment.trim()}
              className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          {authorName && (
            <div className="mt-2 text-xs text-muted-foreground text-center">
              Comentando como: <span className="font-medium">{authorName}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
