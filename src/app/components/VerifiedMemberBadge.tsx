import { Shield } from 'lucide-react';

export function VerifiedMemberBadge() {
  return (
    <div className="bg-gradient-to-br from-[#D4B5F0] to-[#C8A8E9] rounded-2xl p-6 flex flex-col items-center justify-center text-center">
      <Shield className="w-12 h-12 text-primary mb-3" strokeWidth={1.5} />
      <h3 className="text-lg font-semibold text-primary mb-2">Membro Verificado</h3>
      <p className="text-sm text-primary/80">
        Você contribui para tornar a comunidade mais segura
      </p>
    </div>
  );
}
