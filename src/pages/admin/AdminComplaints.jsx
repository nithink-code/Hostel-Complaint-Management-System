import { useState, useEffect, useCallback } from 'react';
import API from '../../api/axios';
import StatusBadge, { PriorityBadge } from '../../components/StatusBadge';
import toast from 'react-hot-toast';
import { Filter, Search, ChevronDown, ChevronUp, Save, X } from 'lucide-react';

const CATEGORIES = ['All', 'Plumbing', 'Electrical', 'Furniture', 'Cleaning', 'Internet/WiFi', 'Pest Control', 'Security', 'Other'];
const STATUSES = ['All', 'Pending', 'In Progress', 'Resolved', 'Rejected'];
const PRIORITIES = ['All', 'Low', 'Medium', 'High', 'Urgent'];

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
            if (c) setEditMap((m) => ({ ...m, [id]: { status: c.status, adminRemark: c.adminRemark || '' } }));
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
                c.title.toLowerCase().includes(search.toLowerCase()) ||
                c.student?.name.toLowerCase().includes(search.toLowerCase()) ||
                c.category.toLowerCase().includes(search.toLowerCase())
        )
        : complaints;

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1>All Complaints</h1>
                    <p>{complaints.length} complaint{complaints.length !== 1 ? 's' : ''} found</p>
                </div>
            </div>

            {/* Filters */}
            <div className="filters-bar">
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
                    <p>No complaints match your filters</p>
                    <button className="btn-secondary" onClick={() => { setFilters({ category: 'All', status: 'All', priority: 'All' }); setSearch(''); }}>
                        Clear Filters
                    </button>
                </div>
            ) : (
                <div className="complaints-accordion">
                    {searched.map((c) => (
                        <div key={c._id} className={`accordion-item ${expanded === c._id ? 'open' : ''}`}>
                            <div className="accordion-header" onClick={() => toggleExpand(c._id)}>
                                <div className="accordion-title">
                                    <h3>{c.title}</h3>
                                    <div className="complaint-meta">
                                        <span className="meta-tag student-tag">👤 {c.student?.name || 'Unknown'}</span>
                                        {c.student?.roomNumber && <span className="meta-tag">🏠 {c.student.roomNumber}</span>}
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

                            {expanded === c._id && editMap[c._id] && (
                                <div className="accordion-body">
                                    <div className="detail-row">
                                        <strong>Description:</strong>
                                        <p>{c.description}</p>
                                    </div>
                                    {c.hostelBlock && (
                                        <div className="detail-row">
                                            <strong>Hostel Block:</strong> {c.hostelBlock}
                                        </div>
                                    )}

                                    <div className="admin-edit-section">
                                        <h4>Update Complaint</h4>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Status</label>
                                                <select
                                                    value={editMap[c._id].status}
                                                    onChange={(e) => handleEditChange(c._id, 'status', e.target.value)}
                                                >
                                                    {['Pending', 'In Progress', 'Resolved', 'Rejected'].map((s) => (
                                                        <option key={s} value={s}>{s}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Admin Remark</label>
                                            <textarea
                                                value={editMap[c._id].adminRemark}
                                                onChange={(e) => handleEditChange(c._id, 'adminRemark', e.target.value)}
                                                placeholder="Add a note for the student..."
                                                rows={3}
                                                maxLength={500}
                                            />
                                        </div>
                                        <div className="form-actions">
                                            <button className="btn-secondary" onClick={() => setExpanded(null)}>Cancel</button>
                                            <button
                                                className="btn-primary"
                                                onClick={() => handleSave(c._id)}
                                                disabled={saving === c._id}
                                            >
                                                {saving === c._id ? <span className="btn-spinner"></span> : <><Save size={16} /> Save Changes</>}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminComplaints;
