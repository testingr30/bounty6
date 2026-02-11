import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getChatHistory, deleteChatEntry, clearChatHistory } from "../hooks/useChat";
import {
    Trash2, MessageSquare, Clock, ChevronRight, Sparkles, AlertTriangle,
    Mail, FileText, Linkedin, Briefcase, BookOpen,
    GraduationCap, Code, FileCheck, BarChart3, PenTool,
    Youtube, Rocket, Send, ShoppingCart, Target, Plane,
    User, CheckSquare, Twitter,
} from "lucide-react";

const iconMap = {
    Mail, Clock, FileText, Linkedin, Briefcase, BookOpen,
    GraduationCap, Code, FileCheck, BarChart3, PenTool,
    Youtube, Rocket, Send, ShoppingCart, Target, Plane,
    User, CheckSquare, Twitter,
};

export default function HistoryPage() {
    const [history, setHistory] = useState(() => getChatHistory());
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const navigate = useNavigate();

    const handleDelete = (id, e) => {
        e.stopPropagation();
        const updated = deleteChatEntry(id);
        setHistory(updated);
    };

    const handleClearAll = () => {
        clearChatHistory();
        setHistory([]);
        setShowClearConfirm(false);
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="history-page">
            <div className="history-header">
                <div>
                    <h1 className="history-title">
                        <MessageSquare size={28} />
                        Chat History
                    </h1>
                    <p className="history-subtitle">
                        {history.length} conversation{history.length !== 1 ? "s" : ""} saved
                    </p>
                </div>
                {history.length > 0 && (
                    <div className="history-actions">
                        {showClearConfirm ? (
                            <div className="clear-confirm">
                                <span><AlertTriangle size={14} /> Clear all?</span>
                                <button onClick={handleClearAll} className="btn-danger-sm">
                                    Yes
                                </button>
                                <button
                                    onClick={() => setShowClearConfirm(false)}
                                    className="btn-ghost-sm"
                                >
                                    No
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowClearConfirm(true)}
                                className="btn-ghost"
                            >
                                <Trash2 size={16} />
                                Clear All
                            </button>
                        )}
                    </div>
                )}
            </div>

            {history.length === 0 ? (
                <div className="history-empty">
                    <div className="empty-icon">
                        <MessageSquare size={48} />
                    </div>
                    <h3>No conversations yet</h3>
                    <p>Start chatting with an agent and your conversations will appear here.</p>
                    <button onClick={() => navigate("/")} className="btn-primary">
                        <Sparkles size={16} />
                        Explore Agents
                    </button>
                </div>
            ) : (
                <div className="history-list">
                    {history.map((entry) => {
                        const Icon = iconMap[entry.agentIcon] || Sparkles;
                        return (
                            <div
                                key={entry.id}
                                className="history-card"
                                onClick={() => navigate(`/chat/${entry.agentId}?historyId=${entry.id}`)}
                                style={{ "--agent-color": entry.agentColor }}
                            >
                                <div
                                    className="history-icon"
                                    style={{
                                        background: `${entry.agentColor}20`,
                                        color: entry.agentColor,
                                    }}
                                >
                                    <Icon size={20} />
                                </div>
                                <div className="history-info">
                                    <h3 className="history-agent-name">{entry.agentName}</h3>
                                    <p className="history-preview">{entry.preview || "Empty conversation"}</p>
                                    <span className="history-time">
                                        <Clock size={12} />
                                        {formatTime(entry.timestamp)}
                                    </span>
                                </div>
                                <div className="history-actions-inline">
                                    <button
                                        onClick={(e) => handleDelete(entry.id, e)}
                                        className="history-delete-btn"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                    <ChevronRight size={18} className="history-chevron" />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
