import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import {
    ClipboardList, Clock, AlertCircle, CheckCircle, XCircle,
    Users, TrendingUp,
} from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [recent, setRecent] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, complaintsRes] = await Promise.all([
                    API.get('/complaints/stats'),
                    API.get('/complaints?limit=5'),
                ]);
                setStats(statsRes.data.stats);
                setRecent(complaintsRes.data.complaints.slice(0, 5));
            } catch {
                toast.error('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="center-loader"><div className="spinner"></div></div>;

    const statusCards = [
        { label: 'Total', value: stats?.total || 0, icon: <ClipboardList size={28} />, cls: 'stat-total' },
        { label: 'Pending', value: stats?.pending || 0, icon: <Clock size={28} />, cls: 'stat-pending' },
        { label: 'In Progress', value: stats?.inProgress || 0, icon: <AlertCircle size={28} />, cls: 'stat-inprogress' },
        { label: 'Resolved', value: stats?.resolved || 0, icon: <CheckCircle size={28} />, cls: 'stat-resolved' },
        { label: 'Rejected', value: stats?.rejected || 0, icon: <XCircle size={28} />, cls: 'stat-rejected' },
    ];

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1>Admin Dashboard</h1>
                    <p>Overview of all hostel complaints</p>
                </div>
                <Link to="/admin/complaints" className="btn-primary">
                    <ClipboardList size={18} />
                    Manage Complaints
                </Link>
            </div>

            {/* Stats */}
            <div className="stats-grid stats-grid-5">
                {statusCards.map((card) => (
                    <div key={card.label} className={`stat-card ${card.cls}`}>
                        <div className="stat-icon">{card.icon}</div>
                        <div className="stat-info">
                            <span className="stat-value">{card.value}</span>
                            <span className="stat-label">{card.label}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="dashboard-grid">
                {/* Category Breakdown */}
                <div className="section-card">
                    <div className="section-header">
                        <h2><TrendingUp size={18} /> By Category</h2>
                    </div>
                    <div className="category-list">
                        {stats?.byCategory?.length === 0 ? (
                            <p className="empty-text">No data yet</p>
                        ) : (
                            stats?.byCategory?.map((item) => {
                                const pct = stats.total ? Math.round((item.count / stats.total) * 100) : 0;
                                return (
                                    <div key={item._id} className="category-item">
                                        <div className="category-label">
                                            <span>{item._id}</span>
                                            <span>{item.count}</span>
                                        </div>
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{ width: `${pct}%` }}></div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Recent Complaints */}
                <div className="section-card">
                    <div className="section-header">
                        <h2>Recent Complaints</h2>
                        <Link to="/admin/complaints" className="link-view-all">View All</Link>
                    </div>
                    <div className="complaint-list">
                        {recent.map((c) => (
                            <div key={c._id} className="complaint-item">
                                <div className="complaint-main">
                                    <h3>{c.title}</h3>
                                    <div className="complaint-meta">
                                        <span className="meta-tag">{c.student?.name || 'Unknown'}</span>
                                        <span className="meta-tag">{c.category}</span>
                                        <span className={`badge badge-${c.status.toLowerCase().replace(' ', '')}`}>{c.status}</span>
                                    </div>
                                </div>
                                <span className="complaint-date">
                                    {new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                </span>
                            </div>
                        ))}
                        {recent.length === 0 && <p className="empty-text">No complaints yet</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
