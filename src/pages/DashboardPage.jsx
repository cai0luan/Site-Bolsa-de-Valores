// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Importação de todos os componentes necessários
import Header from '../components/Header';
import StockTicker from '../components/StockTicker';
import MarketOpportunities from '../components/MarketOpportunities';
import StockDetailModal from '../components/StockDetailModal';
import SignalHistory from '../components/SignalHistory';
import AnalysisModal from '../components/AnalysisModal';
import '../App.css';

import { ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts';

const StatWidget = ({ item, isHovered, onMouseEnter, onMouseLeave, onClick }) => (
  <div className={`widget widget-stat clickable ${isHovered ? 'widget-hovered' : ''}`} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={onClick}>
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={100}>
        <RadialBarChart innerRadius="70%" outerRadius="90%" data={[{ value: item.percent }]} startAngle={90} endAngle={450}>
          <RadialBar background dataKey="value" cornerRadius={10} fill={item.fill} isAnimationActive={false} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="chart-label">{item.displayValue}</div>
    </div>
    <h3>{item.title}</h3>
    <p>{item.description}</p>
    {isHovered && (<div className="widget-details"><p><strong>Info Adicional:</strong> {item.exactValue}</p></div>)}
  </div>
);

const pageVariants = { initial: { opacity: 0, scale: 0.9 }, in: { opacity: 1, scale: 1 }, out: { opacity: 0, scale: 1.1 } };
const pageTransition = { type: 'tween', ease: 'anticipate', duration: 0.5 };

const DashboardPage = () => {
  const [stocksData, setStocksData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredWidget, setHoveredWidget] = useState(null);
  const [selectedStock, setSelectedStock] = useState(null);
  const [buyHistory, setBuyHistory] = useState([]);
  const [sellHistory, setSellHistory] = useState([]);
  const [analysisModalData, setAnalysisModalData] = useState(null);
  const [featuredStockIndex, setFeaturedStockIndex] = useState(0);

  const symbols = 'AAPL,GOOGL,MSFT,AMZN,TSLA,NVDA';
  const apiKey = 'dbKVb8378EtXfGtXNUX9XARGPgb0I9FJ';

  // EFEITO 1: Busca os dados iniciais da API
  useEffect(() => {
    const fetchStockData = async () => {
      setIsLoading(true);
      setError(null);

      if (!apiKey || apiKey === 'SUA_CHAVE_API_AQUI') {
        setError("A chave de API não foi definida no código.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`https://financialmodelingprep.com/api/v3/quote/${symbols}?apikey=${apiKey}`);
        const data = await response.json();

        if (data && Array.isArray(data) && data.length > 0) {
          const formattedData = data.map(s => ({
            symbol: s.symbol, name: s.name, price: s.price, change: s.change,
            changePercent: s.changesPercentage, previousClose: s.previousClose,
            volume: s.volume, marketCap: s.marketCap,
            momentum: 0, signal: 'Manter',
            history: [{ time: new Date().toLocaleTimeString(), price: s.price }],
          }));
          setStocksData(formattedData);
        } else {
          setError(data['Error Message'] || 'A API retornou dados inválidos.');
        }
      } catch (err) {
        setError('Falha na conexão com a API.');
      }
      setIsLoading(false); // ESSA LINHA GARANTE QUE O 'CARREGANDO' TERMINE
    };
    fetchStockData();
  }, []);

  // EFEITO 2: Simula atualizações de preço e sinais
  useEffect(() => {
    if (stocksData.length === 0) return;
    const interval = setInterval(() => {
      setStocksData(currentStocks =>
        currentStocks.map(stock => {
          const change = (Math.random() - 0.48) * (stock.price * 0.01);
          const newPrice = Math.max(10, stock.price + change);
          const newMomentum = Math.min(10, Math.max(-10, stock.momentum + (change > 0 ? 1 : -1)));
          let signal = stock.signal;
          if (newMomentum >= 3) signal = 'Comprar';
          else if (newMomentum <= -3) signal = 'Vender';
          else if (Math.abs(newMomentum) < 2) signal = 'Manter';
          if (signal === 'Comprar' && stock.signal !== 'Comprar') {
            setBuyHistory(prev => [{ ...stock, price: newPrice, time: new Date() }, ...prev].slice(0, 10));
          }
          if (signal === 'Vender' && stock.signal !== 'Vender') {
            setSellHistory(prev => [{ ...stock, price: newPrice, time: new Date() }, ...prev].slice(0, 10));
          }
          return { ...stock, price: newPrice, change: newPrice - stock.previousClose, changePercent: ((newPrice - stock.previousClose) / stock.previousClose) * 100, momentum: newMomentum, signal, strength: Math.abs(newMomentum) * 10, history: [...stock.history.slice(-20), { time: new Date().toLocaleTimeString(), price: newPrice }], };
        })
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [stocksData]);

  // EFEITO 3: Gira a ação em destaque
  useEffect(() => {
    if (stocksData.length === 0) return;
    const rotationInterval = setInterval(() => {
      setFeaturedStockIndex(prevIndex => (prevIndex + 1) % stocksData.length);
    }, 10000);
    return () => clearInterval(rotationInterval);
  }, [stocksData.length]);


  const renderContent = () => {
    if (isLoading) { return <p className="loading-text">Carregando dados do mercado...</p>; }
    if (error) { return <div className="widget error-widget"><h3>Erro ao Carregar Dados</h3><p>{error}</p></div>; }

    if (stocksData.length > 0 && stocksData[featuredStockIndex]) {
      const featuredStock = stocksData[featuredStockIndex];
      const getTrendDescription = (momentum) => {
        if (momentum >= 3) return 'Forte Alta'; if (momentum > 0) return 'Alta Fraca';
        if (momentum <= -3) return 'Forte Baixa'; if (momentum < 0) return 'Baixa Fraca'; return 'Neutra';
      };
      const radialData = [
        { name: 'Tax', title: 'Alíquota Simulada', displayValue: '15%', description: 'Sobre ganhos de capital.', percent: 15, fill: '#f39c12', onClick: () => setAnalysisModalData({ title: 'Análise de Impostos (Simulação)', type: 'neutral', recommendation: 'A alíquota simulada de 15% é aplicada sobre o lucro líquido.', factors: ['Tipo: Swing Trade', 'Base: Lucro Líquido']}) },
        { name: 'Trend', title: `Tendência (${featuredStock.symbol})`, displayValue: getTrendDescription(featuredStock.momentum), description: 'Força do movimento atual.', percent: 10 + Math.abs(featuredStock.momentum || 0) * 9, fill: 'var(--accent-purple)', onClick: () => setAnalysisModalData({ title: `Análise de Tendência (${featuredStock.symbol})`, type: featuredStock.momentum > 0 ? 'good' : 'bad', recommendation: `A tendência atual (${getTrendDescription(featuredStock.momentum)}) indica a direção do mercado.`, factors: [`Momentum: ${featuredStock.momentum?.toFixed(2)}`, `Sinal: ${featuredStock.signal}`]})},
        { name: 'Advantage', title: 'Índice de Vantagem', displayValue: `${Math.max(0, Math.min(100, 50 + (featuredStock.momentum || 0) * 5 - Math.abs((featuredStock.price / featuredStock.previousClose - 1) * 100) * 10)).toFixed(0)}`, description: 'Pontuação de oportunidade.', percent: Math.max(0, Math.min(100, 50 + (featuredStock.momentum || 0) * 5 - Math.abs((featuredStock.price / featuredStock.previousClose - 1) * 100) * 10)), fill: 'var(--accent-cyan)', onClick: () => setAnalysisModalData({ title: 'Análise de Vantagem', type: 'good', recommendation: 'A pontuação sugere o quão favorável está o momento para negociar.', factors: [`Força da Tendência`, `Volatilidade Recente`, 'Índice proprietário simulado.']})},
      ];

      return (
        <>
          <StockTicker data={stocksData} />
          <div className="widgets-grid dashboard-layout-v2">
            {radialData.map((item, index) => <StatWidget key={item.name} item={item} isHovered={hoveredWidget === index} onMouseEnter={() => setHoveredWidget(index)} onMouseLeave={() => setHoveredWidget(null)} onClick={item.onClick} />)}
            <div className="widget-area-span-full"><MarketOpportunities data={stocksData} onStockSelect={setSelectedStock} /></div>
            <div className="widget-area-span-full history-container"><SignalHistory title="Histórico de Compra" history={buyHistory} /><SignalHistory title="Histórico de Venda" history={sellHistory} /></div>
          </div>
        </>
      );
    }
    
    return <p className="loading-text">Aguardando dados...</p>;
  };

  return (
    <motion.div className="page-container" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
      <Header />
      <div className="content-wrapper">{renderContent()}</div>
      {selectedStock && <StockDetailModal stock={selectedStock} onClose={() => setSelectedStock(null)} />}
      {analysisModalData && <AnalysisModal data={analysisModalData} onClose={() => setAnalysisModalData(null)} />}
    </motion.div>
  );
};

export default DashboardPage;