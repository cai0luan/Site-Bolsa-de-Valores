// src/App.jsx
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import './App.css';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import ChartPage from './pages/ChartPage';
import AppsPage from './pages/AppsPage';
import InvestmentPage from './pages/InvestmentPage'; // 1. Importe a nova página

function App() {
  const location = useLocation();

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/chart" element={<ChartPage />} />
            <Route path="/apps" element={<AppsPage />} />
            <Route path="/investment" element={<InvestmentPage />} /> {/* 2. Adicione a rota */}
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;