import { Service } from '../../shared/types';
import { supabase } from '../../../infra/supabase';

export const getServices = async (): Promise<Service[]> => {
  try {
    console.log('🔍 Buscando serviços do Supabase...');
    
    // Primeiro, tentar uma query muito simples para verificar conectividade
    console.log('🔍 Testando conectividade básica...');
    const { data: testData, error: testError } = await supabase
      .from('services')
      .select('id')
      .limit(1);
    
    if (testError) {
      console.error('❌ Erro de conectividade/RLS:', {
        message: testError.message,
        code: testError.code,
        details: testError.details,
        hint: testError.hint,
      });
      
      // Se for erro de RLS, fornecer dica
      if (testError.code === '42501' || testError.message?.includes('row-level security')) {
        console.error('🚨 ERRO DE RLS: As políticas Row Level Security estão bloqueando a query!');
        console.error('📝 SOLUÇÃO: Execute o SQL para permitir SELECT público na tabela services:');
        console.error(`
          CREATE POLICY "Permitir SELECT público em services"
          ON services FOR SELECT
          USING (true);
        `);
        throw new Error('Erro de RLS: A tabela services não permite SELECT público. Verifique as políticas RLS no Supabase.');
      }
      
      throw new Error(`Erro ao buscar serviços: ${testError.message} (Código: ${testError.code})`);
    }
    
    console.log('✅ Conectividade OK, buscando todos os serviços...');
    
    // Buscar serviços aprovados na curadoria
    const { data: allData, error: allError } = await supabase
      .from('services')
      .select('*')
      .eq('curation_status', 'approved')
      .order('created_at', { ascending: false })
      .limit(100);
    
    if (allError) {
      console.error('❌ Erro ao buscar serviços:', {
        message: allError.message,
        code: allError.code,
        details: allError.details,
      });
      throw new Error(`Erro ao buscar serviços: ${allError.message}`);
    }

    if (!allData || allData.length === 0) {
      console.warn('⚠️ Nenhum serviço encontrado no banco (tabela vazia)');
      return [];
    }

    console.log(`✅ Total de serviços encontrados: ${allData.length}`);

    // Filtrar apenas serviços ativos no frontend (mais rápido)
    const activeServices = allData.filter((service) => service.is_active !== false);

    console.log(`✅ Serviços ativos após filtro: ${activeServices.length}`);

    return activeServices.map((service) => ({
      id: service.id,
      name: service.name,
      description: service.description || '',
      image: service.image || undefined,
      imageUrl: service.image || undefined,
      price: service.price ? Number(service.price) : undefined,
      category: service.category || 'Outros',
      categorySlug: service.category_slug || (service.category?.toLowerCase().replace(/\s+/g, '-') || 'outros'),
      rating: Number(service.rating) || 0,
      provider: service.provider || undefined,
      phone: service.phone || undefined,
      whatsapp: service.whatsapp || undefined,
      address: service.address || undefined,
      specialties: service.specialties ? (Array.isArray(service.specialties) ? service.specialties : []) : undefined,
      hours: service.hours || undefined,
    }));
  } catch (error) {
    console.error('❌ Erro fatal ao buscar serviços:', error);
    
    // Se for erro conhecido, relançar para exibir mensagem mais clara
    if (error instanceof Error && error.message.includes('RLS')) {
      throw error;
    }
    
    // Para outros erros, retornar array vazio para não quebrar a UI
    console.warn('⚠️ Retornando array vazio devido a erro');
    return [];
  }
};

