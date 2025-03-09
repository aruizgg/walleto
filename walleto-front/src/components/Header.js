import React from 'react';
import logo from '../assets/logo.svg';
import './Header.css';

function Header() {
    return (
        <header className="header">
            <img src={logo} alt="Walleto Logo" className="header-logo" />
            <h1 className="header-title">WALLETO</h1>
        </header>
    );
}

export default Header;
