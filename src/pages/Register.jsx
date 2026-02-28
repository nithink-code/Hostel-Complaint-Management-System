import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Shield, Mail, Lock, User, Home, Building, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'student',
        roomNumber: '',
        hostelBlock: '',
    });
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.password) {
            toast.error('Please fill in all required fields');
            return;
        }
        if (form.password !== form.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        if (form.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
        setLoading(true);
        try {
            const { confirmPassword: _confirmPassword, ...payload } = form;
            const user = await register(payload);
            toast.success(`Welcome, ${user.name}!`);
            navigate(user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-left">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="auth-hero"
                >
                    <Shield size={64} className="hero-icon" />
                    <h1>HostelOps</h1>
                    <p>Join the smart hostel management platform</p>
                    <div className="auth-features">
                        {[
                            '🏠 For students & admins',
                            '📋 Structured complaint tracking',
                            '⚡ Fast resolution workflow'
                        ].map((text, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + (i * 0.1) }}
                                className="feature-item"
                            >
                                {text}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            <div className="auth-right">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="auth-card"
                >
                    <div className="auth-header">
                        <h2>Create Account</h2>
                        <p>Register to get started</p>
                    </div>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="name">Full Name *</label>
                                <div className="input-wrapper">
                                    <User size={18} className="input-icon" />
                                    <input
                                        id="name"
                                        type="text"
                                        name="name"
                                        placeholder="Your full name"
                                        value={form.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="reg-email">Email Address *</label>
                                <div className="input-wrapper">
                                    <Mail size={18} className="input-icon" />
                                    <input
                                        id="reg-email"
                                        type="email"
                                        name="email"
                                        placeholder="your@email.com"
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="reg-password">Password *</label>
                                <div className="input-wrapper">
                                    <Lock size={18} className="input-icon" />
                                    <input
                                        id="reg-password"
                                        type={showPass ? 'text' : 'password'}
                                        name="password"
                                        placeholder="Min. 6 characters"
                                        value={form.password}
                                        onChange={handleChange}
                                        required
                                    />
                                    <button type="button" className="toggle-pass" onClick={() => setShowPass(!showPass)}>
                                        {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirm Password *</label>
                                <div className="input-wrapper">
                                    <Lock size={18} className="input-icon" />
                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="Re-enter password"
                                        value={form.confirmPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="role">Register As</label>
                            <div className="input-wrapper">
                                <Shield size={18} className="input-icon" />
                                <select id="role" name="role" value={form.role} onChange={handleChange}>
                                    <option value="student">Student</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        </div>

                        {form.role === 'student' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="form-row"
                            >
                                <div className="form-group">
                                    <label htmlFor="roomNumber">Room Number</label>
                                    <div className="input-wrapper">
                                        <Home size={18} className="input-icon" />
                                        <input
                                            id="roomNumber"
                                            type="text"
                                            name="roomNumber"
                                            placeholder="e.g. 204"
                                            value={form.roomNumber}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="hostelBlock">Hostel Block</label>
                                    <div className="input-wrapper">
                                        <Building size={18} className="input-icon" />
                                        <input
                                            id="hostelBlock"
                                            type="text"
                                            name="hostelBlock"
                                            placeholder="e.g. Block A"
                                            value={form.hostelBlock}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            type="submit"
                            className="btn-primary btn-full"
                            disabled={loading}
                        >
                            {loading ? <span className="btn-spinner"></span> : 'Create Account'}
                        </motion.button>

                        <div className="auth-divider">
                            <span>OR</span>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            type="button"
                            className="btn-google btn-full"
                            onClick={() => window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/auth/google`}
                        >
                            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.25.81-.59z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.63l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335" />
                            </svg>
                            Continue with Google
                        </motion.button>
                    </form>

                    <p className="auth-switch">
                        Already have an account?{' '}
                        <Link to="/login">Sign in here</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;
