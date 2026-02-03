/**
 * Utilitário para compartilhamento de conteúdo
 * Usa Web Share API quando disponível, fallback para copiar link
 */

export interface ShareData {
  title: string;
  text: string;
  url?: string;
}

export const shareContent = async (data: ShareData): Promise<boolean> => {
  const shareUrl = data.url || window.location.href;

  // Verificar se Web Share API está disponível (dispositivos móveis principalmente)
  if (navigator.share && navigator.canShare) {
    try {
      const shareData: ShareData = {
        title: data.title,
        text: data.text,
        url: shareUrl,
      };

      // Verificar se os dados podem ser compartilhados
      if (navigator.canShare(shareData)) {
        await navigator.share(shareData);
        return true;
      }
    } catch (error: any) {
      // Usuário cancelou ou erro no share
      if (error.name !== 'AbortError') {
        console.error('Erro ao compartilhar:', error);
      }
      // Fallback para copiar link
    }
  }

  // Fallback: copiar link para área de transferência
  try {
    await navigator.clipboard.writeText(shareUrl);
    return true;
  } catch (error) {
    console.error('Erro ao copiar link:', error);
    // Fallback final: usar método antigo
    try {
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (fallbackError) {
      console.error('Erro no fallback de copiar:', fallbackError);
      return false;
    }
  }
};

/**
 * Gerar URL de compartilhamento para um item específico
 * Usa formato de URL padrão com barra para facilitar roteamento
 */
export const getShareUrl = (type: 'place' | 'event' | 'service' | 'community', id: string): string => {
  const baseUrl = window.location.origin;
  if (type === 'community') {
    return `${baseUrl}/#/community-details/${id}`;
  }
  return `${baseUrl}/#/${type}-details/${id}`;
};

/**
 * Gerar texto de compartilhamento padrão
 */
export const getShareText = (type: 'place' | 'event' | 'service' | 'community', name: string): string => {
  const messages = {
    place: `Confira este local LGBTQIA+ friendly: ${name}`,
    event: `Não perca este evento: ${name}`,
    service: `Confira este serviço: ${name}`,
    community: `Confira esta comunidade: ${name}`,
  };
  return messages[type];
};
