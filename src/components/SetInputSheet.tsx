import { useState, useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface SetInputSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (weight: number, reps: number) => void;
  setNumber: number;
  initialWeight?: number;
  initialReps?: number;
  targetReps: string;
  recentWeights?: number[];
}

export function SetInputSheet({
  isOpen,
  onClose,
  onSave,
  setNumber,
  initialWeight,
  initialReps,
  targetReps,
  recentWeights = []
}: SetInputSheetProps) {
  const defaultReps = targetReps.includes('-') 
    ? targetReps.split('-')[1] 
    : targetReps;
    
  const [weight, setWeight] = useState(initialWeight?.toString() || '');
  const [reps, setReps] = useState(initialReps?.toString() || defaultReps);

  useEffect(() => {
    if (isOpen) {
      setWeight(initialWeight?.toString() || '');
      setReps(initialReps?.toString() || defaultReps);
    }
  }, [isOpen, initialWeight, initialReps, defaultReps]);

  const handleSave = () => {
    const w = parseFloat(weight) || 0;
    const r = parseInt(reps) || 0;
    if (w >= 0 && r >= 1) {
      onSave(w, r);
      onClose();
    }
  };

  const handlePreset = (presetWeight: number) => {
    setWeight(presetWeight.toString());
  };

  const incrementReps = (delta: number) => {
    const current = parseInt(reps) || 0;
    const newValue = Math.max(1, current + delta);
    setReps(newValue.toString());
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="fixed bottom-0 inset-x-0 bg-card rounded-t-[2rem] shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-border/50">
          <h3 className="text-xl font-bold text-foreground">Série #{setNumber}</h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-xl transition-colors"
          >
            <X size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Weight Input */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
              Carga (kg)
            </label>
            <input
              type="number"
              inputMode="decimal"
              placeholder="0.0"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              autoFocus
              className="w-full bg-secondary/50 border-2 border-border rounded-2xl py-6 text-center font-black text-4xl text-foreground focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all shadow-sm placeholder:text-muted-foreground/30"
            />
            
            {/* Recent Weights Presets */}
            {recentWeights.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {recentWeights.slice(0, 3).map((w, i) => (
                  <button
                    key={i}
                    onClick={() => handlePreset(w)}
                    className="flex-shrink-0 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary font-bold rounded-xl text-sm transition-colors border border-primary/30"
                  >
                    {w} kg
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Reps Input with Stepper */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
              Repetições (meta: {targetReps})
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => incrementReps(-1)}
                className="w-16 h-16 bg-secondary hover:bg-secondary/80 rounded-2xl font-black text-2xl text-foreground transition-colors active:scale-95 shadow-sm"
              >
                −
              </button>
              <input
                type="number"
                inputMode="numeric"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                className="flex-1 bg-secondary/50 border-2 border-border rounded-2xl py-6 text-center font-black text-4xl text-foreground focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all shadow-sm"
              />
              <button
                onClick={() => incrementReps(1)}
                className="w-16 h-16 bg-secondary hover:bg-secondary/80 rounded-2xl font-black text-2xl text-foreground transition-colors active:scale-95 shadow-sm"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 py-5 bg-secondary hover:bg-secondary/80 text-foreground rounded-2xl font-bold text-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={!weight || !reps}
              className="flex-1 py-5 bg-primary hover:bg-primary/90 disabled:bg-secondary disabled:text-muted-foreground text-primary-foreground rounded-2xl font-bold text-lg transition-all active:scale-95 shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
            >
              <CheckCircle size={22} />
              Registrar
            </button>
          </div>
        </div>

        {/* Safe area padding for mobile */}
        <div className="h-safe-area-inset-bottom" />
      </div>
    </div>
  );
}
