// pagina de carrinho com resumo e finalizacao do pedido
import { useState } from 'react'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/components/ToastProvider'
import { Minus, Plus, Trash2, CreditCard, CheckCircle2 } from 'lucide-react'

export default function CartPage() {
  const { items, total, setQuantity, removeItem, clear } = useCart()
  const { token } = useAuth()
  const toast = useToast()
  const [tableNumber, setTableNumber] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'DINHEIRO' | 'DEBITO' | 'CREDITO' | 'PIX'>('PIX')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  async function finalizeOrder() {
    if (!token) {
      return navigate('/login', { state: { from: { pathname: '/carrinho' } } })
    }
    if (!tableNumber || tableNumber.trim() === '') {
      toast.error('Informe o número da mesa')
      return
    }
    if (items.length === 0) {
      toast.info('Seu carrinho está vazio')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-access-token': token },
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
      navigate('/perfil')
    } catch (e: any) {
      toast.error(e.message || 'Erro ao finalizar pedido')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
  <h1 className="text-3xl font-extrabold mb-6">Seu Carrinho</h1>
      {items.length === 0 ? (
        <p className="text-gray-600">Seu carrinho está vazio.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            {items.map((i) => (
              <div key={i.id} className="flex items-center justify-between rounded border bg-white p-3">
                <div>
                  <div className="font-medium">{i.name}</div>
                  <div className="text-sm text-gray-600">R$ {i.price.toFixed(2)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setQuantity(i.id, i.quantity - 1)} className="px-2 py-1 border rounded" aria-label="Diminuir quantidade">
                    <Minus size={16} />
                  </button>
                  <input
                    className="w-12 text-center border rounded"
                    type="number"
                    min={1}
                    value={i.quantity}
                    onChange={(e) => setQuantity(i.id, Number(e.target.value))}
                  />
                  <button onClick={() => setQuantity(i.id, i.quantity + 1)} className="px-2 py-1 border rounded" aria-label="Aumentar quantidade">
                    <Plus size={16} />
                  </button>
                  <button onClick={() => removeItem(i.id)} className="px-2 py-1 text-red-600 inline-flex items-center gap-1" aria-label="Remover item">
                    <Trash2 size={16} /> Remover
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded border bg-white p-4 h-fit">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold">R$ {total.toFixed(2)}</span>
            </div>
            <div className="mb-4 text-sm text-gray-500">Taxas serão calculadas pelo backend.</div>

            <div className="mb-3">
              <label className="block text-sm text-gray-700 mb-1">Mesa (opcional)</label>
              <input value={tableNumber} onChange={(e)=>setTableNumber(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Ex: 12" />
            </div>
            <div className="mb-4">
              <label className="inline-flex items-center gap-2 text-sm text-gray-700 mb-1"><CreditCard size={16} /> Pagamento</label>
              <select value={paymentMethod} onChange={(e)=>setPaymentMethod(e.target.value as any)} className="w-full border rounded px-3 py-2">
                <option value="PIX">PIX</option>
                <option value="DEBITO">Débito</option>
                <option value="CREDITO">Crédito</option>
                <option value="DINHEIRO">Dinheiro</option>
              </select>
            </div>
            <button disabled={submitting} onClick={finalizeOrder} className="w-full py-2 bg-yellow-500 text-white rounded disabled:opacity-60 inline-flex items-center justify-center gap-2">
              {submitting ? 'Enviando...' : (<><CheckCircle2 size={18} /> Finalizar Pedido</>)}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
