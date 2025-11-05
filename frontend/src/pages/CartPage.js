import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// pagina de carrinho com resumo e finalizacao do pedido
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ToastProvider';
import { Minus, Plus, Trash2, CreditCard, CheckCircle2 } from 'lucide-react';
export default function CartPage() {
    const { items, total, setQuantity, removeItem, clear } = useCart();
    const { token } = useAuth();
    const toast = useToast();
    const [tableNumber, setTableNumber] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('PIX');
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();
    async function finalizeOrder() {
        if (!token) {
            return navigate('/login', { state: { from: { pathname: '/carrinho' } } });
        }
        if (items.length === 0) {
            toast.info('Seu carrinho está vazio');
            return;
        }
        setSubmitting(true);
        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    tableNumber: tableNumber || null,
                    paymentMethod,
                    items: items.map((i) => ({ itemId: i.id, quantity: i.quantity }))
                })
            });
            const data = await res.json();
            if (!res.ok)
                throw new Error(data?.message || 'Falha ao criar pedido');
            clear();
            toast.success('Pedido criado com sucesso!');
            navigate('/perfil');
        }
        catch (e) {
            toast.error(e.message || 'Erro ao finalizar pedido');
        }
        finally {
            setSubmitting(false);
        }
    }
    return (_jsxs("div", { className: "max-w-4xl mx-auto px-4 py-10", children: [_jsx("h1", { className: "text-3xl font-extrabold mb-6", children: "Seu Carrinho" }), items.length === 0 ? (_jsx("p", { className: "text-gray-600", children: "Seu carrinho est\u00E1 vazio." })) : (_jsxs("div", { className: "grid md:grid-cols-3 gap-6", children: [_jsx("div", { className: "md:col-span-2 space-y-4", children: items.map((i) => (_jsxs("div", { className: "flex items-center justify-between rounded border bg-white p-3", children: [_jsxs("div", { children: [_jsx("div", { className: "font-medium", children: i.name }), _jsxs("div", { className: "text-sm text-gray-600", children: ["R$ ", i.price.toFixed(2)] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { onClick: () => setQuantity(i.id, i.quantity - 1), className: "px-2 py-1 border rounded", "aria-label": "Diminuir quantidade", children: _jsx(Minus, { size: 16 }) }), _jsx("input", { className: "w-12 text-center border rounded", type: "number", min: 1, value: i.quantity, onChange: (e) => setQuantity(i.id, Number(e.target.value)) }), _jsx("button", { onClick: () => setQuantity(i.id, i.quantity + 1), className: "px-2 py-1 border rounded", "aria-label": "Aumentar quantidade", children: _jsx(Plus, { size: 16 }) }), _jsxs("button", { onClick: () => removeItem(i.id), className: "px-2 py-1 text-red-600 inline-flex items-center gap-1", "aria-label": "Remover item", children: [_jsx(Trash2, { size: 16 }), " Remover"] })] })] }, i.id))) }), _jsxs("div", { className: "rounded border bg-white p-4 h-fit", children: [_jsxs("div", { className: "mb-2 flex items-center justify-between", children: [_jsx("span", { className: "text-gray-600", children: "Subtotal" }), _jsxs("span", { className: "font-semibold", children: ["R$ ", total.toFixed(2)] })] }), _jsx("div", { className: "mb-4 text-sm text-gray-500", children: "Taxas ser\u00E3o calculadas pelo backend." }), _jsxs("div", { className: "mb-3", children: [_jsx("label", { className: "block text-sm text-gray-700 mb-1", children: "Mesa (opcional)" }), _jsx("input", { value: tableNumber, onChange: (e) => setTableNumber(e.target.value), className: "w-full border rounded px-3 py-2", placeholder: "Ex: 12" })] }), _jsxs("div", { className: "mb-4", children: [_jsxs("label", { className: "inline-flex items-center gap-2 text-sm text-gray-700 mb-1", children: [_jsx(CreditCard, { size: 16 }), " Pagamento"] }), _jsxs("select", { value: paymentMethod, onChange: (e) => setPaymentMethod(e.target.value), className: "w-full border rounded px-3 py-2", children: [_jsx("option", { value: "PIX", children: "PIX" }), _jsx("option", { value: "DEBITO", children: "D\u00E9bito" }), _jsx("option", { value: "CREDITO", children: "Cr\u00E9dito" }), _jsx("option", { value: "DINHEIRO", children: "Dinheiro" })] })] }), _jsx("button", { disabled: submitting, onClick: finalizeOrder, className: "w-full py-2 bg-yellow-500 text-white rounded disabled:opacity-60 inline-flex items-center justify-center gap-2", children: submitting ? 'Enviando...' : (_jsxs(_Fragment, { children: [_jsx(CheckCircle2, { size: 18 }), " Finalizar Pedido"] })) })] })] }))] }));
}
