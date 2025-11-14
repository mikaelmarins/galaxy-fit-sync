import { useMemo } from 'react';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ProgressViewProps {
  history: any[];
  onBack: () => void;
}

export function ProgressView({ history, onBack }: ProgressViewProps) {
  const exerciseProgress = useMemo(() => {
    const data: Record<string, { name: string; data: { date: string; weight: number; volume: number }[] }> = {};
    
    [...history].reverse().forEach((log) => {
      if (!log.exercises) return;
      const logDate = new Date(log.endTime).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      
      log.exercises.forEach((ex: any) => {
        if (!data[ex.exerciseId]) {
          data[ex.exerciseId] = { name: ex.exerciseName, data: [] };
        }
        const maxWeight = Math.max(...ex.sets.map((s: any) => Number(s.weight) || 0));
        const totalVolume = ex.sets.reduce((sum: number, s: any) => sum + (s.weight * s.reps), 0);
        
        if (maxWeight > 0) {
          data[ex.exerciseId].data.push({
            date: logDate,
            weight: maxWeight,
            volume: totalVolume
          });
        }
      });
    });
    
    return data;
  }, [history]);

  const weeklyStats = useMemo(() => {
    const last7Days = history.filter((log) => {
      const logTime = new Date(log.endTime).getTime();
      const now = Date.now();
      const sevenDaysAgo = now - 7 * 24 * 3600 * 1000;
      return logTime >= sevenDaysAgo;
    });

    const totalWorkouts = last7Days.length;
    const totalVolume = last7Days.reduce((sum, log) => {
      return sum + (log.exercises?.reduce((exSum: number, ex: any) => {
        return exSum + ex.sets.reduce((setSum: number, s: any) => setSum + (s.weight * s.reps), 0);
      }, 0) || 0);
    }, 0);
    
    const totalDuration = last7Days.reduce((sum, log) => sum + (log.durationSeconds || 0), 0);

    return { totalWorkouts, totalVolume, avgDuration: totalWorkouts > 0 ? Math.floor(totalDuration / totalWorkouts / 60) : 0 };
  }, [history]);

  const keyExercises = ['p1_supino_inc_halt', 'l1_agachamento', 'pl1_puxada_frente'];

  return (
    <div className="min-h-screen bg-background pb-32 px-6 pt-10">
      <header className="flex items-center gap-4 mb-10 mt-6">
        <button onClick={onBack} className="bg-card p-3 rounded-xl shadow-sm border border-border text-foreground">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-foreground">Seu Progresso</h1>
      </header>

      {/* Weekly Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-card p-5 rounded-2xl shadow-sm border border-border text-center">
          <p className="text-3xl font-bold text-primary">{weeklyStats.totalWorkouts}</p>
          <p className="text-xs text-muted-foreground font-bold uppercase mt-1">Treinos</p>
        </div>
        <div className="bg-card p-5 rounded-2xl shadow-sm border border-border text-center">
          <p className="text-3xl font-bold text-primary">{Math.floor(weeklyStats.totalVolume / 1000)}k</p>
          <p className="text-xs text-muted-foreground font-bold uppercase mt-1">Volume (kg)</p>
        </div>
        <div className="bg-card p-5 rounded-2xl shadow-sm border border-border text-center">
          <p className="text-3xl font-bold text-primary">{weeklyStats.avgDuration}</p>
          <p className="text-xs text-muted-foreground font-bold uppercase mt-1">Média (min)</p>
        </div>
      </div>

      {history.length < 2 ? (
        <div className="flex flex-col items-center justify-center p-10 bg-card rounded-[2.5rem] shadow-sm border border-border text-center mt-10">
          <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-6">
            <TrendingUp size={32} className="text-muted-foreground" />
          </div>
          <h3 className="font-bold text-foreground text-lg mb-2">Ainda sem dados suficientes</h3>
          <p className="text-muted-foreground">Complete mais alguns treinos para ver seus gráficos.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {keyExercises.map((exId) => {
            const exData = exerciseProgress[exId];
            if (!exData || exData.data.length < 2) return null;

            return (
              <div key={exId} className="bg-card p-6 rounded-[2.5rem] shadow-sm border border-border">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{exData.name}</h3>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Carga Máxima (kg)</p>
                  </div>
                </div>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={exData.data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id={`grad_${exId}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} dx={-10} domain={['auto', 'auto']} />
                      <Tooltip
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }}
                        cursor={false}
                      />
                      <Area type="monotone" dataKey="weight" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill={`url(#grad_${exId})`} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
