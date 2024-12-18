import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGO_URL);
const nodes = client.db('eth').collection('nodes');

export { client, nodes };
