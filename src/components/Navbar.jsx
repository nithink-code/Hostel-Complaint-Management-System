import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, PlusCircle, List, LogOut, User, Shield, ClipboardList } from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = () => {
    const { user, logout } = useAuth();
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
    ];

    const links = user.role === 'admin' ? adminLinks : studentLinks;

    return (
        <nav className="navbar">
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
                    </NavLink>
                ))}
            </div>

            <div className="navbar-user">
                <div className="user-info">
                    <User size={16} />
                    <span>{user?.name || 'Guest'}</span>
                    <span className={`role-badge ${user?.role || 'student'}`}>{user?.role || 'Guest'}</span>
                </div>
                <button className="btn-logout" onClick={handleLogout}>
                    <LogOut size={16} />
                    <span>Logout</span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
