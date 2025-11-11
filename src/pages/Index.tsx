import { useState, useEffect } from 'react';
import { signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';
import { collection, addDoc, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { auth, db, appId } from '@/lib/firebase';
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
      syncQueue(user.uid).then((count) => {
        if (count > 0) {
          console.log(`Sincronizados ${count} treino(s)`);
        }
      });
    }
  }, [online, user]);

  // Auth
  useEffect(() => {
    signInAnonymously(auth).catch(console.error);
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Listen to workout logs
  useEffect(() => {
    if (!user) return;
    
    const q = query(
      collection(db, `artifacts/${appId}/users/${user.uid}/workout_logs`),
      orderBy('endTime', 'desc')
    );
    
    const unsubscribe = onSnapshot(
      q,
      { includeMetadataChanges: true },
      (snapshot) => {
        setHistory(
          snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
            _fromCache: snapshot.metadata.fromCache
          }))
        );
      }
    );
    
    return () => unsubscribe();
  }, [user]);

  const start = (id: WorkoutId) => {
    setActiveId(id);
    setView('workout');
  };

  const finish = async (data: any) => {
    if (!user) return;
    
    try {
      if (navigator.onLine) {
        await addDoc(
          collection(db, `artifacts/${appId}/users/${user.uid}/workout_logs`),
          { ...data, userId: user.uid }
        );
      } else {
        await addToQueue(data);
      }
      setView('dashboard');
      setActiveId(null);
    } catch (e) {
      console.error('Erro ao salvar treino:', e);
      // Try to save offline if online save fails
      await addToQueue(data);
      setView('dashboard');
      setActiveId(null);
    }
  };

  // Calculate workouts this week
  const workoutsThisWeek = history.filter((h) => {
    if (!h.endTime?.seconds) return false;
    const d = new Date(h.endTime.seconds * 1000);
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    return d >= startOfWeek;
  }).length;

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background text-muted-foreground font-medium">
        Carregando...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
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
          onCancel={() => setView('dashboard')}
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
      
      <NavBar view={view} setView={setView} activeId={activeId} />
    </div>
  );
};

export default Index;
