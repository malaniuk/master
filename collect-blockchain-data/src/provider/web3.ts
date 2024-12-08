import * as ethers from 'ethers';

const web3 = new ethers.JsonRpcProvider(process.env.ETHEREUM_NODE_URL);

export { web3 };
