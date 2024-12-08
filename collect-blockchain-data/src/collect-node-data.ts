import { connection, nodes } from './db';
import {
  fetchBalances,
  fetchEthTransactions,
  fetchTokenTransactions,
  getStats,
} from './fetch';
import { getConnectedAddresses } from './get-connected-addresses';

export const collectNodeData = async (
  address: string,
  depth: number,
): Promise<[any, any[]]> => {
  const nodeDataCache = await nodes.findOne({ address });
  if (nodeDataCache) {
    const connected = getConnectedAddresses(address, nodeDataCache.txs);

    return [nodeDataCache, connected];
  }

  console.log(`collectNodeData ${address} ${depth}`);

  const balances = await fetchBalances(address);
  const stats = await getStats(address);

  const tokenTxs = await fetchTokenTransactions(address);
  const ethTxs = await fetchEthTransactions(address);

  const txsTotal = +stats.transactions + +stats.token_transfers;

  const txs = [...tokenTxs, ...ethTxs];

  const nodeData = {
    address,
    active: [stats.firstTx, stats.lastTx],
    txs,
    txsTotal,
    balances: {
      eth: { value: balances.eth, value$: -1 },
      ...balances.erc20,
    },
  };

  await connection;
  await nodes.insertOne(nodeData);

  const connected = getConnectedAddresses(address, txs);

  return [nodeData, connected];
};
