import { sleep } from '@malaniuk/tkit-date';
import { formatUnits } from 'ethers';

import { etherscan } from '../provider';

const action = 'tokentx';

const process = async (arr, address: string) => {
  const newArr = [];

  for (const item of arr) {
    const data: any = {
      timeStamp: item.timeStamp,
      hash: item.hash,
      contractAddress: item.contractAddress,
      value: formatUnits(item.value, +item.tokenDecimal),
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

const fetchTokenTransactionsPage = async (address: string, page: number) => {
  console.log(`fetchTokenTransactionsPage ${address} ${page}`);

  const params = { action, offset: 1000, page, address };
  const resp = await etherscan.get('/', { params });

  return resp.data;
};

export const fetchTokenTransactions = async (address: string) => {
  console.log(`\nfetchTokenTransactions ${address}`);

  let page = 1;
  let response = await fetchTokenTransactionsPage(address, page);
  const results = [...(await process(response.result, address))];

  while (response.message !== 'No transactions found' && page < 10) {
    response = await fetchTokenTransactionsPage(address, ++page);
    results.push(...(await process(response.result, address)));

    await sleep(200);
  }

  return results;
};
