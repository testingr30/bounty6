import { Outlet, NavLink, useLocation } from "react-router-dom";
import { Home, History, Sparkles, Menu, X, MessageSquare, Clock, Plus } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { getChatHistory } from "../hooks/useChat";
import { agents } from "../data/agents";
import { playHoverSound, playClickSound } from "../utils/audio";

export default function Layout() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [recentChats, setRecentChats] = useState([]);
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [ripples, setRipples] = useState([]);
    const location = useLocation();

    useEffect(() => {
        // Refresh recent chats on every location change
        const history = getChatHistory();
        setRecentChats(history.slice(0, 8)); // Top 8 recent
    }, [location]);

    // Custom Cursor Tracking
    useEffect(() => {
        const moveCursor = (e) => {
            setCursorPos({ x: e.clientX, y: e.clientY });
        };

        const handleMouseDown = (e) => {
            playClickSound();
            const newRipple = { id: Date.now(), x: e.clientX, y: e.clientY };
            setRipples((prev) => [...prev, newRipple]);
            setTimeout(() => {
                setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
            }, 600);
        };

        const checkHover = (e) => {
            const isClickable = e.target.closest('button, a, .agent-card, .suggestion-chip, .suggestion-chip-small, .nav-link, .recent-chat-link');
            if (isClickable && !isHovering) {
                setIsHovering(true);
                playHoverSound();
            } else if (!isClickable && isHovering) {
                setIsHovering(false);
            }
        };

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mousemove', checkHover);
        window.addEventListener('mousedown', handleMouseDown);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mousemove', checkHover);
            window.removeEventListener('mousedown', handleMouseDown);
        };
    }, [isHovering]);

    return (
        <div className="app-layout">
            {/* Custom Cursor */}
            <div
                className={`custom-cursor ${isHovering ? 'hovering' : ''}`}
                style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }}
            />

            {/* Click Ripples */}
            {ripples.map((ripple) => (
                <div
                    key={ripple.id}
                    className="click-ripple"
                    style={{ left: `${ripple.x}px`, top: `${ripple.y}px` }}
                />
            ))}

            <nav className="navbar">
                <div className="navbar-inner">
                    <NavLink to="/" className="navbar-brand" onClick={() => setMobileMenuOpen(false)}>
                        <div className="brand-icon">
                            <Sparkles size={22} />
                        </div>
                        <span className="brand-text">Toolhouse Agent Hub</span>
                    </NavLink>

                    <div className={`navbar-links ${mobileMenuOpen ? "open" : ""}`}>
                        <NavLink
                            to="/"
                            end
                            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <Home size={18} />
                            <span>Registry</span>
                        </NavLink>
                        <NavLink
                            to="/history"
                            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <History size={18} />
                            <span>Full Archive</span>
                        </NavLink>
                    </div>

                    <button
                        className="mobile-menu-btn"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </nav>

            <div className="app-layout-with-sidebar">
                <aside className="recent-chats-sidebar">
                    <div className="sidebar-header">
                        <span className="sidebar-title">Recent Links</span>
                    </div>
                    <div className="sidebar-content">
                        <div className="sidebar-label">Active Buffers</div>
                        <div className="recent-chat-list">
                            {recentChats.length > 0 ? (
                                recentChats.map((chat) => (
                                    <NavLink
                                        key={chat.id}
                                        to={`/chat/${chat.agentId}?historyId=${chat.id}`}
                                        className={({ isActive }) => `recent-chat-link ${isActive ? "active" : ""}`}
                                    >
                                        <div className="recent-chat-icon-shell" style={{ color: agents.find(a => a.id === chat.agentId)?.color || 'var(--accent-cyan)' }}>
                                            <MessageSquare size={14} />
                                        </div>
                                        <span className="recent-chat-agent">{chat.agentName}</span>
                                    </NavLink>
                                ))
                            ) : (
                                <div style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                    No active buffers found.
                                </div>
                            )}
                        </div>

                        <div className="sidebar-label" style={{ marginTop: '2rem' }}>Actions</div>
                        <NavLink to="/" className="recent-chat-link">
                            <Plus size={14} />
                            <span className="recent-chat-agent">New Session</span>
                        </NavLink>
                    </div>
                </aside>

                <main className="main-content" style={{ flex: 1, paddingTop: 0 }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
