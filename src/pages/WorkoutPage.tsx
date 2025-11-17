import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import type { User } from '@supabase/supabase-js';
import { ActiveWorkout } from '@/components/ActiveWorkout';
import { WORKOUT_PLAN, WorkoutId } from '@/lib/workoutData';
import { useWorkoutLogs } from '@/hooks/useWorkoutLogs';
import { supabase } from '@/lib/supabase';
import { addToQueue } from '@/lib/offlineQueue';
import type { FinishWorkoutData } from '@/types/workout';
import { toast } from 'sonner';

interface LayoutContext {
  user: User | null;
  online: boolean;
}

export default function WorkoutPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user, online } = useOutletContext<LayoutContext>();
  const { history, invalidate } = useWorkoutLogs(user?.id);

  if (!id || !(id in WORKOUT_PLAN)) {
    navigate('/');
    return null;
  }

  const workoutId = id as WorkoutId;
  const workoutDef = WORKOUT_PLAN[workoutId];
  const lastWorkout = history.find(h => h.workout_id === workoutId);

  const handleFinish = async (data: FinishWorkoutData) => {
    if (!user) return;
    
    const workoutLog = {
      user_id: user.id,
      workout_id: data.workoutId,
      workout_name: data.workoutName,
      start_time: data.startTime.toISOString(),
      end_time: data.endTime.toISOString(),
      duration_seconds: data.durationSeconds,
      exercises: data.exercises,
      user_weight: data.userWeight
    };

    try {
      if (online) {
        const { error } = await supabase
          .from('workout_logs')
          .insert([workoutLog]);
        
        if (error) throw error;
        toast.success('Treino salvo com sucesso!');
      } else {
        await addToQueue(workoutLog);
        toast.success('Treino salvo offline. Será sincronizado quando voltar online.');
      }
      invalidate();
      navigate('/');
    } catch (e) {
      console.error('Erro ao salvar treino:', e);
      await addToQueue(workoutLog);
      toast.error('Erro ao salvar. Treino salvo offline.');
      navigate('/');
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <ActiveWorkout
      def={workoutDef}
      onFinish={handleFinish}
      onCancel={handleCancel}
      lastWorkout={lastWorkout}
    />
  );
}
