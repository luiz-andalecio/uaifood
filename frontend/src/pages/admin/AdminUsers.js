import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// pagina admin para gerenciar usuarios (listagem simples)
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ToastProvider';
import Modal from '@/components/Modal';
import { KeyRound, Trash2 } from 'lucide-react';
export default function AdminUsers() {
    const { token, user } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const isRoot = user?.role === 'ROOT';
    const toast = useToast();
    const [confirmId, setConfirmId] = useState(null);
    const [passModal, setPassModal] = useState({ id: null, value: '' });
    useEffect(() => {
        async function load() {
            const res = await fetch('/api/users?page=1&pageSize=50', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setUsers(data.users || []);
            setLoading(false);
        }
        if (token)
            load();
    }, [token]);
    async function changeRole(id, role) {
        if (!isRoot)
            return toast.error('Somente ROOT pode alterar roles');
        try {
            const res = await fetch(`/api/users/${id}/role`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ role })
            });
            const data = await res.json();
            if (!res.ok)
                throw new Error(data?.message || 'Falha ao alterar role');
            setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role: data.role } : u)));
            toast.success('Tipo alterado');
        }
        catch (e) {
            toast.error(e.message || 'Erro ao alterar role');
        }
    }
    async function submitPassword(id, password) {
        if (!isRoot)
            return toast.error('Somente ROOT pode redefinir senhas');
        if (!password)
            return toast.error('Informe uma senha');
        try {
            const res = await fetch(`/api/users/${id}/password`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ password })
            });
            const data = await res.json();
            if (!res.ok)
                throw new Error(data?.message || 'Falha ao redefinir senha');
            toast.success('Senha atualizada com sucesso');
        }
        catch (e) {
            toast.error(e.message || 'Erro ao redefinir senha');
        }
    }
    async function deleteUser(id) {
        if (!isRoot)
            return toast.error('Somente ROOT pode excluir contas');
        try {
            const res = await fetch(`/api/users/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (!res.ok)
                throw new Error(data?.message || 'Falha ao excluir');
            setUsers((prev) => prev.filter((u) => u.id !== id));
            toast.success('Usuário excluído (desativado)');
        }
        catch (e) {
            toast.error(e.message || 'Erro ao excluir usuário');
        }
    }
    return (_jsxs("div", { className: "max-w-5xl mx-auto px-4 py-10", children: [_jsx("h1", { className: "text-3xl font-extrabold mb-6", children: "Admin - Usu\u00E1rios" }), loading ? (_jsx("p", { children: "Carregando..." })) : (_jsxs(_Fragment, { children: [_jsx("div", { className: "overflow-auto rounded border bg-white", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "text-left p-2", children: "Nome" }), _jsx("th", { className: "text-left p-2", children: "E-mail" }), _jsx("th", { className: "text-left p-2", children: "Tipo" }), isRoot && _jsx("th", { className: "text-left p-2", children: "A\u00E7\u00F5es" })] }) }), _jsx("tbody", { children: users.map((u) => (_jsxs("tr", { className: "border-t", children: [_jsx("td", { className: "p-2", children: u.name }), _jsx("td", { className: "p-2", children: u.email }), _jsx("td", { className: "p-2", children: isRoot ? (_jsxs("select", { value: u.role, onChange: (e) => changeRole(u.id, e.target.value), className: "border rounded px-2 py-1", children: [_jsx("option", { value: "CLIENTE", children: "CLIENTE" }), _jsx("option", { value: "ADMIN", children: "ADMIN" }), _jsx("option", { value: "ROOT", children: "ROOT" })] })) : (u.role) }), isRoot && (_jsxs("td", { className: "p-2 space-x-2", children: [_jsxs("button", { onClick: () => setPassModal({ id: u.id, value: '' }), className: "px-2 py-1 text-xs rounded border border-blue-500 text-blue-600 hover:bg-blue-50 inline-flex items-center gap-1", children: [_jsx(KeyRound, { size: 14 }), " Resetar senha"] }), _jsxs("button", { onClick: () => setConfirmId(u.id), className: "px-2 py-1 text-xs rounded border border-red-500 text-red-600 hover:bg-red-50 inline-flex items-center gap-1", children: [_jsx(Trash2, { size: 14 }), " Excluir"] })] }))] }, u.id))) })] }) }), _jsxs(Modal, { open: !!confirmId, title: "Confirmar exclus\u00E3o", onClose: () => setConfirmId(null), children: [_jsx("p", { className: "mb-4", children: "Tem certeza que deseja excluir/desativar este usu\u00E1rio?" }), _jsxs("div", { className: "flex justify-end gap-2", children: [_jsx("button", { onClick: () => setConfirmId(null), className: "px-3 py-1 border rounded", children: "Cancelar" }), _jsx("button", { onClick: () => { if (confirmId) {
                                            deleteUser(confirmId);
                                            setConfirmId(null);
                                        } }, className: "px-3 py-1 rounded bg-red-600 text-white", children: "Excluir" })] })] }), _jsx(Modal, { open: !!passModal.id, title: "Redefinir senha", onClose: () => setPassModal({ id: null, value: '' }), children: _jsxs("div", { className: "space-y-3", children: [_jsx("input", { type: "password", className: "w-full border rounded px-3 py-2", placeholder: "Nova senha (m\u00EDn. 6 caracteres)", value: passModal.value, onChange: (e) => setPassModal((p) => ({ ...p, value: e.target.value })) }), _jsxs("div", { className: "flex justify-end gap-2", children: [_jsx("button", { onClick: () => setPassModal({ id: null, value: '' }), className: "px-3 py-1 border rounded", children: "Cancelar" }), _jsx("button", { onClick: () => { if (passModal.id) {
                                                submitPassword(passModal.id, passModal.value);
                                                setPassModal({ id: null, value: '' });
                                            } }, className: "px-3 py-1 rounded bg-blue-600 text-white", children: "Salvar" })] })] }) })] }))] }));
}
