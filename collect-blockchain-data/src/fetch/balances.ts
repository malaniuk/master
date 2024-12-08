import { formatEther, formatUnits } from 'ethers';
import Moralis from 'moralis';

import { moralisBoot, web3 } from '../provider';

const getErc20TokenBalances = async (address: string) => {
  await moralisBoot;

  const resp = await Moralis.EvmApi.token.getWalletTokenBalances({
    chain: '0x1',
    address: address,
  });

  return resp.raw.reduce((acc, o) => {
    acc[o.token_address] = {
      value: formatUnits(o.balance, +o.decimals),
      value$: -1,
    };

    return acc;
  }, {});
};

const getNativeTokenBalance = async (address: string) => {
  const balance = await web3.getBalance(address);

  return formatEther(balance);
};

export const fetchBalances = async (address: string) => {
  console.log(`\nfetchBalances ${address}`);

  const [erc20, eth] = await Promise.all([
    getErc20TokenBalances(address),
    getNativeTokenBalance(address),
  ]);

  return { eth, erc20 };
};
