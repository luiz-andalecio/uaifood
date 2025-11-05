import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Pagina de Cardapio com abas simples
import { useEffect, useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Plus } from 'lucide-react';
export default function Menu() {
    const [categories, setCategories] = useState([]);
    const { addItem } = useCart();
    // carrega dados da API publica
    useEffect(() => {
        fetch('/api/menu')
            .then((r) => r.json())
            .then((data) => setCategories(data.categories || []))
            .catch(() => setCategories([]));
    }, []);
    return (_jsxs("div", { className: "max-w-6xl mx-auto px-4 py-10", children: [_jsx("h1", { className: "text-4xl font-extrabold mb-2 text-center", children: "Nosso Card\u00E1pio" }), _jsx("p", { className: "text-center text-gray-600 mb-8", children: "Explore nossos deliciosos pratos e monte seu pedido" }), _jsx("div", { className: "grid md:grid-cols-2 gap-6", children: categories.map((cat) => (_jsxs("div", { className: "rounded-xl border bg-white p-4", children: [_jsx("h3", { className: "font-semibold mb-2", children: cat.name }), _jsx("ul", { className: "space-y-3", children: cat.items?.map((it) => (_jsxs("li", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "font-medium", children: it.name }), _jsxs("div", { className: "text-sm text-gray-600", children: ["R$ ", Number(it.price).toFixed(2)] })] }), _jsxs("button", { onClick: () => addItem({ id: it.id, name: it.name, price: Number(it.price) }, 1), className: "px-4 py-2 rounded bg-yellow-500 text-white inline-flex items-center gap-2", children: [_jsx(Plus, { size: 16 }), " Adicionar"] })] }, it.id))) })] }, cat.id))) })] }));
}
