import { User, Flame, Trophy, ChevronRight, Play, Dumbbell } from 'lucide-react';
import { WORKOUT_PLAN, ORDERED_DAYS, WorkoutId } from '@/lib/workoutData';

interface DashboardProps {
  onStart: (id: WorkoutId) => void;
  history: any[];
  workoutsThisWeek: number;
}

export function Dashboard({ onStart, history, workoutsThisWeek }: DashboardProps) {
  const today = new Date().getDay(); // 0=Dom, 1=Seg, ...
  let sugId: WorkoutId = 'PUSH1'; // Default Seg
  if (today === 2) sugId = 'PULL1';
  if (today === 3) sugId = 'LEGS1';
  if (today === 4) sugId = 'PUSH2';
  if (today === 5) sugId = 'PULL2';
  if (today === 6) sugId = 'LEGS2';
  
  // Se já treinou hoje, sugere o próximo dia da sequência
  if (history.length > 0 && history[0].endTime?.seconds) {
    const lastWorkoutDate = new Date(history[0].endTime.seconds * 1000).toDateString();
    const todayDate = new Date().toDateString();
    if (lastWorkoutDate === todayDate) {
      const lastId = history[0].workoutId;
      const nextIdx = (ORDERED_DAYS.indexOf(lastId as WorkoutId) + 1) % ORDERED_DAYS.length;
      sugId = ORDERED_DAYS[nextIdx] as WorkoutId;
    }
  }

  const sug = WORKOUT_PLAN[sugId];

  return (
    <div className="pb-32 px-6 pt-10 animate-in fade-in duration-500">
      <header className="flex justify-between items-center mb-8 mt-6">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            Olá, Mikael!
          </h1>
          <p className="text-muted-foreground font-medium mt-1">
            Foco na recomposição hoje!
          </p>
        </div>
        <div className="w-12 h-12 bg-card rounded-2xl shadow-sm flex items-center justify-center border border-border">
          <User size={24} className="text-foreground" />
        </div>
      </header>

      {/* Suggested Workout Card */}
      <div
        onClick={() => onStart(sugId)}
        className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 p-8 cursor-pointer transition-transform active:scale-[0.98] shadow-xl mb-10"
      >
        <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${sug.color} opacity-20 blur-3xl rounded-full -mr-20 -mt-20`}></div>
        <div className="relative z-10">
          <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-white uppercase tracking-wider mb-4">
            {sug.dayName} • Sugestão
          </span>
          <h2 className="text-4xl font-black text-white leading-none mb-3">
            {sug.name}
          </h2>
          <p className="text-slate-300 font-medium mb-8 max-w-[80%]">
            {sug.focus}
          </p>
          <button className="bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-primary/30 transition-transform hover:scale-105 active:scale-95">
            <Play size={18} fill="currentColor" />
            COMEÇAR TREINO
          </button>
        </div>
        <Dumbbell className="absolute bottom-4 right-4 text-white/5 rotate-[-30deg]" size={180} />
      </div>

      {/* Stats Cards */}
      <div className="flex gap-4 mb-10">
        <div className="flex-1 bg-card p-5 rounded-[2rem] shadow-sm border border-border flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <Flame size={24} fill="currentColor" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{workoutsThisWeek}</p>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
              Treinos Semana
            </p>
          </div>
        </div>
        <div className="flex-1 bg-card p-5 rounded-[2rem] shadow-sm border border-border flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-600">
            <Trophy size={24} fill="currentColor" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{history.length}</p>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
              Total Treinos
            </p>
          </div>
        </div>
      </div>

      {/* Workout List */}
      <h3 className="text-xl font-bold text-foreground mb-5">Sua Rotina</h3>
      <div className="grid gap-4">
        {ORDERED_DAYS.map((id) => {
          const w = WORKOUT_PLAN[id as WorkoutId];
          const active = id === sugId;
          return (
            <div
              key={id}
              onClick={() => onStart(id as WorkoutId)}
              className={`flex items-center justify-between p-5 rounded-[2rem] bg-card border transition-all cursor-pointer active:scale-[0.98] shadow-sm ${
                active ? 'border-primary ring-4 ring-primary/5' : 'border-border'
              }`}
            >
              <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${w.color} flex items-center justify-center text-lg font-black text-white shadow-sm`}>
                  {w.dayName.slice(0, 3)}
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-lg">{w.name}</h4>
                  <p className="text-sm text-muted-foreground font-medium">
                    {w.exercises.length} exercícios
                  </p>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <ChevronRight className="text-muted-foreground" size={20} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
