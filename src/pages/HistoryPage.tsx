import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import type { User } from '@supabase/supabase-js';
import { HistoryView } from '@/components/HistoryView';
import { WorkoutEditModal } from '@/components/WorkoutEditModal';
import { useWorkoutLogs } from '@/hooks/useWorkoutLogs';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface LayoutContext {
  user: User | null;
  online: boolean;
}

export default function HistoryPage() {
  const navigate = useNavigate();
  const { user } = useOutletContext<LayoutContext>();
  const { history, invalidate } = useWorkoutLogs(user?.id);
  const [editingWorkout, setEditingWorkout] = useState<any>(null);

  const updateWorkout = async (updatedWorkout: any) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('workout_logs')
        .update({
          exercises: updatedWorkout.exercises
        })
        .eq('id', updatedWorkout.id);

      if (error) throw error;
      toast.success('Treino atualizado!');
      invalidate();
    } catch (e) {
      console.error('Erro ao atualizar treino:', e);
      toast.error('Erro ao atualizar treino');
    }
  };

  const deleteWorkout = async (workoutId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('workout_logs')
        .delete()
        .eq('id', workoutId);

      if (error) throw error;
      toast.success('Treino excluído!');
      invalidate();
    } catch (e) {
      console.error('Erro ao excluir treino:', e);
      toast.error('Erro ao excluir treino');
    }
  };

  return (
    <>
      <HistoryView 
        history={history}
        onBack={() => navigate('/')}
        onEdit={(workout) => setEditingWorkout(workout)}
      />

      <WorkoutEditModal
        isOpen={!!editingWorkout}
        onClose={() => setEditingWorkout(null)}
        workout={editingWorkout}
        onSave={updateWorkout}
        onDelete={deleteWorkout}
      />
    </>
  );
}
