import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../api/authService';

interface NavbarProps {
    isAdmin?: boolean;
    onSearch?: (query: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ isAdmin, onSearch }) => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(searchQuery);
        }
    };

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    <span className="logo-text">Events</span>HUB
                </Link>

                {onSearch && (
                    <form className="navbar-search" onSubmit={handleSearch}>
                        <input
                            type="text"
                            placeholder="Search events..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                    </form>
                )}

                <div className="navbar-links">
                    <Link to="/" className="nav-link">Home</Link>
                    {isAdmin && (
                        <Link to="/admin/events" className="nav-link">Manage Events</Link>
                    )}
                    <div className="nav-divider"></div>
                    <Link to="/profile" className="nav-link profile-link">
                        <span className="icon">👤</span> Profile
                    </Link>
                    <button onClick={handleLogout} className="btn-logout">
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
