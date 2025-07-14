// src/components/SignalHistory.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../App.css';

const SignalHistory = ({ title, history }) => (
  <div className="widget history-widget">
    <h3>{title}</h3>
    <ul className="history-list">
      <AnimatePresence>
        {history.map(item => (
          <motion.li
            key={item.symbol + item.time.getTime()}
            layout
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <span className="history-symbol">{item.symbol}</span>
            <span className="history-price">${item.price.toFixed(2)}</span>
            <span className="history-time">{item.time.toLocaleTimeString('pt-BR')}</span>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  </div>
);

export default SignalHistory;