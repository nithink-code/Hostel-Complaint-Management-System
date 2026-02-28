import { useState, useEffect } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Edit2, Trash2, X, Save, Megaphone,
    Droplets, Zap, UtensilsCrossed, Search, AlertTriangle, Info
} from 'lucide-react';

const CATEGORIES = ['General', 'Water', 'Electricity', 'Mess', 'Inspection'];
const PRIORITIES = ['Normal', 'Important', 'Urgent'];

const categoryIcon = (cat) => {
    const map = { Water: Droplets, Electricity: Zap, Mess: UtensilsCrossed, Inspection: Search, General: Info };
    const Icon = map[cat] || Info;
    return <Icon size={15} />;
};

const priorityClass = { Normal: 'ann-priority-normal', Important: 'ann-priority-important', Urgent: 'ann-priority-urgent' };

const EMPTY_FORM = { title: '', description: '', category: 'General', priority: 'Normal', targetBlock: '', expiryDate: '' };

const AdminAnnouncements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(null);

    const fetchAnnouncements = async () => {
        setLoading(true);
        try {
            const { data } = await API.get('/announcements/all');
            setAnnouncements(data.announcements);
        } catch {
            toast.error('Failed to load announcements');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAnnouncements(); }, []);

    const openCreate = () => {
        setEditId(null);
        setForm(EMPTY_FORM);
        setShowForm(true);
    };

    const openEdit = (ann) => {
        setEditId(ann._id);
        setForm({
            title: ann.title,
            description: ann.description,
            category: ann.category,
            priority: ann.priority,
            targetBlock: ann.targetBlock || '',
            expiryDate: ann.expiryDate ? ann.expiryDate.slice(0, 10) : '',
        });
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                ...form,
                targetBlock: form.targetBlock || null,
                expiryDate: form.expiryDate || null,
            };
            if (editId) {
                await API.put(`/announcements/${editId}`, payload);
                toast.success('Announcement updated');
            } else {
                await API.post('/announcements', payload);
                toast.success('Announcement published');
            }
            setShowForm(false);
            fetchAnnouncements();
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Failed to save');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this announcement?')) return;
        setDeleting(id);
        try {
            await API.delete(`/announcements/${id}`);
            toast.success('Announcement deleted');
            fetchAnnouncements();
        } catch {
            toast.error('Delete failed');
        } finally {
            setDeleting(null);
        }
    };

    const isExpired = (ann) => ann.expiryDate && new Date(ann.expiryDate) < new Date();

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1>Announcement Management</h1>
                    <p>Broadcast important notices to students across the hostel.</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="btn-primary"
                    onClick={openCreate}
                >
                    <Plus size={18} /> New Announcement
                </motion.button>
            </div>

            {/* Create / Edit Modal */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="modal-overlay"
                        onClick={(e) => e.target === e.currentTarget && setShowForm(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.92, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.92, y: 20 }}
                            className="modal-card"
                        >
                            <div className="modal-header">
                                <h2><Megaphone size={20} /> {editId ? 'Edit Announcement' : 'New Announcement'}</h2>
                                <button className="modal-close" onClick={() => setShowForm(false)}><X size={20} /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="ann-form">
                                <div className="form-group">
                                    <label>Title</label>
                                    <input
                                        type="text"
                                        required
                                        maxLength={120}
                                        value={form.title}
                                        onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                                        placeholder="e.g. Water Supply Interruption – Block A"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea
                                        required
                                        rows={4}
                                        maxLength={2000}
                                        value={form.description}
                                        onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                                        placeholder="Provide full details of the announcement..."
                                    />
                                </div>

                                <div className="form-row-grid">
                                    <div className="form-group">
                                        <label>Category</label>
                                        <select value={form.category} onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))}>
                                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Priority</label>
                                        <select value={form.priority} onChange={(e) => setForm(f => ({ ...f, priority: e.target.value }))}>
                                            {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="form-row-grid">
                                    <div className="form-group">
                                        <label>Target Block <span className="label-hint">(leave empty = all students)</span></label>
                                        <input
                                            type="text"
                                            value={form.targetBlock}
                                            onChange={(e) => setForm(f => ({ ...f, targetBlock: e.target.value }))}
                                            placeholder="e.g. A, B, C"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Expiry Date <span className="label-hint">(leave empty = never)</span></label>
                                        <input
                                            type="date"
                                            value={form.expiryDate}
                                            onChange={(e) => setForm(f => ({ ...f, expiryDate: e.target.value }))}
                                            min={new Date().toISOString().slice(0, 10)}
                                        />
                                    </div>
                                </div>

                                <div className="form-actions">
                                    <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                                    <motion.button
                                        type="submit"
                                        className="btn-primary"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.97 }}
                                        disabled={saving}
                                    >
                                        {saving ? <span className="btn-spinner"></span> : <><Save size={16} /> {editId ? 'Save Changes' : 'Publish'}</>}
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Announcements List */}
            {loading ? (
                <div className="center-loader"><div className="spinner"></div></div>
            ) : announcements.length === 0 ? (
                <div className="empty-state">
                    <Megaphone size={48} />
                    <p>No announcements yet. Create your first one!</p>
                </div>
            ) : (
                <div className="ann-admin-list">
                    <AnimatePresence>
                        {announcements.map((ann, i) => (
                            <motion.div
                                key={ann._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ delay: i * 0.04 }}
                                className={`ann-card ${isExpired(ann) ? 'ann-expired' : ''}`}
                            >
                                <div className="ann-card-left">
                                    <div className="ann-cat-icon">{categoryIcon(ann.category)}</div>
                                    <div className="ann-main">
                                        <div className="ann-title-row">
                                            <h3>{ann.title}</h3>
                                            <span className={`ann-priority ${priorityClass[ann.priority]}`}>{ann.priority}</span>
                                            {isExpired(ann) && <span className="ann-tag expired-tag">Expired</span>}
                                            {!isExpired(ann) && ann.isActive && <span className="ann-tag active-tag">Active</span>}
                                        </div>
                                        <p className="ann-desc">{ann.description}</p>
                                        <div className="ann-meta">
                                            <span className="meta-tag">{ann.category}</span>
                                            {ann.targetBlock ? <span className="meta-tag">Block {ann.targetBlock}</span> : <span className="meta-tag">All Students</span>}
                                            {ann.expiryDate && <span className="meta-tag">Expires: {new Date(ann.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>}
                                            <div className="ann-posted-by" style={{ marginLeft: 'auto', border: 'none', paddingTop: 0 }}>
                                                <span className="meta-tag">By {ann.createdBy?.name}</span>
                                                <span className={`role-badge ${ann.createdBy?.role || 'admin'}`} style={{ fontSize: '0.62rem' }}>
                                                    {ann.createdBy?.role === 'admin' ? 'Official' : 'Resident'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="ann-card-actions">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="icon-btn edit-btn"
                                        onClick={() => openEdit(ann)}
                                    >
                                        <Edit2 size={16} />
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="icon-btn delete-btn"
                                        onClick={() => handleDelete(ann._id)}
                                        disabled={deleting === ann._id}
                                    >
                                        {deleting === ann._id ? <span className="btn-spinner small"></span> : <Trash2 size={16} />}
                                    </motion.button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

export default AdminAnnouncements;
