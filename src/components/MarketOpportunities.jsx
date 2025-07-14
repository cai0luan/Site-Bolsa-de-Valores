// src/components/MarketOpportunities.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import '../App.css';

const OpportunityItem = ({ stock, onStockSelect }) => (
  <motion.li 
    className="opportunity-item" 
    onClick={() => onStockSelect(stock)}
    whileHover={{ backgroundColor: 'var(--bg-dark)' }}
  >
    <div className="stock-info">
      <span className="stock-symbol">{stock.symbol}</span>
      <span className="stock-price">${stock.price.toFixed(2)}</span>
    </div>
    <div className="strength-bar">
      <div 
        className="bar-fill"
        style={{
          width: `${stock.strength || 75}%`,
          background: stock.signal === 'Comprar' 
            ? 'linear-gradient(90deg, #2ecc71, #27ae60)' 
            : 'linear-gradient(90deg, #e74c3c, #c0392b)',
        }}
      ></div>
    </div>
    <span className={`stock-signal ${stock.signal === 'Comprar' ? 'gainer' : 'loser'}`}>
      {(stock.changePercent > 0 ? '+' : '') + stock.changePercent.toFixed(2)}%
    </span>
  </motion.li>
);

const MarketOpportunities = ({ data, onStockSelect }) => {
  const buySignals = data.filter(s => s.signal === 'Comprar').slice(0, 3);
  const sellSignals = data.filter(s => s.signal === 'Vender').slice(0, 3);

  return (
    <div className="widget market-opportunities-widget">
      <div className="opportunity-column">
        <h3 className="opportunity-title"><FiTrendingUp className="gainer"/> Oportunidades de Compra</h3>
        <ul className="opportunities-list">
          {buySignals.map(stock => <OpportunityItem key={stock.symbol} stock={stock} onStockSelect={onStockSelect} />)}
        </ul>
      </div>
      <div className="opportunity-column">
        <h3 className="opportunity-title"><FiTrendingDown className="loser"/> Oportunidades de Venda</h3>
        <ul className="opportunities-list">
          {sellSignals.map(stock => <OpportunityItem key={stock.symbol} stock={stock} onStockSelect={onStockSelect} />)}
        </ul>
      </div>
    </div>
  );
};

export default MarketOpportunities;