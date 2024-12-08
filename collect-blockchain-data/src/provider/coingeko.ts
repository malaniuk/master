import { CoinGeckoClient } from 'coingecko-api-v3';

const coingeko = new CoinGeckoClient({
  timeout: 10000,
  autoRetry: true,
});

export { coingeko };
