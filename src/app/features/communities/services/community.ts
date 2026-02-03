import { supabase } from '../../../infra/supabase';
import { CommunityPost, PostReply } from '../../../shared/types';

// Buscar posts da comunidade ordenados por relevância
export const getCommunityPosts = async (
  category?: string,
  limit?: number,
  offset?: number
): Promise<{ data: CommunityPost[]; hasMore: boolean }> => {
  try {
    let query = supabase
      .from('community_posts')
      .select(`
        *,
        profiles:user_id (
          id,
          name,
          avatar
        )
      `)
      .order('is_trending', { ascending: false })
      .order('likes_count', { ascending: false })
      .order('replies_count', { ascending: false })
      .order('created_at', { ascending: false });

    // Filtrar por categoria se fornecida
    if (category && category !== 'Todos') {
      query = query.eq('category', category);
    }

    // Aplicar paginação
    if (limit) {
      query = query.limit(limit);
    }
    if (offset) {
      query = query.range(offset, offset + (limit || 50) - 1);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erro ao buscar posts da comunidade:', error);
      throw new Error(`Erro ao buscar posts: ${error.message}`);
    }

    const posts: CommunityPost[] = (data || []).map((post: any) => ({
      id: post.id,
      userId: post.user_id,
      title: post.title,
      content: post.content,
      category: post.category,
      image: post.image || undefined,
      likesCount: post.likes_count || 0,
      repliesCount: post.replies_count || 0,
      isTrending: post.is_trending || false,
      createdAt: post.created_at,
      author: post.profiles
        ? {
            name: post.profiles.name || 'Usuário',
            avatar: post.profiles.avatar || undefined,
          }
        : undefined,
    }));

    // Verificar se há mais resultados
    const hasMore = data ? data.length === (limit || 50) : false;

    return { data: posts, hasMore };
  } catch (error) {
    console.error('Erro ao buscar posts da comunidade:', error);
    throw error;
  }
};

// Buscar post específico por ID
export const getPostById = async (postId: string): Promise<CommunityPost | null> => {
  try {
    const { data, error } = await supabase
      .from('community_posts')
      .select(`
        *,
        profiles:user_id (
          id,
          name,
          avatar
        )
      `)
      .eq('id', postId)
      .single();

    if (error) {
      console.error('Erro ao buscar post:', error);
      throw new Error(`Erro ao buscar post: ${error.message}`);
    }

    if (!data) return null;

    return {
      id: data.id,
      userId: data.user_id,
      title: data.title,
      content: data.content,
      category: data.category,
      image: data.image || undefined,
      likesCount: data.likes_count || 0,
      repliesCount: data.replies_count || 0,
      isTrending: data.is_trending || false,
      createdAt: data.created_at,
      author: data.profiles
        ? {
            name: data.profiles.name || 'Usuário',
            avatar: data.profiles.avatar || undefined,
          }
        : undefined,
    };
  } catch (error) {
    console.error('Erro ao buscar post:', error);
    throw error;
  }
};

// Buscar replies/comentários de um post
export const getPostReplies = async (postId: string): Promise<PostReply[]> => {
  try {
    const { data, error } = await supabase
      .from('post_replies')
      .select(`
        *,
        profiles:user_id (
          id,
          name,
          avatar
        )
      `)
      .eq('post_id', postId)
      .is('parent_reply_id', null) // Apenas comentários principais primeiro
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Erro ao buscar replies:', error);
      throw new Error(`Erro ao buscar replies: ${error.message}`);
    }

    const replies: PostReply[] = (data || []).map((reply: any) => ({
      id: reply.id,
      postId: reply.post_id,
      userId: reply.user_id || undefined,
      authorName: reply.profiles?.name || reply.author_name || 'Usuário',
      content: reply.content,
      parentReplyId: reply.parent_reply_id || undefined,
      createdAt: reply.created_at,
      author: reply.profiles
        ? {
            name: reply.profiles.name || 'Usuário',
            avatar: reply.profiles.avatar || undefined,
          }
        : {
            name: reply.author_name || 'Usuário',
            avatar: undefined,
          },
      likes: 0, // Por enquanto sem sistema de likes em replies
      replies: [], // Será preenchido na próxima chamada se necessário
    }));

    // Buscar replies aninhadas para cada comentário principal
    for (const reply of replies) {
      const nestedReplies = await getNestedReplies(reply.id);
      reply.replies = nestedReplies;
    }

    return replies;
  } catch (error) {
    console.error('Erro ao buscar replies:', error);
    throw error;
  }
};

