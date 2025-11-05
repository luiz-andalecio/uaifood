import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/components/ToastProvider';
import { useAuth } from '@/contexts/AuthContext';
export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();
    const { login } = useAuth();
    async function handleSubmit(e) {
        e.preventDefault();
        if (!name || !email || !password || !confirmPassword) {
            toast.error('Preencha todos os campos');
            return;
        }
        if (password !== confirmPassword) {
            toast.error('As senhas não coincidem');
            return;
        }
        setSubmitting(true);
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        const data = await res.json();
        if (res.ok) {
            // auto login
            const ok = await login(email, password);
            if (ok) {
                toast.success('Bem-vindo! Cadastro concluído.');
                const from = location.state?.from?.pathname || '/';
                navigate(from, { replace: true });
            }
            else {
                toast.info('Conta criada. Faça login para continuar.');
                navigate('/login');
            }
        }
        else {
            toast.error(data.message || 'Falha no cadastro');
        }
        setSubmitting(false);
    }
    return (_jsx("div", { className: "min-h-[70vh] grid place-items-center bg-gradient-to-br from-red-50 to-yellow-50", children: _jsxs("form", { onSubmit: handleSubmit, className: "w-full max-w-md bg-white p-6 rounded-xl shadow", children: [_jsx("h1", { className: "text-2xl font-bold mb-6 text-center", children: "Criar Conta" }), _jsx("input", { className: "w-full border rounded px-3 py-2 mb-3", placeholder: "Nome", value: name, onChange: (e) => setName(e.target.value) }), _jsx("input", { type: "email", autoComplete: "email", className: "w-full border rounded px-3 py-2 mb-3", placeholder: "Email", value: email, onChange: (e) => setEmail(e.target.value) }), _jsx("input", { type: "password", autoComplete: "new-password", className: "w-full border rounded px-3 py-2 mb-3", placeholder: "Senha", value: password, onChange: (e) => setPassword(e.target.value) }), _jsx("input", { type: "password", autoComplete: "new-password", className: "w-full border rounded px-3 py-2 mb-4", placeholder: "Confirmar senha", value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value) }), _jsx("button", { disabled: submitting, className: "w-full py-2 bg-yellow-500 text-white rounded disabled:opacity-60", children: submitting ? 'Criando...' : 'Criar Conta' })] }) }));
}
