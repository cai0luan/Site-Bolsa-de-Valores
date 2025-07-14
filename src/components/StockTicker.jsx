// src/components/StockTicker.jsx
import React from 'react';
import '../App.css';
import { FiArrowUpRight, FiArrowDownLeft } from 'react-icons/fi';

const StockTicker = ({ data }) => (
  <div className="ticker-wrap">
    <div className="ticker">
      {data.map(stock => (
        <div key={stock.symbol} className="ticker-item">
          <span className="stock-symbol">{stock.symbol}</span>
          
          {/* Adicionamos o '?.' para segurança */}
          <span className="stock-price">${stock.price?.toFixed(2)}</span>
          
          <span className={`stock-change ${stock.change > 0 ? 'gainer' : 'loser'}`}>
            {stock.change > 0 ? <FiArrowUpRight/> : <FiArrowDownLeft/>}
            
            {/* Adicionamos o '?.' aqui também */}
            {stock.changePercent?.toFixed(2)}%
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default StockTicker;