// Buscar replies aninhadas (respostas de respostas)
const getNestedReplies = async (parentReplyId: string): Promise<PostReply[]> => {
  try {
    const { data, error } = await supabase
      .from('post_replies')
      .select(`
        *,
        profiles:user_id (
          id,
          name,
          avatar
        )
      `)
      .eq('parent_reply_id', parentReplyId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Erro ao buscar replies aninhadas:', error);
      return [];
    }

    return (data || []).map((reply: any) => ({
      id: reply.id,
      postId: reply.post_id,
      userId: reply.user_id || undefined,
      authorName: reply.profiles?.name || reply.author_name || 'Usuário',
      content: reply.content,
      parentReplyId: reply.parent_reply_id || undefined,
      createdAt: reply.created_at,
      author: reply.profiles
        ? {
            name: reply.profiles.name || 'Usuário',
            avatar: reply.profiles.avatar || undefined,
          }
        : {
            name: reply.author_name || 'Usuário',
            avatar: undefined,
          },
      likes: 0,
      replies: [],
    }));
  } catch (error) {
    console.error('Erro ao buscar replies aninhadas:', error);
    return [];
  }
};

// Criar nova reply/comentário
export const createReply = async (
  postId: string,
  content: string,
  parentReplyId?: string,
  authorName?: string
): Promise<PostReply> => {
  try {
    console.log('📝 Criando reply para post:', postId);
    console.log('📝 Conteúdo:', content.substring(0, 50) + '...');
    console.log('📝 parentReplyId:', parentReplyId);
    console.log('📝 authorName:', authorName);
    
    // Buscar usuário atual (pode ser null se não estiver logado)
    const { data: { user } } = await supabase.auth.getUser();
    console.log('👤 Usuário logado:', user ? user.id : 'Não logado');

    const replyData: any = {
      post_id: postId,
      content: content.trim(),
    };

    // Se houver parent_reply_id, adicionar
    if (parentReplyId) {
      replyData.parent_reply_id = parentReplyId;
    }

    // Se não estiver logado, usar nome opcional
    if (!user && authorName) {
      replyData.user_id = null;
      replyData.author_name = authorName.trim();
    } else if (user) {
      replyData.user_id = user.id;
    } else {
      // Se não tem usuário nem nome, usar "Visitante"
      replyData.author_name = 'Visitante';
    }

    console.log('📤 Dados do reply a inserir:', replyData);

    const { data, error } = await supabase
      .from('post_replies')
      .insert(replyData)
      .select(`
        *,
        profiles:user_id (
          id,
          name,
          avatar
        )
      `)
      .single();

    if (error) {
      console.error('❌ Erro ao criar reply:', error);
      console.error('❌ Código do erro:', error.code);
      console.error('❌ Mensagem do erro:', error.message);
      console.error('❌ Detalhes do erro:', error.details);
      throw new Error(`Erro ao criar comentário: ${error.message}`);
    }

    console.log('✅ Reply criado com sucesso:', data?.id);

    // Atualizar contador de replies no post
    try {
      // Tentar usar a função RPC com diferentes nomes de parâmetro
      let rpcError: any = null;
      try {
        const { error } = await supabase.rpc('increment_replies_count', { 
          post_id_param: postId 
        });
        rpcError = error;
      } catch (e) {
        // Se falhar, tentar com outro nome de parâmetro
        try {
          const { error } = await supabase.rpc('increment_replies_count', { 
            post_id: postId 
          });
          rpcError = error;
        } catch (e2) {
          rpcError = e2;
        }
      }
      
      if (rpcError) {
        console.warn('⚠️ Erro ao chamar RPC increment_replies_count, tentando update manual:', rpcError);
        
        // Fallback: atualizar manualmente
        const { data: postData, error: selectError } = await supabase
          .from('community_posts')
          .select('replies_count')
          .eq('id', postId)
          .single();

        if (selectError) {
          console.error('❌ Erro ao buscar post para atualizar contador:', selectError);
        } else if (postData) {
          const newCount = (postData.replies_count || 0) + 1;
          console.log('📊 Atualizando contador de replies para:', newCount);
          
          const { error: updateError } = await supabase
            .from('community_posts')
            .update({ replies_count: newCount })
            .eq('id', postId);

          if (updateError) {
            console.error('❌ Erro ao atualizar contador de replies:', updateError);
          } else {
            console.log('✅ Contador de replies atualizado com sucesso');
          }
        }
      } else {
        console.log('✅ Contador de replies incrementado via RPC');
      }
    } catch (rpcError) {
      console.error('❌ Erro ao incrementar contador de replies:', rpcError);
    }

    return {
      id: data.id,
      postId: data.post_id,
      userId: data.user_id || undefined,
      authorName: data.profiles?.name || data.author_name || authorName || 'Usuário',
      content: data.content,
      parentReplyId: data.parent_reply_id || undefined,
      createdAt: data.created_at,
      author: data.profiles
        ? {
            name: data.profiles.name || 'Usuário',
            avatar: data.profiles.avatar || undefined,
          }
        : {
            name: data.author_name || authorName || 'Usuário',
            avatar: undefined,
          },
      likes: 0,
      replies: [],
    };
  } catch (error) {
    console.error('Erro ao criar reply:', error);
    throw error;
  }
};

