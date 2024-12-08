import { db } from './client';
import { ObjectId } from 'mongodb';

const tasks = db.collection('tasks');

export const tasksStatistic = async () => {
  const open = await tasks.countDocuments({ status: 'open' });
  const failed = await tasks.countDocuments({ status: 'failed' });

  return [open, failed];
}

export const findLastNotProcessedTask = async () => {
  const openTasks = await tasks.find({ status: 'open' })
    .sort({ createdAt: 'asc' })
    .limit(1)
    .toArray()

  if (openTasks.length === 0) {
    return null
  }

  return openTasks[0];
};

export const updateTaskStatus = async (taskId: ObjectId, status: string) => {
  await tasks.updateOne({ _id: taskId }, { $set: { status } });
};

