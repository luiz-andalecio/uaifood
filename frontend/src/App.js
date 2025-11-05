import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// App principal com rotas e layout basico
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Menu from './pages/Menu';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import CartPage from './pages/CartPage';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import RoleRoute from './components/RoleRoute';
import AdminMenu from './pages/admin/AdminMenu';
import AdminUsers from './pages/admin/AdminUsers';
import MyOrders from './pages/MyOrders';
import AdminDashboard from './pages/admin/AdminDashboard';
export default function App() {
    return (_jsxs("div", { className: "min-h-screen flex flex-col", children: [_jsx(Navbar, {}), _jsx("main", { className: "flex-1", children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Home, {}) }), _jsx(Route, { path: "/cardapio", element: _jsx(Menu, {}) }), _jsx(Route, { path: "/sobre", element: _jsx(About, {}) }), _jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/cadastro", element: _jsx(Register, {}) }), _jsx(Route, { path: "/carrinho", element: _jsx(CartPage, {}) }), _jsxs(Route, { element: _jsx(ProtectedRoute, {}), children: [_jsx(Route, { path: "/perfil", element: _jsx(Profile, {}) }), _jsx(Route, { path: "/meus-pedidos", element: _jsx(MyOrders, {}) })] }), _jsxs(Route, { element: _jsx(RoleRoute, { allowed: ["ADMIN", "ROOT"] }), children: [_jsx(Route, { path: "/admin", element: _jsx(AdminDashboard, {}) }), _jsx(Route, { path: "/admin/cardapio", element: _jsx(AdminMenu, {}) }), _jsx(Route, { path: "/admin/usuarios", element: _jsx(AdminUsers, {}) })] }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/" }) })] }) }), _jsx(Footer, {})] }));
}
