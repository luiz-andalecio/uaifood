import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/components/ToastProvider'

type OrderItemView = {
  id: string
  quantity: number
  unit_price: number
  total_price: number
  item?: { id: string; name: string }
}

type OrderView = {
  id: string
  user?: { id: string; name: string; email: string }
  table_number?: string | null
  status?: string
  total: number
  created_at?: string
  items?: OrderItemView[]
}

export default function AdminOrders() {
  const { token } = useAuth()
  const toast = useToast()
  const [orders, setOrders] = useState<OrderView[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('')

  async function load(s?: string) {
    setLoading(true)
    try {
      const url = new URL('/api/admin/orders', window.location.origin)
      const status = typeof s === 'string' ? s : statusFilter
      if (status) url.searchParams.set('status', status)
      const res = await fetch(url.toString(), { headers: token ? { 'x-access-token': token } : {} })
      const json = await res.json()
      setOrders(json?.data?.orders || [])
    } catch (e) {
      toast.error('Falha ao carregar pedidos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  async function setStatus(id: string, status: string) {
    setUpdating(id)
    try {
      const res = await fetch(`/api/admin/orders/${id}/status`, {
        method: 'PATCH',
        headers: token ? { 'Content-Type': 'application/json', 'x-access-token': token } : { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.message || 'Falha ao atualizar status')
      toast.success('Status atualizado')
      load()
    } catch {
      toast.error('Erro ao atualizar status')
    } finally {
      setUpdating(null)
    }
  }

  async function cancel(id: string) {
    if (!confirm('Confirmar cancelamento?')) return
    setUpdating(id)
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'DELETE',
        headers: token ? { 'x-access-token': token } : {}
      })
      if (!res.ok) throw new Error()
      toast.success('Pedido cancelado')
      load()
    } catch {
      toast.error('Erro ao cancelar pedido')
    } finally {
      setUpdating(null)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-6">Pedidos - Administração</h1>
      {/* Filtros por status */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {[
          { label: 'Todos', value: '' },
          { label: 'Pendentes', value: 'PENDENTE' },
          { label: 'Preparando', value: 'PREPARANDO' },
          { label: 'Prontos', value: 'PRONTO' },
          { label: 'Entregues', value: 'ENTREGUE' },
          { label: 'Cancelados', value: 'CANCELADO' }
        ].map((f) => (
          <button
            key={f.value || 'ALL'}
            className={`px-3 py-1.5 text-sm rounded-full border ${statusFilter === f.value ? 'bg-yellow-100 border-yellow-400 text-yellow-800' : 'bg-white hover:bg-gray-50'}`}
            onClick={() => { setStatusFilter(f.value); load(f.value) }}
          >
            {f.label}
          </button>
        ))}
      </div>
      {loading ? (
        <p>Carregando...</p>
      ) : orders.length === 0 ? (
        <p>Nenhum pedido encontrado.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="rounded-xl border bg-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">Mesa {o.table_number || '—'} · {o.user?.name || '—'}</div>
                  <div className="text-sm text-gray-600">Total: R$ {Number(o.total).toFixed(2)} · Status: {o.status || 'PENDENTE'}</div>
                </div>
                <div className="flex gap-2">
                  {['PENDENTE', 'PREPARANDO', 'PRONTO', 'ENTREGUE'].map((s) => (
                    <button
                      key={s}
                      className={`px-3 py-1 text-sm rounded border ${o.status === s ? 'bg-yellow-100' : 'bg-white hover:bg-gray-50'}`}
                      disabled={updating === o.id}
                      onClick={() => setStatus(o.id, s)}
                    >
                      {s}
                    </button>
                  ))}
                  <button
                    className="px-3 py-1 text-sm rounded border text-red-600 hover:bg-red-50"
                    disabled={updating === o.id}
                    onClick={() => cancel(o.id)}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
              {o.items && o.items.length > 0 && (
                <ul className="mt-3 text-sm text-gray-700 list-disc list-inside">
                  {o.items.map((it) => (
                    <li key={it.id}>{it.quantity}x {it.item?.name} — R$ {Number(it.total_price).toFixed(2)}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
