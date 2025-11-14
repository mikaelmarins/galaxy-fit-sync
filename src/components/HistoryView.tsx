import { ArrowLeft, Clock, Dumbbell } from 'lucide-react';

interface HistoryViewProps {
  history: any[];
  onBack: () => void;
  onEdit?: (log: any) => void;
}

function formatDate(date: Date | string) {
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatTime(s: number) {
  return `${Math.floor(s / 60)}min`;
}

export function HistoryView({ history, onBack, onEdit }: HistoryViewProps) {
  return (
    <div className="min-h-screen bg-background pb-32 px-6 pt-10">
      <header className="flex items-center gap-4 mb-10 mt-6">
        <button onClick={onBack} className="bg-card p-3 rounded-xl shadow-sm border border-border text-foreground">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-foreground">Histórico</h1>
      </header>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-10 bg-card rounded-[2.5rem] shadow-sm border border-border text-center mt-10">
          <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-6">
            <Dumbbell size={32} className="text-muted-foreground" />
          </div>
          <h3 className="font-bold text-foreground text-lg mb-2">Nenhum treino registrado</h3>
          <p className="text-muted-foreground">Complete seu primeiro treino para começar!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((log) => (
            <div 
              key={log.id} 
              className="bg-card p-5 rounded-[2rem] shadow-sm border border-border cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onEdit?.(log)}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-foreground text-lg">{log.workoutName}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{formatDate(log.endTime)}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock size={14} />
                  <span>{formatTime(log.durationSeconds || 0)}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {log.exercises?.slice(0, 3).map((ex: any, i: number) => (
                  <span key={i} className="text-xs px-3 py-1 bg-secondary rounded-full text-foreground font-medium">
                    {ex.exerciseName}
                  </span>
                ))}
                {log.exercises?.length > 3 && (
                  <span className="text-xs px-3 py-1 bg-secondary rounded-full text-muted-foreground font-medium">
                    +{log.exercises.length - 3} mais
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
