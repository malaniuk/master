export const extractFeatures = (walletData: any) => {
  const profile = walletData.walletProfile;
  const txs = walletData.raw.txs;

  const timestamps = txs.map(tx => new Date(tx.timestamp.$date).getTime());
  const timeRangeMs = Math.max(...timestamps) - Math.min(...timestamps);
  const timeRangeDays = timeRangeMs / (1000 * 60 * 60 * 24);

  const sentTxs = txs.filter(tx => tx.from_address === profile.address);
  const receivedTxs = txs.filter(tx => tx.to_address === profile.address);

  const totalSentValue = sentTxs.reduce((sum, tx) => sum + parseFloat(tx.value$ || 0), 0);
  const totalReceivedValue = receivedTxs.reduce((sum, tx) => sum + parseFloat(tx.value$ || 0), 0);

  const avgSentValue = sentTxs.length > 0 ? totalSentValue / sentTxs.length : 0;
  const avgReceivedValue = receivedTxs.length > 0 ? totalReceivedValue / receivedTxs.length : 0;

  const txFrequency = profile.activity.avgTransactionsPerDay;

  const uniqueCounterparties = new Set([
    ...sentTxs.map(tx => tx.to_address),
    ...receivedTxs.map(tx => tx.from_address)
  ]).size;

  return {
    features: [
      timeRangeDays,
      profile.transactions.totalCount,
      profile.transactions.sentCount,
      profile.transactions.receivedCount,
      totalSentValue,
      totalReceivedValue,
      avgSentValue,
      avgReceivedValue,
      txFrequency,
      uniqueCounterparties,
      profile.comparison.transactionCountPercentile,
      profile.comparison.volumePercentile,
      profile.comparison.lifetimePercentile
    ],
    address: profile.address
  };
}