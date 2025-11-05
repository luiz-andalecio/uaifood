import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// página admin para gerenciar itens do cardápio (versão simples)
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ToastProvider';
import Modal from '@/components/Modal';
import { Plus, Pencil, Trash2, Utensils } from 'lucide-react';
export default function AdminMenu() {
    const { token } = useAuth();
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [form, setForm] = useState({ name: '', price: '', categoryId: '' });
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', price: '' });
    const [confirmId, setConfirmId] = useState(null);
    const toast = useToast();
    useEffect(() => {
        async function load() {
            // reusa GET /api/menu para categorias e itens
            const res = await fetch('/api/menu');
            const data = await res.json();
            const cats = (data.categories || []).map((c) => ({ id: c.id, name: c.name }));
            const flat = (data.categories || []).flatMap((c) => c.items || []);
            setCategories(cats);
            setItems(flat);
            setLoading(false);
        }
        load();
    }, []);
    async function handleCreate(e) {
        e.preventDefault();
        if (!token) {
            toast.error('Sem token');
            return;
        }
        if (!form.name || !form.price) {
            toast.error('Preencha nome e preço');
            return;
        }
        setCreating(true);
        try {
            const res = await fetch('/api/menu/items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ name: form.name, price: Number(form.price), categoryId: form.categoryId || undefined })
            });
            const data = await res.json();
            if (!res.ok)
                throw new Error(data?.message || 'Falha ao criar');
            // recarrega lista simples
            setItems((prev) => [...prev, data]);
            setForm({ name: '', price: '', categoryId: '' });
            toast.success('Item criado');
        }
        catch (e) {
            toast.error(e.message || 'Erro ao criar item');
        }
        finally {
            setCreating(false);
        }
    }
    function startEdit(it) {
        setEditingId(it.id);
        setEditForm({ name: it.name, price: String(it.price) });
    }
    async function saveEdit(id) {
        if (!token)
            return;
        try {
            const res = await fetch(`/api/menu/items/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ name: editForm.name, price: Number(editForm.price) })
            });
            const data = await res.json();
            if (!res.ok)
                throw new Error(data?.message || 'Falha ao editar');
            setItems((prev) => prev.map((p) => (p.id === id ? { ...p, name: data.name, price: data.price } : p)));
            setEditingId(null);
            toast.success('Item atualizado');
        }
        catch (e) {
            toast.error(e.message || 'Erro ao editar item');
        }
    }
    async function remove(id) {
        if (!token)
            return;
        try {
            const res = await fetch(`/api/menu/items/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok && res.status !== 204) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data?.message || 'Falha ao excluir');
            }
            setItems((prev) => prev.filter((p) => p.id !== id));
            toast.success('Item excluído');
        }
        catch (e) {
            toast.error(e.message || 'Erro ao excluir item');
        }
    }
    return (_jsxs("div", { className: "max-w-5xl mx-auto px-4 py-10", children: [_jsxs("h1", { className: "text-3xl font-extrabold mb-6 inline-flex items-center gap-2", children: [_jsx(Utensils, { size: 22 }), " Admin - Card\u00E1pio"] }), loading ? (_jsx("p", { children: "Carregando..." })) : (_jsxs(_Fragment, { children: [_jsxs("form", { onSubmit: handleCreate, className: "mb-4 rounded border bg-white p-3 flex flex-col gap-2", children: [_jsxs("div", { className: "font-semibold inline-flex items-center gap-2", children: [_jsx(Plus, { size: 16 }), " Adicionar novo item"] }), _jsxs("div", { className: "grid md:grid-cols-4 gap-2", children: [_jsx("input", { className: "border rounded px-2 py-1", placeholder: "Nome", value: form.name, onChange: (e) => setForm({ ...form, name: e.target.value }) }), _jsx("input", { className: "border rounded px-2 py-1", placeholder: "Pre\u00E7o", value: form.price, onChange: (e) => setForm({ ...form, price: e.target.value }) }), _jsxs("select", { className: "border rounded px-2 py-1", value: form.categoryId, onChange: (e) => setForm({ ...form, categoryId: e.target.value }), children: [_jsx("option", { value: "", children: "Sem categoria" }), categories.map((c) => _jsx("option", { value: c.id, children: c.name }, c.id))] }), _jsx("button", { disabled: creating, className: "bg-yellow-500 text-white rounded px-3 py-1 disabled:opacity-60 inline-flex items-center gap-1", children: creating ? 'Adicionando...' : (_jsxs(_Fragment, { children: [_jsx(Plus, { size: 16 }), " Adicionar"] })) })] })] }), _jsx("div", { className: "overflow-auto rounded border bg-white", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "text-left p-2", children: "Nome" }), _jsx("th", { className: "text-left p-2", children: "Pre\u00E7o" }), _jsx("th", { className: "text-left p-2", children: "Categoria" }), _jsx("th", { className: "text-left p-2", children: "A\u00E7\u00F5es" })] }) }), _jsx("tbody", { children: items.map((it) => (_jsxs("tr", { className: "border-t", children: [_jsx("td", { className: "p-2", children: it.name }), _jsxs("td", { className: "p-2", children: ["R$ ", Number(it.price).toFixed(2)] }), _jsx("td", { className: "p-2", children: categories.find((c) => c.id === it.category_id)?.name || '-' }), _jsx("td", { className: "p-2 space-x-2", children: editingId === it.id ? (_jsxs(_Fragment, { children: [_jsx("input", { className: "border rounded px-2 py-1", value: editForm.name, onChange: (e) => setEditForm((f) => ({ ...f, name: e.target.value })) }), _jsx("input", { className: "border rounded px-2 py-1", value: editForm.price, onChange: (e) => setEditForm((f) => ({ ...f, price: e.target.value })) }), _jsxs("button", { onClick: () => saveEdit(it.id), className: "px-2 py-1 text-xs rounded border border-green-500 text-green-600 hover:bg-green-50 inline-flex items-center gap-1", children: [_jsx(Pencil, { size: 14 }), " Salvar"] }), _jsx("button", { onClick: () => setEditingId(null), className: "px-2 py-1 text-xs rounded border", children: "Cancelar" })] })) : (_jsxs(_Fragment, { children: [_jsxs("button", { onClick: () => startEdit(it), className: "px-2 py-1 text-xs rounded border border-blue-500 text-blue-600 hover:bg-blue-50 inline-flex items-center gap-1", children: [_jsx(Pencil, { size: 14 }), " Editar"] }), _jsxs("button", { onClick: () => setConfirmId(it.id), className: "px-2 py-1 text-xs rounded border border-red-500 text-red-600 hover:bg-red-50 inline-flex items-center gap-1", children: [_jsx(Trash2, { size: 14 }), " Excluir"] })] })) })] }, it.id))) })] }) }), _jsxs(Modal, { open: !!confirmId, title: "Confirmar exclus\u00E3o", onClose: () => setConfirmId(null), children: [_jsx("p", { className: "mb-4", children: "Tem certeza que deseja excluir/desativar este item?" }), _jsxs("div", { className: "flex justify-end gap-2", children: [_jsx("button", { onClick: () => setConfirmId(null), className: "px-3 py-1 border rounded", children: "Cancelar" }), _jsx("button", { onClick: () => { if (confirmId) {
                                            remove(confirmId);
                                            setConfirmId(null);
                                        } }, className: "px-3 py-1 rounded bg-red-600 text-white", children: "Excluir" })] })] })] }))] }));
}
