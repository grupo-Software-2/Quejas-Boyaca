import { createContext, useState, useContext, useEffect } from "react";
// CORRECCIÓN: Quitamos la extensión .js para la resolución correcta
import { authApi } from "../services/api"; 

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Función auxiliar para obtener el rol del usuario desde el token (si aplica)
    // Esto es necesario para que `App.jsx` sepa si es 'ADMIN' o no.
    const decodeRoleFromSessionId = (sessionId) => {
        // En una aplicación real, decodificas el JWT.
        // Aquí simulamos que si el ID existe, el rol es ADMIN (para la demo).
        if (sessionId && sessionId.startsWith('admin_')) return 'ADMIN';
        if (sessionId) return 'USER';
        return null;
    };

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
            const response = await authApi.getCurrentUser();
            // Aseguramos que el objeto de usuario contenga el rol (necesario para la vista Admin)
            const role = response.data.role || decodeRoleFromSessionId(sessionId);
            setUser({ ...response.data, role });
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
            const { sessionId, username, role } = response.data;

            if (!sessionId) {
                return { success: false, message: "No se recibió Session ID" };
            }

            localStorage.setItem("sessionId", sessionId);
            // Si el backend no devuelve el rol, lo inferimos
            const finalRole = role || decodeRoleFromSessionId(sessionId);
            setUser({ username, role: finalRole });
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
            localStorage.removeItem("sessionId"); // CRUCIAL: Remover el ID al cerrar sesión
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
        // Usamos user?.role para que App.jsx sepa si mostrar el panel Admin
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