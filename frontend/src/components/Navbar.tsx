// Navbar com layout responsivo, separando navegação padrão e atalhos de admin
import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { Home, UtensilsCrossed, ShoppingBag, Info, User, LogOut, Utensils, Users, Menu, X, Shield } from 'lucide-react'

export function Navbar() {
  const { token, user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { items } = useCart()
  const cartCount = items.reduce((acc, i) => acc + i.quantity, 0)
  const isAdmin = !!user && (user.role === 'ADMIN' || user.role === 'ROOT')

  // estado do menu mobile
  const [open, setOpen] = useState(false)
  useEffect(() => {
    // fecha o menu quando a rota mudar
    setOpen(false)
  }, [location.pathname])

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur shadow">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo / Nome */}
        <div className="flex items-center min-w-0">
          <Link to="/" className="text-2xl font-bold whitespace-nowrap">
            <span className="text-tertiary">UAI</span><span className="text-yellow-500">Food</span>
          </Link>
          {/* Navegação padrão (desktop) */}
          <nav className="hidden md:flex items-center gap-4 text-sm ml-6">
            <NavLink to="/" className={({isActive})=> `inline-flex items-center gap-1 ${isActive? 'text-tertiary font-semibold':'text-gray-700 hover:text-tertiary'}`}>
              <Home size={16} /> Início
            </NavLink>
            <NavLink to="/cardapio" className={({isActive})=> `inline-flex items-center gap-1 ${isActive? 'text-tertiary font-semibold':'text-gray-700 hover:text-tertiary'}`}>
              <UtensilsCrossed size={16} /> Cardápio
            </NavLink>
            <NavLink to="/sobre" className={({isActive})=> `inline-flex items-center gap-1 ${isActive? 'text-tertiary font-semibold':'text-gray-700 hover:text-tertiary'}`}>
              <Info size={16} /> Sobre
            </NavLink>
            <NavLink to="/carrinho" className={({isActive})=> `inline-flex items-center gap-1 relative ${isActive? 'text-tertiary font-semibold':'text-gray-700 hover:text-tertiary'}`}>
              <ShoppingBag size={16} /> Carrinho
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 text-[11px] bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </NavLink>
          </nav>
        </div>

        {/* Ações à direita (desktop) */}
        <div className="hidden md:flex items-center gap-3 text-sm">
          {token ? (
            <>
              {/* Links de CRUD Admin/Root */}
              {isAdmin && (
                <div className="flex items-center gap-3 pr-3 mr-1 border-r">
                  <NavLink to="/admin" className={({isActive})=> `inline-flex items-center gap-1 ${isActive? 'text-tertiary font-semibold':'text-gray-700 hover:text-tertiary'}`}>
                    <Shield size={16} />
                  </NavLink>
                </div>
              )}
              {/* Saudação e sair */}
              <NavLink to="/perfil" className={({isActive})=> `inline-flex items-center gap-1 ${isActive? 'text-tertiary font-semibold':'text-gray-700 hover:text-tertiary'}`}>
                <User size={16} /> {user?.name ? `Olá, ${user.name.split(' ')[0]}` : 'Perfil'}
              </NavLink>
              <button onClick={handleLogout} className="px-3 py-1 rounded border border-red-500 text-red-600 hover:bg-red-50 inline-flex items-center gap-1">
                <LogOut size={16} /> Sair
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={({isActive})=> `inline-flex items-center gap-1 ${isActive? 'text-tertiary font-semibold':'text-gray-700 hover:text-tertiary'}`}>
                <User size={16} /> Entrar
              </NavLink>
              <NavLink to="/cadastro" className="px-3 py-1 rounded bg-gradient-to-r from-yellow-400 to-red-500 text-white">Cadastrar</NavLink>
            </>
          )}
        </div>

        {/* Botão hamburger (mobile) */}
        <button
          className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded hover:bg-gray-100"
          aria-label="Abrir menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Menu mobile */}
      {open && (
        <div className="md:hidden border-t bg-white">
          <div className="max-w-6xl mx-auto px-4 py-3 grid gap-3 text-sm">
            {/* Padrão */}
            <div className="flex flex-col gap-2">
              <NavLink to="/" className={({isActive})=> `inline-flex items-center gap-2 ${isActive? 'text-tertiary font-semibold':'text-gray-700'}`}>
                <Home size={18} /> Início
              </NavLink>
              <NavLink to="/cardapio" className={({isActive})=> `inline-flex items-center gap-2 ${isActive? 'text-tertiary font-semibold':'text-gray-700'}`}>
                <UtensilsCrossed size={18} /> Cardápio
              </NavLink>
              <NavLink to="/sobre" className={({isActive})=> `inline-flex items-center gap-2 ${isActive? 'text-tertiary font-semibold':'text-gray-700'}`}>
                <Info size={18} /> Sobre
              </NavLink>
              <NavLink to="/carrinho" className={({isActive})=> `inline-flex items-center gap-2 relative ${isActive? 'text-tertiary font-semibold':'text-gray-700'}`}>
                <ShoppingBag size={18} /> Carrinho
                {cartCount > 0 && (
                  <span className="ml-auto text-[11px] bg-red-500 text-white px-1.5 py-0.5 rounded-full">{cartCount}</span>
                )}
              </NavLink>
            </div>
            {/* Admin */}
            {token && isAdmin && (
              <div className="pt-3 border-t flex flex-col gap-2">
                <NavLink to="/admin" className={({isActive})=> `inline-flex items-center gap-2 ${isActive? 'text-tertiary font-semibold':'text-gray-700'}`}>
                  <Shield size={18} /> Administração
                </NavLink>
              </div>
            )}
            {/* Autenticação */}
            <div className="pt-2 border-t flex items-center justify-between gap-2">
              {token ? (
                <>
                  <NavLink to="/perfil" className={({isActive})=> `inline-flex items-center gap-2 ${isActive? 'text-tertiary font-semibold':'text-gray-700'}`}>
                    <User size={18} /> {user?.name ? `Olá, ${user.name.split(' ')[0]}` : 'Perfil'}
                  </NavLink>
                  <button onClick={handleLogout} className="px-3 py-1 rounded border border-red-500 text-red-600 hover:bg-red-50 inline-flex items-center gap-1">
                    <LogOut size={16} /> Sair
                  </button>
                </>
              ) : (
                <>
                  <NavLink to="/login" className={({isActive})=> `inline-flex items-center gap-2 ${isActive? 'text-tertiary font-semibold':'text-gray-700'}`}>
                    <User size={18} /> Entrar
                  </NavLink>
                  <NavLink to="/cadastro" className="px-3 py-1 rounded bg-gradient-to-r from-yellow-400 to-red-500 text-white">Cadastrar</NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
