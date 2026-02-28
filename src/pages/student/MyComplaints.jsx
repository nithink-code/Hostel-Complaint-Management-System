import { useState, useEffect } from 'react';
import API from '../../api/axios';
import StatusBadge, { PriorityBadge } from '../../components/StatusBadge';
import toast from 'react-hot-toast';
import { ClipboardList, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ComplaintTimeline from '../../components/ComplaintTimeline';

const MyComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(null);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        const fetch = async () => {
            try {
                const { data } = await API.get('/complaints/my');
                setComplaints(data.complaints);
            } catch {
                toast.error('Failed to load complaints');
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    const statuses = ['All', 'Pending', 'In Progress', 'Resolved', 'Rejected'];
    const filtered = filter === 'All' ? complaints : complaints.filter((c) => c.status === filter);

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1>My Complaints</h1>
                    <p>{complaints.length} total complaint{complaints.length !== 1 ? 's' : ''}</p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="filter-tabs">
                {statuses.map((s) => (
                    <button
                        key={s}
                        className={`filter-tab ${filter === s ? 'active' : ''}`}
                        onClick={() => setFilter(s)}
                    >
                        {s}
                        <span className="tab-count">
                            {s === 'All' ? complaints.length : complaints.filter((c) => c.status === s).length}
                        </span>
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="center-loader"><div className="spinner"></div></div>
            ) : filtered.length === 0 ? (
                <div className="empty-state">
                    <ClipboardList size={48} />
                    <p>No {filter !== 'All' ? filter.toLowerCase() : ''} complaints found</p>
                </div>
            ) : (
                <div className="complaints-accordion">
                    <AnimatePresence>
                        {filtered.map((c, index) => (
                            <motion.div
                                key={c._id}
                                className={`accordion-item ${expanded === c._id ? 'open' : ''}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <div className="accordion-header" onClick={() => setExpanded(expanded === c._id ? null : c._id)}>
                                    <div className="accordion-title">
                                        <h3>{c.title}</h3>
                                        <div className="complaint-meta">
                                            <span className="meta-tag">{c.category}</span>
                                            <PriorityBadge priority={c.priority} />
                                            <StatusBadge status={c.status} />
                                        </div>
                                    </div>
                                    <div className="accordion-right">
                                        <span className="complaint-date">
                                            {new Date(c.createdAt).toLocaleDateString('en-IN', {
                                                day: 'numeric', month: 'short', year: 'numeric',
                                            })}
                                        </span>
                                        {expanded === c._id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {expanded === c._id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="accordion-body"
                                            style={{ overflow: 'hidden' }}
                                        >
                                            <div className="detail-row">
                                                <strong>Track Progress:</strong>
                                                <ComplaintTimeline status={c.status} />
                                            </div>

                                            <div className="detail-row">
                                                <strong>Description:</strong>
                                                <p>{c.description}</p>
                                            </div>

                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                                {c.roomNumber && (
                                                    <div className="detail-row">
                                                        <strong>Room Detail:</strong>
                                                        <p>{c.roomNumber} {c.hostelBlock && `• ${c.hostelBlock}`}</p>
                                                    </div>
                                                )}
                                                <div className="detail-row">
                                                    <strong>Submitted On:</strong>
                                                    <p>{new Date(c.createdAt).toLocaleString('en-IN')}</p>
                                                </div>
                                            </div>

                                            {c.adminRemark && (
                                                <div className="admin-remark">
                                                    <MessageSquare size={16} style={{ marginTop: '3px' }} />
                                                    <div>
                                                        <strong>Official Response:</strong>
                                                        <p>{c.adminRemark}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {c.resolvedAt && (
                                                <div className="detail-row">
                                                    <strong>Final Resolution:</strong>{' '}
                                                    <p>{new Date(c.resolvedAt).toLocaleString('en-IN')}</p>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

export default MyComplaints;
