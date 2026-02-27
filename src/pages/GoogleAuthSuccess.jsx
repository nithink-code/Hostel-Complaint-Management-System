import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const GoogleAuthSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { googleLogin } = useAuth();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        if (token) {
            googleLogin(token)
                .then((user) => {
                    toast.success(`Welcome, ${user.name}!`);
                    navigate(user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard');
                })
                .catch((err) => {
                    console.error('Google Auth Error:', err);
                    toast.error('Authentication failed. Please try again.');
                    navigate('/login');
                });
        } else {
            toast.error('Authentication failed. No token found.');
            navigate('/login');
        }
    }, [location, googleLogin, navigate]);

    return (
        <div className="loader-screen">
            <div className="auth-hero">
                <div className="spinner"></div>
                <h2 style={{ marginTop: '20px' }}>Completing Sign In...</h2>
                <p>Please wait while we set up your session.</p>
            </div>
        </div>
    );
};

export default GoogleAuthSuccess;
