import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import PageShell from '../components/PageShell';
import type { Employee } from '../types';

const Employees: React.FC = () => {
  const { employees, addEmployee, deleteEmployee, currentUser } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newName.trim() === '' || newEmail.trim() === '' || newPassword.trim() === '') {
      setError('Todos os campos são obrigatórios');
      return;
    }

    if (newPassword.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      await addEmployee(newName, newEmail, newPassword, isAdmin);
      setNewName('');
      setNewEmail('');
      setNewPassword('');
      setIsAdmin(false);
      setShowModal(false);
      setError('');
    } catch (error: unknown) {
      
      if (error instanceof Error) {
        const errorMessage = error.message;
        
        if (errorMessage.includes('permission-denied') || errorMessage.includes('Missing or insufficient permissions')) {
          setError('🔒 Erro de permissão no Firestore. As regras de segurança precisam ser configuradas. Consulte o arquivo FIRESTORE_RULES.md na raiz do projeto.');
        }
        else if (errorMessage.includes('email-already-in-use') || errorMessage.includes('já está cadastrado')) {
          setError('⚠️ Este email já foi cadastrado. Se o Usuário não aparece na lista, pode haver um problema nas regras do Firestore. Consulte FIRESTORE_RULES.md');
        } 
        else {
          setError(errorMessage || 'Erro ao adicionar Usuário. Verifique o console para mais detalhes.');
        }
      } else {
        setError('Erro desconhecido. Verifique as regras do Firestore (veja FIRESTORE_RULES.md)');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmployee = async (employee: Employee) => {
    if (!employee.id) {
      alert('❌ Erro: ID do Usuário não encontrado.');
      return;
    }

    if (employee.id === currentUser?.id) {
      alert('❌ Você não pode remover sua própria conta.');
      return;
    }

    const confirmDelete = window.confirm(
      `⚠️ Tem certeza que deseja remover o Usuário "${employee.name}"?\n\n` +
      `O Usuário não poderá mais fazer login no sistema.\n\n` +
      `⚠️ Para apagar completamente o Usuário do sistema, é necessário excluir manualmente, me mande mensagem`
    );

    if (!confirmDelete) return;

    try {
      await deleteEmployee(employee.id);
      alert('✅ Usuário removido com sucesso!');
    } catch {
      alert('❌ Erro ao remover Usuário.');
    }
  };

  if (!currentUser?.isAdmin) {
    return (
      <PageShell title="Usuários" subtitle="Gerencie usuários e permissões" >
        <div className="surface-card p-12 text-center">
            <h2 className="text-2xl font-bold text-slate-100">Acesso Negado</h2>
            <p className="mt-4 text-slate-300">
              Apenas administradores podem gerenciar Usuários.
            </p>
          </div>
      </PageShell>
    );
  }

  return (
    <PageShell title="Usuários" subtitle="Crie contas e defina permissões (admin/Usuário).">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="text-center sm:text-left">
          <h2 className="text-xl font-bold text-slate-100">Gerenciar usuários</h2>
        </div>
        <div className="flex justify-center sm:justify-end">
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary"
          >
            + Adicionar usuário
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {employees.map((employee: Employee) => (
          <div
            key={employee.id}
            className={`group rounded-2xl border bg-slate-900/70 p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 ${
              employee.isAdmin
                ? 'border-rose-300/30'
                : 'border-cyan-300/25'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-xl font-black text-white shadow-lg ${employee.isAdmin ? 'bg-linear-to-br from-rose-500 to-red-500' : 'bg-linear-to-br from-cyan-500 to-violet-500'}`}>
                {employee.name.charAt(0).toUpperCase()}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-bold text-slate-100">{employee.name}</h3>
                    {employee.email && (
                      <p className="truncate text-sm text-slate-300">{employee.email}</p>
                    )}
                  </div>

                  <span
                    className={`shrink-0 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                      employee.isAdmin
                        ? 'border border-rose-300/40 bg-rose-500/20 text-rose-200'
                        : 'border border-cyan-300/40 bg-cyan-500/20 text-cyan-200'
                    }`}
                  >
                    {employee.isAdmin ? 'Admin' : 'Usuário'}
                  </span>
                </div>

                <div className="mt-4">
                  <div className="h-px bg-white/10" />
                  <p className="mt-3 text-xs text-slate-400">
                    ID: <span className="font-mono">{employee.id}</span>
                  </p>
                  
                  {/* Botão de Remover (apenas para outros Usuários, não para si mesmo) */}
                  {employee.id !== currentUser?.id && (
                    <button
                      onClick={() => handleDeleteEmployee(employee)}
                      className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-200 transition-all hover:bg-red-500/20 hover:border-red-400/60"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Remover Usuário
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-white/15 bg-slate-900 shadow-2xl">
            <div className="bg-linear-to-r from-blue-700 to-red-600 p-6 text-white">
              <h2 className="text-2xl font-black">Adicionar Usuário</h2>
              <p className="text-blue-100 text-sm mt-1">Ao adionar usuário, você sairá da sua conta. Entra novamente.
                Caso der algum erro, me mande mensagem</p>
            </div>

            <form onSubmit={handleAddEmployee} className="p-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">Nome *</label>
                <input type="text" value={newName} onChange={(e) => {setNewName(e.target.value); setError('');}} required disabled={loading} className="input-modern disabled:opacity-50" placeholder="Nome" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">Email *</label>
                <input type="email" value={newEmail} onChange={(e) => {setNewEmail(e.target.value); setError('');}} required disabled={loading} className="input-modern disabled:opacity-50" placeholder="email@exemplo.com" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">Senha *</label>
                <input type="password" value={newPassword} onChange={(e) => {setNewPassword(e.target.value); setError('');}} required disabled={loading} minLength={6} className="input-modern disabled:opacity-50" placeholder="Mínimo 6 caracteres" />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="isAdmin" checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} disabled={loading} className="h-5 w-5 rounded border-white/25 bg-slate-900 text-cyan-400 focus:ring-2 focus:ring-cyan-400 disabled:opacity-50" />
                <label htmlFor="isAdmin" className="text-sm font-medium text-slate-200">Administrador</label>
              </div>
              {error && <div className="rounded-lg border border-red-400/50 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>}

              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                <button type="button" onClick={() => {setShowModal(false); setNewName(''); setNewEmail(''); setNewPassword(''); setIsAdmin(false); setError('');}} disabled={loading} className="btn-ghost disabled:opacity-50">Cancelar</button>
                <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">{loading ? 'Adicionando...' : 'Adicionar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageShell>
  );
};

export default Employees;
