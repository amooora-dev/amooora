import { useState, useEffect } from 'react';
import {
  Briefcase,
  GraduationCap,
  Link2,
  Loader2,
  MapPin,
  Mail,
  Pencil,
  Share2,
  User,
} from 'lucide-react';
import { Header, BottomNav, ImageWithFallback } from '../shared/components';
import { useProfile } from '../hooks/useProfile';
import { supabase } from '../infra/supabase';
import {
  getProfessionalProfileByUserId,
  deleteProfessionalProfile,
  type ProfessionalProfile as ProProfile,
} from '../services/professionalProfile';
import { toast } from 'sonner';

interface ProfileBasic {
  id: string;
  name: string;
  avatar?: string;
  city?: string;
}

interface PerfilProfissionalProps {
  userId?: string;
  onNavigate: (page: string) => void;
  onBack?: () => void;
}

export function PerfilProfissional({ userId: propUserId, onNavigate, onBack }: PerfilProfissionalProps) {
  const { profile: currentProfile } = useProfile();
  const effectiveUserId = propUserId ?? currentProfile?.id;
  const isOwnProfile = !!effectiveUserId && effectiveUserId === currentProfile?.id;

  const [profile, setProfile] = useState<ProfileBasic | null>(null);
  const [pro, setPro] = useState<ProProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!effectiveUserId) {
        setLoading(false);
        return;
      }
      try {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('id, name, avatar, city')
          .eq('id', effectiveUserId)
          .single();

        const proData = await getProfessionalProfileByUserId(effectiveUserId);

        if (profileData) {
          setProfile({
            id: profileData.id,
            name: profileData.name ?? '',
            avatar: profileData.avatar,
            city: profileData.city,
          });
        }
        setPro(proData);
      } catch (e) {
        if (import.meta.env.DEV) console.error('[PerfilProfissional] load:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [effectiveUserId]);

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: `Perfil profissional - ${profile?.name ?? 'Amooora'}`,
        url,
      }).catch(() => {
        navigator.clipboard.writeText(url).then(() => toast.success('Link copiado!'));
      });
    } else {
      navigator.clipboard.writeText(url).then(() => toast.success('Link copiado!'));
    }
  };

  const handleCancelarPerfil = async () => {
    if (!pro?.id || !window.confirm('Tem certeza que deseja excluir seu perfil profissional? Essa ação não pode ser desfeita.')) return;
    setDeleting(true);
    const { error } = await deleteProfessionalProfile(pro.id);
    setDeleting(false);
    if (error) {
      toast.error(error);
      return;
    }
    toast.success('Perfil profissional excluído.');
    if (onBack) onBack();
    else onNavigate('profile');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!pro && !profile) {
    return (
      <div className="min-h-screen bg-muted">
        <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
          <Header onNavigate={onNavigate} showBackButton onBack={onBack ?? (() => onNavigate('profile'))} />
          <div className="flex-1 flex items-center justify-center px-5">
            <p className="text-muted-foreground text-center">
              Perfil não encontrado.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!pro) {
    return (
      <div className="min-h-screen bg-muted">
        <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
          <Header onNavigate={onNavigate} showBackButton onBack={onBack ?? (() => onNavigate('profile'))} />
          <div className="flex-1 flex items-center justify-center px-5">
            <p className="text-muted-foreground text-center">
              {isOwnProfile
                ? 'Você ainda não tem um perfil profissional. Crie um na sua página de perfil.'
                : 'Esta pessoa ainda não criou um perfil profissional.'}
            </p>
            <button
              type="button"
              onClick={onBack ?? (() => onNavigate('profile'))}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-full text-sm font-medium"
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const displayName = profile?.name ?? 'Usuária';
  const displayLocation = pro.location || profile?.city || '';

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
        <Header onNavigate={onNavigate} showBackButton onBack={onBack ?? (() => onNavigate('profile'))} />

        <div className="flex-1 overflow-y-auto pb-24 pt-16">
          {/* Perfil social x Perfil profissional - ao ver perfil de outra pessoa */}
          {!isOwnProfile && propUserId && (
            <div className="flex gap-2 px-5 pt-4 pb-2 bg-white border-b border-border">
              <button
                type="button"
                onClick={() => onNavigate(`view-profile:${propUserId}`)}
                className="flex-1 py-3 rounded-xl bg-primary/10 text-primary font-medium text-sm flex items-center justify-center gap-2 hover:bg-primary/20 border border-primary/20"
              >
                <User className="w-4 h-4" />
                Perfil social
              </button>
              <button
                type="button"
                className="flex-1 py-3 rounded-xl bg-primary text-white font-medium text-sm flex items-center justify-center gap-2 shadow-sm"
                aria-pressed="true"
              >
                <Briefcase className="w-4 h-4" />
                Perfil profissional
              </button>
            </div>
          )}

          {/* Header roxo - referência (voltar fica no Header global) */}
          <div className="bg-primary/10 px-5 pt-6 pb-6">
            {isOwnProfile && (
              <div className="flex items-center justify-end gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => onNavigate('edit-perfil-profissional')}
                  className="w-10 h-10 rounded-full hover:bg-primary/20 flex items-center justify-center"
                  aria-label="Editar"
                >
                  <Pencil className="w-5 h-5 text-primary" />
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  className="w-10 h-10 rounded-full hover:bg-primary/20 flex items-center justify-center"
                  aria-label="Compartilhar"
                >
                  <Share2 className="w-5 h-5 text-primary" />
                </button>
              </div>
            )}

            <div className="flex justify-center mb-4">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary/20 bg-muted">
                {profile?.avatar ? (
                  <ImageWithFallback
                    src={profile.avatar}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-primary/60 text-white text-2xl font-bold">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            <h1 className="text-xl font-bold text-foreground text-center mb-1">{displayName}</h1>
            {pro.title && (
              <p className="text-sm text-foreground/90 text-center mb-1">{pro.title}</p>
            )}
            {pro.industry && (
              <p className="text-sm text-muted-foreground text-center mb-1">{pro.industry}</p>
            )}
            {displayLocation && (
              <p className="text-sm text-muted-foreground text-center mb-4 flex items-center justify-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {displayLocation}
              </p>
            )}

            <div className="flex flex-wrap gap-2 justify-center mb-4">
              {pro.open_to_opportunities && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-medium">
                  <Briefcase className="w-3.5 h-3.5" /> Aberta a oportunidades
                </span>
              )}
              {pro.open_to_networking && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-100 text-pink-800 text-xs font-medium">
                  <Link2 className="w-3.5 h-3.5" /> Aberta a networking
                </span>
              )}
            </div>

            {!isOwnProfile && effectiveUserId && (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate(`friend-chat:${effectiveUserId}`)}
                  className="flex-1 py-3 rounded-xl bg-primary text-white text-sm font-medium flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" /> Enviar Mensagem
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate(`view-profile:${effectiveUserId}`)}
                  className="flex-1 py-3 rounded-xl border-2 border-primary text-primary text-sm font-medium flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4" /> Contato
                </button>
              </div>
            )}
          </div>

          <div className="px-5 py-6 space-y-6">
            {pro.about && (
              <section>
                <h2 className="text-base font-semibold text-foreground mb-2">Sobre</h2>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{pro.about}</p>
              </section>
            )}

            {pro.experiences && pro.experiences.length > 0 && (
              <section>
                <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-primary" />
                  Experiência Profissional
                </h2>
                <div className="space-y-4">
                  {pro.experiences.map((exp, i) => (
                    <div key={exp.id ?? i} className="flex gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-foreground text-sm">{exp.title}</p>
                        <p className="text-sm text-muted-foreground">{exp.company}</p>
                        <p className="text-xs text-muted-foreground">
                          {exp.period}
                          {exp.location ? ` • ${exp.location}` : ''}
                        </p>
                        {exp.description && (
                          <p className="text-sm text-muted-foreground mt-1">{exp.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {pro.education && pro.education.length > 0 && (
              <section>
                <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-primary" />
                  Formação Acadêmica
                </h2>
                <ul className="space-y-2">
                  {pro.education.map((edu, i) => (
                    <li key={edu.id ?? i} className="flex items-start gap-2">
                      <GraduationCap className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{edu.degree}</p>
                        <p className="text-sm text-muted-foreground">{edu.institution}</p>
                        <p className="text-xs text-muted-foreground">{edu.years}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {pro.skills && pro.skills.length > 0 && (
              <section>
                <h2 className="text-base font-semibold text-foreground mb-3">
                  Habilidades & Competências
                </h2>
                <div className="flex flex-wrap gap-2">
                  {pro.skills.map((s, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {pro.links && pro.links.length > 0 && (
              <section>
                <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-primary" />
                  Links & Redes Sociais
                </h2>
                <div className="space-y-2">
                  {pro.links.map((link, i) => {
                    const href = link.url.startsWith('http') ? link.url : `https://${link.url}`;
                    return (
                      <a
                        key={link.id ?? i}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/30 text-sm text-primary hover:bg-muted/50"
                      >
                        <Link2 className="w-4 h-4 flex-shrink-0" />
                        <span className="font-medium">{link.platform || 'Link'}</span>
                        <span className="truncate text-muted-foreground">{link.url}</span>
                      </a>
                    );
                  })}
                </div>
              </section>
            )}

            {isOwnProfile && (
              <section className="pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={handleCancelarPerfil}
                  disabled={deleting}
                  className="w-full py-3 rounded-xl border border-destructive/50 text-destructive text-sm font-medium hover:bg-destructive/5 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Cancelar perfil profissional
                </button>
              </section>
            )}
          </div>
        </div>

        <BottomNav activeItem="profile" onItemClick={onNavigate} />
      </div>
    </div>
  );
}
