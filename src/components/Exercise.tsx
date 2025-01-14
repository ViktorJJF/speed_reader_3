import React, { useEffect, useCallback } from 'react';
import { useStore } from '../store';

const Exercise: React.FC = () => {
  const { currentExercise, isRunning, level, numbers, setNumbers, setTimer, stopExercise } = useStore();

  const generateNumbers = useCallback(() => {
    const min = Math.pow(10, level - 1);
    const max = Math.pow(10, level) - 1;

    switch (currentExercise) {
      case 'EL1': // Leer el número formado
        const num1 = Math.floor(Math.random() * (max - min + 1)) + min;
        const num2 = Math.floor(Math.random() * (max - min + 1)) + min;
        return [num1, num2] as [number, number];

      case 'EO': // Ejercicio de operaciones
        const result = Math.floor(Math.random() * (max - min + 1)) + min;
        const operand = Math.floor(Math.random() * (result - 1)) + 1;
        return [operand, result - operand] as [number, number];

      case 'EPM': // Ejercicio de palabras y memoria
        // For now, returning numbers but this should be replaced with words
        return [Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)] as [number, number];

      case 'EVM': // Ejercicio de visión y memoria
        return [Math.floor(Math.random() * max), Math.floor(Math.random() * max)] as [number, number];

      case 'EMD': // Ejercicio de memoria y deporte
        return [Math.floor(Math.random() * max), Math.floor(Math.random() * max)] as [number, number];

      default:
        return [0, 0] as [number, number];
    }
  }, [currentExercise, level]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    let numberCount = 0;
    let startTime: number;

    if (isRunning) {
      startTime = Date.now();

      // Update timer every second
      const timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(elapsed / 60)
          .toString()
          .padStart(2, '0');
        const seconds = (elapsed % 60).toString().padStart(2, '0');
        setTimer(`${minutes}:${seconds}`);
      }, 1000);

      // Show new numbers every second
      intervalId = setInterval(() => {
        if (numberCount < 20) {
          setNumbers(generateNumbers());
          numberCount++;
        } else {
          clearInterval(intervalId);
          clearInterval(timerInterval);
          stopExercise();
        }
      }, 1000);

      return () => {
        clearInterval(intervalId);
        clearInterval(timerInterval);
      };
    }
  }, [isRunning, generateNumbers, setNumbers, setTimer, stopExercise]);

  return null;
};

export default Exercise;
