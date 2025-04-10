import React, { useEffect, useState, useCallback } from 'react'; // Añade useCallback
import './PriceChart.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const PriceChart = ({ coinId, darkMode, expanded = false }) => {
  const [chartData, setChartData] = useState(null);
  const [timeRange, setTimeRange] = useState('7');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mueve formatDate dentro del componente y usa useCallback
  const formatDate = useCallback((timestamp) => {
    const date = new Date(timestamp);
    const options = {
      hour: '2-digit',
      minute: '2-digit',
      month: 'short',
      day: 'numeric'
    };
    
    if (timeRange === '1') {
      return date.toLocaleTimeString([], options);
    }
    return date.toLocaleDateString([], options);
  }, [timeRange]); // Dependencia timeRange

  // Obtiene datos históricos de la API
  useEffect(() => {
    const fetchHistoricalData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${timeRange}`
        );
        
        if (!response.ok) throw new Error('Error en la API');
        
        const data = await response.json();
        
        const formattedData = {
          labels: data.prices.map(([timestamp]) => formatDate(timestamp)),
          datasets: [
            {
              label: 'Precio (USD)',
              data: data.prices.map(([, price]) => price),
              borderColor: darkMode ? '#805ad5' : '#6b46c1',
              backgroundColor: darkMode ? 'rgba(128, 90, 213, 0.1)' : 'rgba(107, 70, 193, 0.1)',
              borderWidth: 2,
              tension: 0.4,
              fill: true
            }
          ]
        };
        setChartData(formattedData);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching chart data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistoricalData();
  }, [coinId, timeRange, darkMode, formatDate]); // Añade formatDate aquí

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: darkMode ? '#e2e8f0' : '#2d3748', // Corrige darkNode a darkMode
          font: {
            size: expanded ? 14 : 12
          }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: (context) => {
            return `$${context.parsed.y.toFixed(2)}`;
          }
        }
      },
      ...(expanded && {
        title: {
          display: true,
          text: `Historial de precios - ${coinId.toUpperCase()}`,
          color: darkMode ? '#e2e8f0' : '#2d3748',
          font: {
            size: 16
          }
        }
      })
    },
    scales: {
      y: {
        ticks: { 
          color: darkMode ? '#e2e8f0' : '#2d3748',
          callback: (value) => `$${value.toLocaleString()}`
        },
        grid: { color: darkMode ? 'rgba(74, 85, 104, 0.3)' : 'rgba(237, 237, 237, 0.5)' }
      },
      x: {
        type: 'category',
        ticks: {
          color: darkMode ? '#e2e8f0' : '#2d3748',
          maxRotation: expanded ? 45 : 0,
          autoSkip: true
        },
        grid: { display: false }
      }
    },
    maintainAspectRatio: !expanded
  };

  if (isLoading) return <div className="chart-loading">Cargando gráfico...</div>;
  if (error) return <div className="chart-error">Error: {error}</div>;

  return (
    <div className={`price-chart-container ${expanded ? 'expanded' : ''}`}>
      {expanded && (
        <div className="time-range-selector">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className={darkMode ? 'dark' : ''}
          >
            <option value="1">24 horas</option>
            <option value="7">7 días</option>
            <option value="30">30 días</option>
            <option value="90">3 meses</option>
            <option value="365">1 año</option>
          </select>
        </div>
      )}
      <div className="chart-wrapper">
        {chartData && <Line data={chartData} options={options} />}
      </div>
    </div>
  );
};

export default PriceChart;