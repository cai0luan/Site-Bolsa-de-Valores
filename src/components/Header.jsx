import React from 'react';
import { FiSearch, FiBell } from 'react-icons/fi';
import { FaCog, FaEnvelope } from 'react-icons/fa';
import '../App.css';
// GARANTA QUE NÃO HÁ NENHUMA IMPORTAÇÃO DA SIDEBAR AQUI

const Header = () => (
  // O Header deve conter apenas o <header> e seus elementos internos
  <header className="header">
    {/* GARANTA QUE NÃO HÁ NENHUMA TAG <Sidebar /> AQUI DENTRO */}
    <div className="header-left">
      <p>DASHBOARD / HOME</p>
    </div>
    <div className="header-center">
      <div className="search-bar">
        <FiSearch className="search-icon" />
        <input type="text" placeholder="Search" />
      </div>
    </div>
    <div className="header-right">
      <FaCog className="header-icon" />
      <FaEnvelope className="header-icon" />
      <FiBell className="header-icon" />
      <div className="user-profile">
        <img src="https://i.pravatar.cc/40" alt="User" />
        <span>LOGIN</span>
      </div>
    </div>
  </header>
);

export default Header;