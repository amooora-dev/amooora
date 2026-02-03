import { Place } from '../types';
import { supabase } from '../../../infra/supabase';

export const getPlaces = async (
  limit?: number,
  offset?: number
): Promise<{ data: Place[]; hasMore: boolean }> => {
  try {
    console.log('🔍 Buscando locais do Supabase...');
    console.log('🔗 URL:', import.meta.env.VITE_SUPABASE_URL);
    
    // Primeiro, tentar buscar TODOS os locais (sem filtro is_safe) - FALLBACK
    let allQuery = supabase
      .from('places')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (limit) {
      allQuery = allQuery.limit(limit);
    }
    if (offset) {
      allQuery = allQuery.range(offset, offset + (limit || 1000) - 1);
    }
    
    const { data: allData, error: allError } = await allQuery;
    
    if (!allError && allData && allData.length > 0) {
      console.log(`📊 Total de locais no banco (sem filtros): ${allData.length}`);
      console.log('📋 Exemplo de local encontrado:', {
        id: allData[0].id,
        name: allData[0].name,
        is_safe: allData[0].is_safe,
      });
    }
    
    // Agora tentar buscar com o filtro is_safe
    let query = supabase
      .from('places')
      .select('*')
      .eq('is_safe', true)
      .order('created_at', { ascending: false });
    
    if (limit) {
      query = query.limit(limit);
    }
    if (offset) {
      query = query.range(offset, offset + (limit || 1000) - 1);
    }
    
    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      if (error) {
        console.error('❌ Erro ao buscar locais (com filtro is_safe=true):', {
          message: error.message,
          code: error.code,
        });
      }
      
      if (allData && allData.length > 0) {
        console.warn('⚠️ Usando fallback: retornando todos os locais (sem filtro is_safe)');
        console.log(`✅ Retornando ${allData.length} locais (fallback)`);
        
        const mappedPlaces = allData.map((place) => ({
          id: place.id,
          name: place.name,
          description: place.description || undefined,
          image: place.image,
          imageUrl: place.image,
          address: place.address || undefined,
          rating: Number(place.rating) || 0,
          category: place.category,
          latitude: place.latitude ? Number(place.latitude) : undefined,
          longitude: place.longitude ? Number(place.longitude) : undefined,
          reviewCount: place.review_count || 0,
          isSafe: place.is_safe ?? true,
          distance: undefined,
        }));
        
        const hasMore = limit ? allData.length === limit : false;
        return { data: mappedPlaces, hasMore };
      }
      
      console.warn('⚠️ Nenhum local encontrado no banco');
      return { data: [], hasMore: false };
    }

    console.log(`✅ Locais encontrados (com filtro is_safe=true): ${data.length}`);

    const hasMore = limit ? data.length === limit : false;

    const mappedPlaces = data.map((place) => ({
      id: place.id,
      name: place.name,
      description: place.description || undefined,
      image: place.image,
      imageUrl: place.image,
      address: place.address || undefined,
      rating: Number(place.rating) || 0,
      category: place.category,
      latitude: place.latitude ? Number(place.latitude) : undefined,
      longitude: place.longitude ? Number(place.longitude) : undefined,
      reviewCount: place.review_count || 0,
      isSafe: place.is_safe ?? true,
      distance: undefined,
    }));

    return { data: mappedPlaces, hasMore };
  } catch (error) {
    console.error('❌ Erro ao buscar locais:', error);
    try {
      const { data: fallbackData } = await supabase.from('places').select('*');
      if (fallbackData && fallbackData.length > 0) {
        console.warn('⚠️ Usando fallback final: retornando todos os locais');
        const fallbackPlaces = fallbackData.map((place) => ({
          id: place.id,
          name: place.name,
          description: place.description || undefined,
          image: place.image,
          imageUrl: place.image,
          address: place.address || undefined,
          rating: Number(place.rating) || 0,
          category: place.category,
          latitude: place.latitude ? Number(place.latitude) : undefined,
          longitude: place.longitude ? Number(place.longitude) : undefined,
          reviewCount: place.review_count || 0,
          isSafe: place.is_safe ?? true,
          distance: undefined,
        }));
        return { data: fallbackPlaces, hasMore: false };
      }
    } catch (fallbackError) {
      console.error('❌ Erro no fallback:', fallbackError);
    }
    return { data: [], hasMore: false };
  }
};

