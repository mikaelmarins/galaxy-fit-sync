import { useMemo } from 'react';
import { ArrowLeft, TrendingUp, Weight, Dumbbell, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface ProgressViewProps {
  history: any[];
  onBack: () => void;
}

interface BodyWeightStats {
  current: number | null;
  weeklyChange: number;
  monthlyChange: number;
  min: number;
  max: number;
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

  const bodyWeightProgress = useMemo(() => {
    return [...history]
      .filter(log => log.user_weight)
      .reverse()
      .map(log => ({
        date: new Date(log.end_time).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        weight: Number(log.user_weight)
      }));
  }, [history]);

  const bodyWeightStats = useMemo((): BodyWeightStats => {
    const weightsWithDates = [...history]
      .filter(log => log.user_weight)
      .map(log => ({
        weight: Number(log.user_weight),
        date: new Date(log.end_time)
      }))
      .sort((a, b) => b.date.getTime() - a.date.getTime());

    if (weightsWithDates.length === 0) {
      return { current: null, weeklyChange: 0, monthlyChange: 0, min: 0, max: 0 };
    }

    const current = weightsWithDates[0].weight;
    const allWeights = weightsWithDates.map(w => w.weight);
    const min = Math.min(...allWeights);
    const max = Math.max(...allWeights);

    const now = Date.now();
    const oneWeekAgo = now - 7 * 24 * 3600 * 1000;
    const oneMonthAgo = now - 30 * 24 * 3600 * 1000;

    const weekOldWeight = weightsWithDates.find(w => w.date.getTime() <= oneWeekAgo);
    const monthOldWeight = weightsWithDates.find(w => w.date.getTime() <= oneMonthAgo);

    const weeklyChange = weekOldWeight ? current - weekOldWeight.weight : 0;
    const monthlyChange = monthOldWeight ? current - monthOldWeight.weight : 0;

    return { current, weeklyChange, monthlyChange, min, max };
  }, [history]);

  const weeklyStats = useMemo(() => {
    const last7Days = history.filter((log) => {
      const logTime = new Date(log.end_time).getTime();
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
    
    const totalDuration = last7Days.reduce((sum, log) => sum + (log.duration_seconds || 0), 0);
    const totalSets = last7Days.reduce((sum, log) => {
      return sum + (log.exercises?.reduce((exSum: number, ex: any) => exSum + ex.sets.length, 0) || 0);
    }, 0);

    return { 
      totalWorkouts, 
      totalVolume, 
      avgDuration: totalWorkouts > 0 ? Math.floor(totalDuration / totalWorkouts / 60) : 0,
      totalSets
    };
  }, [history]);

  const allTimeStats = useMemo(() => {
    const totalWorkouts = history.length;
    const totalVolume = history.reduce((sum, log) => {
      return sum + (log.exercises?.reduce((exSum: number, ex: any) => {
        return exSum + ex.sets.reduce((setSum: number, s: any) => setSum + (s.weight * s.reps), 0);
      }, 0) || 0);
    }, 0);

    const allExercises = new Set();
    history.forEach(log => {
      log.exercises?.forEach((ex: any) => allExercises.add(ex.exerciseId));
    });

    const personalRecords: Record<string, { exercise: string; weight: number }> = {};
    history.forEach(log => {
      log.exercises?.forEach((ex: any) => {
        const maxWeight = Math.max(...ex.sets.map((s: any) => Number(s.weight) || 0));
        if (!personalRecords[ex.exerciseId] || maxWeight > personalRecords[ex.exerciseId].weight) {
          personalRecords[ex.exerciseId] = { exercise: ex.exerciseName, weight: maxWeight };
        }
      });
    });

    return {
      totalWorkouts,
      totalVolume: Math.floor(totalVolume / 1000),
      uniqueExercises: allExercises.size,
      personalRecords: Object.values(personalRecords).sort((a, b) => b.weight - a.weight).slice(0, 3)
    };
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

      {/* Body Weight Section */}
      <div className="mb-8">
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">Peso Corporal</h2>
        
        {bodyWeightStats.current !== null ? (
          <>
            {/* Current Weight & Changes */}
            <div className="bg-card p-6 rounded-[2.5rem] shadow-sm border border-border mb-4">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Peso Atual</p>
                  <p className="text-4xl font-bold text-foreground">{bodyWeightStats.current} <span className="text-xl text-muted-foreground">kg</span></p>
                </div>
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <Weight size={32} className="text-primary" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary/30 p-4 rounded-xl">
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Semanal</p>
                  <p className={`text-2xl font-bold ${bodyWeightStats.weeklyChange > 0 ? 'text-red-500' : bodyWeightStats.weeklyChange < 0 ? 'text-green-500' : 'text-foreground'}`}>
                    {bodyWeightStats.weeklyChange > 0 ? '+' : ''}{bodyWeightStats.weeklyChange.toFixed(1)} kg
                  </p>
                </div>
                <div className="bg-secondary/30 p-4 rounded-xl">
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Mensal</p>
                  <p className={`text-2xl font-bold ${bodyWeightStats.monthlyChange > 0 ? 'text-red-500' : bodyWeightStats.monthlyChange < 0 ? 'text-green-500' : 'text-foreground'}`}>
                    {bodyWeightStats.monthlyChange > 0 ? '+' : ''}{bodyWeightStats.monthlyChange.toFixed(1)} kg
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Mínimo</p>
                  <p className="text-lg font-bold text-foreground">{bodyWeightStats.min} kg</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Máximo</p>
                  <p className="text-lg font-bold text-foreground">{bodyWeightStats.max} kg</p>
                </div>
              </div>
            </div>

            {/* Body Weight Chart */}
            {bodyWeightProgress.length >= 2 && (
              <div className="bg-card p-6 rounded-[2.5rem] shadow-sm border border-border">
                <h3 className="font-bold text-foreground mb-4">Evolução do Peso</h3>
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={bodyWeightProgress} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="grad_bodyweight" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} dx={-10} domain={['dataMin - 2', 'dataMax + 2']} />
                      <Tooltip
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }}
                        cursor={false}
                      />
                      <Area type="monotone" dataKey="weight" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#grad_bodyweight)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-card p-8 rounded-[2.5rem] shadow-sm border border-border text-center">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4 mx-auto">
              <Weight size={24} className="text-muted-foreground" />
            </div>
            <h3 className="font-bold text-foreground text-lg mb-2">Nenhum registro de peso</h3>
            <p className="text-muted-foreground text-sm">Registre seu peso ao finalizar um treino para acompanhar sua evolução.</p>
          </div>
        )}
      </div>

      {/* Weekly Stats */}
      <div className="mb-6">
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">Últimos 7 Dias</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card p-5 rounded-2xl shadow-sm border border-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Calendar size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{weeklyStats.totalWorkouts}</p>
                <p className="text-xs text-muted-foreground font-bold uppercase">Treinos</p>
              </div>
            </div>
          </div>
          <div className="bg-card p-5 rounded-2xl shadow-sm border border-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Dumbbell size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{weeklyStats.totalSets}</p>
                <p className="text-xs text-muted-foreground font-bold uppercase">Séries</p>
              </div>
            </div>
          </div>
          <div className="bg-card p-5 rounded-2xl shadow-sm border border-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Weight size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{Math.floor(weeklyStats.totalVolume / 1000)}k</p>
                <p className="text-xs text-muted-foreground font-bold uppercase">Volume (kg)</p>
              </div>
            </div>
          </div>
          <div className="bg-card p-5 rounded-2xl shadow-sm border border-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <TrendingUp size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{weeklyStats.avgDuration}</p>
                <p className="text-xs text-muted-foreground font-bold uppercase">Média (min)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* All Time Stats */}
      <div className="mb-8">
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">Estatísticas Totais</h2>
        <div className="bg-card p-6 rounded-[2.5rem] shadow-sm border border-border">
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{allTimeStats.totalWorkouts}</p>
              <p className="text-xs text-muted-foreground font-bold uppercase mt-1">Treinos</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{allTimeStats.totalVolume}k</p>
              <p className="text-xs text-muted-foreground font-bold uppercase mt-1">Volume Total</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{allTimeStats.uniqueExercises}</p>
              <p className="text-xs text-muted-foreground font-bold uppercase mt-1">Exercícios</p>
            </div>
          </div>
          
          {allTimeStats.personalRecords.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Recordes Pessoais</h3>
              <div className="space-y-2">
                {allTimeStats.personalRecords.map((pr, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-secondary/30 rounded-xl">
                    <span className="text-sm font-medium text-foreground">{pr.exercise}</span>
                    <span className="text-sm font-bold text-primary">{pr.weight} kg</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {history.length < 2 ? (
        <div className="flex flex-col items-center justify-center p-10 bg-card rounded-[2.5rem] shadow-sm border border-border text-center mt-10">
          <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-6">
            <TrendingUp size={32} className="text-muted-foreground" />
          </div>
          <h3 className="font-bold text-foreground text-lg mb-2">Ainda sem dados suficientes</h3>
          <p className="text-muted-foreground">Complete mais alguns treinos para ver seus gráficos de exercícios.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Exercise Progress */}
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
