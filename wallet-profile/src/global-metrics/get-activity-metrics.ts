import { nodes } from '../config';

const DAY = 1000 * 60 * 60 * 24;

export const getActivityMetrics = async (match: any) => {
  const data = await nodes.aggregate([
    { $match: match },
    {
      $project: {
        firstDate: { $toDate: { $arrayElemAt: ["$raw.statistics.active", 0] } },
        lastDate: { $toDate: { $arrayElemAt: ["$raw.statistics.active", 1] } }
      }
    },
    {
      $group: {
        _id: null,
        minDate: { $min: "$firstDate" },
        maxDate: { $max: "$lastDate" },
        avgActivityPeriod: {
          $avg: {
            $divide: [{ $subtract: ["$lastDate", "$firstDate"] }, DAY]
          }
        }
      }
    }
  ]).toArray();

  return {
    minDate: data[0].minDate,
    maxDate: data[0].maxDate,
    avgActivityPeriodDays: data[0].avgActivityPeriod,
  };
}