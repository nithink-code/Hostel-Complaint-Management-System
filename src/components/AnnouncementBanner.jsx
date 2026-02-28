import { useState, useEffect } from 'react';
import API from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Megaphone, Droplets, Zap, UtensilsCrossed, Search, Info, AlertTriangle, ChevronDown, ChevronUp
} from 'lucide-react';

const categoryConfig = {
    Water: { icon: Droplets, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
    Electricity: { icon: Zap, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    Mess: { icon: UtensilsCrossed, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
    Inspection: { icon: Search, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
    General: { icon: Info, color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
};

const priorityConfig = {
    Normal: { cls: 'ann-priority-normal', label: null },
    Important: { cls: 'ann-priority-important', label: 'Important' },
    Urgent: { cls: 'ann-priority-urgent', label: '🔴 Urgent' },
};

const isNew = (createdAt) => {
    const hoursDiff = (Date.now() - new Date(createdAt)) / 36e5;
    return hoursDiff < 24;
};

const AnnouncementBanner = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [expanded, setExpanded] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const { data } = await API.get('/announcements');
                setAnnouncements(data.announcements);
            } catch {
                // silent fail — not critical for student dashboard UX
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    if (loading || announcements.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="ann-banner-wrap"
        >
            <div className="ann-banner-header">
                <div className="ann-banner-title">
                    <Megaphone size={18} />
                    <span>Hostel Announcements</span>
                    <span className="ann-count-badge">{announcements.length}</span>
                </div>
            </div>

            <div className="ann-banner-list">
                <AnimatePresence>
                    {announcements.map((ann, i) => {
                        const cfg = categoryConfig[ann.category] || categoryConfig.General;
                        const Icon = cfg.icon;
                        const isOpen = expanded === ann._id;

                        return (
                            <motion.div
                                key={ann._id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.06 }}
                                className={`ann-student-item ${ann.priority === 'Urgent' ? 'ann-urgent-highlight' : ''}`}
                                style={{ '--ann-color': cfg.color, '--ann-bg': cfg.bg }}
                            >
                                <div className="ann-student-top" onClick={() => setExpanded(isOpen ? null : ann._id)}>
                                    <div className="ann-student-left">
                                        <div className="ann-cat-pill" style={{ background: cfg.bg, color: cfg.color }}>
                                            <Icon size={13} />
                                            <span>{ann.category}</span>
                                        </div>
                                        {ann.priority !== 'Normal' && (
                                            <span className={`ann-priority ${priorityConfig[ann.priority].cls}`}>
                                                {priorityConfig[ann.priority].label}
                                            </span>
                                        )}
                                        {isNew(ann.createdAt) && <span className="ann-new-badge">NEW</span>}
                                        <h4 className="ann-student-title">{ann.title}</h4>
                                    </div>
                                    <div className="ann-student-right">
                                        <span className="ann-date">
                                            {new Date(ann.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                        </span>
                                        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="ann-student-body"
                                        >
                                            <p>{ann.description}</p>
                                            <div className="ann-footer-meta">
                                                <span>Posted by {ann.createdBy?.name || 'Admin'}</span>
                                                {ann.expiryDate && (
                                                    <span>Expires: {new Date(ann.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default AnnouncementBanner;
