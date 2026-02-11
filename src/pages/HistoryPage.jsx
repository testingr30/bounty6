import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getChatHistory, deleteChatEntry, clearChatHistory } from "../hooks/useChat";
import {
    Trash2, MessageSquare, Clock, ArrowRight, BookOpen,
    Mail, FileText, Linkedin, Briefcase, GraduationCap, Code,
    FileCheck, BarChart3, PenTool, Youtube, Rocket, Send,
    ShoppingCart, Target, Plane, User, CheckSquare, Twitter, Sparkles
} from "lucide-react";

const iconMap = {
    Mail, Clock, FileText, Linkedin, Briefcase, BookOpen,
    GraduationCap, Code, FileCheck, BarChart3, PenTool,
    Youtube, Rocket, Send, ShoppingCart, Target, Plane,
    User, CheckSquare, Twitter,
};

export default function HistoryPage() {
    const [history, setHistory] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        setHistory(getChatHistory());
    }, []);

    const handleDelete = (id, e) => {
        e.stopPropagation();
        deleteChatEntry(id);
        setHistory(getChatHistory());
    };

    const handleClearAll = () => {
        if (window.confirm("Purge all data from the local registry? This action is irreversible.")) {
            clearChatHistory();
            setHistory([]);
        }
    };

    const IconComponent = (iconName) => {
        return iconMap[iconName] || Sparkles;
    };

    return (
        <div className="history-page fade-in">
            <div className="section-header" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="hero-title" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Full Archive</h1>
                    <p style={{ color: 'var(--text-dim)' }}>Access the history of all processed buffers and communication logs.</p>
                </div>
                {history.length > 0 && (
                    <button onClick={handleClearAll} className="nav-link" style={{ color: 'var(--accent-pink)', border: '1px solid rgba(255, 0, 193, 0.2)' }}>
                        <Trash2 size={16} />
                        <span>Purge Archive</span>
                    </button>
                )}
            </div>

            <div className="history-list">
                {history.length > 0 ? (
                    history.map((entry) => {
                        const Icon = IconComponent(entry.agentIcon);
                        return (
                            <div
                                key={entry.id}
                                className="history-card"
                                onClick={() => navigate(`/chat/${entry.agentId}?historyId=${entry.id}`)}
                            >
                                <div
                                    className="chat-agent-icon"
                                    style={{
                                        background: `${entry.agentColor || 'var(--accent-cyan)'}15`,
                                        color: entry.agentColor || 'var(--accent-cyan)',
                                        width: '50px',
                                        height: '50px'
                                    }}
                                >
                                    <Icon size={24} />
                                </div>

                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                                        <h3 style={{ fontWeight: 800, fontSize: '1.1rem' }}>{entry.agentName}</h3>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                                            <Clock size={12} />
                                            {new Date(entry.timestamp).toLocaleString()}
                                        </div>
                                    </div>
                                    <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '600px' }}>
                                        "{entry.messages[entry.messages.length - 1]?.content}"
                                    </p>
                                </div>

                                <div className="history-actions">
                                    <button
                                        onClick={(e) => handleDelete(entry.id, e)}
                                        className="icon-btn-danger"
                                        title="Delete log"
                                        style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.5rem' }}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                    <ArrowRight size={20} style={{ color: 'var(--accent-cyan)', opacity: 0.5 }} />
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="no-results" style={{ padding: '6rem 0' }}>
                        <BookOpen size={64} style={{ opacity: 0.1, marginBottom: '1.5rem' }} />
                        <h3>No entries found in the archive</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Initiate a communication session to begin recording logs.</p>
                        <button onClick={() => navigate("/")} className="btn-primary">
                            Initialize Registry
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
