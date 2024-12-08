import Moralis from 'moralis';

import { moralisBoot } from '../provider';

export const getStats = async (address: string) => {
  await moralisBoot;

  const respStats = await Moralis.EvmApi.wallets.getWalletStats({
    chain: '0x1',
    address,
  });

  const respsChain = await Moralis.EvmApi.wallets.getWalletActiveChains({
    chains: ['0x1'],
    address,
  });

  return {
    transactions: +respStats.raw.transactions.total,
    token_transfers: +respStats.raw.token_transfers.total,
    firstTx: respsChain.raw.active_chains[0].first_transaction.block_timestamp,
    lastTx: respsChain.raw.active_chains[0].last_transaction.block_timestamp,
  };
};
