import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Users, BarChart, Bell, ClipboardList, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const adminSlides = [
    {
        title: "Total System Control",
        subtitle: "Hostel Maintenance Management",
        desc: "Monitor all incoming complaints from students across all blocks. Assign staff, track resolution times, and ensure a high quality of living.",
        icon: <Shield size={48} />,
        color: "var(--accent)",
        cta: { text: "Manage All", link: "/admin/complaints", icon: <ClipboardList size={18} /> }
    },
    {
        title: "Analytics & Insights",
        subtitle: "Optimize Hostel Operations",
        desc: "View detailed category breakdowns and resolution rates. Identify recurring issues and optimize maintenance resources effectively.",
        icon: <BarChart size={48} />,
        color: "var(--info)",
        cta: { text: "View Analytics", link: "/admin/dashboard", icon: <TrendingUp size={18} /> }
    },
    {
        title: "Direct Admin Feedback",
        subtitle: "Transparent Resolution Process",
        desc: "Communicate directly with students through official remarks. Provide clarity on rejected requests or detailed updates on complex repairs.",
        icon: <Bell size={48} />,
        color: "var(--warning)",
        cta: { text: "Quick Actions", link: "/admin/complaints", icon: <Users size={18} /> }
    }
];

const AdminFeatureCarousel = () => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % adminSlides.length);
        }, 7000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="carousel-poster admin-poster glass-card">
            <div className="poster-welcome">Admin Control Center ⚡</div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="poster-content"
                >
                    <div className="poster-icon-wrapper" style={{ color: adminSlides[index].color }}>
                        {adminSlides[index].icon}
                    </div>
                    <div className="poster-info">
                        <span className="poster-subtitle">{adminSlides[index].subtitle}</span>
                        <h2 className="poster-title">{adminSlides[index].title}</h2>
                        <p className="poster-desc">{adminSlides[index].desc}</p>

                        <div className="poster-actions">
                            <Link to={adminSlides[index].cta.link} className="btn-primary" style={{ background: adminSlides[index].color, borderColor: adminSlides[index].color }}>
                                {adminSlides[index].cta.icon}
                                {adminSlides[index].cta.text}
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            <div className="poster-pagination">
                {adminSlides.map((_, i) => (
                    <motion.div
                        key={i}
                        className={`poster-dot ${i === index ? 'active' : ''}`}
                        onClick={() => setIndex(i)}
                    />
                ))}
            </div>
        </div>
    );
};

export default AdminFeatureCarousel;
