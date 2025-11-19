// pagina admin para gerenciar usuarios (listagem simples)
import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/components/ToastProvider'
import Modal from '@/components/Modal'
import { KeyRound, Trash2 } from 'lucide-react'

type User = { id: string; name: string; email: string; role: 'CLIENTE' | 'ADMIN' | 'ROOT' }

export default function AdminUsers() {
  const { token, user } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const isRoot = user?.role === 'ROOT'
  const toast = useToast()
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [passModal, setPassModal] = useState<{ id: string | null; value: string }>({ id: null, value: '' })

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/users?page=1&pageSize=50', {
        headers: token ? { 'x-access-token': token } : {}
      })
      const json = await res.json()
      setUsers(json?.data?.users || [])
      setLoading(false)
    }
    if (token) load()
  }, [token])

  async function changeRole(id: string, role: User['role']) {
  if (!isRoot) return toast.error('Somente ROOT pode alterar roles')
    try {
      const res = await fetch(`/api/users/${id}/role`, {
        method: 'PATCH',
        headers: token ? { 'Content-Type': 'application/json', 'x-access-token': token } : { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.message || 'Falha ao alterar role')
      const updated = json?.data
      if (updated) setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role: updated.role } : u)))
      toast.success('Tipo alterado')
    } catch (e: any) {
      toast.error(e.message || 'Erro ao alterar role')
    }
  }

  async function submitPassword(id: string, password: string) {
    if (!isRoot) return toast.error('Somente ROOT pode redefinir senhas')
    if (!password) return toast.error('Informe uma senha')
    try {
      const res = await fetch(`/api/users/${id}/password`, {
        method: 'PATCH',
        headers: token ? { 'Content-Type': 'application/json', 'x-access-token': token } : { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.message || 'Falha ao redefinir senha')
      toast.success('Senha atualizada com sucesso')
    } catch (e: any) {
      toast.error(e.message || 'Erro ao redefinir senha')
    }
  }

  async function deleteUser(id: string) {
    if (!isRoot) return toast.error('Somente ROOT pode excluir contas')
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers: token ? { 'x-access-token': token } : {}
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.message || 'Falha ao excluir')
      setUsers((prev) => prev.filter((u) => u.id !== id))
      toast.success('Usuário excluído (desativado)')
    } catch (e: any) {
      toast.error(e.message || 'Erro ao excluir usuário')
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
  <h1 className="text-3xl font-extrabold mb-6">Admin - Usuários</h1>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <>
        <div className="overflow-auto rounded border bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-2">Nome</th>
                <th className="text-left p-2">E-mail</th>
                <th className="text-left p-2">Tipo</th>
                {isRoot && <th className="text-left p-2">Ações</th>}
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="p-2">{u.name}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">
                    {isRoot ? (
                      <select value={u.role} onChange={(e)=>changeRole(u.id, e.target.value as User['role'])} className="border rounded px-2 py-1">
                        <option value="CLIENTE">CLIENTE</option>
                        <option value="ADMIN">ADMIN</option>
                        <option value="ROOT">ROOT</option>
                      </select>
                    ) : (
                      u.role
                    )}
                  </td>
                  {isRoot && (
                    <td className="p-2 space-x-2">
                      <button onClick={()=>setPassModal({ id: u.id, value: '' })} className="px-2 py-1 text-xs rounded border border-blue-500 text-blue-600 hover:bg-blue-50 inline-flex items-center gap-1"><KeyRound size={14} /> Resetar senha</button>
                      <button onClick={()=>setConfirmId(u.id)} className="px-2 py-1 text-xs rounded border border-red-500 text-red-600 hover:bg-red-50 inline-flex items-center gap-1"><Trash2 size={14} /> Excluir</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Modal de confirmação de exclusão */}
        <Modal open={!!confirmId} title="Confirmar exclusão" onClose={()=>setConfirmId(null)}>
          <p className="mb-4">Tem certeza que deseja excluir/desativar este usuário?</p>
          <div className="flex justify-end gap-2">
            <button onClick={()=>setConfirmId(null)} className="px-3 py-1 border rounded">Cancelar</button>
            <button onClick={()=>{ if(confirmId){ deleteUser(confirmId); setConfirmId(null)} }} className="px-3 py-1 rounded bg-red-600 text-white">Excluir</button>
          </div>
        </Modal>
        {/* Modal para redefinir senha */}
        <Modal open={!!passModal.id} title="Redefinir senha" onClose={()=>setPassModal({ id: null, value: '' })}>
          <div className="space-y-3">
            <input type="password" className="w-full border rounded px-3 py-2" placeholder="Nova senha (mín. 6 caracteres)" value={passModal.value} onChange={(e)=>setPassModal((p)=>({...p, value: e.target.value}))} />
            <div className="flex justify-end gap-2">
              <button onClick={()=>setPassModal({ id: null, value: '' })} className="px-3 py-1 border rounded">Cancelar</button>
              <button onClick={()=>{ if(passModal.id){ submitPassword(passModal.id, passModal.value); setPassModal({ id: null, value: '' }) } }} className="px-3 py-1 rounded bg-blue-600 text-white">Salvar</button>
            </div>
          </div>
        </Modal>
        </>
      )}
    </div>
  )
}
