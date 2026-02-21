import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { agents, categories } from "../data/agents";
import {
    Mail, Clock, FileText, Linkedin, Briefcase, BookOpen,
    GraduationCap, Code, FileCheck, BarChart3, PenTool,
    Youtube, Rocket, Send, ShoppingCart, Target, Plane,
    User, CheckSquare, Twitter, Sparkles, Search, ArrowRight,
    Zap, Star, TrendingUp, Activity, Github, Scissors, Key, Flag, Layout
} from "lucide-react";

const iconMap = {
    Mail, Clock, FileText, Linkedin, Briefcase, BookOpen,
    GraduationCap, Code, FileCheck, BarChart3, PenTool,
    Youtube, Rocket, Send, ShoppingCart, Target, Plane,
    User, CheckSquare, Twitter, Github, Scissors, Key, Flag, Layout
};

export default function HomePage() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const filteredAgents = useMemo(() => {
        return agents.filter((agent) => {
            const matchesCategory =
                activeCategory === "All" || agent.category === activeCategory;
            const matchesSearch =
                agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                agent.description.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [activeCategory, searchQuery]);

    const featuredAgents = useMemo(() => agents.filter(a => a.featured), []);

    const IconComponent = (iconName) => {
        return iconMap[iconName] || Sparkles;
    };

    return (
        <div className="home-page fade-in">
            <section className="hero-section">
                <div className="hero-content">
                    <div className="hero-badge">
                        <Zap size={14} className="spin-slow" />
                        <span>Next-Gen Intelligence Showcase</span>
                    </div>
                    <h1 className="hero-title">
                        Unleash the Power of <span className="brand-text">Toolhouse AI</span>
                    </h1>
                    <p className="hero-subtitle">
                        Experience 21 specialized autonomous entities designed to redefine
                        your professional and personal workflow.
                    </p>
                </div>
            </section>

            <section className="agents-section">
                {/* System Broadcast / Special Messages */}
                <div className="system-broadcast fade-in">
                    <div className="broadcast-header">
                        <Activity size={12} className="spin-slow" />
                        <span>System Broadcast</span>
                    </div>
                    <div className="broadcast-content">
                        Everyone loved Lou's agent. Registry sync complete.
                        <span className="broadcast-cursor"></span>
                    </div>
                </div>

                {/* Featured Section */}
                {activeCategory === "All" && !searchQuery && (
                    <div className="featured-container" style={{ marginBottom: '4rem' }}>
                        <div className="section-header" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Star size={20} className="text-accent" style={{ color: 'var(--accent-cyan)' }} />
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Featured Systems</h2>
                        </div>
                        <div className="agents-grid">
                            {featuredAgents.map((agent) => {
                                const Icon = IconComponent(agent.icon);
                                return (
                                    <div
                                        key={agent.id}
                                        className="agent-card featured-border compact-featured"
                                        onClick={() => navigate(`/chat/${agent.id}`)}
                                        style={{
                                            "--agent-color": agent.color,
                                            boxShadow: `0 0 20px color-mix(in srgb, var(--accent-cyan) 6%, transparent)`
                                        }}
                                    >
                                        <div className="agent-card-content">
                                            <div className="agent-card-header">
                                                <div
                                                    className="agent-icon"
                                                    style={{ background: `${agent.color}20`, color: agent.color }}
                                                >
                                                    <Icon size={24} />
                                                </div>
                                                <div className="badge-featured" style={{ background: 'var(--accent-cyan)', color: 'var(--bg-deep)', fontSize: '0.6rem', fontWeight: 900, padding: '2px 8px', borderRadius: '100px' }}>FEATURED</div>
                                            </div>
                                            <h3 className="agent-name">{agent.name}</h3>
                                            <p className="agent-description">{agent.description}</p>
                                            <div className="agent-card-footer">
                                                <span className="try-agent">
                                                    Initialize System <ArrowRight size={14} />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className="section-header" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <TrendingUp size={20} style={{ color: 'var(--accent-purple)' }} />
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{activeCategory === "All" ? "Global Registry" : `${activeCategory} Systems`}</h2>
                </div>

                <div className="filter-bar">
                    <div className="search-box">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Query specialized databases..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="category-pills">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                className={`category-pill ${activeCategory === cat ? "active" : ""}`}
                                onClick={() => setActiveCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="agents-grid">
                    {filteredAgents.map((agent) => {
                        const Icon = IconComponent(agent.icon);
                        return (
                            <div
                                key={agent.id}
                                className="agent-card"
                                onClick={() => navigate(`/chat/${agent.id}`)}
                                style={{ "--agent-color": agent.color }}
                            >
                                <div className="agent-card-content">
                                    <div className="agent-card-header">
                                        <div
                                            className="agent-icon"
                                            style={{ background: `${agent.color}20`, color: agent.color }}
                                        >
                                            <Icon size={24} />
                                        </div>
                                        <span className="agent-category">{agent.category}</span>
                                    </div>
                                    <h3 className="agent-name">{agent.name}</h3>
                                    <p className="agent-description">{agent.description}</p>
                                    <div className="agent-card-footer">
                                        <span className="try-agent">
                                            Access Terminal <ArrowRight size={14} />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filteredAgents.length === 0 && (
                    <div className="no-results" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        <Search size={48} style={{ opacity: 0.2 }} />
                        <p>No matches found in the registry for "{searchQuery}". Try a different query.</p>
                    </div>
                )}
            </section>
        </div>
    );
}
