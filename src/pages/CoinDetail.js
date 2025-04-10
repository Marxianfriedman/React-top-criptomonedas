import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ThemeContext } from '../App';
import PriceChart from '../components/PriceChart/PriceChart';

const CoinDetail = () => {
  const { id } = useParams();
  const { darkMode } = useContext(ThemeContext);

  return (
    <div className={`coin-detail ${darkMode ? 'dark' : ''}`}>
      <h2>Detalles de la criptomoneda: {id}</h2>
      <div className="chart-container">
        <PriceChart coinId={id} darkMode={darkMode} expanded={true} />
      </div>
      {/* Añade más detalles aquí */}
    </div>
  );
};

export default CoinDetail;