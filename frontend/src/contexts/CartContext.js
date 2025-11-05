import { jsx as _jsx } from "react/jsx-runtime";
// contexto do carrinho com persistencia simples em localStorage
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
const CartContext = createContext(undefined);
const STORAGE_KEY = 'uaifood_cart_v1';
export function CartProvider({ children }) {
    const [items, setItems] = useState(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        }
        catch {
            return [];
        }
    });
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }, [items]);
    function addItem(item, qty = 1) {
        setItems((curr) => {
            const idx = curr.findIndex((i) => i.id === item.id);
            if (idx >= 0) {
                const clone = [...curr];
                clone[idx] = { ...clone[idx], quantity: clone[idx].quantity + qty };
                return clone;
            }
            return [...curr, { ...item, quantity: qty }];
        });
    }
    function removeItem(id) {
        setItems((curr) => curr.filter((i) => i.id !== id));
    }
    function setQuantity(id, qty) {
        setItems((curr) => curr.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, qty) } : i)));
    }
    function clear() {
        setItems([]);
    }
    const total = useMemo(() => items.reduce((acc, i) => acc + i.price * i.quantity, 0), [items]);
    const value = useMemo(() => ({ items, total, addItem, removeItem, setQuantity, clear }), [items, total]);
    return _jsx(CartContext.Provider, { value: value, children: children });
}
export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx)
        throw new Error('useCart deve ser usado dentro de <CartProvider>');
    return ctx;
}
