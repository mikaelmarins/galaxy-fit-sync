import { useNavigate, useOutletContext } from 'react-router-dom';
import type { User } from '@supabase/supabase-js';
import { ProgressView } from '@/components/ProgressView';
import { useWorkoutLogs } from '@/hooks/useWorkoutLogs';

interface LayoutContext {
  user: User | null;
  online: boolean;
}

export default function ProgressPage() {
  const navigate = useNavigate();
  const { user } = useOutletContext<LayoutContext>();
  const { history } = useWorkoutLogs(user?.id);

  return (
    <ProgressView 
      history={history}
      onBack={() => navigate('/')}
    />
  );
}
