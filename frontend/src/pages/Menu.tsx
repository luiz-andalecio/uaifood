// Pagina de Cardapio com abas simples + carrinho com checkout ao lado
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/components/ToastProvider'
import { Plus, Trash2, CreditCard, CheckCircle2, Monitor } from 'lucide-react'

// tipo basico de item e categoria
type Item = { id: string; name: string; price: number }
type Category = { id: string; name: string; items: Item[] }

export default function Menu() {
  const [categories, setCategories] = useState<Category[]>([])
  const { addItem, items, total, setQuantity, removeItem, clear } = useCart()
  const [active, setActive] = useState<string>('')
  const { token } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  // mesa automática por sessão (1..12). Simula tablets fixos em cada mesa.
  const [tableNumber, setTableNumber] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'DINHEIRO' | 'DEBITO' | 'CREDITO' | 'PIX'>('PIX')
  const [submitting, setSubmitting] = useState(false)
  const [mesaInvalid, setMesaInvalid] = useState(false)

  // carrega dados da API publica
  useEffect(() => {
    fetch('/api/menu')
      .then((r) => r.json())
      .then((data) => setCategories(data.categories || []))
      .catch(() => setCategories([]))
  }, [])

  const activeCategory = useMemo(() => categories.find(c => c.id === active) || categories[0], [categories, active])

  // função de finalizar pedido direto do carrinho lateral
  // inicializa mesa automática usando sessionStorage para manter na sessão do navegador
  useEffect(() => {
    const stored = sessionStorage.getItem('uaifood_table_number')
    if (stored) {
      setTableNumber(stored)
    } else {
      const randomMesa = String(Math.floor(Math.random() * 12) + 1) // 1..12
      sessionStorage.setItem('uaifood_table_number', randomMesa)
      setTableNumber(randomMesa)
    }
  }, [])

  async function finalizeOrder() {
    if (!token) {
      return navigate('/login', { state: { from: { pathname: '/cardapio' } } })
    }
    if (items.length === 0) {
      toast.info('Seu carrinho está vazio')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          tableNumber: tableNumber || null,
          paymentMethod,
          items: items.map((i) => ({ itemId: i.id, quantity: i.quantity }))
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'Falha ao criar pedido')
      clear()
      toast.success('Pedido criado com sucesso!')
      navigate('/meus-pedidos')
    } catch (e: any) {
      toast.error(e.message || 'Erro ao finalizar pedido')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-extrabold mb-2 text-center">Nosso Cardápio</h1>
      <p className="text-center text-gray-600 mb-8">Explore nossos deliciosos pratos e monte seu pedido</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Coluna esquerda: cardápio com tabs */}
        <div className="md:col-span-2">
          {/* Tabs de categorias */}
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                className={`px-3 py-1.5 rounded-full border text-sm ${ (active ? active === c.id : categories[0]?.id === c.id) ? 'bg-yellow-100 border-yellow-400 text-yellow-800' : 'bg-white hover:bg-gray-50'}`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Grid de cards com animações */}
          <div className="rounded-xl border bg-white p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">{activeCategory?.name}</h3>
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                {activeCategory?.items?.length || 0} itens
              </span>
            </div>
            {activeCategory?.items?.length ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeCategory.items.map((it, idx) => (
                  <div
                    key={it.id}
                    style={{ animationDelay: `${idx * 40}ms` }}
                    className="animate-fade-in-up group relative rounded-xl border bg-white/90 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
                  >
                    <div className="p-4 flex-1 flex flex-col">
                      <h4 className="font-semibold mb-1 leading-tight group-hover:text-tertiary transition-colors">
                        {it.name}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">R$ {Number(it.price).toFixed(2)}</p>
                      <div className="mt-auto">
                        <button
                          onClick={() => addItem({ id: it.id, name: it.name, price: Number(it.price) }, 1)}
                          className="w-full px-3 py-2 rounded-lg bg-gradient-to-r from-yellow-400 to-red-500 text-white text-sm font-medium inline-flex items-center justify-center gap-1 group-hover:animate-pop focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        >
                          <Plus size={16} /> Adicionar
                        </button>
                      </div>
                    </div>
                    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-yellow-50/40 to-red-50/40" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-600">Nenhum item nesta categoria.</div>
            )}
          </div>
        </div>

        {/* Coluna direita: carrinho + checkout */}
        <aside className="md:sticky md:top-20">
          <div className="rounded-xl border bg-white p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Meu Carrinho</h3>
              {items.length > 0 && (
                <button className="text-sm text-red-600 hover:underline inline-flex items-center gap-1" onClick={() => clear()}>
                  <Trash2 size={14} /> Limpar
                </button>
              )}
            </div>
            {items.length === 0 ? (
              <p className="text-sm text-gray-600">Seu carrinho está vazio</p>
            ) : (
              <ul className="divide-y">
                {items.map((i) => (
                  <li key={i.id} className="py-2 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-medium truncate">{i.name}</div>
                      <div className="text-xs text-gray-600">R$ {Number(i.price).toFixed(2)}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="px-2 py-1 border rounded" onClick={() => setQuantity(i.id, Math.max(1, i.quantity - 1))}>-</button>
                      <span className="w-8 text-center">{i.quantity}</span>
                      <button className="px-2 py-1 border rounded" onClick={() => setQuantity(i.id, i.quantity + 1)}>+</button>
                      <button className="px-2 py-1 border rounded text-red-600" onClick={() => removeItem(i.id)}>x</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-3 flex items-center justify-between font-semibold">
              <span>Total</span>
              <span>R$ {Number(total).toFixed(2)}</span>
            </div>
            {/* Checkout direto no carrinho (mesa automática) */}
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="inline-flex items-center gap-1 text-gray-700"><Monitor size={14}/> Mesa atual</span>
                <span className="px-2 py-1 rounded bg-gray-100 font-semibold">{tableNumber || '...'}</span>
              </div>
              <div>
                <label className="inline-flex items-center gap-2 text-sm text-gray-700 mb-1"><CreditCard size={16} /> Pagamento</label>
                <select value={paymentMethod} onChange={(e)=>setPaymentMethod(e.target.value as any)} className="w-full border rounded px-3 py-2">
                  <option value="PIX">PIX</option>
                  <option value="DEBITO">Débito</option>
                  <option value="CREDITO">Crédito</option>
                  <option value="DINHEIRO">Dinheiro</option>
                </select>
              </div>
              <button
                disabled={submitting || items.length === 0}
                onClick={finalizeOrder}
                className="w-full py-2 bg-yellow-500 text-white rounded disabled:opacity-60 inline-flex items-center justify-center gap-2"
              >
                {submitting ? 'Enviando...' : (<><CheckCircle2 size={18} /> Finalizar Pedido</>)}
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