export const getServiceById = async (id: string): Promise<Service | null> => {
  try {
    // Validar se o ID é um UUID válido
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      console.warn(`⚠️ ID inválido (não é UUID): ${id}`);
      return null;
    }

    console.log(`🔍 Buscando serviço pelo ID: ${id}`);
    
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        console.log('⚠️ Serviço não encontrado (PGRST116)');
        return null;
      }
      
      console.error('❌ Erro detalhado ao buscar serviço:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      
      // Se for erro de RLS, tentar buscar sem filtro single (retornar array e pegar primeiro)
      if (error.code === '42501' || error.message?.includes('row-level security')) {
        console.warn('⚠️ Erro de RLS detectado, tentando fallback...');
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('services')
          .select('*')
          .eq('id', id);
        
        if (!fallbackError && fallbackData && fallbackData.length > 0) {
          console.log('✅ Serviço encontrado via fallback');
          const service = fallbackData[0];
          return {
            id: service.id,
            name: service.name,
            description: service.description,
            image: service.image,
            imageUrl: service.image,
            price: service.price ? Number(service.price) : undefined,
            category: service.category,
            categorySlug: service.category_slug,
            rating: Number(service.rating) || 0,
            provider: service.provider || undefined,
          };
        }
      }
      
      throw new Error(`Erro ao buscar serviço: ${error.message}`);
    }

    if (!data) {
      console.log('⚠️ Serviço não encontrado (data vazio)');
      return null;
    }

    console.log(`✅ Serviço encontrado: ${data.name}`);

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      image: data.image,
      imageUrl: data.image,
      price: data.price ? Number(data.price) : undefined,
      category: data.category,
      categorySlug: data.category_slug,
      rating: Number(data.rating) || 0,
      provider: data.provider || undefined,
      phone: data.phone || undefined,
      whatsapp: data.whatsapp || undefined,
      address: data.address || undefined,
      specialties: data.specialties ? (Array.isArray(data.specialties) ? data.specialties : []) : undefined,
      hours: data.hours || undefined,
    };
  } catch (error) {
    console.error('❌ Erro ao buscar serviço:', error);
    // Tentar fallback final: buscar todos os serviços e filtrar manualmente
    try {
      const { data: allServices } = await supabase.from('services').select('*');
      if (allServices && allServices.length > 0) {
        const service = allServices.find(s => s.id === id);
        if (service) {
          console.warn('⚠️ Serviço encontrado via fallback final');
          return {
            id: service.id,
            name: service.name,
            description: service.description,
            image: service.image,
            imageUrl: service.image,
            price: service.price ? Number(service.price) : undefined,
            category: service.category,
            categorySlug: service.category_slug,
            rating: Number(service.rating) || 0,
            provider: service.provider || undefined,
            phone: service.phone || undefined,
            whatsapp: service.whatsapp || undefined,
            address: service.address || undefined,
            specialties: service.specialties ? (Array.isArray(service.specialties) ? service.specialties : []) : undefined,
            hours: service.hours || undefined,
          };
        }
      }
    } catch (fallbackError) {
      console.error('❌ Erro no fallback final:', fallbackError);
    }
    throw error;
  }
};

export const createService = async (
  serviceData: {
    name: string;
    description: string;
    image: string;
    category: string;
    categorySlug: string;
    price?: number;
    provider?: string;
    phone?: string;
    whatsapp?: string;
    address?: string;
    specialties?: string;
    hours?: Record<string, string>;
  },
  options?: { curationStatus?: 'pending' | 'approved' }
): Promise<Service> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;
    const curationStatus = options?.curationStatus ?? 'pending';

    // Preparar especialidades como array JSON
    const specialtiesArray = serviceData.specialties
      ? (typeof serviceData.specialties === 'string'
          ? serviceData.specialties.split(',').map(s => s.trim()).filter(s => s)
          : Array.isArray(serviceData.specialties) ? serviceData.specialties : [])
      : [];

    const { data, error } = await supabase
      .from('services')
      .insert({
        name: serviceData.name,
        description: serviceData.description,
        image: serviceData.image,
        category: serviceData.category,
        category_slug: serviceData.categorySlug,
        price: serviceData.price || null,
        provider: serviceData.provider || null,
        phone: serviceData.phone || null,
        whatsapp: serviceData.whatsapp || null,
        address: serviceData.address || null,
        specialties: specialtiesArray.length > 0 ? specialtiesArray : null,
        hours: serviceData.hours && Object.keys(serviceData.hours).length > 0 ? serviceData.hours : null,
        created_by: userId || null,
        rating: 0,
        review_count: 0,
        is_active: true,
        curation_status: curationStatus,
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar serviço:', error);
      throw new Error(`Erro ao criar serviço: ${error.message}`);
    }

    if (!data) {
      throw new Error('Erro ao criar serviço: nenhum dado retornado');
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      image: data.image,
      imageUrl: data.image,
      price: data.price ? Number(data.price) : undefined,
      category: data.category,
      categorySlug: data.category_slug,
      rating: Number(data.rating) || 0,
      provider: data.provider || undefined,
      phone: data.phone || undefined,
      whatsapp: data.whatsapp || undefined,
      address: data.address || undefined,
      specialties: data.specialties ? (Array.isArray(data.specialties) ? data.specialties : []) : undefined,
      hours: data.hours || undefined,
    };
  } catch (error) {
    console.error('Erro ao criar serviço:', error);
    throw error;
  }
};

