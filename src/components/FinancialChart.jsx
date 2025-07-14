// src/components/FinancialChart.jsx
import React, { useEffect, useRef } from 'react';
// AQUI ESTÁ A CORREÇÃO DEFINITIVA: Importamos a função diretamente.
import { createChart } from 'lightweight-charts';

const FinancialChart = ({ data }) => {
  const chartContainerRef = useRef();

  useEffect(() => {
    if (data.length === 0 || !chartContainerRef.current) return;

    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    };

    // Agora, 'createChart' é a função correta que importamos.
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: { backgroundColor: '#1F1D2B', textColor: 'rgba(255, 255, 255, 0.9)' },
      grid: { vertLines: { color: '#252836' }, horzLines: { color: '#252836' } },
      timeScale: { timeVisible: true, secondsVisible: false, borderColor: '#485158' },
      rightPriceScale: { borderColor: '#485158' },
    });

    // Agora, o objeto 'chart' terá o método '.addCandlestickSeries'
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#26a69a', downColor: '#ef5350', borderDownColor: '#ef5350',
      borderUpColor: '#26a69a', wickDownColor: '#ef5350', wickUpColor: '#26a69a',
    });
    const candleData = data.map(item => ({
      time: new Date(item.date).getTime() / 1000,
      open: item.open, high: item.high, low: item.low, close: item.close,
    }));
    candlestickSeries.setData(candleData);

    const volumeSeries = chart.addHistogramSeries({
      color: '#26a69a', priceFormat: { type: 'volume' }, priceScaleId: 'volume_id',
    });
    const volumeData = data.map(item => ({
        time: new Date(item.date).getTime() / 1000, value: item.volume,
        color: item.close > item.open ? 'rgba(38, 166, 154, 0.5)' : 'rgba(239, 83, 80, 0.5)',
    }));
    volumeSeries.setData(volumeData);
    chart.priceScale('volume_id').applyOptions({
        scaleMargins: { top: 0.8, bottom: 0 },
    });

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data]);

  return <div ref={chartContainerRef} className="financial-chart-container" />;
};

export default FinancialChart;