import { Trophy, Clock, Building, User } from 'lucide-react';
import { motion } from 'framer-motion';

const Leaderboard = ({ staffLeaderboard, blockLeaderboard }) => {
    return (
        <div className="leaderboard-grid">
            {/* Staff Leaderboard */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="section-card leaderboard-card"
            >
                <div className="section-header">
                    <h2><Clock size={18} /> Fastest Resolution Staff</h2>
                </div>
                <div className="leaderboard-list">
                    {staffLeaderboard?.length === 0 ? (
                        <p className="empty-text">No resolution data yet</p>
                    ) : (
                        staffLeaderboard?.map((staff, index) => (
                            <div key={staff._id || index} className={`leaderboard-item rank-${index + 1}`}>
                                <div className="rank-number">
                                    {index === 0 ? <Trophy size={18} className="trophy-gold" /> : (index + 1)}
                                </div>
                                <div className="leaderboard-info">
                                    <div className="name-wrap">
                                        <span className="leaderboard-name">{staff.name}</span>
                                        <span className="leaderboard-resolved">{staff.totalResolved} resolved</span>
                                    </div>
                                    <div className="leaderboard-metric">
                                        <span className="avg-label">Avg Speed</span>
                                        <span className="avg-value">{staff.avgTime}</span>
                                    </div>
                                </div>
                                {index === 0 && <div className="champion-badge">Top Performer</div>}
                            </div>
                        ))
                    )}
                </div>
            </motion.div>

            {/* Block Leaderboard */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="section-card leaderboard-card"
            >
                <div className="section-header">
                    <h2><Building size={18} /> Well Maintained Blocks</h2>
                </div>
                <div className="leaderboard-list">
                    {blockLeaderboard?.length === 0 ? (
                        <p className="empty-text">No block data available</p>
                    ) : (
                        blockLeaderboard?.map((block, index) => (
                            <div key={block.block || index} className={`leaderboard-item rank-${index + 1}`}>
                                <div className="rank-number">
                                    {index === 0 ? <Trophy size={18} className="trophy-gold" /> : (index + 1)}
                                </div>
                                <div className="leaderboard-info">
                                    <div className="name-wrap">
                                        <span className="leaderboard-name">Block {block.block}</span>
                                        <span className="leaderboard-resolved">{block.resolvedCount} Resolved</span>
                                    </div>
                                    <div className="leaderboard-metric text-right">
                                        <span className="avg-label">Total Issues</span>
                                        <span className="avg-value count-badge">{block.totalComplaints}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default Leaderboard;
