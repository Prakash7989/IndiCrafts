import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '@/services/api';

interface User {
    id: string;
    firstName: string;
    lastName: string;
    name: string;
    email: string;
    role: 'customer' | 'producer';
    isEmailVerified: boolean;
    phone?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (userData: RegisterData) => Promise<void>;
    logout: () => void;
    verifyEmail: (token: string) => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
    resetPassword: (token: string, password: string) => Promise<void>;
    updateProfile: (userData: Partial<User>) => Promise<void>;
    refreshProfile: () => Promise<void>;
}

interface RegisterData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: 'customer' | 'producer';
    phone?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState(true);

    const isAuthenticated = !!user && !!token;

    // Initialize auth state on mount
    useEffect(() => {
        const initializeAuth = async () => {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                try {
                    const response = await apiService.getProfile();
                    setUser(response.user);
                    setToken(storedToken);
                } catch (error) {
                    // Token is invalid, clear it
                    localStorage.removeItem('token');
                    setToken(null);
                }
            }
            setIsLoading(false);
        };

        initializeAuth();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            setIsLoading(true);
            const response = await apiService.login({ email, password });

            if (response.token && response.user) {
                localStorage.setItem('token', response.token);
                setToken(response.token);
                setUser(response.user);
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (userData: RegisterData) => {
        try {
            setIsLoading(true);
            const response = await apiService.register(userData);

            if (response.user) {
                setUser(response.user);
                // Don't set token here as user needs to verify email first
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const verifyEmail = async (token: string) => {
        try {
            setIsLoading(true);
            await apiService.verifyEmail(token);
            // Refresh user profile to get updated verification status
            if (user) {
                await refreshProfile();
            }
        } catch (error) {
            console.error('Email verification error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const forgotPassword = async (email: string) => {
        try {
            setIsLoading(true);
            await apiService.forgotPassword(email);
        } catch (error) {
            console.error('Forgot password error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const resetPassword = async (token: string, password: string) => {
        try {
            setIsLoading(true);
            await apiService.resetPassword(token, password);
        } catch (error) {
            console.error('Reset password error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const updateProfile = async (userData: Partial<User>) => {
        try {
            setIsLoading(true);
            const response = await apiService.updateProfile({
                firstName: userData.firstName,
                lastName: userData.lastName,
                phone: userData.phone,
            });

            if (response.user) {
                setUser(response.user);
            }
        } catch (error) {
            console.error('Update profile error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const refreshProfile = async () => {
        try {
            const response = await apiService.getProfile();
            setUser(response.user);
        } catch (error) {
            console.error('Refresh profile error:', error);
            // If profile refresh fails, user might not be authenticated
            logout();
        }
    };

    const value: AuthContextType = {
        user,
        token,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        verifyEmail,
        forgotPassword,
        resetPassword,
        updateProfile,
        refreshProfile,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
