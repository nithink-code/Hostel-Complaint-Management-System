import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('hostelops_user');
        const token = localStorage.getItem('hostelops_token');
        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const { data } = await API.post('/auth/login', { email, password });
        localStorage.setItem('hostelops_token', data.token);
        localStorage.setItem('hostelops_user', JSON.stringify(data.user));
        setUser(data.user);
        return data.user;
    };

    const register = async (formData) => {
        const { data } = await API.post('/auth/register', formData);
        localStorage.setItem('hostelops_token', data.token);
        localStorage.setItem('hostelops_user', JSON.stringify(data.user));
        setUser(data.user);
        return data.user;
    };

    const googleLogin = async (token) => {
        localStorage.setItem('hostelops_token', token);
        // Fetch user data using the token
        try {
            const { data } = await API.get('/auth/me');
            localStorage.setItem('hostelops_user', JSON.stringify(data.user));
            setUser(data.user);
            return data.user;
        } catch (err) {
            logout();
            throw err;
        }
    };

    const logout = () => {
        localStorage.removeItem('hostelops_token');
        localStorage.removeItem('hostelops_user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, googleLogin, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
};
