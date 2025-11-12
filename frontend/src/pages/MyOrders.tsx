// pagina de historico de pedidos do usuario autenticado
import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { ShoppingBag, CalendarClock, CheckCircle2, Hourglass, AlertTriangle, Truck } from 'lucide-react'

type OrderItemView = {
  id: string
  quantity: number
  unit_price: number
  total_price: number
  item?: { id: string; name: string }
}

type OrderView = {
  id: string
  total: number
  created_at?: string
  status?: 'PENDENTE' | 'PREPARANDO' | 'PRONTO' | 'ENTREGUE' | 'CANCELADO'
  items?: OrderItemView[]
}

export default function MyOrders() {
  const { token } = useAuth()
  const [orders, setOrders] = useState<OrderView[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function load() {
      if (!token) return
      try {
        const res = await fetch('/api/orders', { headers: { Authorization: `Bearer ${token}` } })
        const data = await res.json()
        if (res.ok && mounted) setOrders(data.orders || [])
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [token])

  if (!token) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-extrabold mb-6 inline-flex items-center gap-2"><ShoppingBag size={20} /> Meus Pedidos</h1>
        <p className="text-gray-600">Você precisa estar logado para ver seus pedidos.</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
  <h1 className="text-3xl font-extrabold mb-6 inline-flex items-center gap-2"><ShoppingBag size={20} /> Meus Pedidos</h1>
      {loading ? (
        <p className="text-gray-600">Carregando...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-600">Nenhum pedido encontrado.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="rounded border bg-white p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="font-semibold">Pedido #{o.id.slice(0, 8)}</div>
                  <div className="text-sm text-gray-600 inline-flex items-center gap-1">
                    <CalendarClock size={14} /> {o.created_at ? new Date(o.created_at).toLocaleString() : ''}
                  </div>
                </div>
                {/* Status do pedido */}
                <div>
                  {o.status === 'PENDENTE' && (
                    <span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-800 inline-flex items-center gap-1"><Hourglass size={14}/> PENDENTE</span>
                  )}
                  {o.status === 'PREPARANDO' && (
                    <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800 inline-flex items-center gap-1"><Hourglass size={14}/> PREPARANDO</span>
                  )}
                  {o.status === 'PRONTO' && (
                    <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-800 inline-flex items-center gap-1"><CheckCircle2 size={14}/> PRONTO</span>
                  )}
                  {o.status === 'ENTREGUE' && (
                    <span className="text-xs px-2 py-1 rounded bg-emerald-100 text-emerald-800 inline-flex items-center gap-1"><Truck size={14}/> ENTREGUE</span>
                  )}
                  {o.status === 'CANCELADO' && (
                    <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-800 inline-flex items-center gap-1"><AlertTriangle size={14}/> CANCELADO</span>
                  )}
                </div>
              </div>
              <ul className="text-sm text-gray-700 mb-2">
                {o.items?.map((it) => (
                  <li key={it.id} className="flex items-center justify-between">
                    <span>
                      {it.quantity}x {it.item?.name || 'Item'}
                    </span>
                    <span>R$ {Number(it.total_price).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between font-semibold">
                <span>Total</span>
                <span>R$ {Number(o.total).toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
