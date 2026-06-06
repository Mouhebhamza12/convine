import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(async () => {
        const data = await api.getUser();
        setUser(data.user);
        return data.user;
    }, []);

    useEffect(() => {
        refresh().finally(() => setLoading(false));
    }, [refresh]);

    const login = useCallback(async (email, password) => {
        const data = await api.login(email, password);
        setUser(data.user);
        return data.user;
    }, []);

    const logout = useCallback(async () => {
        await api.logout();
        setUser(null);
    }, []);

    const value = useMemo(
        () => ({
            user,
            loading,
            login,
            logout,
            refresh,
            isAdmin: user?.role === 'admin',
            isCustomer: user?.role === 'customer',
        }),
        [user, loading, login, logout, refresh],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }

    return context;
}
