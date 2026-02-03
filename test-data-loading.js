// Script para testar se os dados estão sendo carregados do Supabase
// Execute: node test-data-loading.js

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';

// Carregar variáveis de ambiente
const envFile = readFileSync('.env', 'utf-8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseAnonKey = envVars.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variáveis de ambiente não encontradas!');
  console.error('Certifique-se de que o arquivo .env contém:');
  console.error('VITE_SUPABASE_URL=...');
  console.error('VITE_SUPABASE_ANON_KEY=...');
  process.exit(1);
}

console.log('🔧 Testando conexão com Supabase...');
console.log('🔗 URL:', supabaseUrl);
console.log('🔑 Chave:', supabaseAnonKey.substring(0, 20) + '...');

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testDataLoading() {
  console.log('\n📊 Testando carregamento de dados...\n');

  // Testar Places
  console.log('1️⃣ Testando Places...');
  try {
    const { data: places, error: placesError } = await supabase
      .from('places')
      .select('*')
      .limit(5);
    
    if (placesError) {
      console.error('   ❌ Erro:', placesError.message);
      console.error('   Código:', placesError.code);
    } else {
      console.log(`   ✅ Sucesso! ${places?.length || 0} locais encontrados`);
      if (places && places.length > 0) {
        console.log('   📋 Exemplo:', places[0].name);
      }
    }
  } catch (err) {
    console.error('   ❌ Erro fatal:', err.message);
  }

  // Testar Services
  console.log('\n2️⃣ Testando Services...');
  try {
    const { data: services, error: servicesError } = await supabase
      .from('services')
      .select('*')
      .limit(5);
    
    if (servicesError) {
      console.error('   ❌ Erro:', servicesError.message);
      console.error('   Código:', servicesError.code);
    } else {
      console.log(`   ✅ Sucesso! ${services?.length || 0} serviços encontrados`);
      if (services && services.length > 0) {
        console.log('   📋 Exemplo:', services[0].name);
      }
    }
  } catch (err) {
    console.error('   ❌ Erro fatal:', err.message);
  }

  // Testar Events
  console.log('\n3️⃣ Testando Events...');
  try {
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('*')
      .limit(5);
    
    if (eventsError) {
      console.error('   ❌ Erro:', eventsError.message);
      console.error('   Código:', eventsError.code);
    } else {
      console.log(`   ✅ Sucesso! ${events?.length || 0} eventos encontrados`);
      if (events && events.length > 0) {
        console.log('   📋 Exemplo:', events[0].name);
      }
    }
  } catch (err) {
    console.error('   ❌ Erro fatal:', err.message);
  }

  // Testar Profiles
  console.log('\n4️⃣ Testando Profiles...');
  try {
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(5);
    
    if (profilesError) {
      console.error('   ❌ Erro:', profilesError.message);
      console.error('   Código:', profilesError.code);
    } else {
      console.log(`   ✅ Sucesso! ${profiles?.length || 0} perfis encontrados`);
    }
  } catch (err) {
    console.error('   ❌ Erro fatal:', err.message);
  }

  console.log('\n✅ Teste concluído!\n');
}

testDataLoading().catch(console.error);
