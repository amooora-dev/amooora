/**
 * Serviço de Geocoding usando Google Maps API
 * Converte endereços em coordenadas (latitude, longitude)
 */

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_K;

export interface GeocodeResult {
  lat: number;
  lng: number;
  formattedAddress: string;
}

/**
 * Converte um endereço em coordenadas geográficas
 * @param address - Endereço a ser geocodificado
 * @returns Coordenadas e endereço formatado, ou null se falhar
 */
export async function geocodeAddress(address: string): Promise<GeocodeResult | null> {
  if (!API_KEY) {
    console.error('❌ Google Maps API key não configurada');
    return null;
  }

  if (!address || address.trim().length === 0) {
    console.warn('⚠️ Endereço vazio fornecido para geocoding');
    return null;
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`
    );

    const data = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
      const result = data.results[0];
      return {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
        formattedAddress: result.formatted_address,
      };
    }

    // Tratar diferentes status de erro
    if (data.status === 'ZERO_RESULTS') {
      console.warn(`⚠️ Nenhum resultado encontrado para: ${address}`);
    } else if (data.status === 'OVER_QUERY_LIMIT') {
      console.error('❌ Limite de requisições do Google Maps excedido');
    } else if (data.status === 'REQUEST_DENIED') {
      console.error('❌ Requisição negada pelo Google Maps. Verifique a chave da API e restrições.');
    } else {
      console.warn(`⚠️ Geocoding falhou com status: ${data.status} para: ${address}`);
    }

    return null;
  } catch (error) {
    console.error('❌ Erro ao fazer geocoding:', error);
    return null;
  }
}

/**
 * Geocodifica múltiplos endereços em batch
 * Adiciona delay entre requisições para evitar rate limiting
 * @param addresses - Array de endereços
 * @param delayMs - Delay entre requisições em milissegundos (padrão: 200ms)
 * @returns Array de resultados (null para endereços que falharam)
 */
export async function geocodeAddresses(
  addresses: string[],
  delayMs: number = 200
): Promise<(GeocodeResult | null)[]> {
  const results: (GeocodeResult | null)[] = [];

  for (let i = 0; i < addresses.length; i++) {
    const result = await geocodeAddress(addresses[i]);
    results.push(result);

    // Adicionar delay entre requisições (exceto na última)
    if (i < addresses.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  return results;
}
