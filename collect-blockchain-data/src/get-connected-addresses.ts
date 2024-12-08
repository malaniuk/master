export const getConnectedAddresses = (address: string, txs: any[]) => {
  const uniqueAddresses = new Set([...txs.flatMap((tx) => [tx.from, tx.to])]);

  return Array.from(uniqueAddresses)
    .filter(
      (addr: string) =>
        addr &&
        addr !== address &&
        addr !== '0x0000000000000000000000000000000000000000',
    )
    .map((o) => o.toLowerCase());
};
