import { create } from 'zustand';

type ExerciseType = 'EL1' | 'EO' | 'EPM' | 'EVM' | 'EMD';

interface ExerciseState {
  currentExercise: ExerciseType;
  level: number;
  isRunning: boolean;
  timer: string;
  numbers: [number, number] | null;
  setExercise: (exercise: ExerciseType) => void;
  setLevel: (level: number) => void;
  setIsRunning: (isRunning: boolean) => void;
  setTimer: (timer: string) => void;
  setNumbers: (numbers: [number, number] | null) => void;
  startExercise: () => void;
  stopExercise: () => void;
}

export const useStore = create<ExerciseState>((set) => ({
  currentExercise: 'EL1',
  level: 9,
  isRunning: false,
  timer: '00:00',
  numbers: null,
  
  setExercise: (exercise) => set({ 
    currentExercise: exercise,
    numbers: null,
    timer: '00:00',
    isRunning: false
  }),
  
  setLevel: (level) => set({ 
    level,
    numbers: null,
    timer: '00:00',
    isRunning: false
  }),
  
  setIsRunning: (isRunning) => set({ isRunning }),
  setTimer: (timer) => set({ timer }),
  setNumbers: (numbers) => set({ numbers }),
  
  startExercise: () => {
    set({ 
      isRunning: true,
      timer: '00:00',
      numbers: null
    });
  },
  
  stopExercise: () => {
    set({ 
      isRunning: false,
      numbers: null,
      timer: '00:00'
    });
  }
})); 