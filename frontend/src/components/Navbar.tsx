// Navbar com layout responsivo, separando navegação padrão e atalhos de admin
import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { Home, UtensilsCrossed, ShoppingBag, Info, User, LogOut, Menu as MenuIcon, X, Shield, ListOrdered, Monitor } from 'lucide-react'

export function Navbar() {
  const { token, user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { items } = useCart()
  const cartCount = items.reduce((acc, i) => acc + i.quantity, 0)
  const isAdmin = !!user && (user.role === 'ADMIN' || user.role === 'ROOT')

  // estado do menu mobile
  const [open, setOpen] = useState(false)
  const [tableNumber, setTableNumber] = useState('')
  useEffect(() => {
    // fecha o menu quando a rota mudar
    setOpen(false)
  }, [location.pathname])
  useEffect(() => {
    // lê mesa automática da sessão
    const stored = sessionStorage.getItem('uaifood_table_number')
    if (stored) setTableNumber(stored)
  }, [])

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur shadow" role="banner">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo / Nome */}
        <div className="flex items-center min-w-0">
          <Link to="/" className="text-2xl font-bold whitespace-nowrap">
            <span className="text-tertiary">UAI</span><span className="text-yellow-500">Food</span>
          </Link>
          {/* Navegação padrão (desktop) */}
          <nav className="hidden md:flex items-center gap-4 text-sm ml-6" aria-label="Navegação principal">
            <NavLink to="/" className={({ isActive }) => `inline-flex items-center gap-1 ${isActive ? 'text-tertiary font-semibold' : 'text-gray-700 hover:text-tertiary'}`}>
              <Home size={16} /> Início
            </NavLink>
            <NavLink to="/cardapio" className={({ isActive }) => `inline-flex items-center gap-1 ${isActive ? 'text-tertiary font-semibold' : 'text-gray-700 hover:text-tertiary'}`}>
              <UtensilsCrossed size={16} /> Cardápio
            </NavLink>
            {/* Carrinho agora fica no cardápio, sem rota dedicada */}
            <NavLink to="/sobre" className={({ isActive }) => `inline-flex items-center gap-1 ${isActive ? 'text-tertiary font-semibold' : 'text-gray-700 hover:text-tertiary'}`}>
              <Info size={16} /> Sobre
            </NavLink>
          </nav>
        </div>

        {/* Ações à direita (desktop) */}
        <div className="hidden md:flex items-center gap-3 text-sm">
          {/* Badge da mesa atual (sempre visível) */}
          <div className="flex items-center gap-1 text-gray-700 pr-3 mr-1 border-r" aria-label="Mesa atual">
            <Monitor size={16} />
            <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full font-semibold">Mesa {tableNumber || '...'}</span>
          </div>
          {token ? (
            <>
              {/* Links de CRUD Admin/Root */}
              {isAdmin && (
                <div className="flex items-center gap-3 pr-3 mr-1 border-r">
                  <NavLink to="/admin" className={({ isActive }) => `inline-flex items-center gap-1 ${isActive ? 'text-tertiary font-semibold' : 'text-gray-700 hover:text-tertiary'}`}>
                    <Shield size={16} /> Dashboard
                  </NavLink>
                  <NavLink to="/pedidos" className={({ isActive }) => `inline-flex items-center gap-1 ${isActive ? 'text-tertiary font-semibold' : 'text-gray-700 hover:text-tertiary'}`}>
                    <ShoppingBag size={16} /> Pedidos
                  </NavLink>
                </div>
              )}
              {/* Meus pedidos */}
              <NavLink to="/meus-pedidos" className={({ isActive }) => `inline-flex items-center gap-1 ${isActive ? 'text-tertiary font-semibold' : 'text-gray-700 hover:text-tertiary'}`}>
                <ListOrdered size={16} /> Meus Pedidos
              </NavLink>
              {/* Saudação e sair */}
              <NavLink to="/perfil" className={({ isActive }) => `inline-flex items-center gap-1 ${isActive ? 'text-tertiary font-semibold' : 'text-gray-700 hover:text-tertiary'}`}>
                <User size={16} /> {user?.name ? `Olá, ${user.name.split(' ')[0]}` : 'Perfil'}
              </NavLink>
              <button onClick={handleLogout} className="px-3 py-1 rounded border border-red-500 text-red-600 hover:bg-red-50 inline-flex items-center gap-1">
                <LogOut size={16} /> Sair
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) => `inline-flex items-center gap-1 ${isActive ? 'text-tertiary font-semibold' : 'text-gray-700 hover:text-tertiary'}`}>
                <User size={16} /> Entrar
              </NavLink>
              <NavLink to="/cadastro" className="px-3 py-1 rounded bg-gradient-to-r from-yellow-400 to-red-500 text-white">Cadastrar</NavLink>
            </>
          )}
        </div>

        {/* Botão hamburger (mobile) */}
        <button
          className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded hover:bg-gray-100"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={20} /> : <MenuIcon size={20} />}
        </button>
      </div>

      {/* Menu mobile */}
      {open && (
        <div id="mobile-menu" className="md:hidden border-t bg-white shadow-inner" role="navigation" aria-label="Menu mobile">
          <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-5 text-sm">
            {/* Mesa atual */}
            <div className="flex items-center gap-2 text-gray-700">
              <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full font-semibold">
                <Monitor size={18} />{tableNumber || '...'}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[11px] uppercase tracking-wide text-gray-500">Navegação</span>
              <NavLink to="/" className={({ isActive }) => `inline-flex items-center gap-2 rounded px-2 py-1 ${isActive ? 'bg-red-50 text-tertiary font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}>
                <Home size={18} /> Início
              </NavLink>
              <NavLink to="/cardapio" className={({ isActive }) => `inline-flex items-center gap-2 rounded px-2 py-1 ${isActive ? 'bg-red-50 text-tertiary font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}>
                <UtensilsCrossed size={18} /> Cardápio
              </NavLink>
              <NavLink to="/sobre" className={({ isActive }) => `inline-flex items-center gap-2 rounded px-2 py-1 ${isActive ? 'bg-red-50 text-tertiary font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}>
                <Info size={18} /> Sobre
              </NavLink>
              {cartCount > 0 && (
                <div className="inline-flex items-center gap-2 text-gray-700 px-2 py-1">
                  <ShoppingBag size={18} /> Itens: <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full">{cartCount}</span>
                </div>
              )}
              {token && (
                <NavLink to="/meus-pedidos" className={({ isActive }) => `inline-flex items-center gap-2 rounded px-2 py-1 ${isActive ? 'bg-red-50 text-tertiary font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}>
                  <ListOrdered size={18} /> Meus Pedidos
                </NavLink>
              )}
            </div>
            {token && isAdmin && (
              <div className="flex flex-col gap-2">
                <span className="text-[11px] uppercase tracking-wide text-gray-500">Administração</span>
                <NavLink to="/admin" className={({ isActive }) => `inline-flex items-center gap-2 rounded px-2 py-1 ${isActive ? 'bg-red-50 text-tertiary font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}>
                  <Shield size={18} /> Dashboard
                </NavLink>
                <NavLink to="/pedidos" className={({ isActive }) => `inline-flex items-center gap-2 rounded px-2 py-1 ${isActive ? 'bg-red-50 text-tertiary font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}>
                  <ShoppingBag size={18} /> Pedidos
                </NavLink>
              </div>
            )}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] uppercase tracking-wide text-gray-500">Conta</span>
              {token ? (
                <>
                  <NavLink to="/perfil" className={({ isActive }) => `inline-flex items-center gap-2 rounded px-2 py-1 ${isActive ? 'bg-red-50 text-tertiary font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}>
                    <User size={18} /> {user?.name ? `Olá, ${user.name.split(' ')[0]}` : 'Perfil'}
                  </NavLink>
                  <button onClick={handleLogout} className="inline-flex items-center gap-2 rounded px-2 py-1 border border-red-500 text-red-600 hover:bg-red-50">
                    <LogOut size={16} /> Sair
                  </button>
                </>
              ) : (
                <>
                  <NavLink to="/login" className={({ isActive }) => `inline-flex items-center gap-2 rounded px-2 py-1 ${isActive ? 'bg-red-50 text-tertiary font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}>
                    <User size={18} /> Entrar
                  </NavLink>
                  <NavLink to="/cadastro" className="inline-flex items-center justify-center gap-2 rounded px-2 py-1 bg-gradient-to-r from-yellow-400 to-red-500 text-white">
                    Criar conta
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
