import localforage from 'localforage';
import { collection, addDoc } from 'firebase/firestore';
import { db, appId } from './firebase';

interface QueuedWorkout {
  id: string;
  data: any;
  timestamp: number;
}

const QUEUE_KEY = 'workout_sync_queue';

// Initialize localforage
const storage = localforage.createInstance({
  name: 'WorkoutApp',
  storeName: 'syncQueue'
});

export async function addToQueue(workoutData: any): Promise<void> {
  const queue = await getQueue();
  const queueItem: QueuedWorkout = {
    id: `workout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    data: workoutData,
    timestamp: Date.now()
  };
  queue.push(queueItem);
  await storage.setItem(QUEUE_KEY, queue);
}

export async function getQueue(): Promise<QueuedWorkout[]> {
  const queue = await storage.getItem<QueuedWorkout[]>(QUEUE_KEY);
  return queue || [];
}

export async function syncQueue(userId: string): Promise<number> {
  if (!navigator.onLine) return 0;
  
  const queue = await getQueue();
  if (queue.length === 0) return 0;

  let syncedCount = 0;
  const failedItems: QueuedWorkout[] = [];

  for (const item of queue) {
    try {
      await addDoc(
        collection(db, `artifacts/${appId}/users/${userId}/workout_logs`),
        { ...item.data, userId, syncedAt: new Date() }
      );
      syncedCount++;
    } catch (error) {
      console.error('Erro ao sincronizar item:', error);
      failedItems.push(item);
    }
  }

  // Update queue with failed items only
  await storage.setItem(QUEUE_KEY, failedItems);
  return syncedCount;
}

export async function clearQueue(): Promise<void> {
  await storage.removeItem(QUEUE_KEY);
}

export async function getQueueCount(): Promise<number> {
  const queue = await getQueue();
  return queue.length;
}
