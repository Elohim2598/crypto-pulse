import { useEffect, useRef } from 'react';
import { createChart, IChartApi, ColorType, AreaSeries } from 'lightweight-charts';
import { ChartDataPoint } from '../../types';
import styles from './PriceChart.module.css';

interface PriceChartProps {
  data: ChartDataPoint[];
  livePrice?: number;
}

export const PriceChart = ({ data, livePrice }: PriceChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<any>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        background: { type: ColorType.Solid, color: '#ffffff' },
        textColor: '#333',
      },
      grid: {
        vertLines: { color: '#f0f0f0' },
        horzLines: { color: '#f0f0f0' },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });

    // Create area series - CORRECT SYNTAX from docs
    const areaSeries = chart.addSeries(AreaSeries, {
      lineColor: '#667eea',
      topColor: 'rgba(102, 126, 234, 0.4)',
      bottomColor: 'rgba(102, 126, 234, 0.0)',
      lineWidth: 2,
    });

    chartRef.current = chart;
    seriesRef.current = areaSeries;

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  // Update chart data
  useEffect(() => {
    if (seriesRef.current && data.length > 0) {
      seriesRef.current.setData(data);
    }
  }, [data]);

  // Update with live price
  useEffect(() => {
    if (seriesRef.current && livePrice && data.length > 0) {
      const now = Math.floor(Date.now() / 1000);
      
      seriesRef.current.update({
        time: now,
        value: livePrice,
      });
    }
  }, [livePrice, data]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>24 Hour Price Chart</h2>
      <div ref={chartContainerRef} className={styles.chart} />
    </div>
  );
};