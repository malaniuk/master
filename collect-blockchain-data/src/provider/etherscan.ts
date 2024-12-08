import axios from 'axios';

const baseURL = 'https://api.etherscan.io/v2/api';

const etherscan = axios.create({ baseURL });

etherscan.interceptors.request.use((config) => {
  config.params = {
    apikey: process.env.ETHERSCAN_API_KEY,
    chainid: 1,
    sort: 'desc',
    module: 'account',
    ...config.params,
  };

  return config;
});

export { etherscan };
