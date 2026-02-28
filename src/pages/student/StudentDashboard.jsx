import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import StatusBadge, { PriorityBadge } from '../../components/StatusBadge';
import toast from 'react-hot-toast';
import { PlusCircle, ClipboardList, Clock, CheckCircle, XCircle, AlertCircle, User, ChevronDown, ChevronUp, Megaphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FeatureCarousel from '../../components/FeatureCarousel';
import AnnouncementBanner from '../../components/AnnouncementBanner';

const StudentDashboard = () => {
    const { user } = useAuth();
    const [complaints, setComplaints] = useState([]);
    const [hostelActivity, setHostelActivity] = useState([]);
    const [hostelStats, setHostelStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expandedActivity, setExpandedActivity] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [myRes, allComplaintsRes, allAnnsRes, statsRes] = await Promise.all([
                    API.get('/complaints/my'),
                    API.get('/complaints?limit=5'),
                    API.get('/announcements?limit=5'),
                    API.get('/complaints/stats'),
                ]);

                // Merge and sort activity
                const merged = [
                    ...allComplaintsRes.data.complaints.map(c => ({ ...c, type: 'complaint' })),
                    ...allAnnsRes.data.announcements.map(a => ({ ...a, type: 'announcement' }))
                ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8);

                setComplaints(myRes.data.complaints);
                setHostelActivity(merged);
                setHostelStats(statsRes.data.stats);
            } catch {
                toast.error('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
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
            <FeatureCarousel userName={user?.name} />
            <AnnouncementBanner />

            <div className="section-header" style={{ marginTop: '20px' }}>
                <h2>My Personal Status</h2>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card stat-pending">
                    <div className="stat-icon"><Clock size={28} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.pending}</span>
                        <span className="stat-label">My Pending</span>
                    </div>
                </div>
                <div className="stat-card stat-inprogress">
                    <div className="stat-icon"><AlertCircle size={28} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.inProgress}</span>
                        <span className="stat-label">My Under Review</span>
                    </div>
                </div>
                <div className="stat-card stat-resolved">
                    <div className="stat-icon"><CheckCircle size={28} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.resolved}</span>
                        <span className="stat-label">My Resolved</span>
                    </div>
                </div>
            </div>

            {/* Hostel Performance Section (The "Admin Perspective") */}
            <div className="section-header" style={{ marginTop: '20px' }}>
                <h2>Hostel Performance <span className="admin-tag" style={{ border: 'none', background: 'var(--accent-glow)', color: 'var(--accent)', marginLeft: '8px' }}>Global View</span></h2>
            </div>
            <div className="stats-grid stats-grid-5">
                <div className="stat-card stat-total">
                    <div className="stat-info">
                        <span className="stat-value" style={{ fontSize: '1.5rem' }}>{hostelStats?.total || 0}</span>
                        <span className="stat-label">Total Reported</span>
                    </div>
                </div>
                <div className="stat-card stat-resolved">
                    <div className="stat-info">
                        <span className="stat-value" style={{ fontSize: '1.5rem' }}>{hostelStats?.resolved || 0}</span>
                        <span className="stat-label">Resolved</span>
                    </div>
                </div>
                <div className="stat-card stat-pending">
                    <div className="stat-info">
                        <span className="stat-value" style={{ fontSize: '1.5rem' }}>{hostelStats?.pending || 0}</span>
                        <span className="stat-label">Pending Approval</span>
                    </div>
                </div>
                <div className="stat-card stat-inprogress">
                    <div className="stat-info">
                        <span className="stat-value" style={{ fontSize: '1.5rem' }}>{hostelStats?.inProgress || 0}</span>
                        <span className="stat-label">In Progress</span>
                    </div>
                </div>
                <div className="stat-card stat-rejected">
                    <div className="stat-info">
                        <span className="stat-value" style={{ fontSize: '1.5rem' }}>{hostelStats?.rejected || 0}</span>
                        <span className="stat-label">Rejected</span>
                    </div>
                </div>
            </div>

            <div className="dashboard-grid">
                {/* My Recent Activity */}
                <div className="section-card">
                    <div className="section-header">
                        <h2>My Recent Activity</h2>
                        <Link to="/student/complaints" className="link-view-all">View All</Link>
                    </div>

                    {loading ? (
                        <div className="center-loader"><div className="spinner"></div></div>
                    ) : complaints.length === 0 ? (
                        <div className="empty-state">
                            <ClipboardList size={48} />
                            <p>You haven't submitted any complaints yet</p>
                            <Link to="/student/submit" className="btn-primary">Submit Now</Link>
                        </div>
                    ) : (
                        <div className="complaint-list">
                            {complaints.map((c) => (
                                <div key={c._id} className="accordion-item" style={{ border: 'none', background: 'transparent', padding: 0 }}>
                                    <div className="complaint-item" onClick={() => setExpandedActivity(expandedActivity === c._id ? null : c._id)} style={{ cursor: 'pointer' }}>
                                        <div className="complaint-main">
                                            <h3>{c.title}</h3>
                                            <div className="complaint-meta">
                                                <span className="meta-tag">{c.category}</span>
                                                <PriorityBadge priority={c.priority} />
                                                <StatusBadge status={c.status} />
                                            </div>
                                        </div>
                                        <div className="complaint-date" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                            {expandedActivity === c._id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                        </div>
                                    </div>
                                    <AnimatePresence>
                                        {expandedActivity === c._id && (
                                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                                                <div className="accordion-body" style={{ background: 'var(--bg-elevated)', borderTop: 'none', margin: '0 0 10px 0', borderRadius: 'var(--radius-sm)' }}>
                                                    <div className="detail-row">
                                                        <strong>Description</strong>
                                                        <p>{c.description}</p>
                                                    </div>
                                                    {c.adminRemark && (
                                                        <div className="admin-remark">
                                                            <strong>Admin Remark:</strong> {c.adminRemark}
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Hostel Activity Log (Unified Announcements + Complaints) */}
                <div className="section-card">
                    <div className="section-header">
                        <h2>Hostel Activity Log</h2>
                        <span className="meta-tag" style={{ border: 'none', background: 'var(--accent-glow)', color: 'var(--accent)' }}>Unified Feed</span>
                    </div>

                    {loading ? (
                        <div className="center-loader"><div className="spinner"></div></div>
                    ) : hostelActivity.length === 0 ? (
                        <div className="empty-state">
                            <AlertCircle size={48} />
                            <p>No activity found in the hostel</p>
                        </div>
                    ) : (
                        <div className="complaint-list">
                            {hostelActivity.map((item) => (
                                <div key={item._id} className="accordion-item" style={{ border: 'none', background: 'transparent', padding: 0 }}>
                                    <div className="complaint-item" onClick={() => setExpandedActivity(expandedActivity === item._id ? null : item._id)} style={{ cursor: 'pointer' }}>
                                        <div className="complaint-main">
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                {item.type === 'announcement' ? <Megaphone size={14} className="text-accent" /> : <ClipboardList size={14} />}
                                                <h3>{item.title}</h3>
                                            </div>
                                            <div className="complaint-meta">
                                                {item.type === 'announcement' ? (
                                                    <span className="meta-tag" style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>OFFICIAL NOTICE</span>
                                                ) : (
                                                    <span className="meta-tag student-tag"><User size={12} /> {item.student?.name || 'Resident'}</span>
                                                )}
                                                <span className="meta-tag">{item.category}</span>
                                                <StatusBadge status={item.status || 'Active'} />
                                            </div>
                                        </div>
                                        <div className="complaint-date" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                            {expandedActivity === item._id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                        </div>
                                    </div>
                                    <AnimatePresence>
                                        {expandedActivity === item._id && (
                                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                                                <div className="accordion-body" style={{ background: 'var(--bg-elevated)', borderTop: 'none', margin: '0 0 10px 0', borderRadius: 'var(--radius-sm)' }}>
                                                    <div className="detail-row">
                                                        <strong>Description</strong>
                                                        <p>{item.description}</p>
                                                    </div>
                                                    {item.type === 'announcement' && item.createdBy && (
                                                        <div className="ann-posted-by" style={{ marginTop: '8px', fontSize: '0.75rem' }}>
                                                            <strong>Broadcast By:</strong> {item.createdBy.name}
                                                            <span className={`role-badge ${item.createdBy.role || 'admin'}`} style={{ marginLeft: '6px', fontSize: '0.6rem' }}>
                                                                {item.createdBy.role === 'admin' ? 'Official' : 'Resident'}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {item.type === 'complaint' && item.adminRemark && (
                                                        <div className="admin-remark">
                                                            <strong>Management Response:</strong> {item.adminRemark}
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
