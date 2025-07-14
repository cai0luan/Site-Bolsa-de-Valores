// src/components/PortfolioChart.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import '../App.css';

const COLORS = ['var(--accent-purple)', 'var(--accent-pink)', 'var(--accent-cyan)', '#F39C12'];

const PortfolioChart = ({ data }) => (
  <motion.div className="widget chart-widget-3d" whileHover={{ rotateX: 10, rotateY: -5, scale: 1.05 }}>
    <h3>Alocação de Portfólio</h3>
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Tooltip contentStyle={{ backgroundColor: 'var(--bg-light)', border: 'none' }}/>
        <Pie data={data} innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  </motion.div>
);

export default PortfolioChart;