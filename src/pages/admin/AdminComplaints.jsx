import { useState, useEffect, useCallback } from 'react';
import API from '../../api/axios';
import StatusBadge, { PriorityBadge } from '../../components/StatusBadge';
import toast from 'react-hot-toast';
import { Filter, Search, ChevronDown, ChevronUp, Save, X } from 'lucide-react';

const CATEGORIES = ['All', 'Plumbing', 'Electrical', 'Furniture', 'Cleaning', 'Internet/WiFi', 'Pest Control', 'Security', 'Other'];
const STATUSES = ['All', 'Pending', 'In Progress', 'Resolved', 'Rejected'];
const PRIORITIES = ['All', 'Low', 'Medium', 'High', 'Urgent'];

import { motion, AnimatePresence } from 'framer-motion';

const AdminComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ category: 'All', status: 'All', priority: 'All' });
    const [search, setSearch] = useState('');
    const [expanded, setExpanded] = useState(null);
    const [editMap, setEditMap] = useState({});
    const [saving, setSaving] = useState(null);

    const fetchComplaints = useCallback(async () => {
        setLoading(true);
        try {
            const params = {};
            if (filters.category !== 'All') params.category = filters.category;
            if (filters.status !== 'All') params.status = filters.status;
            if (filters.priority !== 'All') params.priority = filters.priority;
            const { data } = await API.get('/complaints', { params });
            setComplaints(data.complaints);
        } catch {
            toast.error('Failed to load complaints');
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => { fetchComplaints(); }, [fetchComplaints]);

    const handleFilterChange = (key, value) => setFilters((f) => ({ ...f, [key]: value }));

    const toggleExpand = (id) => {
        setExpanded((prev) => (prev === id ? null : id));
        if (!editMap[id]) {
            const c = complaints.find((c) => c._id === id);
            if (c) setEditMap((m) => ({ ...m, [id]: { status: c.status, priority: c.priority, adminRemark: c.adminRemark || '' } }));
        }
    };

    const handleEditChange = (id, field, value) => {
        setEditMap((m) => ({ ...m, [id]: { ...m[id], [field]: value } }));
    };

    const handleSave = async (id) => {
        setSaving(id);
        try {
            await API.put(`/complaints/${id}`, editMap[id]);
            toast.success('Complaint updated');
            fetchComplaints();
            setExpanded(null);
        } catch {
            toast.error('Update failed');
        } finally {
            setSaving(null);
        }
    };

    const searched = search.trim()
        ? complaints.filter(
            (c) =>
                c.title?.toLowerCase().includes(search.toLowerCase()) ||
                c.student?.name?.toLowerCase().includes(search.toLowerCase()) ||
                c.category?.toLowerCase().includes(search.toLowerCase())
        )
        : complaints;

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1>System Complaints Management</h1>
                    <p>Track, resolve, and manage student requests efficiently.</p>
                </div>
            </div>

            {/* Filters */}
            <div className="filters-bar glass-card" style={{ padding: '16px', marginBottom: '32px' }}>
                <div className="search-wrapper">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search by title, student, category..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="search-input"
                    />
                    {search && (
                        <button className="clear-search" onClick={() => setSearch('')}>
                            <X size={16} />
                        </button>
                    )}
                </div>

                <div className="filter-selects">
                    <div className="filter-select-wrap">
                        <Filter size={16} className="filter-icon" />
                        <select value={filters.category} onChange={(e) => handleFilterChange('category', e.target.value)}>
                            {CATEGORIES.map((c) => <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>)}
                        </select>
                    </div>
                    <div className="filter-select-wrap">
                        <select value={filters.status} onChange={(e) => handleFilterChange('status', e.target.value)}>
                            {STATUSES.map((s) => <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>)}
                        </select>
                    </div>
                    <div className="filter-select-wrap">
                        <select value={filters.priority} onChange={(e) => handleFilterChange('priority', e.target.value)}>
                            {PRIORITIES.map((p) => <option key={p} value={p}>{p === 'All' ? 'All Priorities' : p}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="center-loader"><div className="spinner"></div></div>
            ) : searched.length === 0 ? (
                <div className="empty-state">
                    <p>No complaints match your search criteria</p>
                    <button className="btn-secondary" onClick={() => { setFilters({ category: 'All', status: 'All', priority: 'All' }); setSearch(''); }}>
                        Reset Filters
                    </button>
                </div>
            ) : (
                <div className="complaints-accordion">
                    <AnimatePresence>
                        {searched.map((c, index) => (
                            <motion.div
                                key={c._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={`accordion-item ${expanded === c._id ? 'open' : ''}`}
                            >
                                <div className="accordion-header" onClick={() => toggleExpand(c._id)}>
                                    <div className="accordion-title">
                                        <h3>{c.title}</h3>
                                        <div className="complaint-meta">
                                            <span className="meta-tag student-tag">👤 {c.student?.name || 'Unknown User'}</span>
                                            {c.student?.roomNumber && <span className="meta-tag">🏠 Room {c.student.roomNumber}</span>}
                                            <span className="meta-tag">{c.category}</span>
                                            <PriorityBadge priority={c.priority} />
                                            <StatusBadge status={c.status} />
                                        </div>
                                    </div>
                                    <div className="accordion-right">
                                        <span className="complaint-date">
                                            {new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </span>
                                        {expanded === c._id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {expanded === c._id && editMap[c._id] && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="accordion-body"
                                            style={{ overflow: 'hidden' }}
                                        >
                                            <div className="detail-row">
                                                <strong>Student Description:</strong>
                                                <p>{c.description}</p>
                                            </div>

                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                                {c.hostelBlock && (
                                                    <div className="detail-row">
                                                        <strong>Location:</strong>
                                                        <p>{c.hostelBlock}</p>
                                                    </div>
                                                )}
                                                <div className="detail-row">
                                                    <strong>Submitted On:</strong>
                                                    <p>{new Date(c.createdAt).toLocaleString('en-IN')}</p>
                                                </div>
                                            </div>

                                            <div className="admin-edit-section">
                                                <h4>Update Status & Remark</h4>
                                                <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                                    <div className="form-group">
                                                        <label>Complaint Status</label>
                                                        <select
                                                            value={editMap[c._id].status}
                                                            onChange={(e) => handleEditChange(c._id, 'status', e.target.value)}
                                                        >
                                                            {['Pending', 'In Progress', 'Resolved', 'Rejected'].map((s) => (
                                                                <option key={s} value={s}>{s}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Adjust Severity (Priority)</label>
                                                        <select
                                                            value={editMap[c._id].priority}
                                                            onChange={(e) => handleEditChange(c._id, 'priority', e.target.value)}
                                                        >
                                                            {['Low', 'Medium', 'High'].map((p) => (
                                                                <option key={p} value={p}>{p}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="form-group" style={{ marginTop: '16px' }}>
                                                    <label>Official Remark for Student</label>
                                                    <textarea
                                                        value={editMap[c._id].adminRemark}
                                                        onChange={(e) => handleEditChange(c._id, 'adminRemark', e.target.value)}
                                                        placeholder="Add a detailed note about the resolution..."
                                                        rows={3}
                                                        maxLength={500}
                                                    />
                                                </div>
                                                <div className="form-actions" style={{ marginTop: '20px' }}>
                                                    <button className="btn-secondary" onClick={() => setExpanded(null)}>Discard</button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        className="btn-primary"
                                                        onClick={() => handleSave(c._id)}
                                                        disabled={saving === c._id}
                                                    >
                                                        {saving === c._id ? <span className="btn-spinner"></span> : <><Save size={16} /> Update Complaint</>}
                                                    </motion.button>
                                                </div>
                                            </div>
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

export default AdminComplaints;
