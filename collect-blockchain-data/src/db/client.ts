import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URL);

const connection = client.connect();
const db = client.db('eth');

export { connection, client, db };
