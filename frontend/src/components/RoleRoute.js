import { jsx as _jsx } from "react/jsx-runtime";
// rota protegida por papel (role): permite apenas ADMIN/ROOT conforme necessidade
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
export default function RoleRoute({ allowed }) {
    const { token, user, loading } = useAuth();
    const location = useLocation();
    if (loading)
        return null;
    if (!token)
        return _jsx(Navigate, { to: "/login", replace: true, state: { from: location } });
    const role = (user?.role || 'CLIENTE');
    if (!allowed.includes(role))
        return _jsx(Navigate, { to: "/", replace: true });
    return _jsx(Outlet, {});
}
