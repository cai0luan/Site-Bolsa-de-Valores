// src/pages/ChartPage.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
// Voltamos a usar a Recharts, que é mais estável para o nosso caso
import { ResponsiveContainer, ComposedChart, LineChart, Line, Bar, Area, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ReferenceLine } from 'recharts';
import '../App.css';

// --- Configurações de Animação ---
const pageVariants = { initial: { opacity: 0, scale: 0.9 }, in: { opacity: 1, scale: 1 }, out: { opacity: 0, scale: 1.1 } };
const pageTransition = { type: 'tween', ease: 'anticipate', duration: 0.5 };

const symbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'NVDA'];
// AQUI ESTÁ SUA CHAVE. CERTIFIQUE-SE DE QUE ELA É VÁLIDA.
const apiKey = 'dbKVb8378EtXfGtXNUX9XARGPgb0I9FJ'; 

// --- Funções de Cálculo para o Indicador MACD ---
const calculateEMA = (data, period) => {
  if (!data || data.length === 0) return [];
  const k = 2 / (period + 1);
  let emaArray = [{ price: data[0].close, ema: data[0].close }];
  for (let i = 1; i < data.length; i++) {
    const ema = data[i].close * k + emaArray[i - 1].ema * (1 - k);
    emaArray.push({ price: data[i].close, ema: ema });
  }
  return emaArray.map(item => item.ema);
};

// --- Tooltip Personalizado ---
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label">{`Data: ${label}`}</p>
        <p className="intro price">{`Fechamento: $${payload[0].value.toFixed(2)}`}</p>
        <p className="intro volume">{`Volume: ${payload[1].value.toLocaleString()}`}</p>
      </div>
    );
  }
  return null;
};

const ChartPage = () => {
  const [selectedSymbol, setSelectedSymbol] = useState(symbols[0]);
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      setIsLoading(true);
      setChartData([]);
      try {
        const response = await fetch(`https://financialmodelingprep.com/api/v3/historical-price-full/${selectedSymbol}?apikey=${apiKey}`);
        const responseData = await response.json();
        let data = responseData.historical;

        if (data && Array.isArray(data)) {
            data.reverse();
            const ema12 = calculateEMA(data, 12);
            const ema26 = calculateEMA(data, 26);
            
            const processedData = data.map((item, index) => {
                const macdLine = ema12[index] - ema26[index];
                return { ...item, macd: macdLine };
            });
            
            const signalLine = calculateEMA(processedData.map(d => ({close: d.macd})), 9);
            const finalData = processedData.map((item, index) => ({...item, signal: signalLine[index]}));

            setChartData(finalData);
        } else {
            console.error("A API não retornou um array de dados históricos válidos.", responseData);
        }
      } catch (error) {
        console.error("Erro ao buscar dados do gráfico:", error);
      }
      setIsLoading(false);
    };

    if (apiKey && apiKey !== 'SUA_CHAVE_API_AQUI') {
      fetchChartData();
    } else {
      console.error("A chave de API não foi definida no código. Por favor, insira sua chave.");
      setIsLoading(false);
    }
  }, [selectedSymbol]);

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="page-container">
      <h1 className="page-title">Análise Técnica de Mercado</h1>
      <div className="stock-selector">
        {symbols.map(symbol => (
          <button key={symbol} onClick={() => setSelectedSymbol(symbol)} className={selectedSymbol === symbol ? 'active' : ''}>
            {symbol}
          </button>
        ))}
      </div>
      {isLoading ? (<p className="loading-text">Carregando dados de {selectedSymbol}...</p>) : (
        <div className="charts-grid-technical">
          {chartData.length > 0 ? (
            <>
              <div className="widget">
                <h3>{selectedSymbol} - Preço e Volume Diário</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={chartData} syncId="technicalSync">
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)"/>
                    <XAxis dataKey="date" stroke="var(--text-secondary)" />
                    <YAxis yAxisId="left" orientation="left" stroke="var(--accent-cyan)" />
                    <YAxis yAxisId="right" orientation="right" stroke="var(--accent-pink)" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area yAxisId="left" type="monotone" dataKey="close" stroke="var(--accent-cyan)" fill="var(--accent-cyan)" fillOpacity={0.2} name="Preço" />
                    <Bar yAxisId="right" dataKey="volume" fill="var(--accent-pink)" name="Volume" fillOpacity={0.5}/>
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              <div className="widget">
                <h3>Indicador MACD</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData} syncId="technicalSync">
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)"/>
                    <XAxis dataKey="date" stroke="var(--text-secondary)" />
                    <YAxis stroke="var(--text-secondary)" />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--bg-light)' }}/>
                    <Legend />
                    <ReferenceLine y={0} stroke="white" strokeDasharray="5 5" />
                    <Line type="monotone" dataKey="macd" stroke="var(--accent-purple)" dot={false} name="Linha MACD" />
                    <Line type="monotone" dataKey="signal" stroke="#f39c12" dot={false} name="Linha de Sinal" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          ) : (
            <p className="loading-text">Não foi possível carregar os dados do gráfico para {selectedSymbol}. Verifique a chave de API e o console.</p>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default ChartPage;