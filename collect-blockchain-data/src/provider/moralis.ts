import Moralis from 'moralis';

const moralisBoot = Moralis.start({
  apiKey: process.env.MORALIS_API_KEY,
});

export { moralisBoot };
