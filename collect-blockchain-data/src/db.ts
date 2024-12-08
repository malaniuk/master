import { MongoClient } from 'mongodb';

const client = new MongoClient('mongodb://localhost:27017');

const connection = client.connect();
const db = client.db('eth');

const nodes = db.collection('nodes');

export { connection, nodes };