// Verificar se usuário curtiu um post
export const checkPostLike = async (postId: string, userId?: string): Promise<boolean> => {
  try {
    // Se não houver userId (sem login), usar localStorage como fallback
    if (!userId) {
      const likedPosts = JSON.parse(localStorage.getItem('amooora_post_likes') || '[]');
      return likedPosts.includes(postId);
    }

    const { data, error } = await supabase
      .from('post_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows returned, o que é OK
      console.error('Erro ao verificar like:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Erro ao verificar like:', error);
    return false;
  }
};

// Adicionar/remover like de um post
export const togglePostLike = async (
  postId: string,
  userId?: string,
  authorName?: string
): Promise<{ liked: boolean; likesCount: number }> => {
  try {
    // Se não houver userId (sem login), usar localStorage como fallback
    if (!userId) {
      const likedPosts: string[] = JSON.parse(localStorage.getItem('amooora_post_likes') || '[]');
      const isLiked = likedPosts.includes(postId);

      if (isLiked) {
        // Remover like
        const newLikedPosts = likedPosts.filter((id) => id !== postId);
        localStorage.setItem('amooora_post_likes', JSON.stringify(newLikedPosts));

        // Decrementar contador no banco (sem associar a usuário)
        const { data: postData } = await supabase
          .from('community_posts')
          .select('likes_count')
          .eq('id', postId)
          .single();

        if (postData) {
          await supabase
            .from('community_posts')
            .update({ likes_count: Math.max(0, (postData.likes_count || 0) - 1) })
            .eq('id', postId);
        }

        return {
          liked: false,
          likesCount: Math.max(0, (postData?.likes_count || 1) - 1),
        };
      } else {
        // Adicionar like
        likedPosts.push(postId);
        localStorage.setItem('amooora_post_likes', JSON.stringify(likedPosts));

        // Incrementar contador no banco
        const { data: postData } = await supabase
          .from('community_posts')
          .select('likes_count')
          .eq('id', postId)
          .single();

        if (postData) {
          await supabase
            .from('community_posts')
            .update({ likes_count: (postData.likes_count || 0) + 1 })
            .eq('id', postId);
        }

        return {
          liked: true,
          likesCount: (postData?.likes_count || 0) + 1,
        };
      }
    }

    // Com userId (login implementado), usar banco de dados
    const isLiked = await checkPostLike(postId, userId);

    if (isLiked) {
      // Remover like
      const { error } = await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId);

      if (error) {
        console.error('Erro ao remover like:', error);
        throw new Error(`Erro ao remover like: ${error.message}`);
      }

      // Decrementar contador (trigger deve fazer isso automaticamente, mas garantir)
      const { data: postData } = await supabase
        .from('community_posts')
        .select('likes_count')
        .eq('id', postId)
        .single();

      if (postData) {
        await supabase
          .from('community_posts')
          .update({ likes_count: Math.max(0, (postData.likes_count || 0) - 1) })
          .eq('id', postId);
      }

      return {
        liked: false,
        likesCount: Math.max(0, (postData?.likes_count || 1) - 1),
      };
    } else {
      // Adicionar like
      const { error } = await supabase
        .from('post_likes')
        .insert({
          post_id: postId,
          user_id: userId,
        });

      if (error) {
        console.error('Erro ao adicionar like:', error);
        throw new Error(`Erro ao adicionar like: ${error.message}`);
      }

      // Incrementar contador (trigger deve fazer isso automaticamente, mas garantir)
      const { data: postData } = await supabase
        .from('community_posts')
        .select('likes_count')
        .eq('id', postId)
        .single();

      if (postData) {
        await supabase
          .from('community_posts')
          .update({ likes_count: (postData.likes_count || 0) + 1 })
          .eq('id', postId);
      }

      return {
        liked: true,
        likesCount: (postData?.likes_count || 0) + 1,
      };
    }
  } catch (error) {
    console.error('Erro ao alternar like:', error);
    throw error;
  }
};

