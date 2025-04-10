import React, { useState } from 'react';
import './CryptoCard.css';
import PriceChart from '../PriceChart/PriceChart';
import { useNavigate } from 'react-router-dom';

const CryptoCard = ({ 
  id, // Añade id en las props
  name, 
  symbol, 
  current_price, 
  price_change_percentage_24h, 
  image, 
  darkMode 
}) => {
  
  const [showChart, setShowChart] = useState(false);
  const navigate = useNavigate();
  const hasValidPrice = current_price !== undefined && !isNaN(current_price);
  const hasValidChange = price_change_percentage_24h !== undefined && !isNaN(price_change_percentage_24h);

  const changeColor = hasValidChange ? (price_change_percentage_24h >= 0 ? 'green' : 'red') : 'gray';
  const changeIcon = hasValidChange ? (price_change_percentage_24h >= 0 ? '↑' : '↓') : '';
  
  const formattedPrice = hasValidPrice 
    ? current_price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    : 'N/A';

  const formattedChange = hasValidChange
    ? `${changeIcon} ${Math.abs(price_change_percentage_24h).toFixed(2).replace('.', ',')}%`
    : 'N/A';

  return (
    <div className={`crypto-card ${darkMode ? 'dark' : ''}`}>
      <div className="crypto-header"
        onClick={() => navigate(`/coin/$(id)`)}
        style={{ cursor: 'pointer' }}
      >
        
        <img src={image} alt={name} width="30" />
        <h3>{name} ({symbol.toUpperCase()})</h3>
      </div>
      <div className="crypto-price">
        <span>{formattedPrice}</span>
        <span className={changeColor}>{formattedChange}</span>
      </div>
      <button 
        onClick={(e) => { 
          e.stopPropagation(); 
          
          setShowChart(!showChart)
        }}
        className={`chart-btn ${darkMode ? 'dark' : ''}`}
      >
        {showChart ? 'Ocultar Gráfico' : 'Ver Histórico'}
      </button>
      {showChart && <PriceChart coinId={id} darkMode={darkMode} />}
    </div>
  );
};

export default CryptoCard;