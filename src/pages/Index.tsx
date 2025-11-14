import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import { syncQueue, addToQueue } from '@/lib/offlineQueue';
import { WorkoutId } from '@/lib/workoutData';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { Dashboard } from '@/components/Dashboard';
import { ActiveWorkout } from '@/components/ActiveWorkout';
import { ProgressView } from '@/components/ProgressView';
import { HistoryView } from '@/components/HistoryView';
import { NavBar } from '@/components/NavBar';
import { WORKOUT_PLAN } from '@/lib/workoutData';

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState('dashboard');
  const [activeId, setActiveId] = useState<WorkoutId | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [online, setOnline] = useState(navigator.onLine);

  // Online/Offline detection
  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-sync when coming online
  useEffect(() => {
    if (online && user) {
      syncQueue(user.id).then((count) => {
        if (count > 0) {
          console.log(`Sincronizados ${count} treino(s)`);
        }
      });
    }
  }, [online, user]);

  // Auth
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (!session) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Listen to workout logs
  useEffect(() => {
    if (!user) return;
    
    const fetchHistory = async () => {
      const { data, error } = await supabase
        .from('workout_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('end_time', { ascending: false });

      if (error) {
        console.error('Erro ao carregar histórico:', error);
        return;
      }

      const logs = data.map(log => ({
        id: log.id,
        workoutId: log.workout_id,
        workoutName: log.workout_name,
        startTime: new Date(log.start_time),
        endTime: new Date(log.end_time),
        durationSeconds: log.duration_seconds,
        exercises: log.exercises,
        userWeight: log.user_weight
      }));
      
      setHistory(logs);
    };

    fetchHistory();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('workout_logs_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'workout_logs',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchHistory();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const start = (id: WorkoutId) => {
    setActiveId(id);
    setView('workout');
  };

  const finish = async (data: any) => {
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
      if (navigator.onLine) {
        const { error } = await supabase
          .from('workout_logs')
          .insert([workoutLog]);
        
        if (error) throw error;
      } else {
        await addToQueue(workoutLog);
      }
      setView('dashboard');
      setActiveId(null);
    } catch (e) {
      console.error('Erro ao salvar treino:', e);
      // Try to save offline if online save fails
      await addToQueue(workoutLog);
      setView('dashboard');
      setActiveId(null);
    }
  };

  const today = new Date().getDay(); // 0=sun, 1=mon, ..., 6=sat
  // Days: mon=1, tue=2, wed=3, thu=4, fri=5, sat=6
  const dayMap: Record<number, WorkoutId | null> = {
    0: null, // Sunday
    1: 'LEGS1', // Monday
    2: 'PUSH1', // Tuesday
    3: 'PULL1', // Wednesday
    4: 'LEGS2', // Thursday
    5: 'PUSH2', // Friday
    6: 'PULL2'  // Saturday
  };

  const suggestedId = dayMap[today];

  const workoutsThisWeek = history.filter((log) => {
    const logTime = new Date(log.endTime).getTime();
    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 3600 * 1000;
    return logTime >= sevenDaysAgo;
  }).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <OfflineIndicator online={online} />
      
      {view === 'dashboard' && (
        <Dashboard 
          onStart={start}
          history={history}
          workoutsThisWeek={workoutsThisWeek}
        />
      )}
      
      {view === 'workout' && activeId && (
        <ActiveWorkout
          def={WORKOUT_PLAN[activeId]}
          onFinish={finish}
          onCancel={() => {
            setActiveId(null);
            setView('dashboard');
          }}
        />
      )}
      
      {view === 'history' && (
        <HistoryView 
          history={history}
          onBack={() => setView('dashboard')}
        />
      )}
      
      {view === 'progress' && (
        <ProgressView 
          history={history}
          onBack={() => setView('dashboard')}
        />
      )}
      
      <NavBar 
        view={view}
        setView={setView}
        activeId={activeId}
      />
    </div>
  );
};

export default Index;
