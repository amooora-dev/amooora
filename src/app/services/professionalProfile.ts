import { supabase } from '../infra/supabase';

export interface ProfessionalExperience {
  id: string;
  title: string;
  company: string;
  period: string;
  location?: string;
  description?: string;
}

export interface ProfessionalEducation {
  id: string;
  degree: string;
  institution: string;
  years: string;
}

export interface ProfessionalLink {
  id: string;
  platform: string;
  url: string;
}

export interface ProfessionalProfile {
  id: string;
  user_id: string;
  title: string;
  industry: string;
  location: string;
  about: string;
  open_to_opportunities: boolean;
  open_to_networking: boolean;
  experiences: ProfessionalExperience[];
  education: ProfessionalEducation[];
  skills: string[];
  links: ProfessionalLink[];
  created_at?: string;
  updated_at?: string;
}

const TABLE = 'professional_profiles';

/** Payload fake de perfil profissional: Analista de Dados (para admin/demo) */
export function getFakeProfessionalProfilePayloadForAnalista(): Omit<
  ProfessionalProfile,
  'id' | 'user_id' | 'created_at' | 'updated_at'
> {
  const id = () => `fake-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  return {
    title: 'Analista de Dados',
    industry: 'Tecnologia & Dados',
    location: 'São Paulo, SP',
    about:
      'Analista de dados com foco em transformar dados em insights acionáveis. Experiência em pipelines ETL, visualização de dados e apoio à tomada de decisão. Atuo com SQL, Python e ferramentas de BI para entregar relatórios e dashboards que geram impacto nos negócios.',
    open_to_opportunities: true,
    open_to_networking: true,
    experiences: [
      {
        id: id(),
        title: 'Analista de Dados Sênior',
        company: 'Tech Analytics',
        period: 'Mar 2022 - Atual',
        location: 'São Paulo, SP',
        description:
          'Liderança de análises para produtos digitais. Criação de pipelines de dados, métricas e dashboards. Suporte a squads com dados para experimentos e decisões.',
      },
      {
        id: id(),
        title: 'Analista de Dados',
        company: 'Startup Dados',
        period: 'Jun 2020 - Fev 2022',
        location: 'Remoto',
        description:
          'Análise de comportamento de usuários, relatórios de retenção e funil. Uso de BigQuery, Looker e Python para automação de relatórios.',
      },
      {
        id: id(),
        title: 'Analista de Dados Júnior',
        company: 'Consultoria XYZ',
        period: 'Ago 2018 - Mai 2020',
        location: 'São Paulo, SP',
        description:
          'Extração e limpeza de dados, relatórios em Excel e SQL. Suporte a projetos de analytics para clientes de varejo.',
      },
    ],
    education: [
      {
        id: id(),
        degree: 'Bacharelado em Estatística',
        institution: 'Universidade de São Paulo',
        years: '2014 - 2018',
      },
      {
        id: id(),
        degree: 'Pós-graduação em Ciência de Dados',
        institution: 'Insper',
        years: '2019 - 2020',
      },
    ],
    skills: [
      'SQL',
      'Python',
      'Análise de Dados',
      'Power BI',
      'Looker',
      'ETL',
      'Excel',
      'Estatística',
      'Visualização de Dados',
      'Google Analytics',
    ],
    links: [
      { id: id(), platform: 'LinkedIn', url: 'linkedin.com/in/analista-dados' },
      { id: id(), platform: 'Portfólio', url: 'analista-dados.dev' },
      { id: id(), platform: 'GitHub', url: 'github.com/analista-dados' },
    ],
  };
}

/**
 * Garante que o usuário tenha um perfil profissional: se não existir, cria com dados fake de analista de dados.
 * Útil para admin ver um perfil completo de exemplo.
 */
export async function ensureFakeProfessionalProfileForUser(
  userId: string
): Promise<ProfessionalProfile | null> {
  const existing = await getProfessionalProfileByUserId(userId);
  if (existing) return existing;
  const payload = getFakeProfessionalProfilePayloadForAnalista();
  const { data } = await createProfessionalProfile(userId, payload);
  return data;
}

function parseJson<T>(value: unknown, fallback: T): T {
  if (value == null) return fallback;
  if (Array.isArray(value)) return value as T;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  return fallback;
}

function mapRow(row: Record<string, unknown>): ProfessionalProfile {
  return {
    id: String(row.id),
    user_id: String(row.user_id),
    title: String(row.title ?? ''),
    industry: String(row.industry ?? ''),
    location: String(row.location ?? ''),
    about: String(row.about ?? ''),
    open_to_opportunities: Boolean(row.open_to_opportunities ?? true),
    open_to_networking: Boolean(row.open_to_networking ?? true),
    experiences: parseJson(row.experiences, []),
    education: parseJson(row.education, []),
    skills: parseJson(row.skills, []),
    links: parseJson(row.links, []),
    created_at: row.created_at as string | undefined,
    updated_at: row.updated_at as string | undefined,
  };
}

export async function getProfessionalProfileByUserId(
  userId: string
): Promise<ProfessionalProfile | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    if (import.meta.env.DEV) console.error('[professionalProfile] getByUserId:', error);
    return null;
  }
  return data ? mapRow(data as Record<string, unknown>) : null;
}

export async function createProfessionalProfile(
  userId: string,
  payload: Omit<ProfessionalProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>
): Promise<{ data: ProfessionalProfile | null; error: string | null }> {
  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      user_id: userId,
      title: payload.title ?? '',
      industry: payload.industry ?? '',
      location: payload.location ?? '',
      about: payload.about ?? '',
      open_to_opportunities: payload.open_to_opportunities ?? true,
      open_to_networking: payload.open_to_networking ?? true,
      experiences: payload.experiences ?? [],
      education: payload.education ?? [],
      skills: payload.skills ?? [],
      links: payload.links ?? [],
    })
    .select()
    .single();

  if (error) {
    if (import.meta.env.DEV) console.error('[professionalProfile] create:', error);
    return { data: null, error: error.message };
  }
  return { data: data ? mapRow(data as Record<string, unknown>) : null, error: null };
}

export async function updateProfessionalProfile(
  id: string,
  payload: Partial<Omit<ProfessionalProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
): Promise<{ data: ProfessionalProfile | null; error: string | null }> {
  const { data, error } = await supabase
    .from(TABLE)
    .update({
      ...payload,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    if (import.meta.env.DEV) console.error('[professionalProfile] update:', error);
    return { data: null, error: error.message };
  }
  return { data: data ? mapRow(data as Record<string, unknown>) : null, error: null };
}

export async function deleteProfessionalProfile(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) {
    if (import.meta.env.DEV) console.error('[professionalProfile] delete:', error);
    return { error: error.message };
  }
  return { error: null };
}
