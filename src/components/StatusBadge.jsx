const StatusBadge = ({ status }) => {
    const map = {
        Pending: 'badge-pending',
        'In Progress': 'badge-inprogress',
        Resolved: 'badge-resolved',
        Rejected: 'badge-rejected',
    };
    return <span className={`badge ${map[status] || 'badge-pending'}`}>{status}</span>;
};

export const PriorityBadge = ({ priority }) => {
    const map = {
        Low: 'priority-low',
        Medium: 'priority-medium',
        High: 'priority-high',
        Urgent: 'priority-urgent',
    };
    return <span className={`badge ${map[priority] || 'priority-medium'}`}>{priority}</span>;
};

export default StatusBadge;
