import { IsolationForest } from 'isolation-forest';
import { extractFeatures } from './extract-features';

export const analyzeWallets = async (walletsData, contamination = 0.1) => {
  const walletFeatures = walletsData.map(wallet => extractFeatures(wallet));

  const features = walletFeatures.map(w => w.features);
  const addresses = walletFeatures.map(w => w.address);

  const isolationForest = new IsolationForest({
    containmination: contamination,
    nEstimators: 100,
    maxSamples: 'auto',
    maxFeatures: 1.0
  });

  isolationForest.fit(features);
  const scores = isolationForest.scores(features);

  const results = addresses.map((address, index) => ({
    address,
    anomalyScore: scores[index],
    isAnomaly: scores[index] < isolationForest.threshold,
    features: features[index]
  }));

  return results.sort((a, b) => a.anomalyScore - b.anomalyScore);
}
