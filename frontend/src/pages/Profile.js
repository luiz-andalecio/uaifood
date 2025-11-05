import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// pagina de perfil simples mostrando dados do usuario logado
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import Modal from '@/components/Modal';
import { useToast } from '@/components/ToastProvider';
import { ListOrdered, KeyRound, Save, User as UserIcon, Mail, Phone, Home as HomeIcon, MapPin } from 'lucide-react';
export default function Profile() {
    const { user, updateProfile, changePassword } = useAuth();
    const toast = useToast();
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
        zip_code: user?.zip_code || '',
        password: ''
    });
    const [saving, setSaving] = useState(false);
    const [pwdOpen, setPwdOpen] = useState(false);
    const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    if (!user) {
        return (_jsxs("div", { className: "max-w-3xl mx-auto px-4 py-10", children: [_jsx("h1", { className: "text-2xl font-bold", children: "Perfil" }), _jsx("p", { className: "text-gray-600", children: "Voc\u00EA precisa estar logado para ver esta p\u00E1gina." })] }));
    }
    return (_jsxs("div", { className: "max-w-3xl mx-auto px-4 py-10", children: [_jsx("h1", { className: "text-3xl font-extrabold mb-6", children: "Meu Perfil" }), _jsx("div", { className: "rounded-xl border bg-white p-6 space-y-4", children: !editing ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "mb-2 flex items-center gap-2", children: [_jsx(UserIcon, { size: 18, className: "text-gray-500" }), _jsx("span", { className: "font-semibold", children: "Nome:" }), " ", user.name] }), _jsxs("div", { className: "mb-2 flex items-center gap-2", children: [_jsx(Mail, { size: 18, className: "text-gray-500" }), _jsx("span", { className: "font-semibold", children: "E-mail:" }), " ", user.email] }), _jsxs("div", { className: "mb-2 flex items-center gap-2", children: [_jsx(Phone, { size: 18, className: "text-gray-500" }), _jsx("span", { className: "font-semibold", children: "Telefone:" }), " ", user.phone || '-'] }), _jsxs("div", { className: "mb-2 flex items-center gap-2", children: [_jsx(HomeIcon, { size: 18, className: "text-gray-500" }), _jsx("span", { className: "font-semibold", children: "Endere\u00E7o:" }), " ", user.address || '-'] }), _jsxs("div", { className: "mb-4 flex items-center gap-2", children: [_jsx(MapPin, { size: 18, className: "text-gray-500" }), _jsx("span", { className: "font-semibold", children: "CEP:" }), " ", user.zip_code || '-'] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("span", { className: "font-semibold", children: "Tipo:" }), " ", user.role || 'CLIENTE'] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs(Link, { to: "/meus-pedidos", className: "text-yellow-600 hover:text-yellow-700 underline inline-flex items-center gap-2", children: [_jsx(ListOrdered, { size: 16 }), " Ver meus pedidos"] }), _jsx("button", { onClick: () => setEditing(true), className: "px-4 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600", children: "Editar" }), _jsxs("button", { onClick: () => setPwdOpen(true), className: "px-4 py-2 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200 inline-flex items-center gap-2", children: [_jsx(KeyRound, { size: 16 }), " Alterar senha"] })] })] })] })) : (_jsxs("form", { className: "grid grid-cols-1 gap-4", onSubmit: async (e) => {
                        e.preventDefault();
                        if (!form.name || !form.email || !form.password) {
                            toast.error('Preencha nome, e-mail e confirme sua senha.');
                            return;
                        }
                        setSaving(true);
                        const result = await updateProfile({ ...form });
                        setSaving(false);
                        if (result.ok) {
                            toast.success('Perfil atualizado.');
                            setEditing(false);
                            setForm((f) => ({ ...f, password: '' }));
                        }
                        else {
                            toast.error(result.error || 'Falha ao atualizar perfil');
                        }
                    }, children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Nome" }), _jsx("input", { className: "w-full border rounded-lg px-3 py-2", value: form.name, onChange: (e) => setForm({ ...form, name: e.target.value }) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "E-mail" }), _jsx("input", { type: "email", className: "w-full border rounded-lg px-3 py-2", value: form.email, onChange: (e) => setForm({ ...form, email: e.target.value }) })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Telefone" }), _jsx("input", { className: "w-full border rounded-lg px-3 py-2", value: form.phone, onChange: (e) => setForm({ ...form, phone: e.target.value }) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "CEP" }), _jsx("input", { className: "w-full border rounded-lg px-3 py-2", value: form.zip_code, onChange: (e) => setForm({ ...form, zip_code: e.target.value }) })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Endere\u00E7o" }), _jsx("input", { className: "w-full border rounded-lg px-3 py-2", value: form.address, onChange: (e) => setForm({ ...form, address: e.target.value }) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Sua senha (confirma\u00E7\u00E3o)" }), _jsx("input", { type: "password", className: "w-full border rounded-lg px-3 py-2", value: form.password, onChange: (e) => setForm({ ...form, password: e.target.value }) })] }), _jsxs("div", { className: "flex gap-2 justify-end pt-2", children: [_jsx("button", { type: "button", onClick: () => setEditing(false), className: "px-4 py-2 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200", children: "Cancelar" }), _jsxs("button", { type: "submit", disabled: saving, className: "px-4 py-2 rounded-lg bg-tertiary text-white hover:bg-red-600 inline-flex items-center gap-2", children: [_jsx(Save, { size: 16 }), " ", saving ? 'Salvando...' : 'Salvar alterações'] })] })] })) }), _jsx(Modal, { open: pwdOpen, onClose: () => setPwdOpen(false), title: "Alterar senha", children: _jsxs("form", { className: "space-y-3", onSubmit: async (e) => {
                        e.preventDefault();
                        if (!pwdForm.currentPassword || !pwdForm.newPassword || !pwdForm.confirmPassword) {
                            toast.error('Preencha todas as senhas.');
                            return;
                        }
                        if (pwdForm.newPassword.length < 8) {
                            toast.error('Nova senha deve ter pelo menos 8 caracteres.');
                            return;
                        }
                        const result = await changePassword(pwdForm);
                        if (result.ok) {
                            toast.success('Senha alterada com sucesso.');
                            setPwdOpen(false);
                            setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                        }
                        else {
                            toast.error(result.error || 'Falha ao alterar senha');
                        }
                    }, children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Senha atual" }), _jsx("input", { type: "password", className: "w-full border rounded-lg px-3 py-2", value: pwdForm.currentPassword, onChange: (e) => setPwdForm({ ...pwdForm, currentPassword: e.target.value }) })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Nova senha" }), _jsx("input", { type: "password", className: "w-full border rounded-lg px-3 py-2", value: pwdForm.newPassword, onChange: (e) => setPwdForm({ ...pwdForm, newPassword: e.target.value }) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Confirmar nova senha" }), _jsx("input", { type: "password", className: "w-full border rounded-lg px-3 py-2", value: pwdForm.confirmPassword, onChange: (e) => setPwdForm({ ...pwdForm, confirmPassword: e.target.value }) })] })] }), _jsxs("div", { className: "flex justify-end gap-2 pt-2", children: [_jsx("button", { type: "button", onClick: () => setPwdOpen(false), className: "px-4 py-2 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200", children: "Cancelar" }), _jsxs("button", { type: "submit", className: "px-4 py-2 rounded-lg bg-tertiary text-white hover:bg-red-600 inline-flex items-center gap-2", children: [_jsx(KeyRound, { size: 16 }), " Alterar senha"] })] })] }) })] }));
}
