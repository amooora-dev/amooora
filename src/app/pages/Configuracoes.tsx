import { useState } from 'react';
import {
  ChevronLeft,
  User,
  Lock,
  Bell,
  Eye,
  Shield,
  UserX,
  Globe,
  Moon,
  HelpCircle,
  FileText,
  LogOut,
} from 'lucide-react';
import { SettingsSection } from '../components/SettingsSection';
import { SettingsMenuItem } from '../components/SettingsMenuItem';
import { SettingsToggleItem } from '../components/SettingsToggleItem';

interface ConfiguracoesProps {
  onBack: () => void;
}

export function Configuracoes({ onBack }: ConfiguracoesProps) {
  const [modoDiscreto, setModoDiscreto] = useState(false);

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-md mx-auto bg-muted min-h-screen shadow-xl">
        {/* Header */}
        <div className="bg-white px-5 py-4 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
          <button
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center hover:bg-muted rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-primary" />
          </button>
          <h1 className="text-xl font-semibold text-primary">Configurações</h1>
        </div>

        {/* Content */}
        <div className="pt-6">
          {/* Conta */}
          <SettingsSection title="Conta">
            <SettingsMenuItem icon={User} label="Editar Perfil" />
            <SettingsMenuItem icon={Lock} label="Privacidade" />
            <SettingsMenuItem icon={Bell} label="Notificações" />
          </SettingsSection>

          {/* Segurança */}
          <SettingsSection title="Segurança">
            <SettingsToggleItem
              icon={Eye}
              label="Modo Discreto"
              checked={modoDiscreto}
              onChange={setModoDiscreto}
            />
            <SettingsMenuItem icon={Shield} label="Segurança e Proteção" />
            <SettingsMenuItem icon={UserX} label="Usuárias Bloqueadas" />
          </SettingsSection>

          {/* Preferências */}
          <SettingsSection title="Preferências">
            <SettingsMenuItem icon={Globe} label="Idioma" rightText="Português" />
            <SettingsMenuItem icon={Moon} label="Tema" rightText="Claro" />
          </SettingsSection>

          {/* Suporte */}
          <SettingsSection title="Suporte">
            <SettingsMenuItem icon={HelpCircle} label="Central de Ajuda" />
            <SettingsMenuItem icon={FileText} label="Termos de Uso" />
            <SettingsMenuItem icon={Lock} label="Política de Privacidade" />
          </SettingsSection>

          {/* Modo Discreto Info Card */}
          {modoDiscreto && (
            <div className="mx-5 mb-6">
              <div className="bg-gradient-to-br from-[#E8D5F2] to-[#D4B5F0] rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <Eye className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-primary mb-2">
                      Modo Discreto
                    </h3>
                    <p className="text-sm text-primary/80 leading-relaxed">
                      Oculta o nome e ícone do app quando ativado. Mantenha sua
                      privacidade em situações onde precisar de discrição.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sair */}
          <div className="px-5 pb-8">
            <button className="w-full bg-white rounded-2xl py-4 flex items-center justify-center gap-2 text-accent hover:bg-accent/10 transition-colors shadow-sm">
              <LogOut className="w-5 h-5" />
              <span className="font-semibold">Sair</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
