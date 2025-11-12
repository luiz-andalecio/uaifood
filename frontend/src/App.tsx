// App principal com rotas e layout basico
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Menu from './pages/Menu'
import About from './pages/About'
import Login from './pages/Login'
import Register from './pages/Register'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import Profile from './pages/Profile'
import ProtectedRoute from './components/ProtectedRoute'
import RoleRoute from './components/RoleRoute'
import AdminMenu from './pages/admin/AdminMenu'
import AdminUsers from './pages/admin/AdminUsers'
import AdminOrders from './pages/admin/AdminOrders'
import MyOrders from './pages/MyOrders'
import AdminDashboard from './pages/admin/AdminDashboard'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cardapio" element={<Menu />} />
          <Route path="/sobre" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Register />} />
          {/* Carrinho integrado ao /cardapio - rota /carrinho removida */}
          {/* rotas protegidas */}
          <Route element={<ProtectedRoute />}> 
            <Route path="/perfil" element={<Profile />} />
            <Route path="/meus-pedidos" element={<MyOrders />} />
          </Route>
          {/* rotas somente para ADMIN/ROOT */}
          <Route element={<RoleRoute allowed={["ADMIN", "ROOT"]} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/cardapio" element={<AdminMenu />} />
            <Route path="/admin/usuarios" element={<AdminUsers />} />
            <Route path="/pedidos" element={<AdminOrders />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
