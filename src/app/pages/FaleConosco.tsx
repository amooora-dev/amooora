import { useState } from 'react';
import { ArrowLeft, Mail, MessageSquare, Send, Loader2 } from 'lucide-react';
import { Header } from '../shared/components';
import { supabase } from '../infra/supabase';

interface FaleConoscoProps {
  onNavigate: (page: string) => void;
  onBack?: () => void;
}

export function FaleConosco({ onNavigate, onBack }: FaleConoscoProps) {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    tipoConteudo: '',
    mensagem: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const tiposConteudo = [
    { value: '', label: 'Selecione o tipo' },
    { value: 'DENUNCIA', label: 'Denúncia' },
    { value: 'SUGESTAO', label: 'Sugestão' },
    { value: 'DUVIDA', label: 'Dúvida' },
    { value: 'ELOGIO', label: 'Elogio' },
    { value: 'OUTRO', label: 'Outro' },
  ];

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Limpar erro do campo ao digitar
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.tipoConteudo) {
      newErrors.tipoConteudo = 'Tipo de conteúdo é obrigatório';
    }

    if (!formData.mensagem.trim()) {
      newErrors.mensagem = 'Mensagem é obrigatória';
    } else if (formData.mensagem.trim().length < 10) {
      newErrors.mensagem = 'Mensagem deve ter pelo menos 10 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      // Buscar usuário atual (se estiver logado)
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id || null;

      // Inserir mensagem na tabela de contatos
      const { error } = await supabase
        .from('contact_messages')
        .insert({
          user_id: userId,
          name: formData.nome,
          email: formData.email,
          phone: formData.telefone || null,
          content_type: formData.tipoConteudo,
          message: formData.mensagem,
          status: 'pending',
        });

      if (error) {
        console.error('Erro ao enviar mensagem:', error);
        setErrors({ submit: 'Erro ao enviar mensagem. Tente novamente.' });
        setIsSubmitting(false);
        return;
      }

      // Sucesso
      setSubmitSuccess(true);
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        tipoConteudo: '',
        mensagem: '',
      });

      // Limpar mensagem de sucesso após 5 segundos
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      setErrors({ submit: 'Erro ao enviar mensagem. Tente novamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
        <Header onNavigate={onNavigate} showBackButton onBack={onBack || (() => onNavigate('home'))} />

        <div className="flex-1 overflow-y-auto pb-24 pt-24">
          <div className="px-5 py-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Fale Conosco</h1>
            <p className="text-sm text-gray-600 mb-6">
              Envie sua mensagem, dúvida, sugestão ou denúncia. Responderemos o mais breve possível.
            </p>

            {submitSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                <p className="text-sm text-green-800 font-medium">
                  ✓ Mensagem enviada com sucesso! Entraremos em contato em breve.
                </p>
              </div>
            )}

            {errors.submit && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-800">{errors.submit}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nome */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                  <Mail className="w-4 h-4 text-primary" />
                  Nome *
                </label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => handleChange('nome', e.target.value)}
                  className={`w-full px-4 py-3 bg-muted rounded-xl border ${
                    errors.nome ? 'border-red-500' : 'border-transparent'
                  } focus:border-secondary focus:outline-none transition-colors`}
                  placeholder="Seu nome completo"
                />
                {errors.nome && (
                  <p className="text-xs text-red-500 mt-1">{errors.nome}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                  <Mail className="w-4 h-4 text-primary" />
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className={`w-full px-4 py-3 bg-muted rounded-xl border ${
                    errors.email ? 'border-red-500' : 'border-transparent'
                  } focus:border-secondary focus:outline-none transition-colors`}
                  placeholder="seu@email.com"
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              {/* Telefone */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                  <Mail className="w-4 h-4 text-primary" />
                  Telefone (opcional)
                </label>
                <input
                  type="tel"
                  value={formData.telefone}
                  onChange={(e) => handleChange('telefone', e.target.value)}
                  className="w-full px-4 py-3 bg-muted rounded-xl border border-transparent focus:border-secondary focus:outline-none transition-colors"
                  placeholder="(11) 98765-4321"
                />
              </div>

              {/* Tipo de Conteúdo */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  Tipo de Conteúdo *
                </label>
                <select
                  value={formData.tipoConteudo}
                  onChange={(e) => handleChange('tipoConteudo', e.target.value)}
                  className={`w-full px-4 py-3 bg-muted rounded-xl border ${
                    errors.tipoConteudo ? 'border-red-500' : 'border-transparent'
                  } focus:border-secondary focus:outline-none transition-colors`}
                >
                  {tiposConteudo.map((tipo) => (
                    <option key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </option>
                  ))}
                </select>
                {errors.tipoConteudo && (
                  <p className="text-xs text-red-500 mt-1">{errors.tipoConteudo}</p>
                )}
              </div>

              {/* Mensagem */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  Mensagem *
                </label>
                <textarea
                  value={formData.mensagem}
                  onChange={(e) => handleChange('mensagem', e.target.value)}
                  rows={6}
                  className={`w-full px-4 py-3 bg-muted rounded-xl border ${
                    errors.mensagem ? 'border-red-500' : 'border-transparent'
                  } focus:border-secondary focus:outline-none transition-colors resize-none`}
                  placeholder="Descreva sua mensagem, dúvida, sugestão ou denúncia..."
                />
                {errors.mensagem && (
                  <p className="text-xs text-red-500 mt-1">{errors.mensagem}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {formData.mensagem.length} caracteres
                </p>
              </div>

              {/* Botão Enviar */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white border-2 border-[#932d6f] text-[#932d6f] py-4 px-6 rounded-full font-semibold hover:bg-[#932d6f]/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Enviar Mensagem
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
