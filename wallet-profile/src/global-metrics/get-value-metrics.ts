import { nodes } from '../config';

export const getValueMetrics = async (match: any) => {
  const data = await nodes.aggregate([
    { $match: match },
    { $unwind: "$raw.txs" },
    {
      $group: {
        _id: null,
        totalVolume: { $sum: "$raw.txs.value$" },
        meanWithZeros: { $avg: "$raw.txs.value$" },
        meanWithoutZeros: {
          $avg: { $cond: [{ $gt: ["$raw.txs.value$", 0] }, "$raw.txs.value$", null] }
        },
        medianWithZeros: {
          $percentile: { input: "$raw.txs.value$", p: [0.5], method: "approximate" }
        },
        medianWithoutZeros: {
          $percentile: {
            input: { $cond: [{ $gt: ["$raw.txs.value$", 0] }, "$raw.txs.value$", "$$REMOVE"] },
            p: [0.5],
            method: "approximate"
          }
        }
      }
    }
  ]).toArray();

  return {
    totalVolume: data[0].totalVolume,
    meanWithZeros: data[0].meanWithZeros,
    meanWithoutZeros: data[0].meanWithoutZeros,
    medianWithZeros: data[0].medianWithZeros[0],
    medianWithoutZeros: data[0].medianWithoutZeros[0]
  }
}