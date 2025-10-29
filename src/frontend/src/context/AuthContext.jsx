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
        const sessionId = localStorage.getItem("sessionId");

        if (!sessionId) {
            console.log("No hay sesión, omitiendo validación de sesión.");
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const response = await authApi.getCurrentUser(sessionId);
            setUser(response.data);
        } catch (error) {
            console.error("Error al validar la sesión:", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        try {
            const response = await authApi.login(credentials);
            const { sessionId, username } = response.data;

            if (!sessionId) {
                return { success: false, message: "No se recibió Session ID" };
            }

            localStorage.setItem("sessionId", sessionId);
            setUser({ username });
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
        sessionId: localStorage.getItem("sessionId"),
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