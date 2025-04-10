import { useQuery } from '@tanstack/react-query';

const fetchCryptoData = async () => {
  const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20');
  if (!res.ok) throw new Error('Error en la API');
  const data = await res.json();
  return data.map(coin => ({
    ...coin,
    current_price: Number(coin.current_price),
    price_change_percentage_24h: Number(coin.price_change_percentage_24h)
  }));
};

export const useCryptoData = () => {
  return useQuery({
    queryKey: ['cryptoData'],
    queryFn: fetchCryptoData,
    refetchInterval: 60000
  });
};