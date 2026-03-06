import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Briefcase,
  GraduationCap,
  Link2,
  Loader2,
  MapPin,
  Plus,
  Trash2,
  User,
} from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import { useAdmin } from '../shared/hooks';
import {
  getProfessionalProfileByUserId,
  createProfessionalProfile,
  updateProfessionalProfile,
  ensureFakeProfessionalProfileForUser,
  type ProfessionalProfile,
  type ProfessionalExperience,
  type ProfessionalEducation,
  type ProfessionalLink,
} from '../services/professionalProfile';
import { toast } from 'sonner';

interface EditarPerfilProfissionalProps {
  onNavigate: (page: string) => void;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const emptyExperience = (): ProfessionalExperience => ({
  id: generateId(),
  title: '',
  company: '',
  period: '',
  location: '',
  description: '',
});

const emptyEducation = (): ProfessionalEducation => ({
  id: generateId(),
  degree: '',
  institution: '',
  years: '',
});

const emptyLink = (): ProfessionalLink => ({
  id: generateId(),
  platform: '',
  url: '',
});

export function EditarPerfilProfissional({ onNavigate }: EditarPerfilProfissionalProps) {
  const { profile, loading: profileLoading } = useProfile();
  const { isAdmin } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [existingId, setExistingId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('');
  const [about, setAbout] = useState('');
  const [openToOpportunities, setOpenToOpportunities] = useState(true);
  const [openToNetworking, setOpenToNetworking] = useState(true);
  const [experiences, setExperiences] = useState<ProfessionalExperience[]>([]);
  const [education, setEducation] = useState<ProfessionalEducation[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [links, setLinks] = useState<ProfessionalLink[]>([]);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!profile?.id) {
        setLoading(false);
        return;
      }
      let data = await getProfessionalProfileByUserId(profile.id);
      if (!data && isAdmin) {
        data = await ensureFakeProfessionalProfileForUser(profile.id).catch(() => null);
      }
      if (data) {
        setExistingId(data.id);
        setTitle(data.title ?? '');
        setIndustry(data.industry ?? '');
        setLocation(data.location ?? '');
        setAbout(data.about ?? '');
        setOpenToOpportunities(data.open_to_opportunities ?? true);
        setOpenToNetworking(data.open_to_networking ?? true);
        setExperiences(
          Array.isArray(data.experiences) && data.experiences.length > 0
            ? data.experiences.map((e) => ({ ...e, id: e.id || generateId() }))
            : [emptyExperience()]
        );
        setEducation(
          Array.isArray(data.education) && data.education.length > 0
            ? data.education.map((e) => ({ ...e, id: e.id || generateId() }))
            : [emptyEducation()]
        );
        setSkills(Array.isArray(data.skills) ? data.skills : []);
        setLinks(
          Array.isArray(data.links) && data.links.length > 0
            ? data.links.map((l) => ({ ...l, id: l.id || generateId() }))
            : [emptyLink()]
        );
      } else {
        setExperiences([emptyExperience()]);
        setEducation([emptyEducation()]);
        setLinks([emptyLink()]);
      }
      setLoading(false);
    };
    load();
  }, [profile?.id, isAdmin]);

  const addExperience = () => setExperiences((prev) => [...prev, emptyExperience()]);
  const removeExperience = (id: string) =>
    setExperiences((prev) => (prev.length > 1 ? prev.filter((e) => e.id !== id) : prev));
  const updateExperience = (id: string, field: keyof ProfessionalExperience, value: string) =>
    setExperiences((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );

  const addEducation = () => setEducation((prev) => [...prev, emptyEducation()]);
  const removeEducation = (id: string) =>
    setEducation((prev) => (prev.length > 1 ? prev.filter((e) => e.id !== id) : prev));
  const updateEducation = (id: string, field: keyof ProfessionalEducation, value: string) =>
    setEducation((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) {
      setSkills((prev) => [...prev, s]);
      setSkillInput('');
    }
  };
  const removeSkill = (skill: string) => setSkills((prev) => prev.filter((s) => s !== skill));

  const addLink = () => setLinks((prev) => [...prev, emptyLink()]);
  const removeLink = (id: string) =>
    setLinks((prev) => (prev.length > 1 ? prev.filter((l) => l.id !== id) : prev));
  const updateLink = (id: string, field: 'platform' | 'url', value: string) =>
    setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, [field]: value } : l)));

  const handleSubmit = async () => {
    setSaveError(null);
    if (!profile?.id) {
      const msg = 'Perfil não encontrado. Faça login novamente.';
      setSaveError(msg);
      toast.error(msg);
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title,
        industry,
        location,
        about,
        open_to_opportunities: openToOpportunities,
        open_to_networking: openToNetworking,
        experiences: experiences.filter((e) => e.title.trim() || e.company.trim()),
        education: education.filter((e) => e.degree.trim() || e.institution.trim()),
        skills,
        links: links.filter((l) => l.platform.trim() || l.url.trim()),
      };

      if (existingId) {
        const { error } = await updateProfessionalProfile(existingId, payload);
        if (error) {
          const msg = error.includes('professional_profiles') || error.includes('schema cache')
            ? 'A tabela de perfil profissional ainda não existe no banco. Execute o SQL em docs/sql/professional_profiles.sql no Supabase (SQL Editor).'
            : error;
          setSaveError(msg);
          toast.error(msg);
          return;
        }
        toast.success('Perfil profissional atualizado.');
      } else {
        const { data, error } = await createProfessionalProfile(profile.id, payload);
        if (error) {
          const msg = error.includes('professional_profiles') || error.includes('schema cache')
            ? 'A tabela de perfil profissional ainda não existe no banco. Execute o SQL em docs/sql/professional_profiles.sql no Supabase (SQL Editor).'
            : error;
          setSaveError(msg);
          toast.error(msg);
          return;
        }
        if (data) setExistingId(data.id);
        toast.success('Perfil profissional criado.');
      }
      onNavigate('perfil-profissional');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao salvar. Tente novamente.';
      setSaveError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (profileLoading || loading) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  if (!profile) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <button
          type="button"
          onClick={() => onNavigate('profile')}
          className="px-4 py-2 bg-primary text-white rounded-full"
        >
          Voltar ao perfil
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl pb-24">
        <header className="sticky top-0 z-10 bg-white border-b border-border flex items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={() => onNavigate('profile')}
            className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="font-semibold text-lg text-foreground">
            {existingId ? 'Editar perfil profissional' : 'Criar perfil profissional'}
          </h1>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="px-4 py-2 bg-primary text-white rounded-full text-sm font-medium disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Salvar
          </button>
        </header>

        {saveError && (
          <div className="mx-4 mt-3 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
            {saveError}
          </div>
        )}

        <div className="px-5 py-6 space-y-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <User className="w-4 h-4 text-primary" />
              Cargo / Título
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-muted rounded-xl border border-transparent focus:border-primary focus:outline-none"
              placeholder="Ex: Designer UX/UI & Product Designer"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <Briefcase className="w-4 h-4 text-primary" />
              Área / Indústria
            </label>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full px-4 py-3 bg-muted rounded-xl border border-transparent focus:border-primary focus:outline-none"
              placeholder="Ex: Design & Tecnologia"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <MapPin className="w-4 h-4 text-primary" />
              Localização
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-3 bg-muted rounded-xl border border-transparent focus:border-primary focus:outline-none"
              placeholder="Ex: São Paulo, SP"
            />
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-sm font-medium text-foreground">Disponibilidade</span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setOpenToOpportunities(!openToOpportunities)}
                className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-colors ${
                  openToOpportunities
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-muted text-muted-foreground border border-transparent'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                Aberta a oportunidades
              </button>
              <button
                type="button"
                onClick={() => setOpenToNetworking(!openToNetworking)}
                className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-colors ${
                  openToNetworking
                    ? 'bg-pink-100 text-pink-800 border border-pink-200'
                    : 'bg-muted text-muted-foreground border border-transparent'
                }`}
              >
                <Link2 className="w-4 h-4" />
                Aberta a networking
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Sobre</label>
            <textarea
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className="w-full px-4 py-3 bg-muted rounded-xl border border-transparent focus:border-primary focus:outline-none resize-none"
              rows={4}
              placeholder="Conte sobre sua trajetória e foco em experiências inclusivas e acessíveis..."
            />
          </div>

          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-primary" />
                Experiência Profissional
              </h2>
              <button
                type="button"
                onClick={addExperience}
                className="text-sm text-primary font-medium flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Adicionar
              </button>
            </div>
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div
                  key={exp.id}
                  className="p-4 rounded-xl border border-border bg-muted/30 space-y-3"
                >
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeExperience(exp.id)}
                      className="text-muted-foreground hover:text-destructive p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={exp.title}
                    onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-lg border text-sm"
                    placeholder="Cargo"
                  />
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-lg border text-sm"
                    placeholder="Empresa"
                  />
                  <input
                    type="text"
                    value={exp.period}
                    onChange={(e) => updateExperience(exp.id, 'period', e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-lg border text-sm"
                    placeholder="Período (ex: Jan 2022 - Atual)"
                  />
                  <input
                    type="text"
                    value={exp.location ?? ''}
                    onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-lg border text-sm"
                    placeholder="Local (ex: São Paulo, SP)"
                  />
                  <textarea
                    value={exp.description ?? ''}
                    onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-lg border text-sm resize-none"
                    rows={2}
                    placeholder="Principais atividades"
                  />
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-primary" />
                Formação Acadêmica
              </h2>
              <button
                type="button"
                onClick={addEducation}
                className="text-sm text-primary font-medium flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Adicionar
              </button>
            </div>
            <div className="space-y-4">
              {education.map((edu) => (
                <div
                  key={edu.id}
                  className="p-4 rounded-xl border border-border bg-muted/30 space-y-3"
                >
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeEducation(edu.id)}
                      className="text-muted-foreground hover:text-destructive p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-lg border text-sm"
                    placeholder="Curso / Grau"
                  />
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-lg border text-sm"
                    placeholder="Instituição"
                  />
                  <input
                    type="text"
                    value={edu.years}
                    onChange={(e) => updateEducation(edu.id, 'years', e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-lg border text-sm"
                    placeholder="Anos (ex: 2015 - 2019)"
                  />
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-3">
              Habilidades & Competências
            </h2>
            <div className="flex flex-wrap gap-2 mb-2">
              {skills.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                >
                  {s}
                  <button
                    type="button"
                    onClick={() => removeSkill(s)}
                    className="ml-1 text-primary/70 hover:text-primary"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                className="flex-1 px-3 py-2 bg-muted rounded-xl border text-sm"
                placeholder="Ex: UX Design (Enter para adicionar)"
              />
              <button
                type="button"
                onClick={addSkill}
                className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                <Link2 className="w-4 h-4 text-primary" />
                Links & Redes Sociais
              </h2>
              <button
                type="button"
                onClick={addLink}
                className="text-sm text-primary font-medium flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Adicionar
              </button>
            </div>
            <div className="space-y-3">
              {links.map((link) => (
                <div key={link.id} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={link.platform}
                    onChange={(e) => updateLink(link.id, 'platform', e.target.value)}
                    className="flex-1 px-3 py-2 bg-muted rounded-xl text-sm"
                    placeholder="Ex: Linkedin, Portfólio"
                  />
                  <input
                    type="text"
                    value={link.url}
                    onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                    className="flex-1 px-3 py-2 bg-muted rounded-xl text-sm"
                    placeholder="URL ou @"
                  />
                  <button
                    type="button"
                    onClick={() => removeLink(link.id)}
                    className="text-muted-foreground hover:text-destructive p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
