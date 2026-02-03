import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Logs de diagnóstico para verificar configuração
console.log('🔧 Inicializando cliente Supabase...');
console.log('🔗 URL configurada:', supabaseUrl ? '✅ Sim' : '❌ Não');
console.log('🔑 Chave configurada:', supabaseAnonKey ? '✅ Sim' : '❌ Não');

if (!supabaseUrl || !supabaseAnonKey) {
  const errorMsg = 'Variáveis de ambiente do Supabase não configuradas! ' +
    'Certifique-se de que VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY estão definidas no arquivo .env';
  console.error('❌', errorMsg);
  throw new Error(errorMsg);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
console.log('✅ Cliente Supabase inicializado com sucesso');