// src/components/StockDetailModal.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, ComposedChart, Line, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { FiX, FiInfo, FiActivity, FiZap } from 'react-icons/fi';
import '../App.css';

const StockDetailModal = ({ stock, onClose }) => (
  <motion.div className="modal-backdrop" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <motion.div 
      className="modal-content stock-modal-content" 
      onClick={(e) => e.stopPropagation()}
      initial={{ y: "-100vh" }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 15 }}
    >
      <button className="modal-close-btn" onClick={onClose}><FiX /></button>
      
      <div className="stock-modal-header">
        <h2>{stock.symbol} - Análise Detalhada</h2>
        <span className={`recommendation-badge ${stock.signal === 'Comprar' ? 'buy' : 'sell'}`}>{stock.signal}</span>
      </div>

      <div className="stock-modal-chart">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={stock.history}>
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={stock.signal === 'Comprar' ? '#2ecc71' : '#e74c3c'} stopOpacity={0.4}/>
                <stop offset="95%" stopColor={stock.signal === 'Comprar' ? '#2ecc71' : '#e74c3c'} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="time" stroke="var(--text-secondary)" tick={{fontSize: 10}} />
            <YAxis stroke="var(--text-secondary)" domain={['dataMin - 5', 'dataMax + 5']} tick={{fontSize: 10}}/>
            <Tooltip contentStyle={{ backgroundColor: 'var(--bg-dark)', border: '1px solid var(--border-color)' }} />
            <Area type="monotone" dataKey="price" stroke="none" fill="url(#chartGradient)" />
            <Line type="monotone" dataKey="price" stroke={stock.signal === 'Comprar' ? '#2ecc71' : '#e74c3c'} strokeWidth={2} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="stock-modal-metrics">
        <div className="metric-item">
          <FiZap /><div><span>Preço Atual</span><strong>${stock.price.toFixed(2)}</strong></div>
        </div>
        <div className="metric-item">
          <FiActivity /><div><span>Variação (24h)</span><strong className={stock.change > 0 ? 'gainer' : 'loser'}>{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)</strong></div>
        </div>
        <div className="metric-item">
          <FiInfo /><div><span>Volatilidade</span><strong>{stock.volatility || 'Média'}</strong></div>
        </div>
      </div>

    </motion.div>
  </motion.div>
);

export default StockDetailModal;