import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ToastProvider';
export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const toast = useToast();
    async function handleSubmit(e) {
        e.preventDefault();
        if (!email || !password) {
            toast.error('Preencha email e senha');
            return;
        }
        setSubmitting(true);
        const ok = await login(email, password);
        setSubmitting(false);
        if (ok) {
            const from = location.state?.from?.pathname || '/';
            navigate(from, { replace: true });
        }
        else {
            toast.error('Falha no login');
        }
    }
    return (_jsx("div", { className: "min-h-[70vh] grid place-items-center bg-gradient-to-br from-red-50 to-yellow-50", children: _jsxs("form", { onSubmit: handleSubmit, className: "w-full max-w-md bg-white p-6 rounded-xl shadow", children: [_jsx("h1", { className: "text-2xl font-bold mb-6 text-center", children: "Entrar" }), _jsx("input", { className: "w-full border rounded px-3 py-2 mb-3", placeholder: "Email", value: email, onChange: (e) => setEmail(e.target.value) }), _jsx("input", { type: "password", className: "w-full border rounded px-3 py-2 mb-4", placeholder: "Senha", value: password, onChange: (e) => setPassword(e.target.value) }), _jsx("button", { disabled: submitting, className: "w-full py-2 bg-yellow-500 text-white rounded disabled:opacity-60", children: submitting ? 'Entrando...' : 'Entrar' })] }) }));
}
