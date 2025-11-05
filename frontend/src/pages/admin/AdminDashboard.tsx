import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Users, Utensils, Receipt } from 'lucide-react'

type Metrics = { users: number; items: number; orders: number }

export default function AdminDashboard() {
  const { token } = useAuth()
  const [data, setData] = useState<Metrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/admin/dashboard', { headers: { Authorization: `Bearer ${token}` } })
      const json = await res.json()
      setData(json)
      setLoading(false)
    }
    if (token) load()
  }, [token])

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-6">Admin - Dashboard</h1>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-lg border bg-white p-6">
            <div className="text-gray-500 text-sm inline-flex items-center gap-2"><Users size={16} /> Usuários ativos</div>
            <div className="text-3xl font-bold">{data?.users ?? '-'}</div>
          </div>
          <div className="rounded-lg border bg-white p-6">
            <div className="text-gray-500 text-sm inline-flex items-center gap-2"><Utensils size={16} /> Itens do cardápio</div>
            <div className="text-3xl font-bold">{data?.items ?? '-'}</div>
          </div>
          <div className="rounded-lg border bg-white p-6">
            <div className="text-gray-500 text-sm inline-flex items-center gap-2"><Receipt size={16} /> Pedidos</div>
            <div className="text-3xl font-bold">{data?.orders ?? '-'}</div>
          </div>
        </div>
      )}
    </div>
  )
}
