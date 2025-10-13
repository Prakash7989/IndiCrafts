import React from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const AdminLayout: React.FC = () => {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen grid grid-cols-[240px_1fr] grid-rows-[56px_1fr]">
            {/* Topbar */}
            <header className="col-span-2 flex items-center justify-between px-4 border-b">
                <Link to="/admin" className="font-semibold">IndiCrafts Admin</Link>
                <div className="text-sm flex items-center gap-3">
                    <span>{user?.name}</span>
                    <button onClick={logout} className="underline">Logout</button>
                </div>
            </header>

            {/* Sidebar */}
            <aside className="border-r p-3 space-y-2">
                <NavLink to="/admin" end className={({ isActive }) => isActive ? 'font-medium' : ''}>Dashboard</NavLink>
                <div className="space-y-1">
                    <div className="text-xs uppercase text-muted-foreground">Commerce</div>
                    <NavLink to="/admin/orders" className={({ isActive }) => isActive ? 'font-medium' : ''}>Orders</NavLink>
                </div>
            </aside>

            {/* Content */}
            <main className="p-4">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;


