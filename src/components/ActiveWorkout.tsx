import { useState, useEffect, useMemo } from 'react';
import { Clock, X, CheckCircle, ChevronDown, CheckSquare, Flame, Trophy } from 'lucide-react';
import { WorkoutDefinition, CORE_ROUTINE } from '@/lib/workoutData';
import { useBeep } from '@/hooks/useBeep';
import { useWorkoutPersist } from '@/hooks/useWorkoutPersist';
import { SetInputSheet } from './SetInputSheet';

interface ActiveWorkoutProps {
  def: WorkoutDefinition;
  onFinish: (data: any) => void;
  onCancel: () => void;
  lastWorkout?: any;
}

interface SetData {
  w: number;
  r: number;
  done: boolean;
}

interface TimerData {
  total: number;
  end: Date;
  name: string;
}

function formatTime(s: number) {
  return `${Math.floor(s / 60)
    .toString()
    .padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
}

export function ActiveWorkout({ def, onFinish, onCancel, lastWorkout }: ActiveWorkoutProps) {
  const playBeep = useBeep();
  const { savedState, saveState, clearState, isLoading } = useWorkoutPersist(def.id);
  
  // Initialize sets with last workout weights if available
  const getInitialSets = () => {
    if (savedState?.sets) return savedState.sets;
    
    if (lastWorkout?.exercises) {
      const initialSets: Record<string, SetData> = {};
      lastWorkout.exercises.forEach((ex: any) => {
        ex.sets.forEach((set: any, idx: number) => {
          initialSets[`${ex.exerciseId}_${idx}`] = {
            w: set.weight || 0,
            r: set.reps || 0,
            done: false
          };
        });
      });
      return initialSets;
    }
    
    return {};
  };
  
  const [start] = useState(savedState?.startTime ? new Date(savedState.startTime) : new Date());
  const [elapsed, setElapsed] = useState(savedState?.elapsed || 0);
  const [sets, setSets] = useState<Record<string, SetData>>(getInitialSets());
  const [timer, setTimer] = useState<TimerData | null>(null);
  const [coreSets, setCoreSets] = useState<Record<string, boolean>>({});
  const [showCore, setShowCore] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [expandedEx, setExpandedEx] = useState<string | null>(null);
  const [editingSet, setEditingSet] = useState<{ exerciseId: string; setIndex: number } | null>(null);

  // Get recent weights for each exercise
  const recentWeights = useMemo(() => {
    const weights: Record<string, number[]> = {};
    Object.entries(sets).forEach(([key, data]) => {
      const [exerciseId] = key.split('_');
      if (!weights[exerciseId]) weights[exerciseId] = [];
      if (data.w > 0 && !weights[exerciseId].includes(data.w)) {
        weights[exerciseId].push(data.w);
      }
    });
    return weights;
  }, [sets]);

  // Elapsed timer
  useEffect(() => {
    const i = setInterval(() => setElapsed(Math.floor((new Date().getTime() - start.getTime()) / 1000)), 1000);
    return () => clearInterval(i);
  }, [start]);

  // Rest timer with beep
  useEffect(() => {
    if (!timer) return;
    const i = setInterval(() => {
      if (new Date() >= timer.end) {
        playBeep();
        setTimer(null);
      }
    }, 500);
    return () => clearInterval(i);
  }, [timer, playBeep]);

  // Persist workout state (only when sets change, not every second)
  useEffect(() => {
    if (!isLoading) {
      saveState({
        workoutId: def.id,
        startTime: start,
        sets,
        elapsed
      });
    }
  }, [sets, def.id, start, saveState, isLoading]); // Removed 'elapsed' to prevent saving every second

  const doSet = (eid: string, idx: number, w: number, r: number, rest: number, name: string, totalSets: number) => {
    setSets((p) => ({ ...p, [`${eid}_${idx}`]: { w, r, done: true } }));
    
    // Only start timer if NOT the last set of the exercise
    const isLastSet = idx === totalSets - 1;
    if (rest > 0 && !isLastSet) {
      setTimer({ total: rest, end: new Date(Date.now() + rest * 1000), name });
    }
  };

  const markAll = (ex: WorkoutDefinition['exercises'][0]) => {
    const firstSet = sets[`${ex.id}_0`];
    if (!firstSet?.w || !firstSet?.r) return alert('Preencha a 1ª série.');
    for (let i = 1; i < ex.sets; i++) doSet(ex.id, i, firstSet.w, firstSet.r, 0, ex.name, ex.sets);
    setExpandedEx(null);
  };

  const finishWorkout = async () => {
    const coreDone = Object.keys(coreSets).length >= 3;
    await clearState();
    onFinish({
      workoutId: def.id,
      workoutName: def.name,
      startTime: start,
      endTime: new Date(),
      durationSeconds: elapsed,
      coreDone,
      exercises: def.exercises
        .map((ex) => ({
          exerciseId: ex.id,
          exerciseName: ex.name,
          sets: Array.from({ length: ex.sets })
            .map((_, i) => sets[`${ex.id}_${i}`])
            .filter((s) => s?.done)
            .map((s, i) => ({ setNumber: i + 1, weight: s.w, reps: s.r }))
        }))
        .filter((e) => e.sets.length > 0)
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground font-medium">Carregando treino...</div>
      </div>
    );
  }

  return (
    <div className="pb-40 bg-background min-h-screen">
      {/* Header */}
      <div className="fixed top-0 inset-x-0 h-28 bg-card/80 backdrop-blur-md z-20 flex items-end px-6 pb-5 border-b border-border justify-between">
        <div>
          <h2 className="font-extrabold text-xl text-foreground truncate w-56 mb-1">
            {def.name}
          </h2>
          <p className={`font-mono text-sm font-bold flex items-center gap-1.5 ${elapsed > 3600 ? 'text-destructive' : 'text-primary'}`}>
            <Clock size={16} />
            {formatTime(elapsed)}
          </p>
        </div>
        <button onClick={onCancel} className="bg-secondary p-3 rounded-full hover:bg-secondary/80 text-muted-foreground">
          <X size={20} />
        </button>
      </div>

      {/* Exercise List */}
      <div className="pt-36 px-6 space-y-4">
        {def.exercises.map((ex) => {
          const isExpanded = expandedEx === ex.id;
          const completedSets = Array.from({ length: ex.sets }).filter((_, idx) => sets[`${ex.id}_${idx}`]?.done).length;
          const isDone = completedSets === ex.sets;
          
          return (
            <div key={ex.id} className={`bg-card rounded-[2rem] shadow-sm border overflow-hidden transition-all ${isDone ? 'border-green-200 bg-green-50/30' : 'border-border'}`}>
              <div onClick={() => setExpandedEx(isExpanded ? null : ex.id)} className="p-5 flex justify-between items-center cursor-pointer">
                <div>
                  <h3 className={`font-bold text-lg leading-tight ${isDone ? 'text-green-800' : 'text-foreground'}`}>
                    {ex.name}
                  </h3>
                  <p className="text-muted-foreground text-xs mt-1">
                    {ex.sets} séries × {ex.reps} reps • {ex.rest}s
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {isDone && <CheckCircle className="text-green-500" size={24} fill="currentColor" />}
                  <ChevronDown size={20} className={`text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
              </div>
              {isExpanded && (
                <div className="p-5 pt-0 space-y-3 border-t border-border/50 bg-secondary/50 animate-in fade-in duration-200">
                  {ex.notes && (
                    <p className="text-muted-foreground text-sm bg-card p-3 rounded-xl mb-4 border border-border">
                      {ex.notes}
                    </p>
                  )}
                  <button
                    onClick={() => markAll(ex)}
                    className="text-xs font-bold text-primary flex items-center gap-1 mb-4 ml-auto bg-card px-3 py-1.5 rounded-full shadow-sm border border-border"
                  >
                    <CheckSquare size={14} /> REPETIR 1ª SÉRIE
                  </button>
                  {Array.from({ length: ex.sets }).map((_, idx) => (
                    <SetRow
                      key={idx}
                      idx={idx}
                      target={ex.reps}
                      done={sets[`${ex.id}_${idx}`]?.done}
                      onEdit={() => setEditingSet({ exerciseId: ex.id, setIndex: idx })}
                      weight={sets[`${ex.id}_${idx}`]?.w}
                      reps={sets[`${ex.id}_${idx}`]?.r}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Core Routine Section */}
        <div className={`rounded-[2rem] border overflow-hidden transition-all ${showCore ? 'bg-slate-900 border-slate-800' : 'bg-card border-border'}`}>
          <div onClick={() => setShowCore(!showCore)} className="p-6 cursor-pointer flex items-center justify-between">
            <div>
              <h3 className={`font-bold text-lg flex items-center gap-2 mb-1 ${showCore ? 'text-white' : 'text-foreground'}`}>
                <Flame fill={showCore ? '#FF6B6B' : 'none'} className={showCore ? 'text-primary' : 'text-muted-foreground'} size={20} />
                Abdômen Final (10min)
              </h3>
              <p className={`text-sm ${showCore ? 'text-slate-400' : 'text-muted-foreground'}`}>3x por semana.</p>
            </div>
            <ChevronDown size={20} className={`transition-transform ${showCore ? 'text-slate-400 rotate-180' : 'text-muted-foreground'}`} />
          </div>
          {showCore && (
            <div className="p-6 pt-0 space-y-4 bg-slate-900/50 border-t border-slate-800">
              {CORE_ROUTINE.map((ex, i) => (
                <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/10">
                  <div className="flex justify-between mb-3">
                    <h4 className="font-bold text-white">{ex.name}</h4>
                    <span className="text-xs bg-primary text-white px-2 py-1 rounded-md">{ex.reps}</span>
                  </div>
                  <div className="flex gap-2">
                    {[0, 1, 2].map((s) => (
                      <button
                        key={s}
                        onClick={() => setCoreSets((p) => ({ ...p, [`${i}_${s}`]: !p[`${i}_${s}`] }))}
                        className={`flex-1 h-10 rounded-xl font-bold transition-all ${
                          coreSets[`${i}_${s}`] ? 'bg-green-500 text-white' : 'bg-slate-800 text-slate-500 hover:bg-slate-700'
                        }`}
                      >
                        {s + 1}ª
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Finish Button */}
      <div className="fixed bottom-6 inset-x-6 z-20">
        <button
          onClick={() => setConfirmModal(true)}
          className="w-full py-4 bg-primary text-primary-foreground font-extrabold tracking-wide rounded-2xl shadow-xl shadow-primary/30 flex justify-center items-center gap-3 active:scale-95 transition-transform text-base"
        >
          <CheckCircle fill="currentColor" size={24} />
          FINALIZAR TREINO
        </button>
      </div>

      {/* Modals */}
      {timer && <RestModal timer={timer} onClose={() => setTimer(null)} onAdd={() => setTimer((p) => p && { ...p, end: new Date(p.end.getTime() + 15000) })} />}
      {confirmModal && <ConfirmModal onCancel={() => setConfirmModal(false)} onConfirm={finishWorkout} />}
      
      {/* Set Input Sheet */}
      {editingSet && (() => {
        const ex = def.exercises.find(e => e.id === editingSet.exerciseId);
        if (!ex) return null;
        
        const setKey = `${editingSet.exerciseId}_${editingSet.setIndex}`;
        const currentSet = sets[setKey];
        
        return (
          <SetInputSheet
            isOpen={true}
            onClose={() => setEditingSet(null)}
            onSave={(w, r) => {
              doSet(editingSet.exerciseId, editingSet.setIndex, w, r, ex.rest, ex.name, ex.sets);
              setEditingSet(null);
            }}
            setNumber={editingSet.setIndex + 1}
            initialWeight={currentSet?.w || sets[`${editingSet.exerciseId}_0`]?.w}
            initialReps={currentSet?.r}
            targetReps={ex.reps}
            recentWeights={recentWeights[editingSet.exerciseId] || []}
          />
        );
      })()}
    </div>
  );
}

// SetRow Component
interface SetRowProps {
  idx: number;
  target: string;
  done?: boolean;
  onEdit: () => void;
  weight?: number;
  reps?: number;
}

function SetRow({ idx, target, done, onEdit, weight, reps }: SetRowProps) {
  if (done && weight && reps) {
    return (
      <button
        onClick={onEdit}
        className="w-full flex justify-between p-4 text-sm bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 font-bold rounded-2xl items-center animate-in fade-in duration-200 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors border-2 border-green-200 dark:border-green-800"
      >
        <span className="opacity-70">#{idx + 1}</span>
        <span className="text-base">{weight}kg × {reps} reps</span>
        <CheckCircle size={20} fill="currentColor" className="text-green-600 dark:text-green-400" />
      </button>
    );
  }
  
  return (
    <button
      onClick={onEdit}
      className="w-full flex items-center justify-between p-4 bg-secondary/50 hover:bg-secondary border-2 border-border rounded-2xl transition-all active:scale-98 shadow-sm"
    >
      <span className="font-bold text-muted-foreground text-base">#{idx + 1}</span>
      <span className="text-muted-foreground text-sm">
        {weight && reps ? `${weight}kg × ${reps}` : 'Tocar para registrar'}
      </span>
      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
        <CheckCircle size={20} className="text-primary" />
      </div>
    </button>
  );
}

// RestModal Component
function RestModal({ timer, onClose, onAdd }: { timer: TimerData; onClose: () => void; onAdd: () => void }) {
  const [sec, setSec] = useState(0);
  
  useEffect(() => {
    const i = setInterval(() => setSec(Math.max(0, Math.ceil((timer.end.getTime() - new Date().getTime()) / 1000))), 100);
    return () => clearInterval(i);
  }, [timer]);
  
  const progress = 1 - sec / timer.total;
  
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex flex-col items-center justify-center p-8 animate-in fade-in duration-200">
      <div className="bg-card p-8 rounded-[3rem] w-full max-w-sm text-center shadow-2xl flex flex-col items-center">
        <span className="text-muted-foreground uppercase tracking-[0.3em] text-xs font-bold mb-8">Descanso</span>
        <div className="relative w-48 h-48 flex items-center justify-center mb-8">
          <svg className="w-full h-full absolute" viewBox="0 0 100 100">
            <circle className="text-secondary stroke-current" strokeWidth="6" cx="50" cy="50" r="44" fill="none" />
            <circle
              className="text-primary stroke-current transition-all duration-300 ease-linear"
              strokeWidth="6"
              strokeLinecap="round"
              cx="50"
              cy="50"
              r="44"
              fill="none"
              strokeDasharray="276"
              strokeDashoffset={276 - 276 * progress}
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="font-black text-5xl text-foreground relative z-10">{formatTime(sec)}</div>
        </div>
        <p className="text-lg font-bold text-foreground mb-8 leading-tight px-4">{timer.name}</p>
        <div className="flex gap-3 w-full">
          <button onClick={onClose} className="flex-1 py-4 bg-secondary hover:bg-secondary/80 rounded-2xl font-bold text-foreground transition-colors">
            Pular
          </button>
          <button onClick={onAdd} className="flex-1 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl font-bold transition-colors">
            +15s
          </button>
        </div>
      </div>
    </div>
  );
}

// ConfirmModal Component
function ConfirmModal({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-card p-8 rounded-[2.5rem] w-full max-w-sm text-center shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trophy className="text-yellow-500" size={40} fill="currentColor" />
        </div>
        <h3 className="text-2xl font-black text-foreground mb-3">Treino Concluído?</h3>
        <p className="text-muted-foreground font-medium mb-8 leading-relaxed">
          Ótimo trabalho! Certifique-se de que todas as cargas foram registradas corretamente.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-4 bg-secondary hover:bg-secondary/80 text-foreground rounded-2xl font-bold transition-colors">
            Voltar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl font-bold transition-colors shadow-lg shadow-primary/20"
          >
            SALVAR TREINO
          </button>
        </div>
      </div>
    </div>
  );
}
