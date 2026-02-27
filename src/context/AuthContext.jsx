/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';
import API from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('hostelops_user');
        const token = localStorage.getItem('hostelops_token');
        if (storedUser && token) {
            try {
                return JSON.parse(storedUser);
            } catch {
                return null;
            }
        }
        return {
            _id: 'guest',
            name: 'Guest User',
            email: 'guest@example.com',
            role: 'student',
            roomNumber: 'N/A',
            hostelBlock: 'N/A'
        };
    });
    const loading = false;


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
        setUser({
            _id: 'guest',
            name: 'Guest User',
            email: 'guest@example.com',
            role: 'student',
            roomNumber: 'N/A',
            hostelBlock: 'N/A'
        });
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
