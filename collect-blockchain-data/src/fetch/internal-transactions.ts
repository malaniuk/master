import { sleep } from '@malaniuk/tkit-date';
import { formatEther } from 'ethers';

import { etherscan } from '../provider';

const action = 'txlistinternal';

const map = (address) => (tx) => {
  const data: any = {
    ...tx,
    timeStamp: tx.timeStamp,
    value: formatEther(tx.value),
    value$: -1,
  };

  if (tx.from && tx.from.toLowerCase() !== address) {
    data.from = tx.from.toLowerCase();
  }

  if (tx.to && tx.to.toLowerCase() !== address) {
    data.to = tx.to.toLowerCase();
  }

  return data;
};

const fetchInternalTransactionsPage = async (address: string, page: number) => {
  console.log(`fetchInternalTransactionsPage ${address} ${page}`);

  const params = { action, page, address, offset: 1000 };
  const resp = await etherscan.get('/', { params });

  return resp.data;
};

export const fetchInternalTransactions = async (
  address: string,
  excludeTxs: string[],
) => {
  console.log(`\nfetchInternalTransactions ${address}`);

  let page = 1;
  let response = await fetchInternalTransactionsPage(address, page);
  const results = [
    ...response.result
      .filter((o) => !excludeTxs.includes(o.hash))
      .map(map(address)),
  ];

  while (response.message !== 'No transactions found' && page < 10) {
    response = await fetchInternalTransactionsPage(address, ++page);
    results.push(
      ...response.result
        .filter((o) => !excludeTxs.includes(o.hash))
        .map(map(address)),
    );

    await sleep(200);
  }

  return results;
};
