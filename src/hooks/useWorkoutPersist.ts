import { useEffect, useState } from 'react';
import localforage from 'localforage';

const ACTIVE_WORKOUT_KEY = 'active_workout_state';

const storage = localforage.createInstance({
  name: 'WorkoutApp',
  storeName: 'activeWorkout'
});

export interface WorkoutState {
  workoutId: string;
  startTime: Date;
  sets: Record<string, { w: number; r: number; done: boolean }>;
  elapsed: number;
}

export function useWorkoutPersist(workoutId: string | null) {
  const [savedState, setSavedState] = useState<WorkoutState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved state on mount
  useEffect(() => {
    const loadState = async () => {
      try {
        const state = await storage.getItem<WorkoutState>(ACTIVE_WORKOUT_KEY);
        if (state && state.workoutId === workoutId) {
          setSavedState(state);
        }
      } catch (error) {
        console.error('Erro ao carregar estado:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadState();
  }, [workoutId]);

  const saveState = async (state: WorkoutState) => {
    try {
      await storage.setItem(ACTIVE_WORKOUT_KEY, state);
    } catch (error) {
      console.error('Erro ao salvar estado:', error);
    }
  };

  const clearState = async () => {
    try {
      await storage.removeItem(ACTIVE_WORKOUT_KEY);
      setSavedState(null);
    } catch (error) {
      console.error('Erro ao limpar estado:', error);
    }
  };

  return { savedState, saveState, clearState, isLoading };
}