export const createPlace = async (placeData: {
  name: string;
  description?: string;
  image: string;
  address?: string;
  category: string;
  latitude?: number;
  longitude?: number;
  isSafe?: boolean;
}): Promise<Place> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;

    const { data, error } = await supabase
      .from('places')
      .insert({
        name: placeData.name,
        description: placeData.description || null,
        image: placeData.image,
        address: placeData.address || null,
        category: placeData.category,
        latitude: placeData.latitude || null,
        longitude: placeData.longitude || null,
        is_safe: placeData.isSafe ?? true,
        created_by: userId || null,
        rating: 0,
        review_count: 0,
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar local:', error);
      throw new Error(`Erro ao criar local: ${error.message}`);
    }

    if (!data) {
      throw new Error('Erro ao criar local: nenhum dado retornado');
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description || undefined,
      image: data.image,
      imageUrl: data.image,
      address: data.address || undefined,
      rating: Number(data.rating) || 0,
      category: data.category,
      latitude: data.latitude ? Number(data.latitude) : undefined,
      longitude: data.longitude ? Number(data.longitude) : undefined,
      reviewCount: data.review_count || 0,
      isSafe: data.is_safe ?? true,
    };
  } catch (error) {
    console.error('Erro ao criar local:', error);
    throw error;
  }
};

export const updatePlace = async (
  id: string,
  placeData: {
    name?: string;
    description?: string;
    image?: string;
    address?: string;
    category?: string;
    latitude?: number;
    longitude?: number;
    isSafe?: boolean;
    rating?: number;
  }
): Promise<Place> => {
  try {
    const updateData: any = {};
    
    if (placeData.name !== undefined) updateData.name = placeData.name;
    if (placeData.description !== undefined) updateData.description = placeData.description || null;
    if (placeData.image !== undefined) updateData.image = placeData.image || null;
    if (placeData.address !== undefined) updateData.address = placeData.address || null;
    if (placeData.category !== undefined) updateData.category = placeData.category;
    if (placeData.latitude !== undefined) updateData.latitude = placeData.latitude || null;
    if (placeData.longitude !== undefined) updateData.longitude = placeData.longitude || null;
    if (placeData.isSafe !== undefined) updateData.is_safe = placeData.isSafe;
    if (placeData.rating !== undefined) updateData.rating = placeData.rating;

    const { data, error } = await supabase
      .from('places')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar local:', error);
      throw new Error(`Erro ao atualizar local: ${error.message}`);
    }

    if (!data) {
      throw new Error('Erro ao atualizar local: nenhum dado retornado');
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description || undefined,
      image: data.image,
      imageUrl: data.image,
      address: data.address || undefined,
      rating: Number(data.rating) || 0,
      category: data.category,
      latitude: data.latitude ? Number(data.latitude) : undefined,
      longitude: data.longitude ? Number(data.longitude) : undefined,
      reviewCount: data.review_count || 0,
      isSafe: data.is_safe ?? true,
    };
  } catch (error) {
    console.error('Erro ao atualizar local:', error);
    throw error;
  }
};

export const getPlaceById = async (id: string): Promise<Place | null> => {
  try {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      console.warn(`ID inválido (não é UUID): ${id}`);
      return null;
    }

    console.log(`Buscando local pelo ID: ${id}`);
    
    const { data, error } = await supabase
      .from('places')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        console.log('Local não encontrado');
        return null;
      }
      console.error('Erro detalhado ao buscar local:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      throw new Error(`Erro ao buscar local: ${error.message}`);
    }

    if (!data) {
      console.log('Local não encontrado (data vazio)');
      return null;
    }

    console.log(`Local encontrado: ${data.name}`);

    return {
      id: data.id,
      name: data.name,
      description: data.description || undefined,
      image: data.image,
      imageUrl: data.image,
      address: data.address || undefined,
      rating: Number(data.rating) || 0,
      category: data.category,
      latitude: data.latitude ? Number(data.latitude) : undefined,
      longitude: data.longitude ? Number(data.longitude) : undefined,
      reviewCount: data.review_count || 0,
      isSafe: data.is_safe ?? true,
      distance: undefined,
    };
  } catch (error) {
    console.error('Erro ao buscar local:', error);
    throw error;
  }
};

