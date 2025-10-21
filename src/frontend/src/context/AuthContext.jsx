import { createContext, useState, useContext, useEffect } from "react";
import { authApi } from "../services/api.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkSession();
    }, []);

    const checkSession = async () => {
        try {
            const response = await authApi.getCurrentUser();
            setUser(response.data);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (username, password) => {
        try {
            const response = await authApi.login({ username, password });
            setUser(response.data.user);
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Error al iniciar sesión';
            return { success: false, message };
        }
    };

    const register = async (userData) => {
        try {
            const response = await authApi.register(userData);
            return { success: true, message: response.data.message };
        } catch (error) {
            const message = error.response?.data?.message || 'Error al registrar usuario';
            return { success: false, message };
        }
    };

    const logout = async () => {
        try {
            await authApi.logout();
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        } finally {
            setUser(null);
        }
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN',
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe ser usado dentro de un AuthProvider");
    }
    return context;
};