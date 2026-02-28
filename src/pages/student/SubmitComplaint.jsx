import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { Send, AlertTriangle } from 'lucide-react';

const CATEGORIES = ['Plumbing', 'Electrical', 'Furniture', 'Cleaning', 'Internet/WiFi', 'Pest Control', 'Security', 'Other'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];

import { motion } from 'framer-motion';

const SubmitComplaint = () => {
    const [form, setForm] = useState({
        title: '',
        description: '',
        category: '',
        priority: 'Medium',
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title || !form.description || !form.category) {
            toast.error('Please fill in all required fields');
            return;
        }
        setLoading(true);
        try {
            await API.post('/complaints', form);
            toast.success('Complaint submitted successfully!');
            navigate('/student/complaints');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit complaint');
        } finally {
            setLoading(false);
        }
    };

    const priorityColors = { Low: '#10b981', Medium: '#f59e0b', High: '#ef4444', Urgent: '#dc2626' };

    return (
        <div className="page-container">
            <div className="page-header">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h1>Report an Issue</h1>
                    <p>Provide details about the issue and our team will resolve it promptly.</p>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="form-card glass-card"
            >
                <form onSubmit={handleSubmit} className="complaint-form">
                    <div className="form-group">
                        <label htmlFor="title">Complaint Title *</label>
                        <input
                            id="title"
                            type="text"
                            name="title"
                            placeholder="Briefly state the problem (e.g., Leaking Tap in Room 204)"
                            value={form.title}
                            onChange={handleChange}
                            maxLength={100}
                            required
                        />
                        <span className="char-count">{form.title.length}/100</span>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="category">Isssue Category *</label>
                            <select id="category" name="category" value={form.category} onChange={handleChange} required>
                                <option value="">Select a category</option>
                                {CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="priority">Severity Level *</label>
                            <select
                                id="priority"
                                name="priority"
                                value={form.priority}
                                onChange={handleChange}
                                style={{ borderLeftColor: priorityColors[form.priority], borderLeftWidth: '4px' }}
                            >
                                {PRIORITIES.map((p) => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Detailed Description *</label>
                        <textarea
                            id="description"
                            name="description"
                            placeholder="Describe the issue in detail — include exact location, when it started, and any other relevant info..."
                            value={form.description}
                            onChange={handleChange}
                            rows={6}
                            maxLength={1000}
                            required
                        />
                        <span className="char-count">{form.description.length}/1000</span>
                    </div>

                    {form.priority === 'Urgent' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="alert-warning"
                        >
                            <AlertTriangle size={18} />
                            <span><strong>Urgent Alert:</strong> This will be flagged for immediate maintenance intervention.</span>
                        </motion.div>
                    )}

                    <div className="form-actions" style={{ marginTop: '24px' }}>
                        <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>
                            Discard
                        </button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                        >
                            {loading ? <span className="btn-spinner"></span> : <><Send size={16} /> Submit Report</>}
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default SubmitComplaint;
