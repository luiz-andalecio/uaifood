import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// pagina de historico de pedidos do usuario autenticado
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ShoppingBag, CalendarClock } from 'lucide-react';
export default function MyOrders() {
    const { token } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        let mounted = true;
        async function load() {
            if (!token)
                return;
            try {
                const res = await fetch('/api/orders', { headers: { Authorization: `Bearer ${token}` } });
                const data = await res.json();
                if (res.ok && mounted)
                    setOrders(data.orders || []);
            }
            finally {
                if (mounted)
                    setLoading(false);
            }
        }
        load();
        return () => {
            mounted = false;
        };
    }, [token]);
    if (!token) {
        return (_jsxs("div", { className: "max-w-4xl mx-auto px-4 py-10", children: [_jsxs("h1", { className: "text-3xl font-extrabold mb-6 inline-flex items-center gap-2", children: [_jsx(ShoppingBag, { size: 20 }), " Meus Pedidos"] }), _jsx("p", { className: "text-gray-600", children: "Voc\u00EA precisa estar logado para ver seus pedidos." })] }));
    }
    return (_jsxs("div", { className: "max-w-4xl mx-auto px-4 py-10", children: [_jsxs("h1", { className: "text-3xl font-extrabold mb-6 inline-flex items-center gap-2", children: [_jsx(ShoppingBag, { size: 20 }), " Meus Pedidos"] }), loading ? (_jsx("p", { className: "text-gray-600", children: "Carregando..." })) : orders.length === 0 ? (_jsx("p", { className: "text-gray-600", children: "Nenhum pedido encontrado." })) : (_jsx("div", { className: "space-y-4", children: orders.map((o) => (_jsxs("div", { className: "rounded border bg-white p-4", children: [_jsx("div", { className: "flex items-center justify-between mb-2", children: _jsxs("div", { children: [_jsxs("div", { className: "font-semibold", children: ["Pedido #", o.id.slice(0, 8)] }), _jsxs("div", { className: "text-sm text-gray-600 inline-flex items-center gap-1", children: [_jsx(CalendarClock, { size: 14 }), " ", o.created_at ? new Date(o.created_at).toLocaleString() : ''] })] }) }), _jsx("ul", { className: "text-sm text-gray-700 mb-2", children: o.items?.map((it) => (_jsxs("li", { className: "flex items-center justify-between", children: [_jsxs("span", { children: [it.quantity, "x ", it.item?.name || 'Item'] }), _jsxs("span", { children: ["R$ ", Number(it.total_price).toFixed(2)] })] }, it.id))) }), _jsxs("div", { className: "flex items-center justify-between font-semibold", children: [_jsx("span", { children: "Total" }), _jsxs("span", { children: ["R$ ", Number(o.total).toFixed(2)] })] })] }, o.id))) }))] }));
}
