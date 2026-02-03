import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Search, Shield, Save, Loader2, AlertCircle, Trash2, CheckSquare, Square, CheckCircle } from 'lucide-react';
import type { AccessRole, AccessStatus } from '../shared/hooks/useAdmin';
import { adminListProfiles, adminSetProfileAccess, adminDeleteUsers, type AdminProfileRow } from '../shared/services/adminUsers';
import { supabase } from '../infra/supabase';

interface AdminGerenciarUsuariosProps {
  onNavigate: (page: string) => void;
}

const ROLE_OPTIONS: Array<{ value: AccessRole; label: string }> = [
  { value: 'user_viewer', label: 'Usuária (viewer)' },
  { value: 'admin_locais', label: 'Admin Locais' },
  { value: 'admin_eventos', label: 'Admin Eventos' },
  { value: 'admin_servicos', label: 'Admin Serviços' },
  { value: 'admin_geral', label: 'Admin Geral' },
];

const STATUS_OPTIONS: Array<{ value: AccessStatus; label: string }> = [
  { value: 'active', label: 'Ativa' },
  { value: 'blocked', label: 'Bloqueada' },
  { value: 'inactive', label: 'Inativa' },
];

export function AdminGerenciarUsuarios({ onNavigate }: AdminGerenciarUsuariosProps) {
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());

  const [authUserId, setAuthUserId] = useState<string | null>(null);
  const [rows, setRows] = useState<AdminProfileRow[]>([]);
  const [draft, setDraft] = useState<Record<string, { role: AccessRole; status: AccessStatus }>>({});

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setAuthUserId(user?.id ?? null);

      const data = await adminListProfiles();
      setRows(data);
      setDraft(
        Object.fromEntries(
          data.map((r) => [r.id, { role: r.role, status: r.status }])
        )
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar usuárias');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => {
      const email = (r.email || '').toLowerCase();
      const name = (r.name || '').toLowerCase();
      return email.includes(q) || name.includes(q) || r.id.toLowerCase().includes(q);
    });
  }, [rows, search]);

  const hasChanges = (id: string) => {
    const current = rows.find((r) => r.id === id);
    const d = draft[id];
    if (!current || !d) return false;
    return current.role !== d.role || current.status !== d.status;
  };

  const saveRow = async (id: string) => {
    const d = draft[id];
    if (!d) return;
    setSavingId(id);
    setError(null);
    setSuccessMessage(null);
    try {
      await adminSetProfileAccess({
        targetUserId: id,
        newRole: d.role,
        newStatus: d.status,
      });
      setSuccessMessage('Alterações salvas com sucesso!');
      await load();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao salvar');
    } finally {
      setSavingId(null);
    }
  };

  const toggleSelectUser = (userId: string) => {
    if (userId === authUserId) return; // Não permitir selecionar a si mesmo
    setSelectedUsers((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    const selectableIds = filtered
      .map((u) => u.id)
      .filter((id) => id !== authUserId);
    
    if (selectedUsers.size === selectableIds.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(selectableIds));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedUsers.size === 0) {
      setError('Selecione pelo menos um usuário para deletar');
      return;
    }

    const confirmMessage = `Tem certeza que deseja deletar ${selectedUsers.size} usuário(s)?\n\nEsta ação não pode ser desfeita!`;
    if (!window.confirm(confirmMessage)) {
      return;
    }

    setDeleting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await adminDeleteUsers(Array.from(selectedUsers));
      setSuccessMessage(`${selectedUsers.size} usuário(s) deletado(s) com sucesso!`);
      setSelectedUsers(new Set());
      await load();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao deletar usuários');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-border">
          <button
            onClick={() => onNavigate('admin')}
            className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="font-semibold text-lg text-primary">
            Gerenciar Usuárias
          </h1>
          <div className="w-10" />
        </div>

        {/* Search and Actions */}
        <div className="px-5 py-4 border-b border-border space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome, email ou id..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Selection Controls */}
          {!loading && filtered.length > 0 && (
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={toggleSelectAll}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors"
              >
                {selectedUsers.size === filtered.filter((u) => u.id !== authUserId).length ? (
                  <CheckSquare className="w-4 h-4" />
                ) : (
                  <Square className="w-4 h-4" />
                )}
                <span>
                  {selectedUsers.size === filtered.filter((u) => u.id !== authUserId).length
                    ? 'Desmarcar todos'
                    : 'Selecionar todos'}
                </span>
              </button>

              {selectedUsers.size > 0 && (
                <button
                  onClick={handleDeleteSelected}
                  disabled={deleting}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Deletando...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Deletar ({selectedUsers.size})
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>

        {successMessage && (
          <div className="px-5 py-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="px-5 py-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">Erro</p>
                <p className="text-xs text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {loading ? (
            <div className="py-12 text-center">
              <Loader2 className="w-6 h-6 text-primary animate-spin mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Carregando usuárias...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center">
              <Shield className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Nenhuma usuária encontrada.</p>
            </div>
          ) : (
            filtered.map((u) => {
              const d = draft[u.id] || { role: u.role, status: u.status };
              const disabledSelf = authUserId === u.id;
              const isSelected = selectedUsers.has(u.id);

              return (
                <div
                  key={u.id}
                  className={`bg-white border rounded-2xl p-4 transition-colors ${
                    isSelected ? 'border-primary bg-primary/5' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {/* Checkbox de seleção */}
                      <button
                        onClick={() => toggleSelectUser(u.id)}
                        disabled={disabledSelf}
                        className={`mt-1 flex-shrink-0 ${
                          disabledSelf ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
                        }`}
                      >
                        {isSelected ? (
                          <CheckSquare className="w-5 h-5 text-primary" />
                        ) : (
                          <Square className="w-5 h-5 text-gray-400" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <button
                          onClick={() => onNavigate(`view-profile:${u.id}`)}
                          className="font-semibold text-gray-900 truncate text-left hover:text-primary transition-colors w-full"
                          title="Ver perfil da usuária"
                        >
                          {u.name || 'Sem nome'}
                          {disabledSelf ? ' (você)' : ''}
                        </button>
                        <p className="text-xs text-gray-600 truncate">{u.email || 'Sem email'}</p>
                        <p className="text-[10px] text-gray-400 break-all mt-1">{u.id}</p>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        <Shield className="w-3.5 h-3.5" />
                        Acesso
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div>
                      <label className="text-xs font-medium text-gray-700">Perfil</label>
                      <select
                        value={d.role}
                        disabled={disabledSelf}
                        onChange={(e) =>
                          setDraft((prev) => ({
                            ...prev,
                            [u.id]: { ...prev[u.id], role: e.target.value as AccessRole },
                          }))
                        }
                        className="mt-1 w-full px-3 py-2 bg-muted rounded-xl border border-transparent focus:border-secondary focus:outline-none transition-colors text-sm"
                      >
                        {ROLE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      {disabledSelf && (
                        <p className="text-[10px] text-gray-500 mt-1">
                          Para segurança, você não pode alterar seu próprio perfil aqui.
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700">Status</label>
                      <select
                        value={d.status}
                        disabled={disabledSelf}
                        onChange={(e) =>
                          setDraft((prev) => ({
                            ...prev,
                            [u.id]: { ...prev[u.id], status: e.target.value as AccessStatus },
                          }))
                        }
                        className="mt-1 w-full px-3 py-2 bg-muted rounded-xl border border-transparent focus:border-secondary focus:outline-none transition-colors text-sm"
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => saveRow(u.id)}
                      disabled={disabledSelf || savingId === u.id || !hasChanges(u.id)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {savingId === u.id ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Salvar
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

