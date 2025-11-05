import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// provedor simples de toasts (sucesso/erro/info) usando Tailwind
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CheckCircle2, XCircle, Info } from 'lucide-react';
const ToastContext = createContext(null);
export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx)
        throw new Error('useToast deve ser usado dentro de <ToastProvider>');
    return ctx;
}
export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const [id, setId] = useState(1);
    const push = useCallback((message, type, durationMs = 3000) => {
        const nextId = id + 1;
        setId(nextId);
        const toast = { id: nextId, message, type };
        setToasts((prev) => [...prev, toast]);
        // animação de saída: marca como escondendo e remove após 200ms
        setTimeout(() => {
            setToasts((prev) => prev.map((t) => (t.id === toast.id ? { ...t, hiding: true } : t)));
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== toast.id));
            }, 200);
        }, durationMs);
    }, [id]);
    const ctx = useMemo(() => ({
        success: (m, d) => push(m, 'success', d),
        error: (m, d) => push(m, 'error', d),
        info: (m, d) => push(m, 'info', d)
    }), [push]);
    return (_jsxs(ToastContext.Provider, { value: ctx, children: [children, _jsx("div", { className: "fixed bottom-4 right-4 z-[1000] space-y-2", children: toasts.map((t) => (_jsx("div", { className: 'min-w-[220px] max-w-[360px] rounded-lg shadow-xl px-4 py-3 text-sm text-white ring-1 ring-black/5 transition-all duration-200 transform ' +
                        (t.hiding ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0') + ' ' +
                        (t.type === 'success' ? 'bg-green-600' : t.type === 'error' ? 'bg-red-600' : 'bg-gray-900'), children: _jsxs("div", { className: "flex items-center gap-2", children: [t.type === 'success' ? _jsx(CheckCircle2, { size: 18 }) : t.type === 'error' ? _jsx(XCircle, { size: 18 }) : _jsx(Info, { size: 18 }), _jsx("span", { children: t.message })] }) }, t.id))) })] }));
};
