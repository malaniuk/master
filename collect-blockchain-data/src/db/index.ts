import { connection, db } from './client';

const nodes = db.collection('nodes');

export { connection, nodes };
export * from './tasks';

