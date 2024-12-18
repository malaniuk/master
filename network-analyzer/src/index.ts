import 'dotenv/config';
import { client, nodes } from './config';
import { analyzeWallets } from './isolation-forest';

(async () => {
  await client.connect();
  const forceUpdate = process.env.FORCE_UPDATE === 'true';
  const globalSelect = { isSystem: null, isContract: forceUpdate ? undefined : null };

  const allNodes = await nodes.find({ ...globalSelect }).toArray();
  const results = await analyzeWallets(allNodes);

  for (const result of results) {
    await nodes.updateOne({ address: result.address }, { $set: { anomalyScore: result.anomalyScore, isAnomaly: result.isAnomaly } });
  }

  await client.close();
})();
