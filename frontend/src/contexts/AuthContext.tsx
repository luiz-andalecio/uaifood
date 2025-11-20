// contexto de autenticacao basico para o frontend
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

// tipo de usuario basico vindo do backend
export type Role = 'CLIENTE' | 'ADMIN' | 'ROOT'
export type User = { id?: string; name: string; email: string; role?: Role; phone?: string | null; address?: string | null; zip_code?: string | null }

type AuthContextType = {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ ok: boolean; message?: string }>
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
          const res = await fetch('/api/users/me', { headers: { 'x-access-token': token } })
          if (res.ok) {
            const json = await res.json()
            setUser(json?.data || null)
          } else {
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
    const res = await fetch('/api/users/me', { headers: { 'x-access-token': token } })
    if (res.ok) {
      const meJson = await res.json()
      setUser(meJson?.data || null)
    }
  }

  // efetua login chamando a API e armazenando token
  async function login(email: string, password: string): Promise<{ ok: boolean; message?: string }> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const json = await res.json()
      if (!res.ok) return { ok: false, message: json?.message }
      const receivedToken: string | undefined = json?.data?.token
      const receivedUser: User | undefined = json?.data?.user
      if (!receivedToken) return { ok: false, message: 'Token não recebido do servidor.' }

  localStorage.setItem('token', receivedToken)
  setToken(receivedToken)
  // (re)gera numero da mesa a cada login para tablets virtuais
  const newMesa = String(Math.floor(Math.random() * 12) + 1)
  sessionStorage.setItem('uaifood_table_number', newMesa)

      // tenta obter dados do usuario logado
      if (receivedUser) {
        setUser(receivedUser)
      } else {
        const me = await fetch('/api/users/me', { headers: { 'x-access-token': receivedToken } })
        if (me.ok) {
          const meJson = await me.json()
          setUser(meJson?.data || null)
        } else setUser(null)
      }
      return { ok: true }
    } catch (_) {
      return { ok: false, message: 'Falha de rede' }
    }
  }

  // efetua logout limpando dados locais
  function logout() {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    // limpa mesa automatica ao sair para forçar nova atribuicao no proximo login
    sessionStorage.removeItem('uaifood_table_number')
  }

  async function updateProfile(payload: { name?: string; email?: string; phone?: string; address?: string; zip_code?: string; password: string }): Promise<{ ok: boolean; error?: string }> {
    try {
      if (!token) return { ok: false, error: 'Não autenticado' }
      const res = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-access-token': token },
        body: JSON.stringify(payload)
      })
      const json = await res.json()
      if (!res.ok) return { ok: false, error: json?.message || 'Falha ao atualizar perfil' }
      setUser(json?.data || null)
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
        headers: { 'Content-Type': 'application/json', 'x-access-token': token },
        body: JSON.stringify(payload)
      })
      const json = await res.json()
      if (!res.ok) return { ok: false, error: json?.message || 'Falha ao alterar senha' }
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
