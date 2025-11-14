import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2 } from 'lucide-react';

interface WorkoutEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  workout: any;
  onSave: (updatedWorkout: any) => void;
  onDelete: (workoutId: string) => void;
}

export function WorkoutEditModal({ isOpen, onClose, workout, onSave, onDelete }: WorkoutEditModalProps) {
  const [exercises, setExercises] = useState(workout?.exercises || []);

  if (!workout) return null;

  const handleSetChange = (exerciseIdx: number, setIdx: number, field: 'weight' | 'reps', value: string) => {
    const updated = [...exercises];
    updated[exerciseIdx].sets[setIdx][field] = Number(value);
    setExercises(updated);
  };

  const handleSave = () => {
    onSave({
      ...workout,
      exercises
    });
    onClose();
  };

  const handleDelete = () => {
    if (confirm('Tem certeza que deseja excluir este treino?')) {
      onDelete(workout.id);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{workout.workoutName}</DialogTitle>
          <p className="text-sm text-muted-foreground">
            {new Date(workout.endTime).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {exercises.map((ex: any, exIdx: number) => (
            <div key={exIdx} className="bg-secondary/30 p-4 rounded-2xl">
              <h4 className="font-bold text-lg mb-3">{ex.exerciseName}</h4>
              <div className="space-y-2">
                {ex.sets.map((set: any, setIdx: number) => (
                  <div key={setIdx} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground w-16">
                      Série {set.setNumber}
                    </span>
                    <div className="flex-1 flex gap-2">
                      <div className="flex-1">
                        <Input
                          type="number"
                          step="0.5"
                          value={set.weight}
                          onChange={(e) => handleSetChange(exIdx, setIdx, 'weight', e.target.value)}
                          placeholder="Peso (kg)"
                        />
                      </div>
                      <div className="flex-1">
                        <Input
                          type="number"
                          value={set.reps}
                          onChange={(e) => handleSetChange(exIdx, setIdx, 'reps', e.target.value)}
                          placeholder="Reps"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="destructive" onClick={handleDelete} className="gap-2">
            <Trash2 size={16} />
            Excluir Treino
          </Button>
          <div className="flex gap-2 flex-1 sm:justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              Salvar Alterações
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
