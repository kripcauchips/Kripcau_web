'use client';

import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, AreaSeries, IChartApi, ISeriesApi } from 'lightweight-charts';

interface ChartDataPoint {
  time: string;
  value: number;
}

export default function TradingViewChart({ data }: { data: ChartDataPoint[] }) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Area'> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#1B3C33',
        fontFamily: 'Outfit, sans-serif',
      },
      width: chartContainerRef.current.clientWidth,
      height: 350,
      grid: {
        vertLines: { color: 'rgba(27, 60, 51, 0.03)' },
        horzLines: { color: 'rgba(27, 60, 51, 0.03)' },
      },
      rightPriceScale: {
        borderVisible: false,
      },
      timeScale: {
        borderVisible: false,
        fixLeftEdge: true,
        fixRightEdge: true,
      },
      handleScale: false,
      handleScroll: false,
    });

    // v5 standardized way to add series
    const series = chart.addSeries(AreaSeries, {
      lineColor: '#FFB300',
      topColor: 'rgba(255, 179, 0, 0.25)',
      bottomColor: 'rgba(255, 179, 0, 0.02)',
      lineWidth: 4,
      priceFormat: {
        type: 'price',
        precision: 0,
        minMove: 100,
      },
    });

    chartRef.current = chart;
    seriesRef.current = series;

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (seriesRef.current && data && data.length > 0) {
      // Map to unique timestamps to avoid "Assertion failed"
      const uniqueDataMap = new Map();
      data.forEach(p => {
        if (p.time && typeof p.value === 'number') {
          uniqueDataMap.set(p.time, p.value);
        }
      });

      const sortedData = Array.from(uniqueDataMap.entries())
        .map(([time, value]) => ({ time, value }))
        .sort((a, b) => a.time.localeCompare(b.time));

      if (sortedData.length > 0) {
        try {
          seriesRef.current.setData(sortedData);
          if (chartRef.current) {
            chartRef.current.timeScale().fitContent();
          }
        } catch (err) {
          console.warn('Chart data sync handled:', err);
        }
      }
    }
  }, [data]);

  return <div ref={chartContainerRef} style={{ width: '100%', height: '350px' }} />;
}
