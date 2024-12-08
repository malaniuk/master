import { collectNodeData } from './collect-node-data';

export const processQueue = async (
  visited: Set<string>,
  queue: any[],
  networkData: any[],
  maxDepth: number,
) => {
  if (queue.length === 0) {
    return networkData;
  }

  console.log(`processQueue: ${queue.length} ${maxDepth}`);

  const { address, depth } = queue[0];
  const remainingQueue = queue.slice(1);

  if (depth > maxDepth || visited.has(address)) {
    return processQueue(visited, remainingQueue, networkData, maxDepth);
  }

  const newVisited = new Set(visited).add(address);
  const [nodeData, newConnections] = await collectNodeData(address, depth);
  console.log(`node data collected: ${address}`);

  const newQueue = remainingQueue.concat(
    newConnections
      .filter((address: string) => !visited.has(address))
      .map((address: string) => ({ address, depth: depth + 1 })),
  );

  const newNetworkData = [...networkData, nodeData];

  return processQueue(newVisited, newQueue, newNetworkData, maxDepth);
};
