import { jsx as _jsx } from "react/jsx-runtime";
// contexto de autenticacao basico para o frontend
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
const AuthContext = createContext(undefined);
export function AuthProvider({ children }) {
    // controla token e usuario em memoria
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    // ao iniciar, se tiver token, busca dados do usuario logado
    useEffect(() => {
        async function bootstrap() {
            try {
                if (token) {
                    const res = await fetch('/api/users/me', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        setUser(data);
                    }
                    else {
                        // token invalido, remove
                        localStorage.removeItem('token');
                        setToken(null);
                        setUser(null);
                    }
                }
            }
            catch (_) {
                // ignora erros de rede neste bootstrap
            }
            finally {
                setLoading(false);
            }
        }
        bootstrap();
    }, [token]);
    async function refreshMe() {
        if (!token)
            return;
        const res = await fetch('/api/users/me', { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) {
            const me = await res.json();
            setUser(me);
        }
    }
    // efetua login chamando a API e armazenando token
    async function login(email, password) {
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (!res.ok)
                return false;
            const receivedToken = data?.token;
            if (!receivedToken)
                return false;
            localStorage.setItem('token', receivedToken);
            setToken(receivedToken);
            // tenta obter dados do usuario logado
            const me = await fetch('/api/users/me', {
                headers: { Authorization: `Bearer ${receivedToken}` }
            });
            if (me.ok)
                setUser(await me.json());
            else
                setUser(null);
            return true;
        }
        catch (_) {
            return false;
        }
    }
    // efetua logout limpando dados locais
    function logout() {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    }
    async function updateProfile(payload) {
        try {
            if (!token)
                return { ok: false, error: 'Não autenticado' };
            const res = await fetch('/api/users/me', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (!res.ok)
                return { ok: false, error: data?.message || 'Falha ao atualizar perfil' };
            setUser(data);
            return { ok: true };
        }
        catch (e) {
            return { ok: false, error: 'Erro de rede' };
        }
    }
    async function changePassword(payload) {
        try {
            if (!token)
                return { ok: false, error: 'Não autenticado' };
            const res = await fetch('/api/users/me/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (!res.ok)
                return { ok: false, error: data?.message || 'Falha ao alterar senha' };
            return { ok: true };
        }
        catch (e) {
            return { ok: false, error: 'Erro de rede' };
        }
    }
    const value = useMemo(() => ({ user, token, loading, login, logout, refreshMe, updateProfile, changePassword }), [user, token, loading]);
    return _jsx(AuthContext.Provider, { value: value, children: children });
}
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx)
        throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
    return ctx;
}
