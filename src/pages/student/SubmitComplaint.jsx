import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { Send, AlertTriangle } from 'lucide-react';

const CATEGORIES = ['Plumbing', 'Electrical', 'Furniture', 'Cleaning', 'Internet/WiFi', 'Pest Control', 'Security', 'Other'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];

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
                <div>
                    <h1>Submit Complaint</h1>
                    <p>Describe your issue and we'll get it resolved</p>
                </div>
            </div>

            <div className="form-card">
                <form onSubmit={handleSubmit} className="complaint-form">
                    <div className="form-group">
                        <label htmlFor="title">Complaint Title *</label>
                        <input
                            id="title"
                            type="text"
                            name="title"
                            placeholder="Brief title of the issue"
                            value={form.title}
                            onChange={handleChange}
                            maxLength={100}
                            required
                        />
                        <span className="char-count">{form.title.length}/100</span>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="category">Category *</label>
                            <select id="category" name="category" value={form.category} onChange={handleChange} required>
                                <option value="">Select category</option>
                                {CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="priority">Priority *</label>
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
                        <label htmlFor="description">Description *</label>
                        <textarea
                            id="description"
                            name="description"
                            placeholder="Describe the issue in detail — location, what happened, how long it has been an issue..."
                            value={form.description}
                            onChange={handleChange}
                            rows={6}
                            maxLength={1000}
                            required
                        />
                        <span className="char-count">{form.description.length}/1000</span>
                    </div>

                    {form.priority === 'Urgent' && (
                        <div className="alert-warning">
                            <AlertTriangle size={18} />
                            <span>Urgent complaints are escalated immediately to maintenance staff.</span>
                        </div>
                    )}

                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? <span className="btn-spinner"></span> : <><Send size={16} /> Submit Complaint</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SubmitComplaint;
