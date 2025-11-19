// pagina de perfil simples mostrando dados do usuario logado
import { useAuth } from '@/contexts/AuthContext'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import Modal from '@/components/Modal'
import { useToast } from '@/components/ToastProvider'
import { ListOrdered, KeyRound, Save, User as UserIcon, Mail, Phone, Home as HomeIcon, MapPin } from 'lucide-react'

export default function Profile() {
  const { user, updateProfile, changePassword } = useAuth()
  const toast = useToast()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: (user as any)?.phone || '',
    address: (user as any)?.address || '',
    zip_code: (user as any)?.zip_code || '',
    password: ''
  })
  const [saving, setSaving] = useState(false)
  const [pwdOpen, setPwdOpen] = useState(false)
  const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold">Perfil</h1>
  <p className="text-gray-600">Você precisa estar logado para ver esta página.</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-6">Meu Perfil</h1>
      <div className="rounded-xl border bg-white p-6 space-y-4">
        {!editing ? (
          <>
            <div className="mb-2 flex items-center gap-2"><UserIcon size={18} className="text-gray-500" /><span className="font-semibold">Nome:</span> {user.name}</div>
            <div className="mb-2 flex items-center gap-2"><Mail size={18} className="text-gray-500" /><span className="font-semibold">E-mail:</span> {user.email}</div>
            <div className="mb-2 flex items-center gap-2"><Phone size={18} className="text-gray-500" /><span className="font-semibold">Telefone:</span> {(user as any).phone || '-'}</div>
            <div className="mb-2 flex items-center gap-2"><HomeIcon size={18} className="text-gray-500" /><span className="font-semibold">Endereço:</span> {(user as any).address || '-'}
            </div>
            <div className="mb-4 flex items-center gap-2"><MapPin size={18} className="text-gray-500" /><span className="font-semibold">CEP:</span> {(user as any).zip_code || '-'}</div>
            <div className="flex items-center justify-between">
              <div><span className="font-semibold">Tipo:</span> {user.role || 'CLIENTE'}</div>
              <div className="flex gap-2">
                <Link to="/meus-pedidos" className="text-yellow-600 hover:text-yellow-700 underline inline-flex items-center gap-2">
                  <ListOrdered size={16} /> Ver meus pedidos
                </Link>
                <button onClick={() => setEditing(true)} className="px-4 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600">Editar</button>
                <button onClick={() => setPwdOpen(true)} className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200 inline-flex items-center gap-2"><KeyRound size={16}/> Alterar senha</button>
              </div>
            </div>
          </>
        ) : (
          <form
            className="grid grid-cols-1 gap-4"
            onSubmit={async (e) => {
              e.preventDefault()
              if (!form.name || !form.email || !form.password) {
                toast.error('Preencha nome, e-mail e confirme sua senha.')
                return
              }
              setSaving(true)
              const result = await updateProfile({ ...form })
              setSaving(false)
              if (result.ok) {
                toast.success('Perfil atualizado.')
                setEditing(false)
                setForm((f) => ({ ...f, password: '' }))
              } else {
                toast.error(result.error || 'Falha ao atualizar perfil')
              }
            }}
          >
            <div>
              <label className="block text-sm font-medium mb-1">Nome</label>
              <input className="w-full border rounded-lg px-3 py-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">E-mail</label>
              <input type="email" className="w-full border rounded-lg px-3 py-2" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Telefone</label>
                <input className="w-full border rounded-lg px-3 py-2" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">CEP</label>
                <input className="w-full border rounded-lg px-3 py-2" value={form.zip_code} onChange={(e) => setForm({ ...form, zip_code: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Endereço</label>
              <input className="w-full border rounded-lg px-3 py-2" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Sua senha (confirmação)</label>
              <input type="password" className="w-full border rounded-lg px-3 py-2" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <button type="button" onClick={() => setEditing(false)} className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200">Cancelar</button>
              <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-tertiary text-white hover:bg-red-600 inline-flex items-center gap-2">
                <Save size={16}/> {saving ? 'Salvando...' : 'Salvar alterações'}
              </button>
            </div>
          </form>
        )}
      </div>

      <Modal open={pwdOpen} onClose={() => setPwdOpen(false)} title="Alterar senha">
        <form
          className="space-y-3"
          onSubmit={async (e) => {
            e.preventDefault()
            if (!pwdForm.currentPassword || !pwdForm.newPassword || !pwdForm.confirmPassword) {
              toast.error('Preencha todas as senhas.')
              return
            }
            if (pwdForm.newPassword.length < 8) {
              toast.error('Nova senha deve ter pelo menos 8 caracteres.')
              return
            }
            const result = await changePassword(pwdForm)
            if (result.ok) {
              toast.success('Senha alterada com sucesso.')
              setPwdOpen(false)
              setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
            } else {
              toast.error(result.error || 'Falha ao alterar senha')
            }
          }}
        >
          <div>
            <label className="block text-sm font-medium mb-1">Senha atual</label>
            <input type="password" className="w-full border rounded-lg px-3 py-2" value={pwdForm.currentPassword} onChange={(e) => setPwdForm({ ...pwdForm, currentPassword: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Nova senha</label>
              <input type="password" className="w-full border rounded-lg px-3 py-2" value={pwdForm.newPassword} onChange={(e) => setPwdForm({ ...pwdForm, newPassword: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Confirmar nova senha</label>
              <input type="password" className="w-full border rounded-lg px-3 py-2" value={pwdForm.confirmPassword} onChange={(e) => setPwdForm({ ...pwdForm, confirmPassword: e.target.value })} />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setPwdOpen(false)} className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200">Cancelar</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-tertiary text-white hover:bg-red-600 inline-flex items-center gap-2"><KeyRound size={16}/> Alterar senha</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
