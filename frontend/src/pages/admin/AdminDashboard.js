import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Users, Utensils, Receipt } from 'lucide-react';
export default function AdminDashboard() {
    const { token } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function load() {
            const res = await fetch('/api/admin/dashboard', { headers: { Authorization: `Bearer ${token}` } });
            const json = await res.json();
            setData(json);
            setLoading(false);
        }
        if (token)
            load();
    }, [token]);
    return (_jsxs("div", { className: "max-w-5xl mx-auto px-4 py-10", children: [_jsx("h1", { className: "text-3xl font-extrabold mb-6", children: "Admin - Dashboard" }), loading ? (_jsx("p", { children: "Carregando..." })) : (_jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [_jsxs("div", { className: "rounded-lg border bg-white p-6", children: [_jsxs("div", { className: "text-gray-500 text-sm inline-flex items-center gap-2", children: [_jsx(Users, { size: 16 }), " Usu\u00E1rios ativos"] }), _jsx("div", { className: "text-3xl font-bold", children: data?.users ?? '-' })] }), _jsxs("div", { className: "rounded-lg border bg-white p-6", children: [_jsxs("div", { className: "text-gray-500 text-sm inline-flex items-center gap-2", children: [_jsx(Utensils, { size: 16 }), " Itens do card\u00E1pio"] }), _jsx("div", { className: "text-3xl font-bold", children: data?.items ?? '-' })] }), _jsxs("div", { className: "rounded-lg border bg-white p-6", children: [_jsxs("div", { className: "text-gray-500 text-sm inline-flex items-center gap-2", children: [_jsx(Receipt, { size: 16 }), " Pedidos"] }), _jsx("div", { className: "text-3xl font-bold", children: data?.orders ?? '-' })] })] }))] }));
}
