import type { Database } from '@/integrations/supabase/types';

export type WorkoutLog = Database['public']['Tables']['workout_logs']['Row'];

export interface WorkoutLogInsert {
  user_id: string;
  workout_id: string;
  workout_name: string;
  start_time: string;
  end_time: string;
  duration_seconds: number;
  exercises: any;
  user_weight: number | null;
}

export interface FinishWorkoutData {
  workoutId: string;
  workoutName: string;
  startTime: Date;
  endTime: Date;
  durationSeconds: number;
  coreDone?: boolean;
  userWeight: number | null;
  exercises: Array<{
    exerciseId: string;
    exerciseName: string;
    sets: Array<{
      setNumber: number;
      weight: number;
      reps: number;
    }>;
  }>;
}
