// página admin para gerenciar itens do cardápio (versão simples)
import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/components/ToastProvider'
import Modal from '@/components/Modal'
import { Plus, Pencil, Trash2, Utensils } from 'lucide-react'

type Item = { id: string; name: string; price: number; category_id?: string }
type Category = { id: string; name: string }

export default function AdminMenu() {
  const { token } = useAuth()
  const [items, setItems] = useState<Item[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState<{ name: string; price: string; categoryId: string }>({ name: '', price: '', categoryId: '' })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<{ name: string; price: string }>({ name: '', price: '' })
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const toast = useToast()

  useEffect(() => {
    async function load() {
      // reusa GET /api/menu para categorias e itens
      const res = await fetch('/api/menu')
      const data = await res.json()
      const cats: Category[] = (data.categories || []).map((c: any) => ({ id: c.id, name: c.name }))
      const flat: Item[] = (data.categories || []).flatMap((c: any) => c.items || [])
      setCategories(cats)
      setItems(flat)
      setLoading(false)
    }
    load()
  }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
  if (!token) { toast.error('Sem token'); return }
  if (!form.name || !form.price) { toast.error('Preencha nome e preço'); return }
    setCreating(true)
    try {
      const res = await fetch('/api/menu/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: form.name, price: Number(form.price), categoryId: form.categoryId || undefined })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'Falha ao criar')
      // recarrega lista simples
      setItems((prev) => [...prev, data])
      setForm({ name: '', price: '', categoryId: '' })
      toast.success('Item criado')
    } catch (e: any) {
      toast.error(e.message || 'Erro ao criar item')
    } finally {
      setCreating(false)
    }
  }

  function startEdit(it: Item) {
    setEditingId(it.id)
    setEditForm({ name: it.name, price: String(it.price) })
  }

  async function saveEdit(id: string) {
    if (!token) return
    try {
      const res = await fetch(`/api/menu/items/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: editForm.name, price: Number(editForm.price) })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'Falha ao editar')
      setItems((prev) => prev.map((p) => (p.id === id ? { ...p, name: data.name, price: data.price } : p)))
      setEditingId(null)
      toast.success('Item atualizado')
    } catch (e: any) {
      toast.error(e.message || 'Erro ao editar item')
    }
  }

  async function remove(id: string) {
    if (!token) return
    try {
      const res = await fetch(`/api/menu/items/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok && res.status !== 204) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.message || 'Falha ao excluir')
      }
      setItems((prev) => prev.filter((p) => p.id !== id))
      toast.success('Item excluído')
    } catch (e: any) {
      toast.error(e.message || 'Erro ao excluir item')
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-6 inline-flex items-center gap-2"><Utensils size={22} /> Admin - Cardápio</h1>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <>
          <form onSubmit={handleCreate} className="mb-4 rounded border bg-white p-3 flex flex-col gap-2">
            <div className="font-semibold inline-flex items-center gap-2"><Plus size={16} /> Adicionar novo item</div>
            <div className="grid md:grid-cols-4 gap-2">
              <input className="border rounded px-2 py-1" placeholder="Nome" value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} />
              <input className="border rounded px-2 py-1" placeholder="Preço" value={form.price} onChange={(e)=>setForm({...form, price: e.target.value})} />
              <select className="border rounded px-2 py-1" value={form.categoryId} onChange={(e)=>setForm({...form, categoryId: e.target.value})}>
                <option value="">Sem categoria</option>
                {categories.map((c)=> <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <button disabled={creating} className="bg-yellow-500 text-white rounded px-3 py-1 disabled:opacity-60 inline-flex items-center gap-1">{creating? 'Adicionando...':(<><Plus size={16} /> Adicionar</>)}</button>
            </div>
          </form>
          <div className="overflow-auto rounded border bg-white">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-2">Nome</th>
                  <th className="text-left p-2">Preço</th>
                  <th className="text-left p-2">Categoria</th>
                  <th className="text-left p-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it.id} className="border-t">
                    <td className="p-2">{it.name}</td>
                    <td className="p-2">R$ {Number(it.price).toFixed(2)}</td>
                    <td className="p-2">{categories.find((c)=>c.id===it.category_id)?.name || '-'}</td>
                    <td className="p-2 space-x-2">
                      {editingId === it.id ? (
                        <>
                          <input className="border rounded px-2 py-1" value={editForm.name} onChange={(e)=>setEditForm((f)=>({...f, name: e.target.value}))} />
                          <input className="border rounded px-2 py-1" value={editForm.price} onChange={(e)=>setEditForm((f)=>({...f, price: e.target.value}))} />
                          <button onClick={()=>saveEdit(it.id)} className="px-2 py-1 text-xs rounded border border-green-500 text-green-600 hover:bg-green-50 inline-flex items-center gap-1"><Pencil size={14} /> Salvar</button>
                          <button onClick={()=>setEditingId(null)} className="px-2 py-1 text-xs rounded border">Cancelar</button>
                        </>
                      ) : (
                        <>
                          <button onClick={()=>startEdit(it)} className="px-2 py-1 text-xs rounded border border-blue-500 text-blue-600 hover:bg-blue-50 inline-flex items-center gap-1"><Pencil size={14} /> Editar</button>
                          <button onClick={()=>setConfirmId(it.id)} className="px-2 py-1 text-xs rounded border border-red-500 text-red-600 hover:bg-red-50 inline-flex items-center gap-1"><Trash2 size={14} /> Excluir</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Modal de confirmação de exclusão */}
          <Modal open={!!confirmId} title="Confirmar exclusão" onClose={()=>setConfirmId(null)}>
            <p className="mb-4">Tem certeza que deseja excluir/desativar este item?</p>
            <div className="flex justify-end gap-2">
              <button onClick={()=>setConfirmId(null)} className="px-3 py-1 border rounded">Cancelar</button>
              <button onClick={()=>{ if(confirmId){ remove(confirmId); setConfirmId(null)} }} className="px-3 py-1 rounded bg-red-600 text-white">Excluir</button>
            </div>
          </Modal>
        </>
      )}
    </div>
  )
}
