import { Check, Clock, AlertCircle, XCircle } from 'lucide-react';

const ComplaintTimeline = ({ status }) => {
    const steps = [
        { id: 'Pending', label: 'Submitted', icon: <Clock size={16} /> },
        { id: 'In Progress', label: 'Processing', icon: <AlertCircle size={16} /> },
        { id: 'Resolved', label: 'Resolved', icon: <Check size={16} /> },
    ];

    if (status === 'Rejected') {
        return (
            <div className="timeline">
                <div className="timeline-step completed">
                    <div className="step-dot"><Clock size={16} /></div>
                    <span className="step-label">Submitted</span>
                </div>
                <div className="timeline-step active" style={{ color: 'var(--danger)' }}>
                    <div className="step-dot" style={{ backgroundColor: 'var(--danger)', borderColor: 'var(--danger)', color: '#fff' }}><XCircle size={16} /></div>
                    <span className="step-label" style={{ color: 'var(--danger)' }}>Rejected</span>
                </div>
            </div>
        );
    }

    let currentStepIndex = steps.findIndex(s => s.id === status);
    if (currentStepIndex === -1) currentStepIndex = 0; // Fallback

    return (
        <div className="timeline">
            {steps.map((step, index) => {
                const isCompleted = index < currentStepIndex || status === 'Resolved';
                const isActive = index === currentStepIndex && status !== 'Resolved';
                const isActuallyResolved = index === 2 && status === 'Resolved';

                return (
                    <div
                        key={step.id}
                        className={`timeline-step ${isActuallyResolved || isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
                    >
                        <div className="step-dot">
                            {isActuallyResolved || isCompleted ? <Check size={16} /> : step.icon}
                        </div>
                        <span className="step-label">{step.label}</span>
                    </div>
                );
            })}
        </div>
    );
};

export default ComplaintTimeline;
