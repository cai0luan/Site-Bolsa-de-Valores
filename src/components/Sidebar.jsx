// src/components/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom'; 
import { FiHome, FiBarChart2, FiGrid, FiMail, FiDollarSign, FiSettings, FiChevronDown, FiMenu } from 'react-icons/fi';
import '../App.css';

const Sidebar = () => (
  <aside className="sidebar">
    <div className="sidebar-header">{/* ... */}</div>
    <nav className="sidebar-nav">
      <NavLink to="/" className="nav-item"> <FiHome /> Dashboard <FiChevronDown /> </NavLink>
      <NavLink to="/chart" className="nav-item"> <FiBarChart2 /> Chart <FiChevronDown /> </NavLink>
      <NavLink to="/apps" className="nav-item"> <FiGrid /> Apps <FiChevronDown /> </NavLink>
      
      {/* AQUI ESTÁ A MUDANÇA */}
      <NavLink to="/investment" className="nav-item"> <FiDollarSign /> Investimento <FiChevronDown /> </NavLink>
      
      <a href="#" className="nav-item"> <FiMail /> Email <FiChevronDown /> </a>
      <a href="#" className="nav-item"> <FiSettings /> Setting <FiChevronDown /> </a>
    </nav>
    <div className="sidebar-projects">{/* ... */}</div>
  </aside>
);

export default Sidebar;