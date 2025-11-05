// contexto do carrinho com persistencia simples em localStorage
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

export type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
}

type CartContextType = {
  items: CartItem[]
  total: number
  addItem: (item: Omit<CartItem, 'quantity'>, qty?: number) => void
  removeItem: (id: string) => void
  setQuantity: (id: string, qty: number) => void
  clear: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const STORAGE_KEY = 'uaifood_cart_v1'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? (JSON.parse(raw) as CartItem[]) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  function addItem(item: Omit<CartItem, 'quantity'>, qty: number = 1) {
    setItems((curr) => {
      const idx = curr.findIndex((i) => i.id === item.id)
      if (idx >= 0) {
        const clone = [...curr]
        clone[idx] = { ...clone[idx], quantity: clone[idx].quantity + qty }
        return clone
      }
      return [...curr, { ...item, quantity: qty }]
    })
  }

  function removeItem(id: string) {
    setItems((curr) => curr.filter((i) => i.id !== id))
  }

  function setQuantity(id: string, qty: number) {
    setItems((curr) => curr.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, qty) } : i)))
  }

  function clear() {
    setItems([])
  }

  const total = useMemo(() => items.reduce((acc, i) => acc + i.price * i.quantity, 0), [items])
  const value = useMemo(() => ({ items, total, addItem, removeItem, setQuantity, clear }), [items, total])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart deve ser usado dentro de <CartProvider>')
  return ctx
}
