// src/components/DetailedModal.jsx
import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { FiX } from 'react-icons/fi';
import '../App.css';

const DetailedModal = ({ data, onClose }) => {
  // Estado para armazenar os dados do gráfico que serão atualizados em "tempo real"
  const [chartData, setChartData] = useState(data.history);

  // Efeito para simular a chegada de novos dados
  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(prevData => {
        // Remove o ponto de dado mais antigo
        const newData = prevData.slice(1);
        // Adiciona um novo ponto de dado com um valor aleatório próximo ao último
        const lastValue = newData[newData.length - 1].value;
        const newValue = lastValue + Math.floor(Math.random() * 10) - 5; // Variação suave
        
        // Cria um novo nome para o ponto (ex: "10:31:05")
        const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        return [...newData, { name: time, value: Math.max(0, newValue) }]; // Garante que o valor não seja negativo
      });
    }, 2000); // Atualiza a cada 2 segundos

    // Função de limpeza: para o intervalo quando o modal é fechado para evitar vazamentos de memória
    return () => clearInterval(interval);
  }, []); // O array vazio [] garante que o efeito só rode uma vez quando o modal monta

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <FiX />
        </button>
        <h2>{data.title}</h2>
        <p>Análise detalhada em tempo real</p>

        <div className="modal-chart-container">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="name" stroke="var(--text-secondary)" />
              <YAxis stroke="var(--text-secondary)" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--bg-light)', 
                  border: '1px solid var(--border-color)' 
                }}
              />
              <Line type="monotone" dataKey="value" stroke={data.color} strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="modal-details-list">
          <h3>Últimas Atividades</h3>
          <ul>
            <li>Atualização recebida: {chartData[chartData.length - 1].value} às {chartData[chartData.length - 1].name}</li>
            <li>Ponto anterior: {chartData[chartData.length - 2].value}</li>
            <li>Média da série: {Math.round(chartData.reduce((sum, item) => sum + item.value, 0) / chartData.length)}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DetailedModal;