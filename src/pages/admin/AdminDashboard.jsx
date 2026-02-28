import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import {
    ClipboardList, Clock, AlertCircle, CheckCircle, XCircle,
    Users, TrendingUp, User
} from 'lucide-react';

import { motion } from 'framer-motion';

import AdminFeatureCarousel from '../../components/AdminFeatureCarousel';
import Leaderboard from '../../components/Leaderboard';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [recent, setRecent] = useState([]);
    const [leaderboard, setLeaderboard] = useState({ staffLeaderboard: [], blockLeaderboard: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, complaintsRes, leaderboardRes] = await Promise.all([
                    API.get('/complaints/stats'),
                    API.get('/complaints?limit=5'),
                    API.get('/complaints/leaderboard'),
                ]);
                setStats(statsRes.data.stats);
                setRecent(complaintsRes.data.complaints.slice(0, 5));
                setLeaderboard(leaderboardRes.data);
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
            <AdminFeatureCarousel />

            {/* Stats */}
            <div className="stats-grid stats-grid-5">
                {statusCards.map((card, i) => (
                    <motion.div
                        key={card.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`stat-card ${card.cls}`}
                    >
                        <div className="stat-icon">{card.icon}</div>
                        <div className="stat-info">
                            <span className="stat-value">{card.value}</span>
                            <span className="stat-label">{card.label}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Performance Leaderboards */}
            <div style={{ marginBottom: '32px' }}>
                <Leaderboard
                    staffLeaderboard={leaderboard.staffLeaderboard}
                    blockLeaderboard={leaderboard.blockLeaderboard}
                />
            </div>

            <div className="dashboard-grid">
                {/* Category Breakdown */}
                <motion.div
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="section-card"
                >
                    <div className="section-header">
                        <h2><TrendingUp size={18} /> Category Analytics</h2>
                    </div>
                    <div className="category-list">
                        {stats?.byCategory?.length === 0 ? (
                            <p className="empty-text">No data available yet</p>
                        ) : (
                            stats?.byCategory?.map((item, i) => {
                                const pct = stats.total ? Math.round((item.count / stats.total) * 100) : 0;
                                return (
                                    <div key={item._id} className="category-item">
                                        <div className="category-label">
                                            <span>{item._id}</span>
                                            <span>{item.count} issues</span>
                                        </div>
                                        <div className="progress-bar">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${pct}%` }}
                                                transition={{ duration: 1, delay: 0.2 + (i * 0.1) }}
                                                className="progress-fill"
                                            ></motion.div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="section-card"
                >
                    <div className="section-header">
                        <h2>System Recent Activity</h2>
                        <Link to="/admin/complaints" className="link-view-all">See Full Log</Link>
                    </div>
                    <div className="complaint-list">
                        {recent.map((c, i) => (
                            <div key={c._id} className="complaint-item">
                                <div className="complaint-main">
                                    <h3>{c.title}</h3>
                                    <div className="complaint-meta">
                                        <span className="meta-tag student-tag"><User size={12} /> {c.student?.name || 'Unknown'}</span>
                                        <span className="meta-tag">{c.category}</span>
                                        <span className={`badge badge-${c.status.toLowerCase().replace(' ', '')}`}>{c.status}</span>
                                    </div>
                                </div>
                                <span className="complaint-date">
                                    {new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                </span>
                            </div>
                        ))}
                        {recent.length === 0 && <p className="empty-text">No recent activity detected</p>}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminDashboard;
