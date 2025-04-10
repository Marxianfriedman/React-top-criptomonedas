

import React, { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../App';
import CryptoCard from '../components/CryptoCard/CryptoCard';
import { useCryptoData } from '../hooks/useCryptoData'; // Importacion de hook

  

const Dashboard = () => {
  const { darkMode } = useContext(ThemeContext);
  const { data: cryptos = [], isLoading, error } = useCryptoData(); // Valor por defecto []
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (cryptos.length > 0) {
      console.log('Datos de la API', cryptos[0]);
    }
  }, [cryptos]);

  const filteredCryptos = cryptos.filter(crypto => 
    crypto.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div className={`loading ${darkMode ? 'dark' : ''}`}>Cargando...</div>;
  if (error) return <div className={`error ${darkMode ? 'dark' : ''}`}>Error: {error.message}</div>;

  console.log('Datos mapeados:', filteredCryptos[0]?.current_price, filteredCryptos[0]?.price_change_percentage_24h);
  return (
    <div className={`dashboard ${darkMode ? 'dark' : ''}`}>
      <h1>Spider Top Criptomonedas</h1>
      <input
        type="text"
        className="search-crypto" // Clase añadida
        placeholder="Buscar cripto..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="crypto-grid">
        {filteredCryptos.map(crypto => (
          <CryptoCard key={crypto.id} {...crypto} darkMode={darkMode} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;