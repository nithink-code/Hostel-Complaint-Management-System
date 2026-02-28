import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Shield, Clock, Bell, Settings, PlusCircle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const slides = [
    {
        title: "Swift Reporting System",
        subtitle: "Submit your complaints in seconds",
        desc: "Our streamlined interface allows students to report maintenance issues quickly, ensuring minimal downtime and faster response from staff.",
        icon: <Zap size={48} />,
        color: "var(--accent)",
        cta: { text: "File Complaint", link: "/student/submit", icon: <PlusCircle size={18} /> }
    },
    {
        title: "Real-time Maintenance Status",
        subtitle: "Track every step of the resolution",
        desc: "Get live updates on your requests. Know exactly when a technician is assigned, when work begins, and when the issue is resolved.",
        icon: <Clock size={48} />,
        color: "var(--info)",
        cta: { text: "View Progress", link: "/student/complaints", icon: <CheckCircle size={18} /> }
    },
    {
        title: "Automated Notifications",
        subtitle: "Never miss an update again",
        desc: "Receive instant feedback through our smart notification system. Stay informed about admin remarks and priority escalations in real-time.",
        icon: <Bell size={48} />,
        color: "var(--warning)",
        cta: { text: "My History", link: "/student/complaints", icon: <Settings size={18} /> }
    }
];

const FeatureCarousel = ({ userName }) => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="carousel-poster glass-card">
            <div className="poster-welcome">Welcome back, {userName || 'Student'}! 👋</div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="poster-content"
                >
                    <div className="poster-icon-wrapper" style={{ color: slides[index].color }}>
                        {slides[index].icon}
                    </div>
                    <div className="poster-info">
                        <span className="poster-subtitle">{slides[index].subtitle}</span>
                        <h2 className="poster-title">{slides[index].title}</h2>
                        <p className="poster-desc">{slides[index].desc}</p>

                        <div className="poster-actions">
                            <Link to={slides[index].cta.link} className="btn-primary" style={{ background: slides[index].color, borderColor: slides[index].color }}>
                                {slides[index].cta.icon}
                                {slides[index].cta.text}
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            <div className="poster-pagination">
                {slides.map((_, i) => (
                    <motion.div
                        key={i}
                        className={`poster-dot ${i === index ? 'active' : ''}`}
                        onClick={() => setIndex(i)}
                        whileHover={{ scale: 1.2 }}
                    />
                ))}
            </div>
        </div>
    );
};

export default FeatureCarousel;
