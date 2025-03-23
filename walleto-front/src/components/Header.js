import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.svg';
import './Header.css';

function Header() {
    const location = useLocation();

    return (
        <header className="header">
            <img src={logo} alt="Walleto Logo" className="header-logo" />
            <h1 className="header-title">WALLETO</h1>
            <nav className="header-nav">
                {location.pathname !== '/' && <Link to="/" className="header-button"> Home </Link>}
                {location.pathname !== '/manage-vaults' && <Link to="/manage-vaults" className="header-button"> Manage Vaults </Link>}
            </nav>
        </header>
    );
}

export default Header;
