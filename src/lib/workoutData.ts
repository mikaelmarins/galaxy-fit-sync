// Workout plan data extracted from original code
export const WORKOUT_PLAN = {
  PUSH1: { 
    id: 'PUSH1', 
    dayName: 'Terça', 
    name: 'PUSH 1: Peito Tensão',
    focus: 'Peito Superior (Carga)', 
    color: 'from-[hsl(var(--workout-push1-from))] to-[hsl(var(--workout-push1-to))]', 
    exercises: [
      { id: 'p1_supino_inc_halt', name: 'Supino Inclinado (Halteres)', sets: 4, reps: '6-10', rest: 120, notes: 'Prioridade absoluta. Foco clavicular.' },
      { id: 'p1_supino_reto_halt', name: 'Supino Reto (Halteres)', sets: 3, reps: '8-12', rest: 105, notes: 'Amplitude total (alongar bem).' },
      { id: 'p1_dips', name: 'Fundos (Dips) com Peso', sets: 3, reps: '8-12', rest: 90, notes: 'Tronco inclinado à frente. Peito inferior.' },
      { id: 'p1_desenv_halt', name: 'Desenv. Ombros (Halteres)', sets: 3, reps: '8-12', rest: 90, notes: 'Carga pesada controlada.' },
      { id: 'p1_triceps_testa', name: 'Tríceps Testa (Barra W)', sets: 3, reps: '10-15', rest: 75, notes: 'Cabeça longa do tríceps.' },
      { id: 'p1_triceps_corda', name: 'Tríceps Polia (Corda)', sets: 2, reps: '12-15', rest: 60, notes: 'Finalizador metabólico.' }
    ]
  },
  PULL1: { 
    id: 'PULL1', 
    dayName: 'Quarta', 
    name: 'PULL 1: Costas Largura',
    focus: 'Dorsais & Espessura', 
    color: 'from-[hsl(var(--workout-pull1-from))] to-[hsl(var(--workout-pull1-to))]', 
    exercises: [
      { id: 'pl1_puxada_frente', name: 'Puxada Frontal (Polia)', sets: 4, reps: '8-12', rest: 90, notes: 'Foco na largura (V-Taper).' },
      { id: 'pl1_remada_cavalo', name: 'Remada Cavalinho (Neutra)', sets: 3, reps: '8-12', rest: 105, notes: 'Carga pesada para espessura.' },
      { id: 'pl1_serrote', name: 'Remada Unilateral (Serrote)', sets: 3, reps: '10-12', rest: 90, notes: 'Grande amplitude de movimento.' },
      { id: 'pl1_facepull', name: 'Face Pull (Corda)', sets: 3, reps: '15-20', rest: 60, notes: 'Saúde dos ombros/deltóide posterior.' },
      { id: 'pl1_rosca_direta', name: 'Rosca Direta (Barra Reta)', sets: 3, reps: '8-12', rest: 75, notes: 'Construtor base de bíceps.' },
      { id: 'pl1_rosca_martelo', name: 'Rosca Martelo (Halteres)', sets: 3, reps: '10-15', rest: 60, notes: 'Foco braquial/antebraço.' }
    ]
  },
  LEGS1: { 
    id: 'LEGS1', 
    dayName: 'Segunda', 
    name: 'LEGS 1: Manutenção Força',
    focus: 'Quadríceps (Volume Baixo)', 
    color: 'from-[hsl(var(--workout-legs1-from))] to-[hsl(var(--workout-legs1-to))]', 
    exercises: [
      { id: 'l1_agachamento', name: 'Agachamento Livre (Barra)', sets: 3, reps: '5-8', rest: 150, notes: 'Manter carga de 140kg+. Descanso total.' },
      { id: 'l1_legpress', name: 'Leg Press 45º', sets: 2, reps: '10-15', rest: 105, notes: 'Complemento com menos stress axial.' },
      { id: 'l1_flexora', name: 'Cadeira Flexora', sets: 3, reps: '12-15', rest: 75, notes: 'Isolamento de posteriores.' },
      { id: 'l1_panturrilha', name: 'Panturrilha (Máquina/Leg)', sets: 3, reps: '15-20', rest: 60, notes: 'Pausa no alongamento.' }
    ]
  },
  PUSH2: { 
    id: 'PUSH2', 
    dayName: 'Sexta', 
    name: 'PUSH 2: Peito Metabólico',
    focus: 'Variação & Calistenia', 
    color: 'from-[hsl(var(--workout-push2-from))] to-[hsl(var(--workout-push2-to))]', 
    exercises: [
      { id: 'p2_supino_reto_barra', name: 'Supino Reto (Barra)', sets: 4, reps: '8-12', rest: 105, notes: 'Sobrecarga absoluta.' },
      { id: 'p2_supino_inc_maq', name: 'Supino Inclinado (Máq/Smith)', sets: 3, reps: '10-15', rest: 90, notes: 'Levar até a falha com segurança.' },
      { id: 'p2_flexoes', name: 'Flexões com Peso', sets: 3, reps: 'FALHA', rest: 75, notes: 'Disco nas costas. ROM completo.' },
      { id: 'p2_elev_lateral_polia', name: 'Elevação Lateral (Polia Unilateral)', sets: 4, reps: '12-15', rest: 60, notes: 'Tensão constante no deltóide medial.' },
      { id: 'p2_crossover', name: 'Crossover (Polia Média/Baixa)', sets: 2, reps: '15-20', rest: 60, notes: 'Foco no pump e adução máxima.' },
      { id: 'p2_triceps_corda', name: 'Tríceps Polia (Corda)', sets: 3, reps: '12-15', rest: 60, notes: 'Volume para tríceps.' }
    ]
  },
  PULL2: { 
    id: 'PULL2', 
    dayName: 'Sábado', 
    name: 'PULL 2: Costas Variação',
    focus: 'Planos & Pegadas', 
    color: 'from-[hsl(var(--workout-pull2-from))] to-[hsl(var(--workout-pull2-to))]', 
    exercises: [
      { id: 'pl2_remada_barra', name: 'Remada com Barra (Pronada)', sets: 4, reps: '6-10', rest: 120, notes: 'Espessura total (trapézio/rombóides).' },
      { id: 'pl2_puxada_neutra', name: 'Puxada Neutra (Triângulo)', sets: 3, reps: '10-15', rest: 90, notes: 'Foco dorsais com carga alta.' },
      { id: 'pl2_pulldown_corda', name: 'Pulldown (Braços Retos)', sets: 3, reps: '12-15', rest: 75, notes: 'Isolamento puro de dorsais.' },
      { id: 'pl2_crucifixo_inv', name: 'Crucifixo Inverso (Máq/Polia)', sets: 3, reps: '15-20', rest: 60, notes: 'Deltóide posterior e meio das costas.' },
      { id: 'pl2_scott', name: 'Rosca Scott (Máquina)', sets: 3, reps: '10-15', rest: 75, notes: 'Foco no pico do bíceps.' },
      { id: 'pl2_rosca_inversa', name: 'Rosca Inversa (Polia Baixa)', sets: 2, reps: '12-15', rest: 60, notes: 'Braquiorradial/Antebraço.' }
    ]
  },
  LEGS2: { 
    id: 'LEGS2', 
    dayName: 'Quinta', 
    name: 'LEGS 2: Manutenção Posterior',
    focus: 'Cadeia Posterior & Carga', 
    color: 'from-[hsl(var(--workout-legs2-from))] to-[hsl(var(--workout-legs2-to))]', 
    exercises: [
      { id: 'l2_sumo', name: 'Agachamento Sumô', sets: 3, reps: '5-8', rest: 150, notes: 'Manter/progredir carga de 180kg. Glúteos/Adutores.' },
      { id: 'l2_stiff', name: 'Stiff (RDL)', sets: 3, reps: '8-12', rest: 120, notes: 'Construtor primário de posterior.' },
      { id: 'l2_extensora', name: 'Cadeira Extensora', sets: 2, reps: '15-20', rest: 75, notes: 'Foco metabólico para quadríceps.' },
      { id: 'l2_panturrilha_sent', name: 'Panturrilha Sentado', sets: 3, reps: '15-20', rest: 60, notes: 'Foco no sóleo.' }
    ]
  }
};

export const ORDERED_DAYS = ['LEGS1', 'PUSH1', 'PULL1', 'LEGS2', 'PUSH2', 'PULL2'];

export const CORE_ROUTINE = [
  { name: 'Elevação de Pernas (Suspenso)', reps: '10-15', notes: 'Foco infra abdominal.' },
  { name: 'Abdominal Polia (Cable Crunch)', reps: '12-15', notes: 'Foco supra, com carga.' },
  { name: 'Rotação Russa (com Peso)', reps: '30-45s', notes: 'Foco oblíquos.' }
];

export type WorkoutId = keyof typeof WORKOUT_PLAN;
export type WorkoutDefinition = typeof WORKOUT_PLAN[WorkoutId];
export type Exercise = WorkoutDefinition['exercises'][0];
