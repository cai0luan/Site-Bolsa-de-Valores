// src/pages/AppsPage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FiBox, FiCalendar, FiCloud, FiPieChart, FiMessageCircle, FiHeadphones } from 'react-icons/fi';
import '../App.css';

// Reutilizamos as mesmas animações das outras páginas para consistência
const pageVariants = {
  initial: { opacity: 0, scale: 0.9 },
  in: { opacity: 1, scale: 1 },
  out: { opacity: 0, scale: 1.1 }
};
const pageTransition = { type: 'tween', ease: 'anticipate', duration: 0.5 };

// Dados de exemplo para nossos aplicativos
const appsData = [
  { id: 1, icon: <FiBox />, title: 'Project Kanban', description: 'Organize suas tarefas em quadros visuais.', status: 'Ativo', statusColor: 'var(--accent-cyan)' },
  { id: 2, icon: <FiCalendar />, title: 'Team Calendar', description: 'Sincronize eventos e prazos com a equipe.', status: 'Ativo', statusColor: 'var(--accent-cyan)' },
  { id: 3, icon: <FiCloud />, title: 'Cloud Storage', description: 'Conecte seus arquivos do Google Drive ou Dropbox.', status: 'Requer Atualização', statusColor: '#f39c12' },
  { id: 4, icon: <FiPieChart />, title: 'Automated Reports', description: 'Gere relatórios de performance automaticamente.', status: 'Ativo', statusColor: 'var(--accent-cyan)' },
  { id: 5, icon: <FiMessageCircle />, title: 'CRM Integration', description: 'Integre com Salesforce ou HubSpot.', status: 'Desativado', statusColor: 'var(--text-secondary)' },
  { id: 6, icon: <FiHeadphones />, title: 'Support Chatbot', description: 'Atenda clientes com nosso chatbot de IA.', status: 'Ativo', statusColor: 'var(--accent-cyan)' },
];

const AppsPage = () => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="page-container"
    >
      <h1 className="page-title">Gerenciador de Aplicativos</h1>
      <p className="page-subtitle">Ative, desative e configure as integrações do seu painel.</p>

      <div className="apps-grid">
        {appsData.map(app => (
          <div key={app.id} className="app-card">
            <div className="app-card-header">
              <span className="app-card-icon">{app.icon}</span>
              <h3>{app.title}</h3>
            </div>
            <div className="app-card-body">
              <p>{app.description}</p>
            </div>
            <div className="app-card-footer">
              <span className="app-status" style={{ backgroundColor: app.statusColor }}>
                {app.status}
              </span>
              <button className="app-launch-btn">Configurar</button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default AppsPage;