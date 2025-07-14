// src/components/TopMovers.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowUpRight, FiArrowDownLeft } from 'react-icons/fi';
import '../App.css';

const TopMovers = ({ data }) => {
  const sortedData = [...data].sort((a, b) => b.changePercent - a.changePercent);
  const gainers = sortedData.slice(0, 3);
  const losers = sortedData.slice(-3).reverse();

  return (
    <motion.div className="widget top-movers-widget" whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}>
      <h3>Top Movers</h3>
      <div className="movers-container">
        <div className="movers-list">
          <h4>Maiores Altas</h4>
          <ul>
            {gainers.map(stock => (
              <li key={stock.symbol}>
                <span className="stock-symbol">{stock.symbol}</span>
                <span className="stock-price">${stock.price.toFixed(2)}</span>
                <span className="stock-change gainer">
                  <FiArrowUpRight /> {stock.changePercent.toFixed(2)}%
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="movers-list">
          <h4>Maiores Baixas</h4>
          <ul>
            {losers.map(stock => (
              <li key={stock.symbol}>
                <span className="stock-symbol">{stock.symbol}</span>
                <span className="stock-price">${stock.price.toFixed(2)}</span>
                <span className="stock-change loser">
                  <FiArrowDownLeft /> {stock.changePercent.toFixed(2)}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default TopMovers;