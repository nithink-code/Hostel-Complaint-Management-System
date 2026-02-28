import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/student/StudentDashboard';
import SubmitComplaint from './pages/student/SubmitComplaint';
import MyComplaints from './pages/student/MyComplaints';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminComplaints from './pages/admin/AdminComplaints';
import AdminAnnouncements from './pages/admin/AdminAnnouncements';
import GoogleAuthSuccess from './pages/GoogleAuthSuccess';

import { AnimatePresence } from 'framer-motion';
import PageTransition from './components/PageTransition';

const AppRoutes = () => {
  const location = useLocation();

  return (
    <>
      <Navbar />
      <main className="main-content">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Public */}
            <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
            <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
            <Route path="/google-auth-success" element={<PageTransition><GoogleAuthSuccess /></PageTransition>} />

            {/* Student */}
            <Route path="/student/dashboard" element={<PageTransition><StudentDashboard /></PageTransition>} />
            <Route path="/student/submit" element={<PageTransition><SubmitComplaint /></PageTransition>} />
            <Route path="/student/complaints" element={<PageTransition><MyComplaints /></PageTransition>} />

            {/* Admin */}
            <Route path="/admin/dashboard" element={<PageTransition><AdminDashboard /></PageTransition>} />
            <Route path="/admin/complaints" element={<PageTransition><AdminComplaints /></PageTransition>} />
            <Route path="/admin/announcements" element={<PageTransition><AdminAnnouncements /></PageTransition>} />

            {/* Fallback */}
            <Route path="/" element={<Navigate to="/student/dashboard" />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AnimatePresence>
      </main>
    </>
  );
};

const App = () => (
  <ThemeProvider>
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: { background: '#1e293b', color: '#f1f5f9', border: '1px solid #334155', borderRadius: '12px' },
            success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </ThemeProvider>
);

export default App;
