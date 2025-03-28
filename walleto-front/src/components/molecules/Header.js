import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/svg/logo.svg';
import '../../styles/Header.css';
import ComponentTextButton from '../atoms/Buttons/TextButton';

function Header() {
    const location = useLocation();

    return (
        <header className="header">
            <img src={logo} alt="Walleto Logo" className="header-logo" />
            <h1 className="header-title">WALLETO</h1>
            <nav className="header-nav">
                {location.pathname !== '/' && <Link to="/" className="header-button"><ComponentTextButton> Home </ComponentTextButton></Link>}
                {location.pathname !== '/manage-vaults' && <Link to="/manage-vaults" className="header-button"> <ComponentTextButton> Manage Vaults</ComponentTextButton> </Link>}
                {location.pathname !== '/transactions' && <Link to="/transactions" className="header-button"><ComponentTextButton> Transactions</ComponentTextButton> </Link>}
            </nav>
        </header>
    );
}

export default Header;