export const updateService = async (
  id: string,
  serviceData: {
    name?: string;
    description?: string;
    image?: string;
    category?: string;
    categorySlug?: string;
    price?: number;
    provider?: string;
    phone?: string;
    whatsapp?: string;
    address?: string;
    specialties?: string[];
    hours?: Record<string, string>;
    isActive?: boolean;
  }
): Promise<Service> => {
  try {
    const updateData: any = {};
    
    if (serviceData.name !== undefined) updateData.name = serviceData.name;
    if (serviceData.description !== undefined) updateData.description = serviceData.description;
    if (serviceData.image !== undefined) updateData.image = serviceData.image || null;
    if (serviceData.category !== undefined) updateData.category = serviceData.category;
    if (serviceData.categorySlug !== undefined) updateData.category_slug = serviceData.categorySlug;
    if (serviceData.price !== undefined) updateData.price = serviceData.price || null;
    if (serviceData.provider !== undefined) updateData.provider = serviceData.provider || null;
    if (serviceData.phone !== undefined) updateData.phone = serviceData.phone || null;
    if (serviceData.whatsapp !== undefined) updateData.whatsapp = serviceData.whatsapp || null;
    if (serviceData.address !== undefined) updateData.address = serviceData.address || null;
    if (serviceData.isActive !== undefined) updateData.is_active = serviceData.isActive;

    // Preparar especialidades como array JSON
    if (serviceData.specialties !== undefined) {
      const specialtiesArray = serviceData.specialties.length > 0 ? serviceData.specialties : null;
      updateData.specialties = specialtiesArray;
    }

    // Preparar horários
    if (serviceData.hours !== undefined) {
      updateData.hours = serviceData.hours && Object.keys(serviceData.hours).length > 0 ? serviceData.hours : null;
    }

    const { data, error } = await supabase
      .from('services')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar serviço:', error);
      throw new Error(`Erro ao atualizar serviço: ${error.message}`);
    }

    if (!data) {
      throw new Error('Erro ao atualizar serviço: nenhum dado retornado');
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      image: data.image,
      imageUrl: data.image,
      price: data.price ? Number(data.price) : undefined,
      category: data.category,
      categorySlug: data.category_slug,
      rating: Number(data.rating) || 0,
      provider: data.provider || undefined,
      phone: data.phone || undefined,
      whatsapp: data.whatsapp || undefined,
      address: data.address || undefined,
      specialties: data.specialties ? (Array.isArray(data.specialties) ? data.specialties : []) : undefined,
      hours: data.hours || undefined,
    };
  } catch (error) {
    console.error('Erro ao atualizar serviço:', error);
    throw error;
  }
};

export const getServicesByCategory = async (categorySlug: string): Promise<Service[]> => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('category_slug', categorySlug)
      .eq('is_active', true)
      .order('rating', { ascending: false });

    if (error) {
      console.error('Erro ao buscar serviços por categoria:', error);
      throw new Error(`Erro ao buscar serviços por categoria: ${error.message}`);
    }

    return (data || []).map((service) => ({
      id: service.id,
      name: service.name,
      description: service.description,
      image: service.image,
      imageUrl: service.image,
      price: service.price ? Number(service.price) : undefined,
      category: service.category,
      categorySlug: service.category_slug,
      rating: Number(service.rating) || 0,
      provider: service.provider || undefined,
    }));
  } catch (error) {
    console.error('Erro ao buscar serviços por categoria:', error);
    throw error;
  }
};
