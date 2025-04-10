import React, { createContext } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Nuevos imports
import Dashboard from './pages/Dashboard';
import CoinDetail from './pages/CoinDetail'; // Crea este componente después
import './App.css';

export const ThemeContext = createContext();

const queryClient = new QueryClient();

const App = () => {
  const darkMode = true;

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeContext.Provider value={{ darkMode }}>
        <BrowserRouter>
          <div className={`App ${darkMode ? 'darkMode' : ''}`}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/coin/:id" element={<CoinDetail />} />
            </Routes>
          </div>
        </BrowserRouter>
      </ThemeContext.Provider>
    </QueryClientProvider>
  );
};

export default App;