import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/student/StudentDashboard';
import SubmitComplaint from './pages/student/SubmitComplaint';
import MyComplaints from './pages/student/MyComplaints';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminComplaints from './pages/admin/AdminComplaints';
import GoogleAuthSuccess from './pages/GoogleAuthSuccess';

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Public */}
          <Route path="/login" element={!user ? <Login /> : <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} />} />
          <Route path="/google-auth-success" element={<GoogleAuthSuccess />} />

          {/* Student */}
          <Route path="/student/dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
          <Route path="/student/submit" element={<ProtectedRoute><SubmitComplaint /></ProtectedRoute>} />
          <Route path="/student/complaints" element={<ProtectedRoute><MyComplaints /></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin/dashboard" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/complaints" element={<ProtectedRoute adminOnly><AdminComplaints /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="/" element={<Navigate to={user ? (user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard') : '/login'} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </>
  );
};

const App = () => (
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
);

export default App;