// Criar novo post na comunidade
export const createPost = async (
  title: string,
  content: string,
  category: string,
  image?: string,
  authorName?: string
): Promise<CommunityPost> => {
  try {
    // Buscar usuário atual (pode ser null se não estiver logado)
    const { data: { user } } = await supabase.auth.getUser();

    const postData: any = {
      title: title.trim(),
      content: content.trim(),
      category: category,
      likes_count: 0,
      replies_count: 0,
      is_trending: false,
    };

    // Adicionar imagem se fornecida
    if (image) {
      postData.image = image;
    }

    // Se não estiver logado, precisamos de um user_id válido
    // Por enquanto, usar o primeiro usuário disponível ou criar um post sem user_id (se permitido)
    if (!user) {
      // Buscar um usuário padrão ou usar null (precisa verificar se a tabela permite)
      const { data: defaultUser } = await supabase
        .from('profiles')
        .select('id')
        .limit(1)
        .single();
      
      if (defaultUser) {
        postData.user_id = defaultUser.id;
      } else {
        throw new Error('Não é possível criar post sem usuário. Por favor, faça login.');
      }
    } else {
      postData.user_id = user.id;
    }

    const { data, error } = await supabase
      .from('community_posts')
      .insert(postData)
      .select(`
        *,
        profiles:user_id (
          id,
          name,
          avatar
        )
      `)
      .single();

    if (error) {
      console.error('Erro ao criar post:', error);
      throw new Error(`Erro ao criar post: ${error.message}`);
    }

    return {
      id: data.id,
      userId: data.user_id,
      title: data.title,
      content: data.content,
      category: data.category,
      image: data.image || undefined,
      likesCount: data.likes_count || 0,
      repliesCount: data.replies_count || 0,
      isTrending: data.is_trending || false,
      createdAt: data.created_at,
      author: data.profiles
        ? {
            name: data.profiles.name || 'Usuário',
            avatar: data.profiles.avatar || undefined,
          }
        : undefined,
    };
  } catch (error) {
    console.error('Erro ao criar post:', error);
    throw error;
  }
};
