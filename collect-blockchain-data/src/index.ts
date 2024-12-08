import { sleep  } from '@malaniuk/tkit-date';
import { connection, findLastNotProcessedTask, tasksStatistic, updateTaskStatus } from './db';
import { collectNodeData } from './collect-node-data';

(async () => {
  await connection;

  while (true) {
    const [open, failed] = await tasksStatistic();
    console.log(`Tasks: open: ${open} failed: ${failed}`);

    const openTask = await findLastNotProcessedTask();
    if (!openTask) {
      await sleep(1000);
    }

    try {
      await collectNodeData(openTask.address, openTask.depth);
      await updateTaskStatus(openTask._id, 'processed');
    } catch (e) {
      console.error(`Error processing task ${openTask._id}`);
      console.error(e);

      await updateTaskStatus(openTask._id, 'failed');
    }

    await sleep(1000);
  }
})();
