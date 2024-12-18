import { nodes } from '../config';

export const getBaseMetrics = async (match: any) => {
  const data = await nodes.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalWallets: { $sum: 1 },
        totalTransactions: { $sum: "$raw.statistics.txsTotal" }
      }
    }
  ]).toArray();

  return {
    totalWallets: data[0].totalWallets,
    totalTransactions: data[0].totalTransactions,
    avgTxsPerWallet: data[0].totalTransactions / data[0].totalWallets,
  };
}
