// src/components/AnalysisModal.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FiX, FiCheckCircle, FiXCircle, FiInfo } from 'react-icons/fi';
import '../App.css';

const AnalysisModal = ({ data, onClose }) => {
  // Escolhe o ícone e a cor com base no tipo de recomendação
  const getRecommendationStyle = (type) => {
    switch (type) {
      case 'good': return { icon: <FiCheckCircle />, color: 'var(--accent-cyan)' };
      case 'bad': return { icon: <FiXCircle />, color: '#e74c3c' };
      default: return { icon: <FiInfo />, color: '#f39c12' };
    }
  };

  const style = getRecommendationStyle(data.type);

  return (
    <motion.div className="modal-backdrop" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.div 
        className="modal-content analysis-modal-content" 
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <button className="modal-close-btn" onClick={onClose}><FiX /></button>
        
        <div className="analysis-header">
          {style.icon}
          <h2>{data.title}</h2>
        </div>

        <div className="analysis-recommendation" style={{ borderColor: style.color }}>
          <h4>Conclusão da Análise</h4>
          <p>{data.recommendation}</p>
        </div>

        <div className="analysis-factors">
          <h4>Fatores Considerados:</h4>
          <ul>
            {data.factors.map((factor, index) => (
              <li key={index}>{factor}</li>
            ))}
          </ul>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AnalysisModal;