import * as ethers from 'ethers';

const web3 = new ethers.JsonRpcProvider(process.env.WEB_URL);

export { web3 };
