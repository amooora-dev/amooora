import { supabase } from './supabase';

/**
 * Faz upload de uma imagem para o Supabase Storage
 * @param file Arquivo de imagem a ser enviado
 * @param bucket Nome do bucket (ex: 'places', 'services', 'events')
 * @param folder Pasta dentro do bucket (opcional)
 * @returns URL pública da imagem ou erro
 */
export async function uploadImage(
  file: File,
  bucket: string,
  folder?: string
): Promise<{ url: string; error: null } | { url: null; error: string }> {
  try {
    // Validar tipo de arquivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return {
        url: null,
        error: 'Tipo de arquivo inválido. Use JPG, PNG, WEBP ou GIF.',
      };
    }

    // Validar tamanho (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB em bytes
    if (file.size > maxSize) {
      return {
        url: null,
        error: 'Arquivo muito grande. Tamanho máximo: 5MB.',
      };
    }

    // Gerar nome único para o arquivo
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExt = file.name.split('.').pop();
    const fileName = `${timestamp}-${randomString}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    // Fazer upload do arquivo
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Erro ao fazer upload:', error);
      return {
        url: null,
        error: `Erro ao fazer upload: ${error.message}`,
      };
    }

    // Obter URL pública da imagem
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return {
      url: publicUrl,
      error: null,
    };
  } catch (error) {
    console.error('Erro ao fazer upload de imagem:', error);
    return {
      url: null,
      error: error instanceof Error ? error.message : 'Erro desconhecido ao fazer upload',
    };
  }
}

/**
 * Remove uma imagem do Supabase Storage
 * @param bucket Nome do bucket
 * @param filePath Caminho do arquivo no bucket
 */
export async function deleteImage(bucket: string, filePath: string): Promise<void> {
  try {
    await supabase.storage.from(bucket).remove([filePath]);
  } catch (error) {
    console.error('Erro ao deletar imagem:', error);
  }
}
