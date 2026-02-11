import { Outlet, NavLink, useLocation } from "react-router-dom";
import { Home, History, Sparkles, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Layout() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    return (
        <div className="app-layout">
            <nav className="navbar">
                <div className="navbar-inner">
                    <NavLink to="/" className="navbar-brand" onClick={() => setMobileMenuOpen(false)}>
                        <div className="brand-icon">
                            <Sparkles size={22} />
                        </div>
                        <span className="brand-text">Toolhouse AI Agents</span>
                    </NavLink>

                    <div className={`navbar-links ${mobileMenuOpen ? "open" : ""}`}>
                        <NavLink
                            to="/"
                            end
                            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <Home size={18} />
                            <span>Home</span>
                        </NavLink>
                        <NavLink
                            to="/history"
                            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <History size={18} />
                            <span>History</span>
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

            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}
