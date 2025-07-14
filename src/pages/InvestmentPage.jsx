// src/pages/InvestmentPage.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { FiDollarSign, FiBarChart2, FiCalendar, FiTrendingUp, FiTrendingDown, FiClock } from 'react-icons/fi';
import '../App.css';

const pageVariants = { initial: { opacity: 0, scale: 0.9 }, in: { opacity: 1, scale: 1 }, out: { opacity: 0, scale: 1.1 } };
const pageTransition = { type: 'tween', ease: 'anticipate', duration: 0.5 };
const apiKey = 'dbKVb8378EtXfGtXNUX9XARGPgb0I9FJ';

// --- Componente Reutilizável de Projeção ---
const ProjectionCard = ({ year, value, annualRate, investmentAmount }) => {
  const grossProfit = value - investmentAmount;
  const tax = grossProfit * 0.15;
  const netProfit = grossProfit - tax;
  const chartData = [{ name: 'Ganho', investmentAmount, netProfit, tax }];

  return (
    <div className="widget projection-card">
      <h4><FiCalendar /> Projeção para {year} Ano{year > 1 ? 's' : ''}</h4>
      <span className="projection-value">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(investmentAmount + netProfit)}</span>
      <p>Taxa anual simulada de <strong>{(annualRate * 100).toFixed(2)}%</strong></p>
      <div className="profit-chart-container">
        <ResponsiveContainer width="100%" height={60}>
          <BarChart layout="vertical" data={chartData}>
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="name" hide />
            <Tooltip cursor={{fill: 'rgba(255,255,255,0.1)'}} contentStyle={{backgroundColor: 'var(--bg-dark)'}} formatter={(val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)} />
            <Bar dataKey="investmentAmount" stackId="a" fill="var(--border-color)" name="Investimento" />
            <Bar dataKey="netProfit" stackId="a" fill="var(--accent-cyan)" name="Lucro Líquido" />
            <Bar dataKey="tax" stackId="a" fill="#e74c3c" name="Imposto (Simulado)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="profit-details"><span>Lucro Líquido: <strong>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(netProfit)}</strong></span></div>
    </div>
  );
};

const InvestmentPage = () => {
  const [investmentAmount, setInvestmentAmount] = useState(1000);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [liveStocks, setLiveStocks] = useState([]);

  // Efeito para simular os dados em tempo real do Dashboard
  useEffect(() => {
    const fetchAndSimulate = async () => {
      try {
        const response = await fetch(`https://financialmodelingprep.com/api/v3/quote/AAPL,GOOGL,MSFT,AMZN,TSLA,NVDA?apikey=${apiKey}`);
        const data = await response.json();
        if (data && data.length > 0) {
          let stocks = data.map(s => ({ ...s, momentum: 0, signal: 'Manter'}));
          const interval = setInterval(() => {
            stocks = stocks.map(stock => {
              const change = (Math.random() - 0.48) * (stock.price * 0.01);
              const newPrice = Math.max(10, stock.price + change);
              const newMomentum = Math.min(10, Math.max(-10, stock.momentum + (change > 0 ? 1 : -1)));
              let signal = stock.signal;
              if (newMomentum >= 3) signal = 'Comprar'; else if (newMomentum <= -3) signal = 'Vender'; else if (Math.abs(newMomentum) < 2) signal = 'Manter';
              return { ...stock, price: newPrice, momentum: newMomentum, signal };
            });
            setLiveStocks([...stocks]);
          }, 3000);
          return () => clearInterval(interval);
        }
      } catch(err) {}
    };
    fetchAndSimulate();
  }, []);

  const handleAnalysis = async () => {
    setIsLoading(true); setError(null); setAnalysisResult(null);
    if (liveStocks.length === 0) {
        setError("Dados de mercado em tempo real não estão disponíveis. Tente novamente em alguns segundos.");
        setIsLoading(false);
        return;
    }

    try {
      // 1. A NOVA LÓGICA DE ANÁLISE
      const opportunities = liveStocks.filter(s => s.signal !== 'Manter');
      if (opportunities.length === 0) {
        setAnalysisResult({ type: 'neutral' });
        setIsLoading(false);
        return;
      }

      const bestOpportunity = opportunities.reduce((best, current) => Math.abs(current.momentum) > Math.abs(best.momentum) ? current : best);
      
      const historyResponse = await fetch(`https://financialmodelingprep.com/api/v3/historical-price-full/${bestOpportunity.symbol}?apikey=${apiKey}`);
      const historyData = await historyResponse.json();
      if (!historyData.historical || historyData.historical.length < 2) throw new Error("Dados históricos insuficientes para análise.");
      
      const historical = historyData.historical.reverse();
      const years = historical.length / 252;
      const totalReturn = (historical[historical.length - 1].close / historical[0].close) - 1;
      const annualRate = Math.pow(1 + totalReturn, 1 / years) - 1;
      
      const projections = [1, 5, 10, 20].map(year => ({ year, value: investmentAmount * Math.pow(1 + annualRate, year), annualRate, investmentAmount }));

      setAnalysisResult({ type: bestOpportunity.signal, stock: bestOpportunity, projections });

    } catch (err) { setError(err.message); }
    setIsLoading(false);
  };

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="page-container">
      <h1 className="page-title">Simulador de Estratégia</h1>
      <p className="page-subtitle">Insira um valor e receba uma recomendação de compra ou venda baseada no momentum do mercado.</p>
      <div className="investment-form widget">
        <FiDollarSign />
        <input type="number" value={investmentAmount} onChange={(e) => setInvestmentAmount(Number(e.target.value))} />
        <button onClick={handleAnalysis} disabled={isLoading}>{isLoading ? "Analisando..." : "Gerar Estratégia"}</button>
      </div>

      {error && <div className="widget error-widget"><p>{error}</p></div>}

      {analysisResult && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="analysis-results">
          {analysisResult.type === 'Comprar' && (
            <>
              <div className="widget recommendation-box"><FiTrendingUp /><h3>Recomendação: COMPRAR {analysisResult.stock.symbol}</h3><p>A análise indica um forte momentum de alta para <strong>{analysisResult.stock.name}</strong>, tornando-a a oportunidade de compra mais clara no momento.</p></div>
              <div className="projection-grid">{analysisResult.projections.map(proj => <ProjectionCard key={proj.year} {...proj} />)}</div>
            </>
          )}
          {analysisResult.type === 'Vender' && (
            <div className="widget recommendation-box sell-box"><FiTrendingDown /><h3>Recomendação: VENDER {analysisResult.stock.symbol}</h3><p>A análise indica um forte momentum de baixa para <strong>{analysisResult.stock.name}</strong>. Esta é uma oportunidade para realizar lucros ou limitar perdas. Projeções de longo prazo não são aplicáveis para uma estratégia de venda de curto prazo.</p></div>
          )}
          {analysisResult.type === 'neutral' && (
            <div className="widget recommendation-box neutral-box"><FiClock /><h3>Recomendação: AGUARDAR</h3><p>Nenhuma oportunidade clara de compra ou venda com forte momentum foi identificada no momento. Em um mercado lateral, a melhor estratégia é aguardar um sinal mais forte.</p></div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default InvestmentPage;