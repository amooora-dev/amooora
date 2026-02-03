import { useState, useEffect } from 'react';
import { getPostReplies, createReply } from '../services/community';
import { PostReply } from '../types';

interface UsePostRepliesOptions {
  postId: string;
  authorName?: string;
}

export const usePostReplies = (options: UsePostRepliesOptions) => {
  const { postId, authorName } = options;
  const [replies, setReplies] = useState<PostReply[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadReplies = async () => {
    try {
      setLoading(true);
      const data = await getPostReplies(postId);
      setReplies(data);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar replies:', err);
      setError(err instanceof Error ? err : new Error('Erro desconhecido'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReplies();
  }, [postId]);

  const addReply = async (content: string, parentReplyId?: string, replyAuthorName?: string) => {
    try {
      setLoading(true);
      const finalAuthorName = replyAuthorName || authorName;
      const newReply = await createReply(postId, content, parentReplyId, finalAuthorName);
      
      // Recarregar todas as replies do banco para garantir sincronização
      // Isso é mais confiável do que tentar atualizar manualmente o estado
      await loadReplies();

      setError(null);
      return newReply;
    } catch (err) {
      console.error('Erro ao criar reply:', err);
      setError(err instanceof Error ? err : new Error('Erro desconhecido'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    replies,
    loading,
    error,
    addReply,
    refetch: loadReplies,
  };
};
