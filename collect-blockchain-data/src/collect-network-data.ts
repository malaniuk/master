import 'dotenv/config';

import { processQueue } from './process-queue';

// Breadth-First Search (BFS) approach for exploring the blockchain network
const collectNetworkData = async (address: string, maxDepth: number) => {
  console.log(`collectNetworkData ${address} ${maxDepth}`);

  const visited = new Set<string>();
  const queue: any[] = [{ address, depth: 0 }];
  const networkData: any[] = [];

  return processQueue(visited, queue, networkData, maxDepth);
};


(async () => {
  const address = process.env.ADDRESS;
  await collectNetworkData(address, 1);
})();