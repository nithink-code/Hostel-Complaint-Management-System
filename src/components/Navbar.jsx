import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Home, PlusCircle, List, LogOut, User, Shield, ClipboardList, Megaphone, Sun, Moon } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        navigate('/login');
    };

    if (!user) return null;

    const studentLinks = [
        { to: '/student/dashboard', label: 'Dashboard', icon: <Home size={18} /> },
        { to: '/student/submit', label: 'Submit Complaint', icon: <PlusCircle size={18} /> },
        { to: '/student/complaints', label: 'My Complaints', icon: <List size={18} /> },
    ];

    const adminLinks = [
        { to: '/admin/dashboard', label: 'Dashboard', icon: <Home size={18} /> },
        { to: '/admin/complaints', label: 'All Complaints', icon: <ClipboardList size={18} /> },
        { to: '/admin/announcements', label: 'Announcements', icon: <Megaphone size={18} /> },
    ];

    const links = user.role === 'admin' ? adminLinks : studentLinks;
    const isLight = theme === 'light';

    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="navbar"
        >
            <div className="navbar-brand">
                <Shield size={24} className="brand-icon" />
                <span>HostelOps</span>
            </div>

            <div className="navbar-links">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    >
                        {link.icon}
                        <span>{link.label}</span>
                        <motion.div
                            className="nav-indicator"
                            layoutId="nav-indicator"
                        />
                    </NavLink>
                ))}
            </div>

            <div className="navbar-user">
                {/* Theme Toggle */}
                <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={toggleTheme}
                    className="theme-toggle-btn"
                    title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                    aria-label="Toggle theme"
                >
                    <motion.div
                        key={theme}
                        initial={{ rotate: -30, opacity: 0, scale: 0.7 }}
                        animate={{ rotate: 0, opacity: 1, scale: 1 }}
                        exit={{ rotate: 30, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="theme-toggle-icon"
                    >
                        {isLight ? <Moon size={17} /> : <Sun size={17} />}
                    </motion.div>
                    <span className="theme-toggle-label">
                        {isLight ? 'Dark' : 'Light'}
                    </span>
                </motion.button>

                <div className="user-info glass-card" style={{ padding: '6px 12px', border: 'none', background: 'rgba(255,255,255,0.03)' }}>
                    <div className="user-avatar">
                        {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span>{user?.name || 'Guest'}</span>
                    <span className={`role-badge ${user?.role || 'student'}`}>{user?.role || 'Guest'}</span>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-logout"
                    onClick={handleLogout}
                >
                    <LogOut size={16} />
                    <span>Logout</span>
                </motion.button>
            </div>
        </motion.nav>
    );
};

export default Navbar;
