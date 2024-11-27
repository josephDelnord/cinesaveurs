import { useState } from 'react';
import { Link } from 'react-router-dom';

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const userRole = localStorage.getItem('role');

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <div id="header">
            <Link to="/">
                <img id="logo-header" src="/img/logo.png" alt="logo" />
            </Link>

            <nav 
                id="nav" 
                className={isMenuOpen ? 'open' : ''}
            >
                <ul>
                    <li><Link to="/" onClick={closeMenu}>Accueil</Link></li>
                    <li><Link to="/register" onClick={closeMenu}>Inscription</Link></li>
                    <li><Link to="/login" onClick={closeMenu}>Connexion</Link></li>
                    <li><Link to="/about" onClick={closeMenu}>A propos</Link></li>
                    {userRole === 'admin' && (
                        <li><Link to="/admin/dashboard" onClick={closeMenu}>Dashboard</Link></li>
                    )}
                </ul>
            </nav>

            <div 
                className={`burger-menu ${isMenuOpen ? 'open' : ''}`} 
                onClick={toggleMenu}
                aria-label="Menu burger"
            >
                <span className="burger-icon"></span>
                <span className="burger-icon"></span>
                <span className="burger-icon"></span>
            </div>
        </div>
    );
}

export default Header;