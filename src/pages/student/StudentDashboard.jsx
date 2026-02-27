import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import StatusBadge, { PriorityBadge } from '../../components/StatusBadge';
import toast from 'react-hot-toast';
import { PlusCircle, ClipboardList, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const StudentDashboard = () => {
    const { user } = useAuth();
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const { data } = await API.get('/complaints/my');
                setComplaints(data.complaints);
            } catch {
                toast.error('Failed to load complaints');
            } finally {
                setLoading(false);
            }
        };
        fetchComplaints();
    }, []);

    const stats = {
        total: complaints.length,
        pending: complaints.filter((c) => c.status === 'Pending').length,
        inProgress: complaints.filter((c) => c.status === 'In Progress').length,
        resolved: complaints.filter((c) => c.status === 'Resolved').length,
        rejected: complaints.filter((c) => c.status === 'Rejected').length,
    };

    const recentComplaints = complaints.slice(0, 5);

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1>Welcome, {user?.name || 'Guest'}! 👋</h1>
                    <p>
                        {user?.roomNumber && `Room ${user.roomNumber}`}
                        {user?.hostelBlock && ` • ${user.hostelBlock}`}
                    </p>
                </div>
                <Link to="/student/submit" className="btn-primary">
                    <PlusCircle size={18} />
                    New Complaint
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card stat-total">
                    <div className="stat-icon"><ClipboardList size={28} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.total}</span>
                        <span className="stat-label">Total</span>
                    </div>
                </div>
                <div className="stat-card stat-pending">
                    <div className="stat-icon"><Clock size={28} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.pending}</span>
                        <span className="stat-label">Pending</span>
                    </div>
                </div>
                <div className="stat-card stat-inprogress">
                    <div className="stat-icon"><AlertCircle size={28} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.inProgress}</span>
                        <span className="stat-label">In Progress</span>
                    </div>
                </div>
                <div className="stat-card stat-resolved">
                    <div className="stat-icon"><CheckCircle size={28} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.resolved}</span>
                        <span className="stat-label">Resolved</span>
                    </div>
                </div>
            </div>

            {/* Recent Complaints */}
            <div className="section-card">
                <div className="section-header">
                    <h2>Recent Complaints</h2>
                    <Link to="/student/complaints" className="link-view-all">View All</Link>
                </div>

                {loading ? (
                    <div className="center-loader"><div className="spinner"></div></div>
                ) : recentComplaints.length === 0 ? (
                    <div className="empty-state">
                        <ClipboardList size={48} />
                        <p>No complaints submitted yet</p>
                        <Link to="/student/submit" className="btn-primary">Submit Your First Complaint</Link>
                    </div>
                ) : (
                    <div className="complaint-list">
                        {recentComplaints.map((c) => (
                            <div key={c._id} className="complaint-item">
                                <div className="complaint-main">
                                    <h3>{c.title}</h3>
                                    <div className="complaint-meta">
                                        <span className="meta-tag">{c.category}</span>
                                        <PriorityBadge priority={c.priority} />
                                        <StatusBadge status={c.status} />
                                    </div>
                                </div>
                                <div className="complaint-date">
                                    {new Date(c.createdAt).toLocaleDateString('en-IN', {
                                        day: 'numeric', month: 'short', year: 'numeric',
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;
