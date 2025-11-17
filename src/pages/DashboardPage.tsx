import { useNavigate, useOutletContext } from 'react-router-dom';
import type { User } from '@supabase/supabase-js';
import { Dashboard } from '@/components/Dashboard';
import { useWorkoutLogs } from '@/hooks/useWorkoutLogs';

interface LayoutContext {
  user: User | null;
  online: boolean;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useOutletContext<LayoutContext>();
  const { history } = useWorkoutLogs(user?.id);

  const workoutsThisWeek = history.filter((log) => {
    const logTime = new Date(log.end_time).getTime();
    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 3600 * 1000;
    return logTime >= sevenDaysAgo;
  }).length;

  const handleStart = (workoutId: string) => {
    navigate(`/workout/${workoutId}`);
  };

  return (
    <Dashboard 
      onStart={handleStart}
      history={history}
      workoutsThisWeek={workoutsThisWeek}
    />
  );
}
