// contexto de autenticacao basico para o frontend
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

// tipo de usuario basico vindo do backend
export type Role = 'CLIENTE' | 'ADMIN' | 'ROOT'
export type User = { id?: string; name: string; email: string; role?: Role; phone?: string | null; address?: string | null; zip_code?: string | null }

type AuthContextType = {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  refreshMe: () => Promise<void>
  updateProfile: (payload: { name?: string; email?: string; phone?: string; address?: string; zip_code?: string; password: string }) => Promise<{ ok: boolean; error?: string }>
  changePassword: (payload: { currentPassword: string; newPassword: string; confirmPassword: string }) => Promise<{ ok: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // controla token e usuario em memoria
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  // ao iniciar, se tiver token, busca dados do usuario logado
  useEffect(() => {
    async function bootstrap() {
      try {
        if (token) {
          const res = await fetch('/api/users/me', {
            headers: { Authorization: `Bearer ${token}` }
          })
          if (res.ok) {
            const data = await res.json()
            setUser(data)
          } else {
            // token invalido, remove
            localStorage.removeItem('token')
            setToken(null)
            setUser(null)
          }
        }
      } catch (_) {
        // ignora erros de rede neste bootstrap
      } finally {
        setLoading(false)
      }
    }
    bootstrap()
  }, [token])

  async function refreshMe() {
    if (!token) return
    const res = await fetch('/api/users/me', { headers: { Authorization: `Bearer ${token}` } })
    if (res.ok) {
      const me = await res.json()
      setUser(me)
    }
  }

  // efetua login chamando a API e armazenando token
  async function login(email: string, password: string): Promise<boolean> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) return false

      const receivedToken: string | undefined = data?.token
      if (!receivedToken) return false

      localStorage.setItem('token', receivedToken)
      setToken(receivedToken)

      // tenta obter dados do usuario logado
      const me = await fetch('/api/users/me', {
        headers: { Authorization: `Bearer ${receivedToken}` }
      })
      if (me.ok) setUser(await me.json()); else setUser(null)
      return true
    } catch (_) {
      return false
    }
  }

  // efetua logout limpando dados locais
  function logout() {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  async function updateProfile(payload: { name?: string; email?: string; phone?: string; address?: string; zip_code?: string; password: string }): Promise<{ ok: boolean; error?: string }> {
    try {
      if (!token) return { ok: false, error: 'Não autenticado' }
      const res = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (!res.ok) return { ok: false, error: data?.message || 'Falha ao atualizar perfil' }
      setUser(data)
      return { ok: true }
    } catch (e) {
      return { ok: false, error: 'Erro de rede' }
    }
  }

  async function changePassword(payload: { currentPassword: string; newPassword: string; confirmPassword: string }): Promise<{ ok: boolean; error?: string }> {
    try {
      if (!token) return { ok: false, error: 'Não autenticado' }
      const res = await fetch('/api/users/me/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (!res.ok) return { ok: false, error: data?.message || 'Falha ao alterar senha' }
      return { ok: true }
    } catch (e) {
      return { ok: false, error: 'Erro de rede' }
    }
  }

  const value = useMemo<AuthContextType>(() => ({ user, token, loading, login, logout, refreshMe, updateProfile, changePassword }), [user, token, loading])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>')
  return ctx
}
