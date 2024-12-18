import 'dotenv/config';
import { client, nodes } from './config';
import { getActivityMetrics, getBaseMetrics, getValueMetrics } from './global-metrics';

(async () => {
  await client.connect();
  const forceUpdate = process.env.FORCE_UPDATE === 'true';
  const globalSelect = { isSystem: null, isContract: forceUpdate ? undefined : null };

  const baseMetrics = await getBaseMetrics(globalSelect);
  const valueMetrics = await getValueMetrics(globalSelect);
  const activityMetrics = await getActivityMetrics(globalSelect)

  const globalMetrics = {
    ...baseMetrics,
    ...valueMetrics,
    ...activityMetrics
  };

  console.log('Global metrics', globalMetrics);

  const allNodes = nodes.find({ ...globalSelect, walletProfile: null });
  for await (const node of allNodes) {
    const txs = node.raw.txs;

    const sentTxs = txs.filter(tx => tx.from_address === node.address);
    const receivedTxs = txs.filter(tx => tx.to_address === node.address);

    const totalSent = sentTxs.reduce((acc, tx) => acc + parseFloat(tx.value$), 0);
    const totalReceived = receivedTxs.reduce((acc, tx) => acc + parseFloat(tx.value$), 0);

    const activeDays = (+new Date(node.raw.statistics.active[1]) - +new Date(node.raw.statistics.active[0])) / (1000 * 60 * 60 * 24)

    await nodes.updateOne({ _id: node._id }, {
      $set: {
        walletProfile: {
          address: node.address,
          isContract: false,
          label: node.social ? node.social.label : null,
          hasKyc: node.social ? node.social.hasKyc : null,
          transactions: {
            totalCount: node.raw.statistics.txsTotal,
            sentCount: sentTxs.length,
            receivedCount: receivedTxs.length,
            totalSent$: totalSent,
            totalReceived$: totalReceived,
            netPosition$: totalReceived - totalSent
          },
          activity: {
            firstSeen: node.raw.statistics.active[0],
            lastSeen: node.raw.statistics.active[1],
            activeDays: activeDays,
            avgTransactionsPerDay: activeDays > 0 ? node.raw.statistics.txsTotal / activeDays : -1,
          },
          balances: node.raw.statistics.balances,
          comparison: {
            transactionCountPercentile: node.raw.statistics.txsTotal / globalMetrics.avgTxsPerWallet,
            volumePercentile: totalSent / globalMetrics.totalVolume,
            lifetimePercentile: activeDays / globalMetrics.avgActivityPeriodDays
          }
        }
      }
    })
  }

  await client.close();
})();
