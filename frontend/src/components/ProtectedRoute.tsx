import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: 'customer' | 'producer';
    requireEmailVerification?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    requiredRole,
    requireEmailVerification = false
}) => {
    const { user, isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    // Show loading spinner while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-burnt-orange"></div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated || !user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check email verification requirement
    if (requireEmailVerification && !user.isEmailVerified) {
        return <Navigate to="/verify-email" state={{ from: location }} replace />;
    }

    // Check role requirement
    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
