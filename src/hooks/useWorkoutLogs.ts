import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { WorkoutLog } from '@/types/workout';

export function useWorkoutLogs(userId: string | undefined) {
  const queryClient = useQueryClient();

  const { data: history = [], isLoading } = useQuery({
    queryKey: ['workout_logs', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('workout_logs')
        .select('*')
        .eq('user_id', userId)
        .order('end_time', { ascending: false });

      if (error) {
        console.error('Erro ao carregar histórico:', error);
        return [];
      }

      return data as WorkoutLog[];
    },
    enabled: !!userId,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['workout_logs', userId] });
  };

  return { history, isLoading, invalidate };
}
