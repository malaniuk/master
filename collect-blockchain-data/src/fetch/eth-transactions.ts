import { sleep } from '@malaniuk/tkit-date';
import { formatEther } from 'ethers';

import { etherscan } from '../provider';

const action = 'txlist';

const process = async (arr, address: string) => {
  const newArr = [];

  for (const item of arr) {
    console.log(item);

    const data: any = {
      timeStamp: item.timeStamp,
      hash: item.hash,
      value: formatEther(item.value),
      value$: -1,
    };

    if (item.to && item.to.toLowerCase() !== address) {
      data.to = item.to.toLowerCase();
    }

    if (item.from && item.from.toLowerCase() !== address) {
      data.from = item.from.toLowerCase();
    }

    newArr.push(data);
  }

  return newArr;
};

const fetchEthTransactionsPage = async (address: string, page: number) => {
  console.log(`fetchEthTransactionsPage ${address} ${page}`);

  const response = await etherscan.get('/', {
    params: { action, address, page, offset: 1000, input: '0x' },
  });

  return response.data;
};

export const fetchEthTransactions = async (address: string) => {
  console.log(`\nfetchEthTransactions ${address}`);

  let page = 1;
  let response = await fetchEthTransactionsPage(address, page);
  const results = [...(await process(response.result, address))];

  while (response.message !== 'No transactions found' && page < 10) {
    response = await fetchEthTransactionsPage(address, ++page);
    results.push(...(await process(response.result, address)));

    await sleep(200);
  }

  return results;
};
