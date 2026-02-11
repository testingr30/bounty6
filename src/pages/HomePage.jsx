import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { agents, categories } from "../data/agents";
import {
    Mail, Clock, FileText, Linkedin, Briefcase, BookOpen,
    GraduationCap, Code, FileCheck, BarChart3, PenTool,
    Youtube, Rocket, Send, ShoppingCart, Target, Plane,
    User, CheckSquare, Twitter, Sparkles, Search, ArrowRight,
} from "lucide-react";

const iconMap = {
    Mail, Clock, FileText, Linkedin, Briefcase, BookOpen,
    GraduationCap, Code, FileCheck, BarChart3, PenTool,
    Youtube, Rocket, Send, ShoppingCart, Target, Plane,
    User, CheckSquare, Twitter,
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

    const IconComponent = (iconName) => {
        return iconMap[iconName] || Sparkles;
    };

    return (
        <div className="home-page">
            <section className="hero-section">
                <div className="hero-glow"></div>
                <div className="hero-content">
                    <div className="hero-badge">
                        <Sparkles size={14} />
                        <span>Powered by Toolhouse AI</span>
                    </div>
                    <h1 className="hero-title">
                        AI Agents <span className="gradient-text">Showcase</span>
                    </h1>
                    <p className="hero-subtitle">
                        Explore and interact with 21 powerful AI agents. Each agent is specialized
                        for a unique task — from managing your emails to generating startup plans.
                    </p>
                </div>
            </section>

            <section className="agents-section">
                <div className="filter-bar">
                    <div className="search-box">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search agents..."
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
                                <div className="agent-card-glow"></div>
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
                                            Try Agent <ArrowRight size={14} />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filteredAgents.length === 0 && (
                    <div className="no-results">
                        <p>No agents found matching your criteria.</p>
                    </div>
                )}
            </section>
        </div>
    );
}
