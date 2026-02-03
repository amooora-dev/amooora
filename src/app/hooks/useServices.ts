import { useState, useEffect } from 'react';
import { Service } from '../types';
import { getServices, getServiceById, getServicesByCategory } from '../services/services';

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Timeout de segurança para evitar loading infinito (aumentado para 15s)
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Timeout ao carregar serviços. Verifique sua conexão ou as políticas RLS do Supabase.')), 15000);
        });
        
        const data = await Promise.race([getServices(), timeoutPromise]);
        setServices(data || []);
      } catch (err) {
        console.error('❌ Erro no hook useServices:', err);
        setError(err instanceof Error ? err : new Error('Erro ao carregar serviços'));
        setServices([]); // Garantir que services seja array vazio em caso de erro
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  return { services, loading, error };
};

export const useService = (id: string | undefined) => {
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setService(null);
      setLoading(false);
      return;
    }

    const loadService = async () => {
      try {
        setLoading(true);
        const data = await getServiceById(id);
        setService(data);
        if (!data) {
          setError(new Error('Serviço não encontrado'));
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erro ao carregar serviço'));
      } finally {
        setLoading(false);
      }
    };

    loadService();
  }, [id]);

  return { service, loading, error };
};

export const useServicesByCategory = (categorySlug: string | undefined) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!categorySlug) {
      setServices([]);
      setLoading(false);
      return;
    }

    const loadServices = async () => {
      try {
        setLoading(true);
        const data = await getServicesByCategory(categorySlug);
        setServices(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erro ao carregar serviços'));
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, [categorySlug]);

  return { services, loading, error };
};
